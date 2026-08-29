'use client';

import React, { useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

function ProductsContent() {
  const { data: session, status } = useSession();
  const [products] = useState<any[]>([]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>Loading Products Console...</div>
      </div>
    );
  }

  const userEmail = session?.user?.email || 'admin@tapa.co';
  const userRole = (session?.user as any)?.role?.toUpperCase() || 'SUPER_ADMIN';

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '12px' }}>
          DASHBOARD &gt; PRODUCTS
        </div>

        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: '0 0 6px' }}>
              Inventory Products &amp; Kits
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              Manage Puja Kits and individual Samagri items, pricing, inventory stock status, and configurations.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            style={{
              background: '#DE1B59',
              color: '#FFFFFF',
              border: 'none',
              padding: '11px 20px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(222, 27, 89, 0.2)',
            }}
          >
            + New Product
          </Link>
        </div>

        {/* Empty State Card (Exact match to screenshot 1) */}
        {products.length === 0 && (
          <div
            style={{
              background: '#FFFDF9',
              border: '1px solid #F5E6D3',
              borderRadius: '20px',
              padding: '64px 32px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                border: '2px solid #D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '16px',
                color: '#D97706',
              }}
            >
              📦
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 8px', color: '#111827' }}>
              No Products Found
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, maxWidth: '440px', lineHeight: 1.5 }}>
              Create a new Puja Kit or Samagri item above to begin stocking the inventory.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <SessionProvider>
      <ProductsContent />
    </SessionProvider>
  );
}
