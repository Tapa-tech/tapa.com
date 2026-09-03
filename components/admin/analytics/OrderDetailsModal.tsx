'use client';

import React, { useState } from 'react';
import { OrderRecord } from './RecentOrdersSection';

interface OrderDetailsModalProps {
  order: OrderRecord | null;
  onClose: () => void;
  onStatusUpdated?: (updatedOrder: OrderRecord) => void;
}

function formatINR(val: number): string {
  return '₹' + (val || 0).toLocaleString('en-IN');
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose, onStatusUpdated }) => {
  const [updating, setUpdating] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>(order?.orderStatus || 'PLACED');
  const [paymentStatus, setPaymentStatus] = useState<string>(order?.paymentStatus || 'PENDING');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!order) return null;

  const handleSaveStatus = async () => {
    setUpdating(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          orderStatus,
          paymentStatus,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: 'Order & Payment status updated successfully!' });
        if (onStatusUpdated && data.order) {
          onStatusUpdated(data.order);
        }
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to update order status' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Error saving status updates' });
    } finally {
      setUpdating(false);
    }
  };

  const createdDateFormatted = new Date(order.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const updatedDateFormatted = order.updatedAt
    ? new Date(order.updatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : createdDateFormatted;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(17, 24, 39, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '750px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E5E7EB',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid #F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FDF2F5',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.5px' }}>
              ORDER DETAILS &amp; FULFILLMENT MANAGEMENT
            </div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
              Order #{order.orderNumber}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              color: '#6B7280',
            }}
          >
            ✕
          </button>
        </div>

        {/* MODAL BODY */}
        <div style={{ padding: '24px 28px' }}>
          {msg && (
            <div
              style={{
                background: msg.type === 'success' ? '#ECFDF5' : '#FEE2E2',
                color: msg.type === 'success' ? '#065F46' : '#991B1B',
                border: `1px solid ${msg.type === 'success' ? '#A7F3D0' : '#FCA5A5'}`,
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              {msg.text}
            </div>
          )}

          {/* STATUS UPDATE CONTROLS BAR */}
          <div
            style={{
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr auto',
              gap: '16px',
              alignItems: 'end',
            }}
          >
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Fulfillment Order Status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: '#FFFFFF',
                }}
              >
                <option value="PLACED">PLACED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="DISPATCHED">DISPATCHED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLATION_REQUESTED">CANCELLATION_REQUESTED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: '#FFFFFF',
                }}
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="FAILED">FAILED</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleSaveStatus}
              disabled={updating}
              style={{
                background: '#DE1B59',
                color: '#FFFFFF',
                padding: '9px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '12px',
                cursor: updating ? 'not-allowed' : 'pointer',
                border: 'none',
                height: '36px',
              }}
            >
              {updating ? 'Saving...' : 'Update Status'}
            </button>
          </div>

          {/* GRID INFO SECTIONS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            {/* CUSTOMER INFO */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                👤 Customer Information
              </div>
              <div style={{ fontSize: '12px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div><strong>Name:</strong> {order.customerName}</div>
                <div><strong>Mobile:</strong> {order.customerMobile}</div>
                <div><strong>Email:</strong> {order.customerEmail}</div>
              </div>
            </div>

            {/* SHIPPING ADDRESS */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                📍 Shipping &amp; Delivery Address
              </div>
              <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
                <div>{order.streetAddress}</div>
                <div>{order.city}, {order.state} - {order.pincode}</div>
                <div>{order.country}</div>
              </div>
            </div>
          </div>

          {/* ORDER ITEMS TABLE */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📦 Ordered Ritual Kits &amp; Products
            </div>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', textAlign: 'left', fontSize: '11px' }}>
                    <th style={{ padding: '8px 12px' }}>Product</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Unit Price</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((it) => (
                      <tr key={it.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#111827' }}>{it.productName}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>{it.quantity}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#4B5563' }}>{formatINR(it.unitPrice)}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#111827' }}>{formatINR(it.lineTotal)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ padding: '12px', textAlign: 'center', color: '#9CA3AF' }}>No line items recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* FINANCIAL TOTALS FOOTER */}
              <div style={{ background: '#FAF5FF', padding: '12px 16px', borderTop: '1px solid #E9D5FF', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', textAlign: 'right' }}>
                <div>Subtotal: <strong>{formatINR(order.subtotal)}</strong></div>
                <div>Delivery Charge: <strong>{formatINR(order.deliveryCharge)}</strong></div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#6B21A8', fontFamily: 'Georgia, serif' }}>
                  Grand Total: {formatINR(order.grandTotal)}
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT & TIMELINE METADATA */}
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '16px', fontSize: '12px', color: '#92400E' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '6px', color: '#B45309' }}>
              💳 Payment &amp; System Timestamps
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div><strong>Payment Method:</strong> {order.paymentMethod}</div>
              <div><strong>Payment Status:</strong> {order.paymentStatus}</div>
              {order.razorpayOrderId && <div><strong>Razorpay Order ID:</strong> {order.razorpayOrderId}</div>}
              {order.razorpayPaymentId && <div><strong>Razorpay Payment ID:</strong> {order.razorpayPaymentId}</div>}
              <div><strong>Placed At:</strong> {createdDateFormatted}</div>
              <div><strong>Last Updated:</strong> {updatedDateFormatted}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
