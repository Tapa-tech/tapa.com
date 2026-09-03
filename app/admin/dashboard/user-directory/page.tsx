'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface UserRecord {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  image?: string | null;
  activeSessionId?: string | null;
  emailVerified?: string | null;
  provider?: string;
  ordersCount?: number;
  createdAt: string;
}


function UserDirectoryContent() {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('CUSTOMER');
  const [newPassword, setNewPassword] = useState('');

  // Action feedback & modals
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const rawUserRole = (session?.user as { role?: string })?.role?.toUpperCase() || 'CUSTOMER';
  const currentRole = rawUserRole === 'SUPER_ADMIN' ? 'SUPER_USER' : rawUserRole;
  const isAuthorized = ['SUPER_USER', 'ADMIN', 'SUPER_ADMIN'].includes(currentRole);
  const userEmail = session?.user?.email || (session?.user as any)?.phone || 'admin@tapa.co';
  const isSuperUser = currentRole === 'SUPER_USER' || currentRole === 'SUPER_ADMIN';

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('query', search.trim());
      if (roleFilter !== 'ALL') params.set('role', roleFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    if (status === 'authenticated' && isAuthorized) {
      fetchUsers();
    }
  }, [status, isAuthorized, fetchUsers]);

  const handleRoleChange = async (userId: string, targetRole: string) => {
    if (!userId || !targetRole) return;
    setActionMessage(null);
    setUpdatingUserId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, userId, requestedRole: targetRole, role: targetRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: `Role updated to ${targetRole} successfully!` });
        fetchUsers();
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to update role.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Error updating role.' });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || (!newEmail.trim() && !newPhone.trim())) {
      setActionMessage({ type: 'error', text: 'Name and either Email or Phone are required.' });
      return;
    }

    setActionMessage(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim() || undefined,
          phone: newPhone.trim() || undefined,
          role: newRole,
          password: newPassword.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: 'New user created successfully!' });
        setShowAddModal(false);
        setNewName('');
        setNewEmail('');
        setNewPhone('');
        setNewRole('CUSTOMER');
        setNewPassword('');
        fetchUsers();
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to create user.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Error creating user.' });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!isSuperUser) {
      setActionMessage({ type: 'error', text: 'Forbidden: Only SUPER_USER can delete users.' });
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete user "${userName || userId}"?`)) return;

    setActionMessage(null);
    setDeletingUserId(userId);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: 'User account deleted successfully.' });
        fetchUsers();
      } else {
        setActionMessage({ type: 'error', text: data.error || 'Failed to delete user.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Error deleting user.' });
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
  };

  const filteredUsers = users.filter((u) => {
    const isActive = u.activeSessionId !== 'disabled';
    if (statusFilter === 'ACTIVE' && !isActive) return false;
    if (statusFilter === 'DEACTIVATED' && isActive) return false;
    return true;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen" style={{ background: '#F8F5EE' }}>
        <AdminSidebar userEmail={userEmail} userRole={currentRole} />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-[#DE1B59] font-bold">Loading User Directory...</div>
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
          <p className="text-gray-600">You do not have administrative permissions to view the User Directory.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#F8F5EE' }}>
      <AdminSidebar userEmail={userEmail} userRole={currentRole} />

      <div className="flex-1 p-6 md:p-8 max-w-7xl overflow-x-hidden">
        {/* Header Title & Add User Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
              User Directory &amp; RBAC Management
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Super Admin view for searching, creating, editing, and managing user roles &amp; permissions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#DE1B59] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity shadow-sm self-start md:self-auto"
          >
            + Add New User
          </button>
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

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#F5E6D3] shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1 flex items-center bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2">
            <span className="text-gray-400 mr-2 text-xs">⌕</span>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_USER">SUPER_USER</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="DEACTIVATED">Deactivated</option>
            </select>

            {(search || roleFilter !== 'ALL' || statusFilter !== 'ALL') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3 py-2 text-xs font-bold text-[#DE1B59] hover:bg-pink-50 rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* User List Table */}
        <div className="bg-white rounded-2xl border border-[#F5E6D3] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F0E8D8] flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Showing {filteredUsers.length} Users
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-xs">
              No users found matching your search and filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-[#F0E8D8]">
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Orders</th>
                    <th className="py-3.5 px-4">Joined</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredUsers.map((u) => {
                    const isSelf = u.id === (session?.user as any)?.id;
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-xs flex-shrink-0 uppercase">
                              {u.name ? u.name.charAt(0) : u.email ? u.email.charAt(0) : 'U'}
                            </div>
                            <div>
                              <Link
                                href={`/admin/dashboard/user-directory/${u.id}`}
                                className="font-bold text-gray-900 hover:text-[#DE1B59] transition-colors"
                              >
                                {u.name || 'Unnamed User'}
                              </Link>
                              <div className="text-[11px] text-gray-400">ID: {u.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-800 font-medium">{u.email || '—'}</span>
                            {u.email && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  u.emailVerified || u.provider === 'google' || u.provider === 'phone'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {u.emailVerified || u.provider === 'google' || u.provider === 'phone' ? 'VERIFIED' : 'UNVERIFIED'}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400">{u.phone || 'No phone'}</div>
                        </td>


                        <td className="py-3.5 px-4">
                          <select
                            value={u.role}
                            disabled={updatingUserId === u.id || (!isSuperUser && u.role === 'SUPER_USER')}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="bg-[#F9F6F0] border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-800 outline-none focus:border-[#DE1B59]"
                          >
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="ADMIN">ADMIN</option>
                            {isSuperUser && <option value="SUPER_USER">SUPER_USER</option>}
                          </select>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-gray-700">{u.ordersCount || 0}</td>

                        <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/dashboard/user-directory/${u.id}`}
                              className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg font-bold hover:bg-gray-200 text-[11px]"
                            >
                              Profile
                            </Link>

                            {isSuperUser && !isSelf && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.name || u.email || u.id)}
                                disabled={deletingUserId === u.id}
                                className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg font-bold hover:bg-red-100 text-[11px]"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#F5E6D3]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                Create New User Account
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-gray-400 font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-[#DE1B59]"
                  placeholder="e.g. Priya Sundaram"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-[#DE1B59]"
                    placeholder="priya@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-[#DE1B59]"
                    placeholder="+919876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Role *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-[#DE1B59]"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ADMIN">ADMIN</option>
                    {isSuperUser && <option value="SUPER_USER">SUPER_USER</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Initial Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-[#DE1B59]"
                    placeholder="Set secure password"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#DE1B59] text-white rounded-xl text-xs font-bold hover:opacity-90"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserDirectoryPage() {
  return (
    <SessionProvider>
      <UserDirectoryContent />
    </SessionProvider>
  );
}
