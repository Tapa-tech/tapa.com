'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface UserRecord {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
}

function UserDirectoryContent() {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Action States
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const rawUserRole = (session?.user as { role?: string })?.role?.toUpperCase() || 'CUSTOMER';
  const currentRole = rawUserRole === 'SUPER_ADMIN' ? 'SUPER_USER' : rawUserRole;
  const currentUserId = (session?.user as any)?.id || '';
  const isAuthorized = ['SUPER_USER', 'ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(currentRole);
  const userEmail = session?.user?.email || (session?.user as any)?.phone || 'admin@tapa.co';
  const isSuperUser = currentRole === 'SUPER_USER' || currentRole === 'SUPER_ADMIN';

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && isAuthorized) {
      fetchUsers();
    }
  }, [status, isAuthorized, fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionMessage(null);
    setUpdatingUserId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({ type: 'success', text: `Role updated to ${newRole} successfully!` });
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

  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase();
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.phone && u.phone.toLowerCase().includes(query));
    const normalizedRole = u.role.toUpperCase() === 'SUPER_ADMIN' ? 'SUPER_USER' : u.role.toUpperCase() === 'USER' ? 'CUSTOMER' : u.role.toUpperCase();
    const matchesRole = roleFilter === 'ALL' || normalizedRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalCount = users.length;
  const adminCount = users.filter((u) => ['ADMIN', 'SUPER_USER', 'SUPER_ADMIN'].includes(u.role.toUpperCase())).length;
  const customerCount = users.filter((u) => ['CUSTOMER', 'USER'].includes(u.role.toUpperCase())).length;

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <div style={{ fontSize: '14px', color: '#DE1B59', fontWeight: 600 }}>Loading User Directory...</div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !isAuthorized) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", padding: '20px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #FCA5A5', borderRadius: '20px', padding: '36px', maxWidth: '440px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', letterSpacing: '1px', marginBottom: '8px' }}>
            ACCESS DENIED (403 FORBIDDEN)
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: '22px', fontWeight: 700, margin: '0 0 8px' }}>
            CMS Authorization Required
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 24px', lineHeight: 1.5 }}>
            Only users with <strong>ADMIN</strong> or <strong>SUPER_USER</strong> roles can access the User Management Directory. Your current role is <strong>{currentRole}</strong>.
          </p>
          <Link
            href="/admin/login"
            style={{ display: 'inline-block', background: '#DE1B59', color: '#FFFFFF', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}
          >
            Return to Console Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", display: 'flex' }}>
      <AdminSidebar userEmail={userEmail} userRole={currentRole} />

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, 'Tiro Devanagari Hindi', serif", fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>
              User Directory &amp; RBAC Management
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
              View and manage registered accounts, roles, and administrative permissions ({currentRole} Console).
            </p>
          </div>
        </div>

        {actionMessage && (
          <div style={{ background: actionMessage.type === 'success' ? '#ECFDF5' : '#FEE2E2', border: `1px solid ${actionMessage.type === 'success' ? '#A7F3D0' : '#FCA5A5'}`, color: actionMessage.type === 'success' ? '#065F46' : '#991B1B', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, marginBottom: '24px' }}>
            {actionMessage.text}
          </div>
        )}

        {/* METRICS STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TOTAL REGISTERED USERS</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginTop: '4px' }}>{totalCount}</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CUSTOMER ACCOUNTS</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#3B82F6', marginTop: '4px' }}>{customerCount}</div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ADMINS &amp; SUPER_USERS</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#DE1B59', marginTop: '4px' }}>{adminCount}</div>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827', padding: '9px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#374151', padding: '9px 14px', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_USER">SUPER_USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="CUSTOMER">CUSTOMER</option>
            </select>
          </div>
        </div>

        {/* USERS LIST TABLE */}
        {loading ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
            Loading User Directory...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>No Users Found</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>No registered users match your search criteria.</p>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEAE4', color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>USER</th>
                  <th style={{ padding: '14px 20px' }}>CONTACT</th>
                  <th style={{ padding: '14px 20px' }}>ROLE MANAGEMENT</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const targetRole = user.role.toUpperCase() === 'SUPER_ADMIN' ? 'SUPER_USER' : user.role.toUpperCase() === 'USER' ? 'CUSTOMER' : user.role.toUpperCase();
                  const isSelf = user.id === currentUserId;

                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>
                          {user.name || 'Anonymous User'} {isSelf && <span style={{ fontSize: '10px', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>(You)</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace' }}>ID: {user.id}</div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#4B5563' }}>
                        <div>{user.email || 'No email provided'}</div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{user.phone || 'No phone provided'}</div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <select
                            disabled={isSelf || updatingUserId === user.id}
                            value={targetRole}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            style={{ background: '#F9FAFB', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, outline: 'none', opacity: isSelf ? 0.6 : 1, cursor: isSelf ? 'not-allowed' : 'pointer' }}
                          >
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="ADMIN">ADMIN</option>
                            {/* Only SUPER_USER can select/assign SUPER_USER role */}
                            {isSuperUser && <option value="SUPER_USER">SUPER_USER</option>}
                          </select>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        {isSuperUser && !isSelf ? (
                          <button
                            type="button"
                            disabled={deletingUserId === user.id}
                            onClick={() => handleDeleteUser(user.id, user.name || user.email || user.id)}
                            style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', opacity: deletingUserId === user.id ? 0.5 : 1 }}
                          >
                            {deletingUserId === user.id ? 'Deleting...' : 'Delete User'}
                          </button>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                            {isSelf ? 'Self (Protected)' : 'Read / Edit Only'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
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
