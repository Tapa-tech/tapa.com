import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { ProductStatus, ProductCategory } from '@prisma/client';

import { IN_MEMORY_PRODUCTS_STORE, ProductRecord } from '@/lib/products';

export const GET = withAdminAuth(async (req, { params }) => {
  const idOrSlug = params?.id;
  if (!idOrSlug) {
    return NextResponse.json({ success: false, error: 'Product ID or slug required' }, { status: 400 });
  }

  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      const product = await prisma.product.findFirst({
        where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      });
      if (product) {
        return NextResponse.json({ success: true, product });
      }
    } catch (err: any) {
      console.warn('[API Admin Product GET] DB error fallback:', err?.message || err);
    }
  }

  const fallbackProduct = IN_MEMORY_PRODUCTS_STORE.products.get(idOrSlug);
  if (fallbackProduct) {
    return NextResponse.json({ success: true, product: fallbackProduct });
  }

  return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
});

export const PUT = withAdminAuth(async (req, { params }) => {
  const idOrSlug = params?.id;
  if (!idOrSlug) {
    return NextResponse.json({ success: false, error: 'Product ID or slug required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const {
      name,
      slug,
      description,
      category,
      price,
      stock,
      status = 'ACTIVE',
      featuredImage,
      images = [],
      samagriItems = [],

      significanceLabel,
      significanceHeading,
      significanceDescription,

      whatsInsideLabel,
      whatsInsideHeading,
      whatsInsideDescription,

      howToUseLabel,
      howToUseHeading,
      howToUseSteps = [],

      supportingText,

      dispatchInfo,
      expectedDelivery,
      serviceableAreas,
      courierInfo,

      cancellationInfo,
      cancellationPolicyText,
      cancellationPolicyUrl,

      returnsInfo,
      returnsPolicyText,
      returnsPolicyUrl,

      damageInTransitInfo,
      damageClaimText,
      damageClaimUrl,
    } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Product name must be at least 2 characters long.' },
        { status: 400 }
      );
    }

    const parsedPrice = parseInt(String(price), 10);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be a valid non-negative number.' },
        { status: 400 }
      );
    }

    const parsedStock = parseInt(String(stock), 10);
    const validStock = isNaN(parsedStock) || parsedStock < 0 ? 0 : parsedStock;

    const imagesArray: string[] = Array.isArray(images) ? images : [];

    let cleanFeaturedImage: string | null = null;
    if (imagesArray.length > 0) {
      if (!featuredImage || typeof featuredImage !== 'string' || !featuredImage.trim()) {
        return NextResponse.json(
          { success: false, error: 'Exactly one Featured Image must be selected from the product images.' },
          { status: 400 }
        );
      }

      cleanFeaturedImage = featuredImage.trim();
      if (!imagesArray.includes(cleanFeaturedImage)) {
        return NextResponse.json(
          { success: false, error: 'The selected Featured Image must exist inside the uploaded product images collection.' },
          { status: 400 }
        );
      }
    } else if (featuredImage && typeof featuredImage === 'string' && featuredImage.trim()) {
      return NextResponse.json(
        { success: false, error: 'A featured image cannot be set without being part of the product images.' },
        { status: 400 }
      );
    }

    const cleanSlug = slug
      ? slug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
      : idOrSlug;

    const normalizedStatus: ProductStatus =
      status?.toUpperCase() === 'INACTIVE' ? ProductStatus.INACTIVE : ProductStatus.ACTIVE;

    const VALID_CATEGORIES: ProductCategory[] = [
      ProductCategory.BY_FESTIVAL,
      ProductCategory.BY_RITUAL,
      ProductCategory.GRIHA_LIFE_EVENTS,
      ProductCategory.DAILY_PUJA_ESSENTIALS,
    ];

    let normalizedCategory: ProductCategory = ProductCategory.BY_FESTIVAL;
    if (category && VALID_CATEGORIES.includes(category as ProductCategory)) {
      normalizedCategory = category as ProductCategory;
    }

    const imagesJsonStr = JSON.stringify(imagesArray);
    const samagriJsonStr = JSON.stringify(Array.isArray(samagriItems) ? samagriItems : []);

    const formattedHowToUseSteps = Array.isArray(howToUseSteps)
      ? howToUseSteps
          .filter((step: any) => typeof step === 'string' ? step.trim().length > 0 : (step?.text && step.text.trim().length > 0))
          .map((step: any, idx: number) => ({
            text: typeof step === 'string' ? step.trim() : (step?.text || '').trim(),
            order: idx + 1,
          }))
      : [];
    const howToUseStepsJsonStr = JSON.stringify(formattedHowToUseSteps);

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        const existing = await prisma.product.findFirst({
          where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
        });

        if (existing) {
          const updated = await prisma.product.update({
            where: { id: existing.id },
            data: {
              name: name.trim(),
              slug: cleanSlug,
              description: description?.trim() || null,
              category: normalizedCategory,
              price: parsedPrice,

              stock: validStock,
              status: normalizedStatus,
              featuredImage: cleanFeaturedImage,
              imagesJson: imagesJsonStr,
              samagriItemsJson: samagriJsonStr,
              significanceLabel: significanceLabel?.trim() || null,
              significanceHeading: significanceHeading?.trim() || null,
              significanceDescription: significanceDescription?.trim() || null,
              whatsInsideLabel: whatsInsideLabel?.trim() || null,
              whatsInsideHeading: whatsInsideHeading?.trim() || null,
              whatsInsideDescription: whatsInsideDescription?.trim() || null,
              howToUseLabel: howToUseLabel?.trim() || null,
              howToUseHeading: howToUseHeading?.trim() || null,
              howToUseStepsJson: howToUseStepsJsonStr,
              supportingText: supportingText?.trim() || null,
              dispatchInfo: dispatchInfo?.trim() || null,
              expectedDelivery: expectedDelivery?.trim() || null,
              serviceableAreas: serviceableAreas?.trim() || null,
              courierInfo: courierInfo?.trim() || null,
              cancellationInfo: cancellationInfo?.trim() || null,
              cancellationPolicyText: cancellationPolicyText?.trim() || null,
              cancellationPolicyUrl: cancellationPolicyUrl?.trim() || null,
              returnsInfo: returnsInfo?.trim() || null,
              returnsPolicyText: returnsPolicyText?.trim() || null,
              returnsPolicyUrl: returnsPolicyUrl?.trim() || null,
              damageInTransitInfo: damageInTransitInfo?.trim() || null,
              damageClaimText: damageClaimText?.trim() || null,
              damageClaimUrl: damageClaimUrl?.trim() || null,
            },
          });

          return NextResponse.json({ success: true, message: 'Product updated successfully', product: updated });
        }
      } catch (dbErr: any) {
        console.warn('[API Admin Product PUT] DB error fallback:', dbErr?.message || dbErr);
      }
    }

    const existingMem = IN_MEMORY_PRODUCTS_STORE.products.get(idOrSlug);
    if (!existingMem) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const updatedMem: ProductRecord = {
      ...existingMem,
      name: name.trim(),
      slug: cleanSlug,
      description: description?.trim() || null,
      category: category?.trim() || null,
      price: parsedPrice,
      stock: validStock,
      status: normalizedStatus === ProductStatus.INACTIVE ? 'INACTIVE' : 'ACTIVE',
      featuredImage: cleanFeaturedImage,
      imagesJson: imagesJsonStr,
      samagriItemsJson: samagriJsonStr,
      significanceLabel: significanceLabel?.trim() || null,
      significanceHeading: significanceHeading?.trim() || null,
      significanceDescription: significanceDescription?.trim() || null,
      whatsInsideLabel: whatsInsideLabel?.trim() || null,
      whatsInsideHeading: whatsInsideHeading?.trim() || null,
      whatsInsideDescription: whatsInsideDescription?.trim() || null,
      howToUseLabel: howToUseLabel?.trim() || null,
      howToUseHeading: howToUseHeading?.trim() || null,
      howToUseStepsJson: howToUseStepsJsonStr,
      supportingText: supportingText?.trim() || null,
      dispatchInfo: dispatchInfo?.trim() || null,
      expectedDelivery: expectedDelivery?.trim() || null,
      serviceableAreas: serviceableAreas?.trim() || null,
      courierInfo: courierInfo?.trim() || null,
      cancellationInfo: cancellationInfo?.trim() || null,
      cancellationPolicyText: cancellationPolicyText?.trim() || null,
      cancellationPolicyUrl: cancellationPolicyUrl?.trim() || null,
      returnsInfo: returnsInfo?.trim() || null,
      returnsPolicyText: returnsPolicyText?.trim() || null,
      returnsPolicyUrl: returnsPolicyUrl?.trim() || null,
      damageInTransitInfo: damageInTransitInfo?.trim() || null,
      damageClaimText: damageClaimText?.trim() || null,
      damageClaimUrl: damageClaimUrl?.trim() || null,
      updatedAt: new Date().toISOString(),
    };

    IN_MEMORY_PRODUCTS_STORE.products.set(cleanSlug, updatedMem);

    return NextResponse.json({ success: true, message: 'Product updated successfully', product: updatedMem });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Update failed' }, { status: 500 });
  }
});

export const DELETE = withAdminAuth(async (req, { params }) => {
  const idOrSlug = params?.id;
  if (!idOrSlug) {
    return NextResponse.json({ success: false, error: 'Product ID or slug required' }, { status: 400 });
  }

  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      await prisma.product.deleteMany({
        where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      });
      return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    } catch (err: any) {
      console.warn('[API Admin Product DELETE] DB error:', err);
    }
  }

  IN_MEMORY_PRODUCTS_STORE.products.delete(idOrSlug);
  return NextResponse.json({ success: true, message: 'Product deleted successfully' });
});
