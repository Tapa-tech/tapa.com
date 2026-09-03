import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/admin/*',
        '/api/',
        '/api/*',
        '/checkout',
        '/cart',
        '/login',
        '/auth/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
