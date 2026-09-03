import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { IN_MEMORY_PRODUCTS_STORE } from '@/lib/products';
import { getCachedOrFetch, CACHE_KEYS } from '@/lib/redis';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const slugOrId = params?.slug;
  if (!slugOrId) {
    return NextResponse.json({ success: false, error: 'Product slug or ID is required.' }, { status: 400 });
  }

  const cleanSlug = slugOrId.toLowerCase().trim();

  const product = await getCachedOrFetch(
    CACHE_KEYS.PUBLIC_PRODUCT_SLUG(cleanSlug),
    async () => {
      if (process.env.DATABASE_URL?.startsWith('postgres')) {
        try {
          const dbProd = await prisma.product.findFirst({
            where: {
              OR: [
                { slug: cleanSlug },
                { id: slugOrId },
              ],
            },
          });
          if (dbProd) return dbProd;
        } catch (err) {
          console.warn('[Public Product Detail API] DB lookup fallback:', err);
        }
      }

      let fallbackProd = IN_MEMORY_PRODUCTS_STORE.products.get(cleanSlug);
      if (!fallbackProd) {
        IN_MEMORY_PRODUCTS_STORE.products.forEach((p) => {
          if (p.id === slugOrId || p.slug === cleanSlug) {
            fallbackProd = p;
          }
        });
      }
      return fallbackProd || null;
    },
    1800
  );

  if (product) {
    return NextResponse.json({
      success: true,
      product,
    });
  }

  return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });
}
