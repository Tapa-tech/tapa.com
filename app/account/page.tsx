'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productId?: string;
  productName?: string;
  name?: string;
  unitPrice?: number;
  price?: number;
  quantity: number;
  lineTotal?: number;
}

interface Order {
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
  items: OrderItem[];
}

function AccountDashboardContent() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'profile'>('overview');


  const [profile, setProfile] = useState<{ name: string; email: string; phone: string; role: string } | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);


  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/customer/profile');
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setProfile(data.user);
        setNameInput(data.user.name || '');
      }
    } catch (e) {
      console.error('Error fetching profile:', e);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/customer/orders');
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      Promise.all([fetchProfile(), fetchOrders()]);
    }
  }, [status, fetchProfile, fetchOrders]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileLoading(true);
    try {
      const res = await fetch('/api/customer/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfileMessage('Profile updated successfully!');
        setEditingProfile(false);
        fetchProfile();
      } else {
        setProfileMessage(data.error || 'Failed to update profile.');
      }
    } catch (err: unknown) {
      setProfileMessage(err instanceof Error ? err.message : 'Error updating profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to request cancellation for this order?')) return;
    setCancellingOrderId(orderId);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/customer/orders/${orderId}/cancel`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage('Order cancellation request submitted successfully.');
        fetchOrders();
        if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderNumber === orderId)) {
          setSelectedOrder({ ...selectedOrder, orderStatus: 'CANCELLATION_REQUESTED' });
        }
      } else {
        setActionMessage(data.error || 'Failed to cancel order.');
      }
    } catch (err: unknown) {
      setActionMessage(err instanceof Error ? err.message : 'Error cancelling order.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="wrap stage max-w-[1280px] mx-auto px-4 md:px-10 w-full py-16 text-center text-sm font-semibold text-[var(--sub-text)]">
        Loading Customer Dashboard...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="wrap stage max-w-[1280px] mx-auto px-4 md:px-10 w-full py-16 text-center">
        <div className="max-w-md mx-auto bg-white border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <div className="text-xs font-bold text-[var(--pink)] uppercase tracking-wider mb-2">AUTH REQUIRED</div>
          <h2 className="font-serif text-2xl font-bold mb-3 text-[var(--text)]">Customer Login Required</h2>
          <p className="text-xs text-[var(--sub-text)] mb-6">
            Please log in to your account to view your profile, track orders, or submit order cancellation requests.
          </p>
          <Link href="/admin/login?mode=credentials" className="inline-block px-6 py-3 bg-[var(--pink)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity">
            Log In / Sign Up →
          </Link>
        </div>
      </div>
    );
  }

  const customerDisplayName = profile?.name || session?.user?.name || session?.user?.email || 'Valued Devotee';
  const customerEmail = profile?.email || session?.user?.email || 'N/A';

  return (
    <div className="wrap stage max-w-[1280px] mx-auto px-4 md:px-10 w-full py-10">
      <div className="sec-ey">CUSTOMER PORTAL</div>
      <h1 className="sec-t text-3xl font-bold mb-2">Pranām, {customerDisplayName}</h1>
      <p className="sec-s text-xs text-[var(--sub-text)] mb-8">
        Manage your account details, track live Ritual Kit orders, and update personal preferences.
      </p>


      <div className="flex border-b border-[var(--border)] mb-8 gap-6 overflow-x-auto">
        <button
          type="button"
          className={`pb-3 text-xs font-bold cursor-pointer border-b-2 whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'border-[var(--pink)] text-[var(--pink)]' : 'border-transparent text-[var(--sub-text)] hover:text-[var(--text)]'
            }`}
          onClick={() => { setActiveTab('overview'); setSelectedOrder(null); }}
        >
          📊 Dashboard Overview
        </button>
        <button
          type="button"
          className={`pb-3 text-xs font-bold cursor-pointer border-b-2 whitespace-nowrap transition-colors ${activeTab === 'orders' ? 'border-[var(--pink)] text-[var(--pink)]' : 'border-transparent text-[var(--sub-text)] hover:text-[var(--text)]'
            }`}
          onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
        >
          📦 My Orders ({orders.length})
        </button>
        <button
          type="button"
          className={`pb-3 text-xs font-bold cursor-pointer border-b-2 whitespace-nowrap transition-colors ${activeTab === 'profile' ? 'border-[var(--pink)] text-[var(--pink)]' : 'border-transparent text-[var(--sub-text)] hover:text-[var(--text)]'
            }`}
          onClick={() => setActiveTab('profile')}
        >
          👤 My Profile
        </button>
        <button
          type="button"
          className="ml-auto pb-3 text-xs font-bold text-[var(--sub-text)] hover:text-[var(--pink)] cursor-pointer whitespace-nowrap"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          ↳ Sign Out
        </button>
      </div>

      {actionMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
          {actionMessage}
        </div>
      )}


      {activeTab === 'overview' && (
        <div className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <div className="text-[10px] font-bold text-[var(--sub-text)] uppercase tracking-wider mb-1">TOTAL ORDERS</div>
              <div className="text-3xl font-serif font-bold text-[var(--text)]">{orders.length}</div>
              <div className="text-xs text-[var(--sub-text)] mt-2">Active & past Ritual Kit orders</div>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className="mt-4 text-xs font-bold text-[var(--pink)] hover:underline block cursor-pointer"
              >
                View Order History →
              </button>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <div className="text-[10px] font-bold text-[var(--sub-text)] uppercase tracking-wider mb-1">ACCOUNT STATUS</div>
              <div className="text-3xl font-serif font-bold text-emerald-600">Active</div>
              <div className="text-xs text-[var(--sub-text)] mt-2">Authenticated Devotee Account</div>
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="mt-4 text-xs font-bold text-[var(--pink)] hover:underline block cursor-pointer"
              >
                View Profile Details →
              </button>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <div className="text-[10px] font-bold text-[var(--sub-text)] uppercase tracking-wider mb-1">TAPA CIRCLE</div>
              <div className="text-3xl font-serif font-bold text-[var(--pink)]">Member</div>
              <div className="text-xs text-[var(--sub-text)] mt-2">Exclusive access to Vedic Ritual Guides</div>
              <Link href="/ritual-kits/all" className="mt-4 text-xs font-bold text-[var(--pink)] hover:underline block">
                Explore Ritual Kits →
              </Link>
            </div>
          </div>


          <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
              <h3 className="font-serif text-lg font-bold text-[var(--text)]">Recent Orders</h3>
              {orders.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[var(--pink)] hover:underline cursor-pointer"
                >
                  View All ({orders.length}) →
                </button>
              )}
            </div>

            {ordersLoading ? (
              <div className="py-6 text-center text-xs font-bold text-[var(--sub-text)]">Loading recent orders...</div>
            ) : orders.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-[var(--sub-text)] mb-4">No recent orders found on your account.</p>
                <Link href="/ritual-kits/all" className="inline-block px-5 py-2 bg-[var(--pink)] text-white text-xs font-bold rounded-xl hover:opacity-90">
                  Browse Ritual Kits →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="font-bold text-[var(--text)]">{order.orderNumber}</div>
                      <div className="text-[11px] text-[var(--sub-text)]">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div>
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${order.orderStatus === 'CANCELLED' || order.orderStatus === 'CANCELLATION_REQUESTED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                        }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="font-bold text-[var(--text)]">₹{(order.grandTotal ?? 0).toLocaleString('en-IN')}</div>
                    <button
                      type="button"
                      onClick={() => { setSelectedOrder(order); setActiveTab('orders'); }}
                      className="px-3 py-1 bg-[var(--bg)] border border-[var(--border)] font-bold rounded-lg hover:border-[var(--pink)] cursor-pointer"
                    >
                      Details ›
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}


      {activeTab === 'orders' && (
        <div>
          {selectedOrder ? (
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <button
                type="button"
                className="mb-4 text-xs font-bold text-[var(--pink)] hover:underline cursor-pointer"
                onClick={() => setSelectedOrder(null)}
              >
                ← Back to Order History
              </button>

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-bold text-[var(--sub-text)] uppercase tracking-wider block">ORDER NUMBER</span>
                  <span className="text-lg font-bold text-[var(--text)]">{selectedOrder.orderNumber}</span>
                  <span className="text-xs text-[var(--sub-text)] block mt-0.5">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full ${selectedOrder.orderStatus === 'CANCELLED' || selectedOrder.orderStatus === 'CANCELLATION_REQUESTED'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                    }`}>
                    STATUS: {selectedOrder.orderStatus}
                  </span>
                </div>
              </div>


              <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider mb-3">Order Items</h3>
              <div className="divide-y divide-[var(--border)] mb-6 border border-[var(--border)] rounded-xl overflow-hidden">
                {selectedOrder.items?.map((item) => {
                  const itemName = item.name || item.productName || 'Ritual Kit';
                  const unitPrice = item.unitPrice ?? item.price ?? 0;
                  const lineTotal = item.lineTotal ?? (unitPrice * item.quantity);
                  return (
                    <div key={item.id || item.productId} className="flex items-center justify-between p-4 bg-white text-xs">
                      <div>
                        <div className="font-bold text-[var(--text)]">{itemName}</div>
                        <div className="text-[11px] text-[var(--sub-text)]">Qty: {item.quantity} × ₹{unitPrice.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="font-bold text-[var(--text)]">₹{lineTotal.toLocaleString('en-IN')}</div>
                    </div>
                  );
                })}
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--bg)] p-4 rounded-xl text-xs mb-6 border border-[var(--border)]">
                <div>
                  <div className="font-bold text-[var(--text)] mb-1">Delivery Address</div>
                  <div className="text-[var(--sub-text)]">{selectedOrder.customerName}</div>
                  <div className="text-[var(--sub-text)]">{selectedOrder.streetAddress}, {selectedOrder.city}</div>
                  <div className="text-[var(--sub-text)]">{selectedOrder.state} - {selectedOrder.pincode}</div>
                  <div className="text-[var(--sub-text)] mt-1">Mobile: {selectedOrder.customerMobile}</div>
                </div>
                <div className="space-y-1 text-right md:text-right">
                  <div className="flex justify-between"><span>Subtotal:</span><span>₹{(selectedOrder.subtotal ?? 0).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Delivery:</span><span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge || 0}`}</span></div>
                  <div className="flex justify-between font-bold text-sm text-[var(--text)] pt-2 border-t border-[var(--border)]">
                    <span>Grand Total:</span><span>₹{(selectedOrder.grandTotal ?? 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-[11px] text-[var(--sub-text)] pt-1">Payment Method: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</div>
                </div>
              </div>


              {['PLACED', 'CONFIRMED', 'PENDING'].includes(selectedOrder.orderStatus) && (
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={cancellingOrderId === selectedOrder.id || cancellingOrderId === selectedOrder.orderNumber}
                    onClick={() => handleCancelOrder(selectedOrder.id || selectedOrder.orderNumber)}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {cancellingOrderId === selectedOrder.id ? 'Submitting Cancellation...' : 'Request Order Cancellation'}
                  </button>
                </div>
              )}
            </div>
          ) : ordersLoading ? (
            <div className="py-12 text-center text-xs font-bold text-[var(--sub-text)]">
              Loading orders history...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-[var(--border)] rounded-2xl p-10 text-center">
              <h3 className="font-serif text-lg font-bold text-[var(--text)] mb-2">No Orders Found</h3>
              <p className="text-xs text-[var(--sub-text)] mb-6">You have not placed any Ritual Kit orders yet.</p>
              <Link href="/ritual-kits/all" className="inline-block px-6 py-2.5 bg-[var(--pink)] text-white text-xs font-bold rounded-xl hover:opacity-90">
                Browse Ritual Kits →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-[var(--text)]">{order.orderNumber}</div>
                    <div className="text-[11px] text-[var(--sub-text)]">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {order.items?.length || 1} item(s)
                    </div>
                  </div>
                  <div>
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${order.orderStatus === 'CANCELLED' || order.orderStatus === 'CANCELLATION_REQUESTED'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                      }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-[var(--text)]">
                    ₹{(order.grandTotal ?? 0).toLocaleString('en-IN')}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] text-xs font-bold rounded-lg hover:border-[var(--pink)] transition-colors cursor-pointer"
                    >
                      View Details ›
                    </button>
                    {['PLACED', 'CONFIRMED', 'PENDING'].includes(order.orderStatus) && (
                      <button
                        type="button"
                        disabled={cancellingOrderId === order.id || cancellingOrderId === order.orderNumber}
                        onClick={() => handleCancelOrder(order.id || order.orderNumber)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-[var(--text)] mb-4">Personal Details</h3>

          {profileMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
              {profileMessage}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[var(--text)] mb-1">Full Name</label>
              <input
                type="text"
                value={nameInput}
                disabled={!editingProfile}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full p-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl outline-none disabled:opacity-75"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--text)] mb-1">Email Address</label>
              <input
                type="email"
                value={customerEmail}
                disabled
                className="w-full p-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl outline-none opacity-60 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-bold text-[var(--text)] mb-1">Account Role</label>
              <input
                type="text"
                value={profile?.role || (session?.user as Record<string, unknown>)?.role as string || 'CUSTOMER'}
                disabled
                className="w-full p-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl outline-none opacity-60 cursor-not-allowed font-bold"
              />
            </div>

            <div className="pt-2 flex gap-3">
              {editingProfile ? (
                <>
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="px-5 py-2 bg-[var(--pink)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                  >
                    {profileLoading ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditingProfile(false); setNameInput(profile?.name || ''); }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingProfile(true)}
                  className="px-5 py-2 bg-[var(--pink)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function CustomerDashboardPage() {
  return (
    <SessionProvider>
      <AccountDashboardContent />
    </SessionProvider>
  );
}
