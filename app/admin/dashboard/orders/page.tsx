'use client';

import React, { useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { FullOrdersSection } from '@/components/admin/analytics/FullOrdersSection';
import { OrderDetailsModal } from '@/components/admin/analytics/OrderDetailsModal';
import { OrderRecord } from '@/components/admin/analytics/RecentOrdersSection';

function OrdersContent() {
  const { data: session, status } = useSession();
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>Loading Orders Console...</div>
      </div>
    );
  }

  const userRole = (session?.user as { role?: string })?.role?.toUpperCase() || 'SUPER_ADMIN';

  if (status === 'unauthenticated' || !['ADMIN', 'SUPER_USER', 'SUPER_ADMIN', 'EDITOR'].includes(userRole)) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #FCA5A5', borderRadius: '20px', padding: '36px', maxWidth: '440px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#DC2626', margin: '0 0 8px' }}>Access Denied</h2>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 24px' }}>You must be authenticated as an Admin.</p>
          <Link href="/admin/login" style={{ background: '#DE1B59', color: '#FFFFFF', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}>
            Console Login →
          </Link>
        </div>
      </div>
    );
  }

  const userEmail = session?.user?.email || (session?.user as any)?.phone || 'admin@tapa.co';

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1280px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '12px' }}>
          DASHBOARD &gt; ORDERS MANAGEMENT
        </div>

        {/* Title Bar */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: '0 0 6px' }}>
            Orders Management &amp; Fulfillment
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
            Inspect customer orders, filter by status, export reports, and update delivery fulfillment logistics.
          </p>
        </div>

        {/* FULL ORDERS SECTION COMPONENT */}
        <FullOrdersSection onSelectOrder={(ord) => setSelectedOrder(ord)} />

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusUpdated={() => {
              // Trigger refresh by re-rendering if needed
            }}
          />
        )}
      </main>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <SessionProvider>
      <OrdersContent />
    </SessionProvider>
  );
}
