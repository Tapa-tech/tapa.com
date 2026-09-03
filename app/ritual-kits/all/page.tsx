import React from 'react';
import { getPublicProductsServer } from '@/lib/products-server';
import { AllRitualKitsView } from '@/components/RitualKits/AllRitualKitsView';

export const revalidate = 60; // 60 seconds revalidation

export default async function AllRitualKitsListingPage() {
  const products = await getPublicProductsServer();

  return <AllRitualKitsView initialProducts={products} />;
}
