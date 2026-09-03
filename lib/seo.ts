export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/+$/, '');
  }
  return 'https://thetapa.com';
}

export function generateProductJsonLd(product: any) {
  if (!product) return null;
  const baseUrl = getBaseUrl();
  const productUrl = `${baseUrl}/product/${product.slug}`;
  
  let images: string[] = [];
  if (product.featuredImage) {
    images.push(product.featuredImage);
  }
  if (product.imagesJson) {
    try {
      const parsed = typeof product.imagesJson === 'string' ? JSON.parse(product.imagesJson) : product.imagesJson;
      if (Array.isArray(parsed)) {
        images = Array.from(new Set([...images, ...parsed]));
      }
    } catch {}
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.significanceDescription || product.name,
    image: images.length > 0 ? images : undefined,
    url: productUrl,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'The Tapa Co.',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: product.stock && product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/InStock',
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: 'The Tapa Co.',
      },
    },
  };
}

export function generateArticleJsonLd(content: {
  title: string;
  slug: string;
  sectionPath?: string;
  description?: string | null;
  image?: string | null;
  publishedAt?: string | Date;
  updatedAt?: string | Date;
  createdAt?: string | Date;
  authorName?: string | null;
}) {
  if (!content || !content.title) return null;
  const baseUrl = getBaseUrl();
  const section = content.sectionPath || 'ritual-guides';
  const url = `${baseUrl}/${section}/${content.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: content.title,
    description: content.description || content.title,
    image: content.image ? [content.image] : undefined,
    datePublished: content.publishedAt
      ? new Date(content.publishedAt).toISOString()
      : content.createdAt
      ? new Date(content.createdAt).toISOString()
      : undefined,
    dateModified: content.updatedAt ? new Date(content.updatedAt).toISOString() : undefined,
    author: {
      '@type': 'Organization',
      name: content.authorName || 'The Tapa Co.',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Tapa Co.',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.ico`,
      },
    },
  };
}


export function generateFaqJsonLd(faqItems: Array<{ question: string; answer: string }>) {
  if (!Array.isArray(faqItems) || faqItems.length === 0) return null;
  
  const validItems = faqItems.filter(item => item && item.question && item.answer);
  if (validItems.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
