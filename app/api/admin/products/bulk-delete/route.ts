import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { IN_MEMORY_PRODUCTS_STORE } from '@/lib/products';

export const POST = withAdminAuth(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one valid product ID or slug is required for bulk deletion.' },
        { status: 400 }
      );
    }

    let deletedCount = 0;

    // 1. Delete specified products from PostgreSQL DB
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        const result = await prisma.product.deleteMany({
          where: {
            OR: [
              { id: { in: ids } },
              { slug: { in: ids } },
            ],
          },
        });
        deletedCount = result.count;
      } catch (err: any) {
        console.warn('[API Admin Products Bulk Delete] DB error fallback:', err?.message || err);
      }
    }

    // 2. Clear specified products from in-memory fallback store
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
          deletedCount++;
        }
      }
    });


    return NextResponse.json({
      success: true,
      message: `${deletedCount} product(s) deleted successfully.`,
      count: deletedCount,
    });
  } catch (err: any) {
    console.error('[API Admin Products Bulk Delete] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to bulk delete products.' },
      { status: 500 }
    );
  }
});

export const DELETE = POST;
