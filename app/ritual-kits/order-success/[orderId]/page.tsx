'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderItemData {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

interface OrderData {
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
  createdAt: string;
  items: OrderItemData[];
}

interface PageProps {
  params: {
    orderId: string;
  };
}

export default function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = params;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Order not found.');
        }

        setOrder(data.order);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unable to load order details.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="w-full bg-[var(--bg,#F2EDE4)] min-h-[70vh] flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[var(--pink,#FD066D)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-[var(--dark,#1C1712)]">Loading your order confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="w-full bg-[var(--bg,#F2EDE4)] min-h-[70vh] py-12 px-4">
        <div className="max-w-md mx-auto bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-8 text-center shadow-sm">
          <div className="text-4xl mb-3">⚠️</div>
          <h1 className="text-xl font-bold text-[var(--dark,#1C1712)] mb-2">Order Not Found</h1>
          <p className="text-xs text-[var(--sub-text,#8A7A68)] mb-6">{error || 'We could not locate the order details requested.'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/ritual-kits/all"
              className="bg-[var(--pink,#FD066D)] text-white font-bold text-xs px-5 py-2.5 rounded-xl"
            >
              Continue Shopping ›
            </Link>
            <Link
              href="/ritual-kits"
              className="border border-[var(--border,#E8E0D0)] text-[var(--dark,#1C1712)] font-bold text-xs px-5 py-2.5 rounded-xl"
            >
              Back to Ritual Kits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="w-full bg-[var(--bg,#F2EDE4)] min-h-[75vh] py-8">
      {/* BREADCRUMB */}
      <div className="bcrumb bg-[var(--card,#FFFFFF)] border-b border-[var(--border,#E8E0D0)] px-4 md:px-10 py-2.5 mb-6">
        <div className="max-w-[1280px] mx-auto text-xs text-[var(--sub-text,#8A7A68)]">
          <Link href="/" className="hover:text-[var(--pink,#FD066D)]">Home</Link> ›{' '}
          <Link href="/ritual-kits" className="hover:text-[var(--pink,#FD066D)]">Ritual Kits</Link> ›{' '}
          <b className="text-[var(--body-text,#2C2010)]">Order Confirmation</b>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 md:px-10 space-y-6">
        {/* SUCCESS BANNER */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
              ✓
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-emerald-950">
                Order Placed Successfully!
              </h1>
              <p className="text-xs text-emerald-800 mt-0.5">
                Thank you, <span className="font-semibold">{order.customerName}</span>. Your samagri kit order has been placed.
              </p>
            </div>
          </div>
          <div className="text-center md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-emerald-200">
            <span className="inline-block bg-emerald-100 text-emerald-900 font-bold text-xs px-3 py-1 rounded-full uppercase">
              {order.orderStatus}
            </span>
            <div className="text-[11px] text-emerald-800 mt-1 font-mono">{order.orderNumber}</div>
          </div>
        </div>

        {/* ORDER DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT COLUMN: ITEMS & SUMMARY */}
          <div className="md:col-span-2 space-y-6">
            {/* ITEMS CARD */}
            <div className="bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-5 md:p-6 shadow-sm">
              <h2 className="text-base font-bold text-[var(--dark,#1C1712)] border-b border-[var(--border-light,#F0E8D8)] pb-3 mb-4">
                Ordered Ritual Kits ({order.items.length})
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 border-b border-[var(--border-light,#F0E8D8)] pb-3 last:border-b-0 last:pb-0">
                    <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-base font-bold" style={{ background: 'linear-gradient(150deg, #7A4A12, #2A1408)' }}>
                      🛕
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-[var(--dark)] truncate">{item.productName}</div>
                      <div className="text-xs text-[var(--sub-text)] mt-0.5">
                        Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-right font-bold text-sm text-[var(--dark)]">
                      ₹{item.lineTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PAYMENT & TIMELINE CARD */}
            <div className="bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-5 md:p-6 shadow-sm space-y-3 text-xs">
              <h2 className="text-base font-bold text-[var(--dark,#1C1712)] border-b border-[var(--border-light,#F0E8D8)] pb-3 mb-3">
                Payment &amp; Processing Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[var(--sub-text)] block">Payment Method</span>
                  <span className="font-bold text-[var(--dark)] text-sm">Cash on Delivery (COD)</span>
                </div>
                <div>
                  <span className="text-[var(--sub-text)] block">Payment Status</span>
                  <span className="font-bold text-[var(--gold,#A07800)] text-sm">Pending (Pay upon delivery)</span>
                </div>
              </div>
              <p className="text-[11px] text-[var(--sub-text)] pt-2 border-t border-[var(--border-light,#F0E8D8)]">
                Our delivery partner will collect ₹{order.grandTotal.toLocaleString('en-IN')} via Cash or UPI at the time of delivery.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: ADDRESS & TOTALS */}
          <div className="space-y-6">
            {/* DELIVERY ADDRESS */}
            <div className="bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-5 md:p-6 shadow-sm text-xs space-y-2">
              <h2 className="text-base font-bold text-[var(--dark,#1C1712)] border-b border-[var(--border-light,#F0E8D8)] pb-3 mb-3">
                Delivery Address
              </h2>
              <p className="font-bold text-[var(--dark)] text-sm">{order.customerName}</p>
              <p className="text-[var(--body-text)]">{order.streetAddress}</p>
              <p className="text-[var(--body-text)]">{order.city}, {order.state} - {order.pincode}</p>
              <p className="text-[var(--body-text)]">{order.country}</p>
              <div className="pt-2 text-[var(--sub-text)] border-t border-[var(--border-light,#F0E8D8)] mt-2">
                <div>📞 Mobile: <span className="font-semibold text-[var(--dark)]">{order.customerMobile}</span></div>
                <div>✉️ Email: <span className="font-semibold text-[var(--dark)]">{order.customerEmail}</span></div>
              </div>
            </div>

            {/* SUMMARY TOTALS */}
            <div className="bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-5 md:p-6 shadow-sm space-y-3 text-xs">
              <h2 className="text-base font-bold text-[var(--dark,#1C1712)] border-b border-[var(--border-light,#F0E8D8)] pb-3">
                Order Summary
              </h2>

              <div className="flex justify-between text-[var(--body-text)]">
                <span className="text-[var(--sub-text)]">Order Date</span>
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex justify-between text-[var(--body-text)]">
                <span className="text-[var(--sub-text)]">Subtotal</span>
                <span className="font-semibold">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[var(--body-text)]">
                <span className="text-[var(--sub-text)]">Delivery / Shipping</span>
                <span className="font-semibold text-emerald-700">FREE</span>
              </div>

              <div className="border-t border-[var(--border,#E8E0D0)] pt-3 flex justify-between text-base font-bold text-[var(--dark)]">
                <span>Grand Total</span>
                <span className="text-[var(--pink,#FD066D)]">₹{order.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              <Link
                href="/ritual-kits/all"
                className="w-full bg-[var(--pink,#FD066D)] hover:opacity-90 text-white font-bold py-3.5 px-4 rounded-xl transition-all text-center block text-sm shadow-sm"
              >
                Continue Shopping ›
              </Link>
              <Link
                href="/ritual-kits"
                className="w-full border border-[var(--border,#E8E0D0)] bg-[var(--card,#FFFFFF)] hover:bg-[var(--bg,#F2EDE4)] text-[var(--dark,#1C1712)] font-bold py-3 px-4 rounded-xl transition-all text-center block text-xs"
              >
                Back to Ritual Kits
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
