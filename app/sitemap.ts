import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { getBaseUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Static public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ritual-kits`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ritual-kits/all`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ritual-guides`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ritual-guides/beginner-guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ritual-guides/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dharmic-concepts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/panchang`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/vrat-calendar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/festival-calendar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/eclipses`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/editorial-method`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    if (process.env.DATABASE_URL) {
      const [products, ritualGuides, dharmicConcepts, beginnerGuides] = await Promise.all([
        prisma.product.findMany({
          where: { status: 'ACTIVE' },
          select: { slug: true, updatedAt: true },
        }),
        prisma.ritualGuide.findMany({
          where: { status: 'PUBLISHED' },
          select: { slug: true, updatedAt: true },
        }),
        prisma.dharmicConcept.findMany({
          where: { status: 'PUBLISHED' },
          select: { slug: true, updatedAt: true },
        }),
        prisma.beginnerGuide.findMany({
          where: { status: 'PUBLISHED' },
          select: { slug: true, updatedAt: true },
        }),
      ]);

      const productUrls: MetadataRoute.Sitemap = products.map((item) => ({
        url: `${baseUrl}/product/${item.slug}`,
        lastModified: item.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

      const guideUrls: MetadataRoute.Sitemap = ritualGuides.map((item) => ({
        url: `${baseUrl}/ritual-guides/${item.slug}`,
        lastModified: item.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

      const conceptUrls: MetadataRoute.Sitemap = dharmicConcepts.map((item) => ({
        url: `${baseUrl}/dharmic-concepts/${item.slug}`,
        lastModified: item.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

      const beginnerUrls: MetadataRoute.Sitemap = beginnerGuides.map((item) => ({
        url: `${baseUrl}/ritual-guides/beginner-guides/${item.slug}`,
        lastModified: item.updatedAt || new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));

      dynamicRoutes = [...productUrls, ...guideUrls, ...conceptUrls, ...beginnerUrls];
    }
  } catch (err) {
    console.error('Error fetching dynamic sitemap entries:', err);
  }

  // Deduplicate and filter out any invalid/admin URLs
  const allEntries = [...staticRoutes, ...dynamicRoutes];
  const uniqueMap = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const entry of allEntries) {
    if (!entry.url.includes('/admin') && !entry.url.includes('/api') && !entry.url.includes('/checkout')) {
      uniqueMap.set(entry.url, entry);
    }
  }

  return Array.from(uniqueMap.values());
}
