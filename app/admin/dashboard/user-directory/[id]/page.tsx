'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items?: OrderItem[];
}

interface ActivityEvent {
  title: string;
  detail: string;
  timestamp: string;
  type: string;
}

interface UserDetail {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  image: string | null;
  activeSessionId: string | null;
  provider: string;
  ordersCount: number;
  orders?: OrderRecord[];
  activityEvents?: ActivityEvent[];
  createdAt: string;
  updatedAt: string;
}

type TabType = 'overview' | 'profile' | 'security' | 'orders' | 'saved' | 'downloads' | 'consent' | 'activity';

function UserDetailContent({ params }: { params: { id: string } }) {
  const userId = params.id;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [newPassword, setNewPassword] = useState('');

  // Action feedback & modals
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const rawUserRole = (session?.user as { role?: string })?.role?.toUpperCase() || 'CUSTOMER';
  const currentRole = rawUserRole === 'SUPER_ADMIN' ? 'SUPER_USER' : rawUserRole;
  const isAuthorized = ['SUPER_USER', 'ADMIN', 'SUPER_ADMIN'].includes(currentRole);
  const userEmail = session?.user?.email || (session?.user as any)?.phone || 'admin@tapa.co';
  const isSuperUser = currentRole === 'SUPER_USER' || currentRole === 'SUPER_ADMIN';

  const fetchUserDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        setName(data.user.name || '');
        setEmail(data.user.email || '');
        setPhone(data.user.phone || '');
        setRole(data.user.role || 'CUSTOMER');
      } else {
        setError(data.error || 'Failed to fetch user details.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error loading user details.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (status === 'authenticated' && isAuthorized) {
      fetchUserDetail();
    }
  }, [status, isAuthorized, fetchUserDetail]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage(null);
    setSaving(true);
    try {
      const payload: any = { name, email, phone, role };
      if (newPassword.trim()) {
        payload.password = newPassword.trim();
      }

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: 'User profile updated successfully!' });
        setNewPassword('');
        fetchUserDetail();
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Error updating profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActiveStatus = async () => {
    if (!user) return;
    setActionMessage(null);
    setSaving(true);
    const newSessionStatus = user.activeSessionId === 'disabled' ? null : 'disabled';
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeSessionId: newSessionStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({
          type: 'success',
          text: `Account ${newSessionStatus === 'disabled' ? 'deactivated' : 'activated'} successfully!`,
        });
        fetchUserDetail();
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to change account status.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Error toggling account status.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUserConfirmed = async () => {
    if (!isSuperUser) {
      setActionMessage({ type: 'error', text: 'Forbidden: Only SUPER_USER can delete user accounts.' });
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/dashboard/user-directory');
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to delete user.' });
        setShowDeleteModal(false);
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Error deleting user.' });
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen" style={{ background: '#F8F5EE' }}>
        <AdminSidebar userEmail={userEmail} userRole={currentRole} />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-[#DE1B59] font-bold">Loading 360° User View...</div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen" style={{ background: '#F8F5EE' }}>
        <AdminSidebar userEmail={userEmail} userRole={currentRole} />
        <div className="flex-1 p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have administrative permissions to view user management.</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen" style={{ background: '#F8F5EE' }}>
        <AdminSidebar userEmail={userEmail} userRole={currentRole} />
        <div className="flex-1 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested user account does not exist.'}</p>
          <Link
            href="/admin/dashboard/user-directory"
            className="px-4 py-2 bg-[#DE1B59] text-white font-bold rounded-lg text-xs"
          >
            ‹ Back to User Directory
          </Link>
        </div>
      </div>
    );
  }

  const isAccountActive = user.activeSessionId !== 'disabled';
  const isSelf = user.id === (session?.user as any)?.id;

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'orders', label: `Orders (${user.ordersCount})` },
    { id: 'saved', label: 'Saved Content' },
    { id: 'downloads', label: 'Downloads' },
    { id: 'consent', label: 'Consent' },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: '#F8F5EE' }}>
      <AdminSidebar userEmail={userEmail} userRole={currentRole} />

      <div className="flex-1 p-6 md:p-8 max-w-6xl overflow-x-hidden">
        {/* Header Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/admin/dashboard/user-directory"
            className="text-xs font-bold text-gray-600 hover:text-[#DE1B59] transition-colors"
          >
            ‹ Back to User Directory
          </Link>
          <span className="text-xs font-semibold text-gray-400">User ID: {user.id}</span>
        </div>

        {/* Action Feedback Toast */}
        {actionMessage && (
          <div
            className={`p-3.5 mb-6 rounded-xl text-xs font-bold flex justify-between items-center ${
              actionMessage.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <span>{actionMessage.text}</span>
            <button type="button" onClick={() => setActionMessage(null)} className="text-sm font-bold ml-4">
              ✕
            </button>
          </div>
        )}

        {/* User Banner Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#F5E6D3] shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white uppercase shadow-inner"
              style={{ background: 'linear-gradient(135deg, #DE1B59, #A07800)' }}
            >
              {user.name ? user.name.charAt(0) : user.email ? user.email.charAt(0) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                  {user.name || 'Unnamed User'}
                </h1>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    user.role === 'SUPER_USER'
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === 'ADMIN'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {user.role}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isAccountActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isAccountActive ? 'ACTIVE' : 'DEACTIVATED'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {user.email || 'No email'} · {user.phone || 'No phone'} · Provider: <b>{user.provider}</b>
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Joined: {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={handleToggleActiveStatus}
              disabled={saving || isSelf}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-opacity ${
                isAccountActive
                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  : 'bg-green-600 text-white hover:bg-green-700'
              } ${isSelf ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAccountActive ? 'Deactivate User' : 'Activate User'}
            </button>

            {isSuperUser && !isSelf && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={deleting}
                className="px-3.5 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
              >
                Delete Account
              </button>
            )}
          </div>
        </div>

        {/* 360° Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-[#F0E8D8] mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#DE1B59] text-[#DE1B59] bg-white rounded-t-xl'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#F5E6D3] shadow-sm">
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">TOTAL ORDERS</div>
                <div className="text-2xl font-bold text-gray-900">{user.ordersCount}</div>
                <p className="text-xs text-gray-400 mt-1">E-commerce transactions</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#F5E6D3] shadow-sm">
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">AUTH PROVIDER</div>
                <div className="text-lg font-bold text-gray-800">{user.provider.toUpperCase()}</div>
                <p className="text-xs text-gray-400 mt-1">Primary sign-in method</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#F5E6D3] shadow-sm">
                <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">ACCOUNT STATUS</div>
                <div className={`text-lg font-bold ${isAccountActive ? 'text-green-700' : 'text-red-700'}`}>
                  {isAccountActive ? 'Active' : 'Deactivated'}
                </div>
                <p className="text-xs text-gray-400 mt-1">Session access permission</p>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-2xl p-6 border border-[#F5E6D3] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                  Recent Orders
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#DE1B59] hover:underline"
                >
                  View All Orders ({user.ordersCount}) ›
                </button>
              </div>

              {!user.orders || user.orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-xs bg-[#FFFDF9] rounded-xl border border-[#F5E6D3]">
                  No orders placed by this user yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAF8F5] text-gray-500 font-bold border-b border-[#F0E8D8]">
                        <th className="py-2.5 px-3">Order #</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Method</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {user.orders.slice(0, 5).map((o) => (
                        <tr key={o.id}>
                          <td className="py-2.5 px-3 font-bold text-gray-900">{o.orderNumber}</td>
                          <td className="py-2.5 px-3 text-gray-500">
                            {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-gray-800">₹{o.grandTotal.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 font-semibold text-gray-600">{o.paymentMethod}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                              {o.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE EDIT */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 border border-[#F5E6D3] shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Edit User Profile Details
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-[#DE1B59]"
                    placeholder="Full Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Role Permission</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={!isSuperUser && role === 'SUPER_USER'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-[#DE1B59]"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ADMIN">ADMIN</option>
                    {isSuperUser && <option value="SUPER_USER">SUPER_USER</option>}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-[#DE1B59]"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-[#DE1B59]"
                    placeholder="Phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Reset Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-[#DE1B59]"
                  placeholder="Enter new password"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#DE1B59] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#F5E6D3] shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Account Security State
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#F9F6F0] rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-500 block">AUTHENTICATION METHOD</span>
                  <span className="font-bold text-gray-900 text-sm">{user.provider.toUpperCase()}</span>
                </div>
                <div className="p-3 bg-[#F9F6F0] rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-500 block">SESSION PERMISSION</span>
                  <span className={`font-bold text-sm ${isAccountActive ? 'text-green-700' : 'text-red-700'}`}>
                    {isAccountActive ? 'ACTIVE SESSION ALLOWED' : 'ACCOUNT DEACTIVATED / DISABLED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs">
              🔒 <b>Security Policy Note:</b> Sensitive user credentials, password hashes, OAuth tokens, and OTP secrets are securely protected and strictly excluded from administrative view.
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl p-6 border border-[#F5E6D3] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                Customer Orders History
              </h3>
              <Link href="/admin/dashboard/orders" className="text-xs font-bold text-[#DE1B59] hover:underline">
                Go to Order Management ›
              </Link>
            </div>

            {!user.orders || user.orders.length === 0 ? (
              <div className="p-10 text-center text-gray-500 text-xs bg-[#FFFDF9] rounded-xl border border-[#F5E6D3]">
                No orders placed by this user yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F5] text-gray-500 font-bold border-b border-[#F0E8D8]">
                      <th className="py-3 px-4">Order Number</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Order Status</th>
                      <th className="py-3 px-4 text-right">Items</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {user.orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-bold text-gray-900">{o.orderNumber}</td>
                        <td className="py-3 px-4 text-gray-500">
                          {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-800">₹{o.grandTotal.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-gray-700">
                          <span className="font-semibold">{o.paymentMethod}</span> ({o.paymentStatus})
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600 font-medium">
                          {o.items ? o.items.length : 0} items
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SAVED CONTENT */}
        {activeTab === 'saved' && (
          <div className="bg-white rounded-2xl p-6 border border-[#F5E6D3] shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Saved &amp; Bookmarked Rituals
            </h3>
            <div className="p-10 text-center text-gray-500 text-xs bg-[#FFFDF9] rounded-xl border border-[#F5E6D3]">
              No saved rituals or bookmarked guides recorded for this account.
            </div>
          </div>
        )}

        {/* TAB 6: DOWNLOADS */}
        {activeTab === 'downloads' && (
          <div className="bg-white rounded-2xl p-6 border border-[#F5E6D3] shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Download History Logs
            </h3>
            <div className="p-10 text-center text-gray-500 text-xs bg-[#FFFDF9] rounded-xl border border-[#F5E6D3]">
              No article PDF or samagri download logs recorded for this account.
            </div>
          </div>
        )}

        {/* TAB 7: CONSENT */}
        {activeTab === 'consent' && (
          <div className="bg-white rounded-2xl p-6 border border-[#F5E6D3] shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Consent Records
            </h3>
            <div className="p-4 bg-[#F9F6F0] rounded-xl border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Terms of Use &amp; Privacy Policy Consent:</span>
                <span className="font-bold text-green-700">ACCEPTED (v1.0)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Consent Date:</span>
                <span className="font-semibold text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-2xl p-6 border border-[#F5E6D3] shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Account Activity Timeline
            </h3>

            {!user.activityEvents || user.activityEvents.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs">No activity logged.</div>
            ) : (
              <div className="space-y-4">
                {user.activityEvents.map((evt, idx) => (
                  <div key={idx} className="flex items-start gap-3 border-l-2 border-[#DE1B59] pl-4 py-1">
                    <div>
                      <div className="text-xs font-bold text-gray-900">{evt.title}</div>
                      <div className="text-xs text-gray-500">{evt.detail}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(evt.timestamp).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete User Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm User Account Deletion</h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Are you sure you want to permanently delete account <b>{user.name || user.email || user.id}</b>?
            </p>
            <div className="bg-red-50 text-red-800 p-3 rounded-xl text-xs mb-6 border border-red-200">
              ⚠️ Warning: Deleting a user removes their credentials and session tokens. Order history records will be decoupled.
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUserConfirmed}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
              >
                {deleting ? 'Deleting...' : 'Permanently Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  return (
    <SessionProvider>
      <UserDetailContent params={params} />
    </SessionProvider>
  );
}
