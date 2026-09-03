'use client';

import React from 'react';

export interface TopCustomerItem {
  id?: string;
  name: string;
  email: string;
  totalSpent: number;
  ordersCount: number;
}

interface CustomerAnalyticsProps {
  data: {
    totalUsers: number;
    usersWithOrders: number;
    newUsersInRange: number;
    repeatCustomers: number;
    topCustomers: TopCustomerItem[];
  };
  loading?: boolean;
}

function formatINR(val: number): string {
  return '₹' + (val || 0).toLocaleString('en-IN');
}

export const CustomerAnalyticsCard: React.FC<CustomerAnalyticsProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', marginBottom: '36px' }}>
        <div style={{ height: '20px', width: '180px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '16px' }} />
        <div style={{ height: '120px', background: '#FAFAFA', borderRadius: '10px' }} />
      </div>
    );
  }

  const repeatRatio = data?.usersWithOrders > 0
    ? parseFloat(((data?.repeatCustomers / data?.usersWithOrders) * 100).toFixed(1))
    : 0;

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', marginBottom: '36px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif', margin: '0 0 4px' }}>
          👥 Customer Analytics &amp; Loyalty
        </h3>
        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
          User growth, purchase frequency, repeat customers, and top customer accounts
        </p>
      </div>

      {/* METRIC BADGES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.5px', marginBottom: '4px' }}>TOTAL REGISTERED</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A', fontFamily: 'Georgia, serif' }}>
            {data?.totalUsers || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Total user accounts</div>
        </div>

        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', letterSpacing: '0.5px', marginBottom: '4px' }}>CUSTOMERS WITH ORDERS</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#065F46', fontFamily: 'Georgia, serif' }}>
            {data?.usersWithOrders || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#047857', marginTop: '2px' }}>Active buyers</div>
        </div>

        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', letterSpacing: '0.5px', marginBottom: '4px' }}>NEW USERS (PERIOD)</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1E3A8A', fontFamily: 'Georgia, serif' }}>
            {data?.newUsersInRange || 0}
          </div>
          <div style={{ fontSize: '11px', color: '#1E40AF', marginTop: '2px' }}>Registered in range</div>
        </div>

        <div style={{ background: '#F3E8FF', border: '1px solid #E9D5FF', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B21A8', letterSpacing: '0.5px', marginBottom: '4px' }}>REPEAT CUSTOMERS</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#581C87', fontFamily: 'Georgia, serif' }}>
            {data?.repeatCustomers || 0} <span style={{ fontSize: '13px', fontWeight: 600 }}>({repeatRatio}%)</span>
          </div>
          <div style={{ fontSize: '11px', color: '#6B21A8', marginTop: '2px' }}>Multiple purchases</div>
        </div>
      </div>

      {/* TOP CUSTOMERS TABLE */}
      {data?.topCustomers && data.topCustomers.length > 0 && (
        <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🏆</span> Top Customers by Paid Volume
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 12px' }}>Customer</th>
                  <th style={{ padding: '8px 12px' }}>Contact</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Orders</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {data.topCustomers.map((c, i) => (
                  <tr key={c.id || i} style={{ borderBottom: '1px solid #F9FAFB' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#111827' }}>{c.name}</td>
                    <td style={{ padding: '10px 12px', color: '#6B7280' }}>{c.email}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: '#DE1B59' }}>{c.ordersCount}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#047857', fontFamily: 'Georgia, serif' }}>
                      {formatINR(c.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
