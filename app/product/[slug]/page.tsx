import { getProductBySlugServer } from '@/lib/products-server';
import ProductDetailClient from '@/components/ProductDetail/ProductDetailClient';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductBySlugServer(params.slug);

  return <ProductDetailClient product={product} />;
}
