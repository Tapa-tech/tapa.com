import { prisma } from '@/lib/db';
import { IN_MEMORY_PRODUCTS_STORE } from '@/lib/products';

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  price: number;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE';
  featuredImage?: string | null;
  imagesJson?: string | null;
}

export async function getPublicProductsServer(): Promise<ProductSummary[]> {
  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      const products = await prisma.product.findMany({
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
        },
        orderBy: { createdAt: 'desc' },
      });
      return products as ProductSummary[];
    } catch (err) {
      console.warn('[Products Server] DB query fallback:', err);
    }
  }

  return Array.from(IN_MEMORY_PRODUCTS_STORE.products.values())
    .filter((p) => p.status === 'ACTIVE')
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description || null,
      category: p.category || null,
      price: p.price,
      stock: p.stock,
      status: p.status,
      featuredImage: p.featuredImage || null,
      imagesJson: p.imagesJson || null,
    }));
}

export async function getProductBySlugServer(slug: string): Promise<any | null> {
  if (!slug) return null;
  const cleanSlug = slug.trim().toLowerCase();

  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      let product = await prisma.product.findFirst({
        where: {
          OR: [
            { slug: cleanSlug },
            { slug: slug },
            { id: slug },
            { slug: { contains: cleanSlug } },
          ],
        },
      });
      if (!product) {
        product = await prisma.product.findFirst({
          where: { status: 'ACTIVE' },
        });
      }
      if (product) return product;
    } catch (err) {
      console.warn('[Products Server] DB findFirst fallback:', err);
    }
  }

  // Fallback to in-memory store
  const allProducts = Array.from(IN_MEMORY_PRODUCTS_STORE.products.values());
  const found = allProducts.find(
    (p) => p.slug === cleanSlug || p.slug === slug || p.id === slug
  );
  return found || allProducts[0] || null;
}
