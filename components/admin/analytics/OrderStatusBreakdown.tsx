'use client';

import React from 'react';

export interface OrderStatusBreakdownItem {
  status: string;
  count: number;
  percentage: number;
  amount: number;
}

interface OrderStatusBreakdownProps {
  data: OrderStatusBreakdownItem[];
  loading?: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; icon: string }> = {
  PLACED: { label: 'Placed', bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE', icon: '📝' },
  CONFIRMED: { label: 'Confirmed', bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', icon: '✅' },
  PROCESSING: { label: 'Processing', bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', icon: '⚙️' },
  DISPATCHED: { label: 'Dispatched', bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE', icon: '🚚' },
  DELIVERED: { label: 'Delivered', bg: '#ECFDF5', text: '#065F46', border: '#6EE7B7', icon: '📦' },
  CANCELLATION_REQUESTED: { label: 'Cancellation Requested', bg: '#FEF3C7', text: '#B45309', border: '#FCD34D', icon: '⚠️' },
  CANCELLED: { label: 'Cancelled', bg: '#FEF2F2', text: '#991B1B', border: '#FCA5A5', icon: '❌' },
};

function formatINR(val: number): string {
  return '₹' + (val || 0).toLocaleString('en-IN');
}

export const OrderStatusBreakdown: React.FC<OrderStatusBreakdownProps> = ({ data = [], loading }) => {
  if (loading) {
    return (
      <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', marginBottom: '36px' }}>
        <div style={{ height: '20px', width: '200px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '16px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} style={{ height: '80px', background: '#F9FAFB', borderRadius: '12px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', marginBottom: '36px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif', margin: '0 0 4px' }}>
          📦 Order Status Distribution
        </h3>
        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
          Real-time count, percentage, and monetary volume across all fulfillment stages
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {data.map((item) => {
          const cfg = STATUS_CONFIG[item.status] || {
            label: item.status,
            bg: '#F3F4F6',
            text: '#374151',
            border: '#E5E7EB',
            icon: '📄',
          };

          return (
            <div
              key={item.status}
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: cfg.text, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{cfg.icon}</span> {cfg.label.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: cfg.text, background: 'rgba(255,255,255,0.7)', padding: '1px 6px', borderRadius: '4px' }}>
                    {item.percentage}%
                  </span>
                </div>

                <div style={{ fontSize: '24px', fontWeight: 700, color: cfg.text, fontFamily: 'Georgia, serif', lineHeight: 1 }}>
                  {item.count} <span style={{ fontSize: '12px', fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}>orders</span>
                </div>
              </div>

              {/* PROGRESS BAR & VALUE */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ width: '100%', height: '5px', background: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{ width: `${Math.min(item.percentage, 100)}%`, height: '100%', background: cfg.text, borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: cfg.text, textAlign: 'right' }}>
                  Value: {formatINR(item.amount)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
