'use client';

import React from 'react';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  createdAt: string;
  updatedAt?: string;
  items?: Array<{
    id: string;
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
}

interface RecentOrdersProps {
  orders: OrderRecord[];
  onSelectOrder: (order: OrderRecord) => void;
  loading?: boolean;
}

function formatINR(val: number): string {
  return '₹' + (val || 0).toLocaleString('en-IN');
}

const PAYMENT_BADGES: Record<string, { bg: string; text: string }> = {
  PAID: { bg: '#DCFCE7', text: '#15803D' },
  PENDING: { bg: '#FEF3C7', text: '#B45309' },
  FAILED: { bg: '#FEE2E2', text: '#B91C1C' },
  REFUNDED: { bg: '#F3E8FF', text: '#7E22CE' },
};

const ORDER_BADGES: Record<string, { bg: string; text: string }> = {
  PLACED: { bg: '#EFF6FF', text: '#1E40AF' },
  CONFIRMED: { bg: '#F0FDF4', text: '#166534' },
  PROCESSING: { bg: '#FFFBEB', text: '#92400E' },
  DISPATCHED: { bg: '#F5F3FF', text: '#5B21B6' },
  DELIVERED: { bg: '#ECFDF5', text: '#065F46' },
  CANCELLATION_REQUESTED: { bg: '#FEF3C7', text: '#B45309' },
  CANCELLED: { bg: '#FEF2F2', text: '#991B1B' },
};

export const RecentOrdersSection: React.FC<RecentOrdersProps> = ({ orders = [], onSelectOrder, loading }) => {
  if (loading) {
    return (
      <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', marginBottom: '36px' }}>
        <div style={{ height: '20px', width: '180px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '16px' }} />
        <div style={{ height: '140px', background: '#FAFAFA', borderRadius: '10px' }} />
      </div>
    );
  }

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', marginBottom: '36px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif', margin: '0 0 4px' }}>
            ⚡ Recent Customer Orders
          </h3>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
            Latest 10 order placements &amp; payment updates
          </p>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#4B5563', background: '#F3F4F6', padding: '4px 10px', borderRadius: '8px' }}>
          {orders.length} Recent Records
        </span>
      </div>

      {orders.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px', background: '#FAFAFA', borderRadius: '12px' }}>
          No customer orders found in the system yet.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F3F4F6', color: '#6B7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '10px 12px' }}>Order #</th>
                <th style={{ padding: '10px 12px' }}>Customer</th>
                <th style={{ padding: '10px 12px' }}>Date</th>
                <th style={{ padding: '10px 12px' }}>Amount</th>
                <th style={{ padding: '10px 12px' }}>Payment</th>
                <th style={{ padding: '10px 12px' }}>Fulfillment</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const payStyle = PAYMENT_BADGES[o.paymentStatus] || { bg: '#F3F4F6', text: '#374151' };
                const ordStyle = ORDER_BADGES[o.orderStatus] || { bg: '#F3F4F6', text: '#374151' };
                const dateFormatted = new Date(o.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr
                    key={o.id}
                    onClick={() => onSelectOrder(o)}
                    style={{ borderBottom: '1px solid #F9FAFB', cursor: 'pointer', transition: 'background 0.15s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#FDF2F5')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px', fontWeight: 700, color: '#DE1B59' }}>{o.orderNumber}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 700, color: '#111827' }}>{o.customerName}</div>
                      <div style={{ fontSize: '11px', color: '#6B7280' }}>{o.customerMobile}</div>
                    </td>
                    <td style={{ padding: '12px', color: '#6B7280', fontSize: '11px' }}>{dateFormatted}</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>
                      {formatINR(o.grandTotal)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: payStyle.bg, color: payStyle.text, fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: ordStyle.bg, color: ordStyle.text, fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <span style={{ color: '#DE1B59', fontWeight: 700, fontSize: '11px' }}>Inspect →</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
