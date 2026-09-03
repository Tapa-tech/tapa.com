'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { OrderRecord } from './RecentOrdersSection';

interface FullOrdersSectionProps {
  onSelectOrder: (order: OrderRecord) => void;
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

export const FullOrdersSection: React.FC<FullOrdersSectionProps> = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('ALL');
  const [paymentStatus, setPaymentStatus] = useState('ALL');
  const [orderStatus, setOrderStatus] = useState('ALL');
  const [range, setRange] = useState('all');

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [paginationInfo, setPaginationInfo] = useState({
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search: debouncedSearch,
        paymentMethod,
        paymentStatus,
        orderStatus,
        range,
      });

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
        if (data.pagination) {
          setPaginationInfo(data.pagination);
        }
      }
    } catch (err) {
      console.error('Error fetching full orders list:', err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, paymentMethod, paymentStatus, orderStatus, range]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle Export CSV
  const handleExportCSV = () => {
    const params = new URLSearchParams({
      search: debouncedSearch,
      paymentMethod,
      paymentStatus,
      orderStatus,
      range,
    });
    window.open(`/api/admin/orders/export?${params.toString()}`, '_blank');
  };

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', marginBottom: '36px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      {/* SECTION HEADER */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif', margin: '0 0 4px' }}>
            📜 Complete Customer Orders Register
          </h3>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
            Server-paginated table with live search, filters, fulfillment actions, and CSV export
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          style={{
            background: '#047857',
            color: '#FFFFFF',
            border: 'none',
            padding: '9px 16px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(4, 120, 87, 0.2)',
          }}
        >
          📥 Export CSV Report
        </button>
      </div>

      {/* FILTERS & SEARCH CONTROL BAR */}
      <div
        style={{
          background: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* SEARCH INPUT */}
        <div style={{ flex: '1 1 240px', minWidth: '220px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', display: 'block', marginBottom: '4px' }}>
            Search Orders
          </label>
          <input
            type="text"
            placeholder="Search Order #, Name, Email, Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '12px',
              outline: 'none',
              background: '#FFFFFF',
            }}
          />
        </div>

        {/* PAYMENT METHOD FILTER */}
        <div style={{ flex: '0 1 150px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', display: 'block', marginBottom: '4px' }}>
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setPage(1);
            }}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '12px',
              fontWeight: 600,
              background: '#FFFFFF',
            }}
          >
            <option value="ALL">All Methods</option>
            <option value="RAZORPAY">Razorpay</option>
            <option value="COD">COD</option>
          </select>
        </div>

        {/* PAYMENT STATUS FILTER */}
        <div style={{ flex: '0 1 150px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', display: 'block', marginBottom: '4px' }}>
            Payment Status
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value);
              setPage(1);
            }}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '12px',
              fontWeight: 600,
              background: '#FFFFFF',
            }}
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>

        {/* ORDER STATUS FILTER */}
        <div style={{ flex: '0 1 180px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', display: 'block', marginBottom: '4px' }}>
            Order Status
          </label>
          <select
            value={orderStatus}
            onChange={(e) => {
              setOrderStatus(e.target.value);
              setPage(1);
            }}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '12px',
              fontWeight: 600,
              background: '#FFFFFF',
            }}
          >
            <option value="ALL">All Order Statuses</option>
            <option value="PLACED">PLACED</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="DISPATCHED">DISPATCHED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLATION_REQUESTED">CANCELLATION REQUESTS</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        {/* PAGE SIZE SELECTOR */}
        <div style={{ flex: '0 1 100px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', display: 'block', marginBottom: '4px' }}>
            Per Page
          </label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '12px',
              fontWeight: 600,
              background: '#FFFFFF',
            }}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* TABLE / CARD VIEW */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#DE1B59', fontWeight: 600, fontSize: '13px' }}>
          Loading Orders Data...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px', background: '#FAFAFA', borderRadius: '12px' }}>
          No orders found matching your search and filter parameters.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F3F4F6', color: '#6B7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '10px 12px' }}>Order #</th>
                <th style={{ padding: '10px 12px' }}>Customer Name</th>
                <th style={{ padding: '10px 12px' }}>Contact</th>
                <th style={{ padding: '10px 12px' }}>Date</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Items</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Grand Total</th>
                <th style={{ padding: '10px 12px' }}>Method</th>
                <th style={{ padding: '10px 12px' }}>Payment Status</th>
                <th style={{ padding: '10px 12px' }}>Order Status</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const payStyle = PAYMENT_BADGES[o.paymentStatus] || { bg: '#F3F4F6', text: '#374151' };
                const ordStyle = ORDER_BADGES[o.orderStatus] || { bg: '#F3F4F6', text: '#374151' };
                const itemsCount = Array.isArray(o.items) ? o.items.reduce((acc, it) => acc + (it.quantity || 1), 0) : 0;
                const dateFormatted = new Date(o.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <tr
                    key={o.id}
                    style={{ borderBottom: '1px solid #F9FAFB', transition: 'background 0.15s ease' }}
                  >
                    <td style={{ padding: '12px', fontWeight: 700, color: '#DE1B59' }}>{o.orderNumber}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#111827' }}>{o.customerName}</td>
                    <td style={{ padding: '12px', color: '#4B5563', fontSize: '11px' }}>
                      <div>{o.customerMobile}</div>
                      <div style={{ color: '#9CA3AF' }}>{o.customerEmail}</div>
                    </td>
                    <td style={{ padding: '12px', color: '#6B7280', fontSize: '11px' }}>{dateFormatted}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700 }}>{itemsCount}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>
                      {formatINR(o.grandTotal)}
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#374151', fontSize: '11px' }}>
                      {o.paymentMethod}
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
                      <button
                        type="button"
                        onClick={() => onSelectOrder(o)}
                        style={{
                          background: '#F3F4F6',
                          color: '#111827',
                          border: '1px solid #E5E7EB',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        Details →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION CONTROLS FOOTER */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F3F4F6', fontSize: '12px', color: '#6B7280' }}>
        <div>
          Showing page <strong style={{ color: '#111827' }}>{page}</strong> of <strong style={{ color: '#111827' }}>{paginationInfo.totalPages}</strong> ({paginationInfo.totalCount} total orders)
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            disabled={!paginationInfo.hasPreviousPage}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              background: paginationInfo.hasPreviousPage ? '#FFFFFF' : '#F3F4F6',
              color: paginationInfo.hasPreviousPage ? '#374151' : '#9CA3AF',
              fontWeight: 600,
              cursor: paginationInfo.hasPreviousPage ? 'pointer' : 'not-allowed',
            }}
          >
            ← Previous
          </button>

          <button
            type="button"
            disabled={!paginationInfo.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              background: paginationInfo.hasNextPage ? '#FFFFFF' : '#F3F4F6',
              color: paginationInfo.hasNextPage ? '#374151' : '#9CA3AF',
              fontWeight: 600,
              cursor: paginationInfo.hasNextPage ? 'pointer' : 'not-allowed',
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};
