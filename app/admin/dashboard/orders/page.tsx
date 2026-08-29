'use client';

import React, { useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

function OrdersContent() {
  const { data: session, status } = useSession();
  const [orders] = useState<any[]>([]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>Loading Orders Console...</div>
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
          DASHBOARD &gt; ORDERS
        </div>

        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: '0 0 6px' }}>
              Orders Management
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              Browse placed orders, inspect snapshots, print checklists, and update fulfillment logistics.
            </p>
          </div>
          <button
            onClick={() => alert('Orders refreshed!')}
            style={{
              background: '#FFFFFF',
              color: '#374151',
              border: '1px solid #E5E7EB',
              padding: '9px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🔄 Refresh List
          </button>
        </div>

        {/* Empty State Card (Exact match to screenshot 5) */}
        {orders.length === 0 && (
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '16px',
                color: '#6B7280',
              }}
            >
              🛒
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 8px', color: '#111827' }}>
              No Orders Placed
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, maxWidth: '440px', lineHeight: 1.5 }}>
              Once customers submit checkout details, orders will appear in this log list.
            </p>
          </div>
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
