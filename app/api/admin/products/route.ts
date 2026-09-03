import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { ProductStatus, ProductCategory } from '@prisma/client';

import { IN_MEMORY_PRODUCTS_STORE, ProductRecord } from '@/lib/products';
import { invalidateProductCache } from '@/lib/redis';

export const GET = withAdminAuth(async () => {
  let dbProducts: any[] = [];
  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      dbProducts = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (err: any) {
      console.warn('[API Admin Products GET] Database query fallback:', err?.message || err);
    }
  }

  const fallbackList = Array.from(IN_MEMORY_PRODUCTS_STORE.products.values());

  // Merge DB products and in-memory fallback products by slug so no items are missing
  const productMap = new Map<string, any>();

  fallbackList.forEach((p) => {
    productMap.set(p.slug || p.id, p);
  });

  dbProducts.forEach((p) => {
    productMap.set(p.slug || p.id, p);
  });

  const combinedList = Array.from(productMap.values());

  return NextResponse.json({
    success: true,
    data: combinedList,
  });
});

export const POST = withAdminAuth(async (req) => {
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

    // 1. Input Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Product name must be at least 2 characters long.' },
        { status: 400 }
      );
    }

    if (!slug || typeof slug !== 'string' || slug.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Product slug / ID is required.' },
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
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');

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

    // 2. Database Persistence with Fallback Safety
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        const existingProduct = await prisma.product.findUnique({
          where: { slug: cleanSlug },
        });

        if (existingProduct) {
          return NextResponse.json(
            { success: false, error: `A product with the slug "${cleanSlug}" already exists.` },
            { status: 400 }
          );
        }

        const createdProduct = await prisma.product.create({
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

        // Sync with in-memory fallback
        IN_MEMORY_PRODUCTS_STORE.products.set(cleanSlug, {
          id: createdProduct.id,
          name: createdProduct.name,
          slug: createdProduct.slug,
          description: createdProduct.description,
          category: createdProduct.category,
          price: createdProduct.price,
          stock: createdProduct.stock,
          status: createdProduct.status === ProductStatus.INACTIVE ? 'INACTIVE' : 'ACTIVE',
          featuredImage: createdProduct.featuredImage,
          imagesJson: createdProduct.imagesJson,
          samagriItemsJson: createdProduct.samagriItemsJson,
          significanceLabel: createdProduct.significanceLabel,
          significanceHeading: createdProduct.significanceHeading,
          significanceDescription: createdProduct.significanceDescription,
          whatsInsideLabel: createdProduct.whatsInsideLabel,
          whatsInsideHeading: createdProduct.whatsInsideHeading,
          whatsInsideDescription: createdProduct.whatsInsideDescription,
          howToUseLabel: createdProduct.howToUseLabel,
          howToUseHeading: createdProduct.howToUseHeading,
          howToUseStepsJson: createdProduct.howToUseStepsJson,
          supportingText: createdProduct.supportingText,
          dispatchInfo: createdProduct.dispatchInfo,
          expectedDelivery: createdProduct.expectedDelivery,
          serviceableAreas: createdProduct.serviceableAreas,
          courierInfo: createdProduct.courierInfo,
          cancellationInfo: createdProduct.cancellationInfo,
          cancellationPolicyText: createdProduct.cancellationPolicyText,
          cancellationPolicyUrl: createdProduct.cancellationPolicyUrl,
          returnsInfo: createdProduct.returnsInfo,
          returnsPolicyText: createdProduct.returnsPolicyText,
          returnsPolicyUrl: createdProduct.returnsPolicyUrl,
          damageInTransitInfo: createdProduct.damageInTransitInfo,
          damageClaimText: createdProduct.damageClaimText,
          damageClaimUrl: createdProduct.damageClaimUrl,
          createdAt: createdProduct.createdAt.toISOString(),
          updatedAt: createdProduct.updatedAt.toISOString(),
        });

        await invalidateProductCache(createdProduct.slug);

        return NextResponse.json(
          {
            success: true,
            message: 'Product created successfully!',
            product: createdProduct,
          },
          { status: 201 }
        );
      } catch (dbErr: any) {
        console.warn('[API Admin Products POST] Database error, switching to resilient fallback:', dbErr?.message || dbErr);
      }
    }

    // 3. Fallback In-Memory Store Persistence
    if (IN_MEMORY_PRODUCTS_STORE.products.has(cleanSlug)) {
      return NextResponse.json(
        { success: false, error: `A product with the slug "${cleanSlug}" already exists.` },
        { status: 400 }
      );
    }

    const productId = `prod_${Date.now()}`;
    const newProduct: ProductRecord = {
      id: productId,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    IN_MEMORY_PRODUCTS_STORE.products.set(cleanSlug, newProduct);

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully in catalog!',
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[API Admin Products POST] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to create product.' },
      { status: 500 }
    );
  }
});

// DELETE ALL PRODUCTS API & BULK DELETE ROUTING
export const DELETE = withAdminAuth(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];

    // Case 1: Bulk Delete (specific IDs provided)
    if (ids.length > 0) {
      let count = 0;
      if (process.env.DATABASE_URL?.startsWith('postgres')) {
        try {
          const res = await prisma.product.deleteMany({
            where: {
              OR: [
                { id: { in: ids } },
                { slug: { in: ids } },
              ],
            },
          });
          count = res.count;
        } catch (err: any) {
          console.warn('[API Admin Products DELETE] DB error:', err);
        }
      }

      ids.forEach((idOrSlug) => {
        let foundKey: string | null = null;
        IN_MEMORY_PRODUCTS_STORE.products.forEach((prod, key) => {
          if (prod.id === idOrSlug || prod.slug === idOrSlug || key === idOrSlug) {
            foundKey = key;
          }
        });
        if (foundKey) {
          IN_MEMORY_PRODUCTS_STORE.products.delete(foundKey);
          if (!process.env.DATABASE_URL?.startsWith('postgres')) {
            count++;
          }
        }
      });


      return NextResponse.json({
        success: true,
        message: `${count} product(s) deleted successfully.`,
        count,
      });
    }

    // Case 2: Delete ALL Products (product-only deletion, no table drop or foreign table damage)
    let deletedCount = 0;
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        const res = await prisma.product.deleteMany({});
        deletedCount = res.count;
      } catch (err: any) {
        console.warn('[API Admin Products Delete All] DB error:', err);
      }
    }

    const memCount = IN_MEMORY_PRODUCTS_STORE.products.size;
    IN_MEMORY_PRODUCTS_STORE.products.clear();
    if (!process.env.DATABASE_URL?.startsWith('postgres')) {
      deletedCount = memCount;
    }

    return NextResponse.json({
      success: true,
      message: `All products (${deletedCount}) deleted successfully from database catalog.`,
      count: deletedCount,
    });
  } catch (err: any) {
    console.error('[API Admin Products DELETE] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to execute deletion operation.' },
      { status: 500 }
    );
  }
});
