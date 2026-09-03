import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { IN_MEMORY_PRODUCTS_STORE } from '@/lib/products';

export const POST = withAdminAuth(async (req, { params }) => {
  const idOrSlug = params?.id;
  if (!idOrSlug) {
    return NextResponse.json({ success: false, error: 'Product ID or slug is required.' }, { status: 400 });
  }

  try {
    let sourceProduct: any = null;

    // 1. Fetch source product from PostgreSQL DB
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        sourceProduct = await prisma.product.findFirst({
          where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
        });
      } catch (err: any) {
        console.warn('[API Admin Duplicate Product] DB fetch warning:', err?.message || err);
      }
    }

    // Fallback lookup from in-memory catalog
    if (!sourceProduct) {
      sourceProduct = IN_MEMORY_PRODUCTS_STORE.products.get(idOrSlug);
      if (!sourceProduct) {
        IN_MEMORY_PRODUCTS_STORE.products.forEach((p) => {
          if (p.id === idOrSlug || p.slug === idOrSlug) {
            sourceProduct = p;
          }
        });
      }
    }

    if (!sourceProduct) {
      return NextResponse.json({ success: false, error: 'Source product to duplicate was not found.' }, { status: 404 });
    }

    // 2. Generate unique slug for duplicated product
    const rawBaseSlug = `${sourceProduct.slug || 'product'}-copy`;
    let candidateSlug = rawBaseSlug;
    let counter = 2;

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      while (await prisma.product.findUnique({ where: { slug: candidateSlug } })) {
        candidateSlug = `${rawBaseSlug}-${counter}`;
        counter++;
      }
    } else {
      while (IN_MEMORY_PRODUCTS_STORE.products.has(candidateSlug)) {
        candidateSlug = `${rawBaseSlug}-${counter}`;
        counter++;
      }
    }

    const duplicatedName = `${sourceProduct.name} (Copy)`;

    // 3. Create independent duplicate record in PostgreSQL DB
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        const createdDuplicate = await prisma.product.create({
          data: {
            name: duplicatedName,
            slug: candidateSlug,
            description: sourceProduct.description || null,
            category: sourceProduct.category,
            price: sourceProduct.price || 0,
            stock: sourceProduct.stock || 0,
            status: sourceProduct.status || 'ACTIVE',
            featuredImage: sourceProduct.featuredImage || null,
            imagesJson: sourceProduct.imagesJson || null,
            samagriItemsJson: sourceProduct.samagriItemsJson || null,
            significanceLabel: sourceProduct.significanceLabel || null,
            significanceHeading: sourceProduct.significanceHeading || null,
            significanceDescription: sourceProduct.significanceDescription || null,
            whatsInsideLabel: sourceProduct.whatsInsideLabel || null,
            whatsInsideHeading: sourceProduct.whatsInsideHeading || null,
            whatsInsideDescription: sourceProduct.whatsInsideDescription || null,
            howToUseLabel: sourceProduct.howToUseLabel || null,
            howToUseHeading: sourceProduct.howToUseHeading || null,
            howToUseStepsJson: sourceProduct.howToUseStepsJson || null,
            supportingText: sourceProduct.supportingText || null,
            dispatchInfo: sourceProduct.dispatchInfo || null,
            expectedDelivery: sourceProduct.expectedDelivery || null,
            serviceableAreas: sourceProduct.serviceableAreas || null,
            courierInfo: sourceProduct.courierInfo || null,
            cancellationInfo: sourceProduct.cancellationInfo || null,
            cancellationPolicyText: sourceProduct.cancellationPolicyText || null,
            cancellationPolicyUrl: sourceProduct.cancellationPolicyUrl || null,
            returnsInfo: sourceProduct.returnsInfo || null,
            returnsPolicyText: sourceProduct.returnsPolicyText || null,
            returnsPolicyUrl: sourceProduct.returnsPolicyUrl || null,
            damageInTransitInfo: sourceProduct.damageInTransitInfo || null,
            damageClaimText: sourceProduct.damageClaimText || null,
            damageClaimUrl: sourceProduct.damageClaimUrl || null,
          },
        });

        // Sync with in-memory fallback store
        IN_MEMORY_PRODUCTS_STORE.products.set(candidateSlug, {
          id: createdDuplicate.id,
          name: createdDuplicate.name,
          slug: createdDuplicate.slug,
          description: createdDuplicate.description,
          category: createdDuplicate.category,
          price: createdDuplicate.price,
          stock: createdDuplicate.stock,
          status: createdDuplicate.status,
          featuredImage: createdDuplicate.featuredImage,
          imagesJson: createdDuplicate.imagesJson,
          samagriItemsJson: createdDuplicate.samagriItemsJson,
          significanceLabel: createdDuplicate.significanceLabel,
          significanceHeading: createdDuplicate.significanceHeading,
          significanceDescription: createdDuplicate.significanceDescription,
          whatsInsideLabel: createdDuplicate.whatsInsideLabel,
          whatsInsideHeading: createdDuplicate.whatsInsideHeading,
          whatsInsideDescription: createdDuplicate.whatsInsideDescription,
          howToUseLabel: createdDuplicate.howToUseLabel,
          howToUseHeading: createdDuplicate.howToUseHeading,
          howToUseStepsJson: createdDuplicate.howToUseStepsJson,
          supportingText: createdDuplicate.supportingText,
          dispatchInfo: createdDuplicate.dispatchInfo,
          expectedDelivery: createdDuplicate.expectedDelivery,
          serviceableAreas: createdDuplicate.serviceableAreas,
          courierInfo: createdDuplicate.courierInfo,
          cancellationInfo: createdDuplicate.cancellationInfo,
          cancellationPolicyText: createdDuplicate.cancellationPolicyText,
          cancellationPolicyUrl: createdDuplicate.cancellationPolicyUrl,
          returnsInfo: createdDuplicate.returnsInfo,
          returnsPolicyText: createdDuplicate.returnsPolicyText,
          returnsPolicyUrl: createdDuplicate.returnsPolicyUrl,
          damageInTransitInfo: createdDuplicate.damageInTransitInfo,
          damageClaimText: createdDuplicate.damageClaimText,
          damageClaimUrl: createdDuplicate.damageClaimUrl,

          createdAt: createdDuplicate.createdAt.toISOString(),
          updatedAt: createdDuplicate.updatedAt.toISOString(),
        });

        return NextResponse.json(
          {
            success: true,
            message: `Product duplicated successfully as "${duplicatedName}".`,
            product: createdDuplicate,
          },
          { status: 201 }
        );
      } catch (dbErr: any) {
        console.warn('[API Admin Duplicate Product] DB create fallback:', dbErr?.message || dbErr);
      }
    }

    // Fallback store duplication
    const dupId = `prod_${Date.now()}`;
    const duplicatedRecord = {
      ...sourceProduct,
      id: dupId,
      name: duplicatedName,
      slug: candidateSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    IN_MEMORY_PRODUCTS_STORE.products.set(candidateSlug, duplicatedRecord);

    return NextResponse.json(
      {
        success: true,
        message: `Product duplicated successfully as "${duplicatedName}".`,
        product: duplicatedRecord,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[API Admin Duplicate Product] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to duplicate product.' },
      { status: 500 }
    );
  }
});
