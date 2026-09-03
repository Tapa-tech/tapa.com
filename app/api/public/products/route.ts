import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { IN_MEMORY_PRODUCTS_STORE } from '@/lib/products';
import { getCachedOrFetch, CACHE_KEYS } from '@/lib/redis';

export async function GET() {
  const data = await getCachedOrFetch(
    CACHE_KEYS.PUBLIC_PRODUCTS_ALL,
    async () => {
      if (process.env.DATABASE_URL?.startsWith('postgres')) {
        try {
          return await prisma.product.findMany({
            where: { status: 'ACTIVE' },
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              category: true,
              price: true,
              stock: true,
              status: true,
              featuredImage: true,
              imagesJson: true,
              samagriItemsJson: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
          });
        } catch (err) {
          console.warn('[Public Products API] DB fallback:', err);
        }
      }

      return Array.from(IN_MEMORY_PRODUCTS_STORE.products.values()).filter(
        (p) => p.status === 'ACTIVE'
      );
    },
    900
  );

  const res = NextResponse.json({ success: true, data });
  res.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
  return res;
}
