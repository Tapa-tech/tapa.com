'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { CartProvider } from '@/context/CartContext';
import { SessionProvider } from 'next-auth/react';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <main className="w-full max-w-full min-h-screen">{children}</main>;
  }

  return (
    <SessionProvider>
      <CartProvider>
        <Header />
        <main className="w-full max-w-full min-h-screen overflow-x-hidden">{children}</main>
        <Footer />
      </CartProvider>
    </SessionProvider>
  );
}

