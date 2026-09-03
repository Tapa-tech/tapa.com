'use client';

import React from 'react';

interface PaymentSummaryItem {
  count: number;
  amount: number;
}

interface PaymentAnalyticsProps {
  summary: {
    paid: PaymentSummaryItem;
    pending: PaymentSummaryItem;
    failed: PaymentSummaryItem;
    refunded: PaymentSummaryItem;
    razorpay: PaymentSummaryItem;
    cod: PaymentSummaryItem;
  };
  health: {
    successRate: number;
    failureRate: number;
    pendingRate: number;
    refundRate: number;
  };
  loading?: boolean;
}

function formatINR(val: number): string {
  return '₹' + (val || 0).toLocaleString('en-IN');
}

export const PaymentAnalyticsCard: React.FC<PaymentAnalyticsProps> = ({ summary, health, loading }) => {
  if (loading) {
    return (
      <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', marginBottom: '36px' }}>
        <div style={{ height: '20px', width: '200px', background: '#F3F4F6', borderRadius: '4px', marginBottom: '16px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: '90px', background: '#F9FAFB', borderRadius: '12px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', marginBottom: '36px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif', margin: '0 0 4px' }}>
            💳 Payment Analytics &amp; Gateway Health
          </h3>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
            Comprehensive breakdown of transactions, gateway success rates, and payment methods
          </p>
        </div>

        {/* PAYMENT HEALTH BADGES */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', padding: '6px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#047857', letterSpacing: '0.5px' }}>SUCCESS RATE</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#065F46' }}>{health?.successRate || 0}%</div>
          </div>
          <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', padding: '6px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#B45309', letterSpacing: '0.5px' }}>PENDING</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#92400E' }}>{health?.pendingRate || 0}%</div>
          </div>
          <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '6px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#B91C1C', letterSpacing: '0.5px' }}>FAILED</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#991B1B' }}>{health?.failureRate || 0}%</div>
          </div>
          <div style={{ background: '#F3E8FF', border: '1px solid #E9D5FF', borderRadius: '8px', padding: '6px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#6B21A8', letterSpacing: '0.5px' }}>REFUNDED</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#581C87' }}>{health?.refundRate || 0}%</div>
          </div>
        </div>
      </div>

      {/* 4 PAYMENT STATUS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {/* PAID */}
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', letterSpacing: '0.5px', marginBottom: '6px' }}>PAID</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#15803D', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>
            {formatINR(summary?.paid?.amount || 0)}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#166534' }}>
            {summary?.paid?.count || 0} orders
          </div>
        </div>

        {/* PENDING */}
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', letterSpacing: '0.5px', marginBottom: '6px' }}>PENDING</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#B45309', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>
            {formatINR(summary?.pending?.amount || 0)}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#92400E' }}>
            {summary?.pending?.count || 0} orders
          </div>
        </div>

        {/* FAILED */}
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#991B1B', letterSpacing: '0.5px', marginBottom: '6px' }}>FAILED</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#B91C1C', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>
            {formatINR(summary?.failed?.amount || 0)}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#991B1B' }}>
            {summary?.failed?.count || 0} orders
          </div>
        </div>

        {/* REFUNDED */}
        <div style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B21A8', letterSpacing: '0.5px', marginBottom: '6px' }}>REFUNDED</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#7E22CE', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>
            {formatINR(summary?.refunded?.amount || 0)}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B21A8' }}>
            {summary?.refunded?.count || 0} orders
          </div>
        </div>
      </div>

      {/* PAYMENT METHOD COMPARISON ROW */}
      <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* RAZORPAY */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              💳
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>RAZORPAY</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Online Gateway (UPI, Cards, Netbanking)</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1E3A8A', fontFamily: 'Georgia, serif' }}>
              {formatINR(summary?.razorpay?.amount || 0)}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#3B82F6' }}>
              {summary?.razorpay?.count || 0} total orders
            </div>
          </div>
        </div>

        {/* COD */}
        <div style={{ background: '#FDFBF7', border: '1px solid #F3EAD8', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              💵
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#451A03' }}>CASH ON DELIVERY (COD)</div>
              <div style={{ fontSize: '12px', color: '#78350F' }}>Pay upon doorstep receipt</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#78350F', fontFamily: 'Georgia, serif' }}>
              {formatINR(summary?.cod?.amount || 0)}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#D97706' }}>
              {summary?.cod?.count || 0} total orders
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
