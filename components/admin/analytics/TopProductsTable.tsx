'use client';

import React from 'react';

export interface TopProductItem {
  id: string;
  name: string;
  unitsSold: number;
  orderCount: number;
  revenue: number;
}

interface TopProductsTableProps {
  products: TopProductItem[];
  loading?: boolean;
}

function formatINR(val: number): string {
  return '₹' + (val || 0).toLocaleString('en-IN');
}

export const TopProductsTable: React.FC<TopProductsTableProps> = ({ products = [], loading }) => {
  if (loading) {
    return (
      <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', marginBottom: '36px' }}>
        <div style={{ height: '20px', width: '180px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '16px' }} />
        <div style={{ height: '120px', background: '#FAFAFA', borderRadius: '10px' }} />
      </div>
    );
  }

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', marginBottom: '36px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif', margin: '0 0 4px' }}>
            🔥 Top Selling Ritual Kits &amp; Products
          </h3>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
            Ranked by units sold and generated revenue from valid orders
          </p>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', background: '#FDF2F5', padding: '4px 10px', borderRadius: '8px' }}>
          Top {products.length} Items
        </span>
      </div>

      {products.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px', background: '#FAFAFA', borderRadius: '12px' }}>
          No product sales recorded in the selected period.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F3F4F6', color: '#6B7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '10px 12px', width: '50px' }}>Rank</th>
                <th style={{ padding: '10px 12px' }}>Product Name</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Units Sold</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Orders Count</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr key={p.id || idx} style={{ borderBottom: '1px solid #F9FAFB', transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: idx === 0 ? '#D97706' : idx === 1 ? '#4B5563' : idx === 2 ? '#B45309' : '#9CA3AF' }}>
                    #{idx + 1}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#111827' }}>
                    {p.name}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700, color: '#DE1B59' }}>
                    {p.unitsSold}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#4B5563' }}>
                    {p.orderCount}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#047857', fontFamily: 'Georgia, serif' }}>
                    {formatINR(p.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
