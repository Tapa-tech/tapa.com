'use client';

import React from 'react';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

function AdminDashboardContent() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <div style={{ fontSize: '14px', color: '#DE1B59', fontWeight: 600 }}>Loading CMS Console...</div>
      </div>
    );
  }

  const userRole = (session?.user as { role?: string })?.role?.toUpperCase() || 'USER';

  // Role Access Guard: Only ADMIN role allowed for main dashboard overview
  if (status === 'unauthenticated' || !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", padding: '20px' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #FCA5A5', borderRadius: '20px', padding: '36px', maxWidth: '440px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', letterSpacing: '1px', marginBottom: '8px' }}>
            ACCESS DENIED (403 FORBIDDEN)
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: '22px', fontWeight: 700, margin: '0 0 8px' }}>
            Admin Console Required
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 24px', lineHeight: 1.5 }}>
            You must be authenticated with an <strong>ADMIN</strong> role to access the CMS Console. Your current role is <strong>{userRole}</strong>.
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

  const userEmail = session?.user?.email || (session?.user as any)?.phone || 'admin@tapa.co';
  const userName = session?.user?.name || 'Admin';

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

      {/* MAIN OVERVIEW CONTAINER */}
      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Top Welcome Banner Card */}
        <div
          style={{
            background: '#FFF8F0',
            border: '1px solid #F5E6D3',
            borderRadius: '16px',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <h1 style={{ fontFamily: "Georgia, 'Tiro Devanagari Hindi', serif", fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>
                Pranām, {userName}
              </h1>
              <span style={{ background: '#FDF2F5', color: '#DE1B59', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                👑 SUPER_ADMIN
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
              Welcome to the content control center. Here you can compose scripture-based guides, verify facts, and update the daily calendar.
            </p>
          </div>

          <Link
            href="/admin/dashboard/dharmic-concepts"
            style={{
              background: '#DE1B59',
              color: '#FFFFFF',
              padding: '11px 20px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(222, 27, 89, 0.2)',
            }}
          >
            + New Ritual Guide
          </Link>
        </div>

        {/* STAT CARDS GRID (3 COLUMNS) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '36px' }}>
          {/* Card 1: Ritual Guides */}
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FDF2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  📖
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>1</div>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Ritual Guides</div>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                Instructional guides with steps, mantras &amp; samagri
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
              <span style={{ color: '#9CA3AF' }}>1 Published · 0 Drafts</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/admin/dashboard/dharmic-concepts" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Create</Link>
                <Link href="/admin/dashboard/dharmic-concepts" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
              </div>
            </div>
          </div>

          {/* Card 2: Dharmic Concepts */}
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  🌱
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>1</div>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Dharmic Concepts</div>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                Informative content and philosophical explanations
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
              <span style={{ color: '#9CA3AF' }}>Paragraph-led formats</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/admin/dashboard/dharmic-concepts" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Create</Link>
                <Link href="/admin/dashboard/dharmic-concepts" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
              </div>
            </div>
          </div>

          {/* Card 3: Panchang Entries */}
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  📅
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>365</div>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Panchang Entries</div>

              <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                Astronomical metrics &amp; vrat details per date
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
              <span style={{ color: '#9CA3AF' }}>Synced location: Delhi-NCR</span>
              <span style={{ color: '#DE1B59', fontWeight: 700 }}>Manage →</span>
            </div>
          </div>
        </div>

        {/* SYSTEM ENVIRONMENT STATUS BAR */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚡</span> System Environment Status
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '18px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '4px' }}>DATABASE STATUS</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10B981', fontSize: '10px' }}>●</span> SQLite / Dev DB (Connected)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '4px' }}>FILE STORAGE</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10B981', fontSize: '10px' }}>●</span> Local Uploads Mode (Active)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '4px' }}>EDITOR TYPE</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#3B82F6', fontSize: '10px' }}>●</span> Tiptap JSON Structure
              </div>
            </div>

            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '4px' }}>AUTHENTICATION CHECK</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#8B5CF6', fontSize: '10px' }}>●</span> Role-Based JWT cookies
              </div>
            </div>
          </div>
        </div>

        {/* SUPER ADMIN COMMAND CENTER */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🛡️</span> Super Admin Command Center
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {/* Card 1: User Directory */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>👥 User Directory Overview</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Total Users</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>2</div>
                </div>
                <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Customers</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>1</div>

                <div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Admins</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#10B981' }}>0</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Super Admins</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#DE1B59' }}>1</div>
                </div>
              </div>
              <div style={{ color: '#DE1B59', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Manage Users Directory →</div>
            </div>

            {/* Card 2: Security & FAQ */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>📜 System Security &amp; FAQ</div>
              <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                Access immutable audit logs tracking role modifications, account deactivations, and manage other platform settings.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', fontWeight: 600 }}>
                <div style={{ background: '#F9FAFB', border: '1px solid #F3F4F6', padding: '8px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>📋 View Security Audit Logs</span>
                  <span>→</span>
                </div>
                <div style={{ background: '#F9FAFB', border: '1px solid #F3F4F6', padding: '8px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>💬 FAQ Content Editor</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Card 3: Banner Announcement */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>📢 Banner Announcement</div>
              <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 12px', lineHeight: 1.4 }}>
                Publish a new site-wide announcement banner message.
              </p>
              <input
                type="text"
                placeholder="Enter banner message..."
                style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', marginBottom: '12px', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                style={{ width: '100%', background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '9px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
              >
                Update Announcement Banner
              </button>
            </div>
          </div>
        </div>

        {/* RECENT SIGNUPS TABLE CARD */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Recent Signups (Super Admin Audit)</h3>
            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Delhi-NCR Location</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6', color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '10px 12px' }}>NAME</th>
                <th style={{ padding: '10px 12px' }}>CONTACT</th>
                <th style={{ padding: '10px 12px' }}>ROLE</th>
                <th style={{ padding: '10px 12px' }}>JOINED DATE</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F9FAFB' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>Super Admin</td>
                <td style={{ padding: '12px', color: '#6B7280' }}>admin@tapa.co</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ background: '#FDF2F5', color: '#DE1B59', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>SUPER_ADMIN</span>
                </td>
                <td style={{ padding: '12px', color: '#6B7280' }}>25/8/2026</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', fontWeight: 700 }}>Test Subscriber Name</td>

                <td style={{ padding: '12px', color: '#6B7280' }}>test.subscriber@tapa.co<br /><span style={{ fontSize: '10px', color: '#9CA3AF' }}>9876543210</span></td>
                <td style={{ padding: '12px' }}>
                  <span style={{ background: '#F3F4F6', color: '#374151', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>CUSTOMER</span>
                </td>
                <td style={{ padding: '12px', color: '#6B7280' }}>25/8/2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <SessionProvider>
      <AdminDashboardContent />
    </SessionProvider>
  );
}
