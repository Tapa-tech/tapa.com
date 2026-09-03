import React from 'react';
import { getPublicProductsServer } from '@/lib/products-server';
import { RitualKitsView } from '@/components/RitualKits/RitualKitsView';

export const revalidate = 60; // Server-side revalidation window (60 seconds)

export default async function RitualKitsPage() {
  const products = await getPublicProductsServer();

  return <RitualKitsView initialProducts={products} />;
}
