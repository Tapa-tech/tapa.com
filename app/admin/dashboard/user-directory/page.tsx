'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

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

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const userRole = (session?.user as { role?: string })?.role?.toUpperCase() || 'USER';
  const isAuthorized = ['ADMIN', 'EDITOR'].includes(userRole);
  const userEmail = session?.user?.email || (session?.user as any)?.phone || 'admin@tapa.co';

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

  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase();
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.phone && u.phone.toLowerCase().includes(query));
    const matchesRole = roleFilter === 'ALL' || u.role.toUpperCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role.toUpperCase() === 'ADMIN' || u.role.toUpperCase() === 'SUPER_ADMIN').length;
  const customerCount = users.filter((u) => u.role.toUpperCase() === 'USER').length;

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
            Only users with <strong>EDITOR</strong> or <strong>ADMIN</strong> roles can access the User Directory. Your current role is <strong>{userRole}</strong>.
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
      {/* LEFT SIDEBAR */}
      <aside
        style={{
          width: '240px',
          background: '#FFFFFF',
          borderRight: '1px solid #EAEAEA',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div>
          {/* Logo Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', marginBottom: '28px' }}>
            <span style={{ fontFamily: "'Tiro Devanagari Hindi', Georgia, serif", fontSize: '26px', fontWeight: 900, color: '#DE1B59' }}>
              तप
            </span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>The Tapa Co.</div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.5px' }}>CMS CONSOLE</div>
            </div>
          </div>

          {/* User Account Banner */}
          <div style={{ paddingLeft: '8px', paddingRight: '8px', marginBottom: '24px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.8px', marginBottom: '4px' }}>
              LOGGED IN AS
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userEmail}
            </div>
            <div style={{ marginTop: '4px' }}>
              <span style={{ background: '#FDF2F5', color: '#DE1B59', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', display: 'inline-block' }}>
                SUPER_ADMIN
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Link
              href="/admin/dashboard"
              style={{
                color: '#4B5563',
                borderRadius: '12px',
                padding: '11px 14px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>🩼</span> Dashboard
            </Link>

            <Link
              href="/admin/dashboard/ritual-guides"
              style={{
                color: '#4B5563',
                borderRadius: '12px',
                padding: '11px 14px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>📖</span> Ritual Guides
            </Link>

            <Link
              href="/admin/dashboard/dharmic-concepts"
              style={{
                color: '#4B5563',
                borderRadius: '12px',
                padding: '11px 14px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>🧭</span> Dharmic Concepts
            </Link>

            <Link
              href="/admin/dashboard/beginner-guides"
              style={{
                color: '#4B5563',
                borderRadius: '12px',
                padding: '11px 14px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>🌱</span> Beginner Guides
            </Link>

            <Link
              href="/admin/dashboard/panchang"
              style={{
                color: '#4B5563',
                borderRadius: '12px',
                padding: '11px 14px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>📅</span> Panchang &amp; Vrats
            </Link>

            <Link
              href="/admin/dashboard/user-directory"
              style={{
                background: '#DE1B59',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '11px 14px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span>👥</span> User Directory
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={{ paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            style={{
              width: '100%',
              background: '#FFFFFF',
              color: '#DE1B59',
              border: '1px solid #DE1B59',
              borderRadius: '9999px',
              padding: '10px 16px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '12px',
            }}
          >
            ↳ Sign Out
          </button>
          <div style={{ fontSize: '10px', color: '#9CA3AF', textAlign: 'center' }}>
            Legal Entity: Tale Scale Networks
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, 'Tiro Devanagari Hindi', serif", fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>
              User Directory
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
              View and manage registered accounts, roles, and administrative permissions.
            </p>
          </div>
        </div>

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
            <div style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ADMINS &amp; EDITORS</div>
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
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="ADMIN">ADMIN</option>
              <option value="EDITOR">EDITOR</option>
              <option value="USER">USER</option>
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
                  <th style={{ padding: '14px 20px' }}>ROLE</th>
                  <th style={{ padding: '14px 20px' }}>JOIN DATE</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>
                        {user.name || 'Anonymous User'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace' }}>ID: {user.id}</div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#4B5563' }}>
                      <div>{user.email || 'No email provided'}</div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{user.phone || 'No phone provided'}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {user.role.toUpperCase() === 'SUPER_ADMIN' ? (
                        <span style={{ background: '#FDF2F5', color: '#DE1B59', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px' }}>
                          🛡️ SUPER_ADMIN
                        </span>
                      ) : user.role.toUpperCase() === 'ADMIN' ? (
                        <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px' }}>
                          ⚡ ADMIN
                        </span>
                      ) : (
                        <span style={{ background: '#F3F4F6', color: '#4B5563', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px' }}>
                          👤 USER
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#6B7280', fontSize: '12px' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
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
