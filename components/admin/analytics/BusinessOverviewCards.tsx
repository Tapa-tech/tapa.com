'use client';

import React from 'react';

interface BusinessOverviewData {
  totalOrdersAllTime: number;
  totalOrdersToday: number;
  totalOrdersWeek: number;
  totalOrdersMonth: number;
  totalOrdersYear: number;
  totalOrdersInRange: number;
  paidRevenueAllTime: number;
  paidRevenueToday: number;
  paidRevenueWeek: number;
  paidRevenueMonth: number;
  paidRevenueYear: number;
  paidRevenueInRange: number;
  averageOrderValue: number;
  pendingPayments: { count: number; amount: number };
  failedPayments: { count: number; amount: number };
  refundedPayments: { count: number; amount: number };
  codStats: { count: number; amount: number };
  razorpayStats: {
    count: number;
    paidRevenue: number;
    pendingAmount: number;
    failedAmount: number;
    refundedAmount: number;
  };
}

interface BusinessOverviewCardsProps {
  data: BusinessOverviewData;
  loading?: boolean;
}

function formatINR(val: number): string {
  return '₹' + (val || 0).toLocaleString('en-IN');
}

export const BusinessOverviewCards: React.FC<BusinessOverviewCardsProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '14px', fontFamily: 'Georgia, serif' }}>
          📊 Business &amp; Financial Overview
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', height: '110px', animation: 'pulse 1.5s infinite ease-in-out' }}>
              <div style={{ width: '40%', height: '12px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '12px' }} />
              <div style={{ width: '70%', height: '24px', background: '#E5E7EB', borderRadius: '6px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif', margin: 0 }}>
          📊 Business &amp; Financial Overview
        </h2>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', background: '#F3F4F6', padding: '3px 10px', borderRadius: '12px' }}>
          Real Database Metrics
        </span>
      </div>

      {/* PRIMARY STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
        {/* Card A: TOTAL ORDERS */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.5px' }}>TOTAL ORDERS</span>
              <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🛍️</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif', lineHeight: 1 }}>
              {(data?.totalOrdersAllTime || 0).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '6px' }}>
              Selected Period: <strong style={{ color: '#111827' }}>{data?.totalOrdersInRange || 0}</strong>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '10px', marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', fontSize: '10px', textAlign: 'center' }}>
            <div>
              <div style={{ color: '#9CA3AF' }}>Today</div>
              <div style={{ fontWeight: 700, color: '#111827' }}>{data?.totalOrdersToday || 0}</div>
            </div>
            <div>
              <div style={{ color: '#9CA3AF' }}>Week</div>
              <div style={{ fontWeight: 700, color: '#111827' }}>{data?.totalOrdersWeek || 0}</div>
            </div>
            <div>
              <div style={{ color: '#9CA3AF' }}>Month</div>
              <div style={{ fontWeight: 700, color: '#111827' }}>{data?.totalOrdersMonth || 0}</div>
            </div>
            <div>
              <div style={{ color: '#9CA3AF' }}>Year</div>
              <div style={{ fontWeight: 700, color: '#111827' }}>{data?.totalOrdersYear || 0}</div>
            </div>
          </div>
        </div>

        {/* Card B: REVENUE (PAID) */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', letterSpacing: '0.5px' }}>PAID REVENUE</span>
              <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💰</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#047857', fontFamily: 'Georgia, serif', lineHeight: 1 }}>
              {formatINR(data?.paidRevenueAllTime || 0)}
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '6px' }}>
              Avg Order Value: <strong style={{ color: '#047857' }}>{formatINR(data?.averageOrderValue || 0)}</strong>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '10px', marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', fontSize: '10px', textAlign: 'center' }}>
            <div>
              <div style={{ color: '#9CA3AF' }}>Today</div>
              <div style={{ fontWeight: 700, color: '#047857' }}>{formatINR(data?.paidRevenueToday || 0)}</div>
            </div>
            <div>
              <div style={{ color: '#9CA3AF' }}>Week</div>
              <div style={{ fontWeight: 700, color: '#047857' }}>{formatINR(data?.paidRevenueWeek || 0)}</div>
            </div>
            <div>
              <div style={{ color: '#9CA3AF' }}>Month</div>
              <div style={{ fontWeight: 700, color: '#047857' }}>{formatINR(data?.paidRevenueMonth || 0)}</div>
            </div>
            <div>
              <div style={{ color: '#9CA3AF' }}>Year</div>
              <div style={{ fontWeight: 700, color: '#047857' }}>{formatINR(data?.paidRevenueYear || 0)}</div>
            </div>
          </div>
        </div>

        {/* Card C: PENDING PAYMENTS */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', letterSpacing: '0.5px' }}>PENDING PAYMENTS</span>
              <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⏳</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#B45309', fontFamily: 'Georgia, serif', lineHeight: 1 }}>
              {formatINR(data?.pendingPayments?.amount || 0)}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#D97706', marginTop: '6px' }}>
              {data?.pendingPayments?.count || 0} orders awaiting payment
            </div>
          </div>
          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '10px', marginTop: '12px', fontSize: '11px', color: '#9CA3AF', display: 'flex', justifyContent: 'space-between' }}>
            <span>Status: PENDING</span>
            <span style={{ color: '#B45309', fontWeight: 600 }}>Uncaptured COD/Online</span>
          </div>
        </div>

        {/* Card D: FAILED PAYMENTS */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', letterSpacing: '0.5px' }}>FAILED PAYMENTS</span>
              <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚠️</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#B91C1C', fontFamily: 'Georgia, serif', lineHeight: 1 }}>
              {formatINR(data?.failedPayments?.amount || 0)}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', marginTop: '6px' }}>
              {data?.failedPayments?.count || 0} failed transactions
            </div>
          </div>
          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '10px', marginTop: '12px', fontSize: '11px', color: '#9CA3AF', display: 'flex', justifyContent: 'space-between' }}>
            <span>Status: FAILED</span>
            <span style={{ color: '#B91C1C', fontWeight: 600 }}>Card/UPI rejections</span>
          </div>
        </div>
      </div>

      {/* SECONDARY STATS GRID (REFUNDS, COD, RAZORPAY) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {/* Card E: REFUNDS */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>↩️</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#7E22CE' }}>Refunded Orders</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, background: '#F3E8FF', color: '#6B21A8', padding: '2px 8px', borderRadius: '6px' }}>
              {data?.refundedPayments?.count || 0} Orders
            </span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#6B21A8', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>
            {formatINR(data?.refundedPayments?.amount || 0)}
          </div>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>
            Total value of processed refunds &amp; reversals
          </div>
        </div>

        {/* Card F: COD ANALYTICS */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>💵</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#B45309' }}>Cash on Delivery (COD)</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: '6px' }}>
              {data?.codStats?.count || 0} Orders
            </span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#B45309', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>
            {formatINR(data?.codStats?.amount || 0)}
          </div>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>
            Total COD booking volume
          </div>
        </div>

        {/* Card G: RAZORPAY ANALYTICS */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>💳</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1D4ED8' }}>Razorpay Online</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '6px' }}>
              {data?.razorpayStats?.count || 0} Orders
            </span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#1E40AF', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>
            {formatINR(data?.razorpayStats?.paidRevenue || 0)}
          </div>
          <div style={{ fontSize: '10px', color: '#6B7280', display: 'flex', gap: '12px' }}>
            <span>Pending: <strong style={{ color: '#D97706' }}>{formatINR(data?.razorpayStats?.pendingAmount || 0)}</strong></span>
            <span>Failed: <strong style={{ color: '#DC2626' }}>{formatINR(data?.razorpayStats?.failedAmount || 0)}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
