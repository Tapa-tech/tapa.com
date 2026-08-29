'use client';

import React from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

function AdminDashboardContent() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ fontSize: '14px', color: '#DE1B59', fontWeight: 600 }}>Loading CMS Console...</div>
      </div>
    );
  }

  const userRole = (session?.user as { role?: string })?.role?.toUpperCase() || 'SUPER_ADMIN';

  if (status === 'unauthenticated' || !['ADMIN', 'SUPER_USER', 'SUPER_ADMIN', 'EDITOR'].includes(userRole)) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "system-ui, -apple-system, sans-serif", padding: '20px' }}>
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
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', fontFamily: "system-ui, -apple-system, sans-serif", display: 'flex' }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      {/* MAIN OVERVIEW CONTAINER */}
      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Top Welcome Banner Card (Exact match to screenshot 4) */}
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
                👑 {userRole}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
              Welcome to the content control center. Here you can compose scripture-based guides, verify facts, and update the daily calendar.
            </p>
          </div>

          <Link
            href="/admin/dashboard/ritual-guides"
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

        {/* STAT CARDS GRID - ROW 1 (4 COLUMNS - Matching Screenshot 4) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
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
                <Link href="/admin/dashboard/ritual-guides" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Create</Link>
                <Link href="/admin/dashboard/ritual-guides" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
              </div>
            </div>
          </div>

          {/* Card 2: Dharmic Concepts */}
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  🧭
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
              <Link href="/admin/dashboard/panchang" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
            </div>
          </div>

          {/* Card 4: Ritual Kits */}
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  📦
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>13</div>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Ritual Kits</div>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                Complete Samagri boxes for pujas &amp; festivals
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
              <span style={{ color: '#9CA3AF' }}>Dynamic inventory catalog</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/admin/products/new" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Create</Link>
                <Link href="/admin/products" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
              </div>
            </div>
          </div>
        </div>

        {/* STAT CARDS GRID - ROW 2 (3 COLUMNS - Matching Screenshot 4) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {/* Card 5: All Products */}
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  📦
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>0</div>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>All Products</div>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                Individual items &amp; Samagri components catalog
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
              <span style={{ color: '#9CA3AF' }}>Product-level management</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/admin/products/new" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Create</Link>
                <Link href="/admin/products" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
              </div>
            </div>
          </div>

          {/* Card 6: Customer Orders */}
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FDF2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  🛒
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>0</div>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Customer Orders</div>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                Manage customer order fulfillment &amp; payment status
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
              <span style={{ color: '#9CA3AF' }}>0 Confirmed · 0 Processing · 0 Shipped</span>
              <Link href="/admin/orders" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
            </div>
          </div>

          {/* Card 7: Tapa Circle Subscribers */}
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  👥
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>1</div>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Tapa Circle Subscribers</div>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                Registered practitioners for weekly broadcasts
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
              <span style={{ color: '#9CA3AF' }}>Authorized consent profiles</span>
              <Link href="/admin/tapa-circle" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
            </div>
          </div>
        </div>

        {/* STAT CARDS GRID - ROW 3 & 4 (NEW ADMIN FEATURES CARDS) */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🛠️</span> Content &amp; System Administration Tools
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {/* Card 8: Upcoming Features */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    ✨
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>4</div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Upcoming Features</div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                  Roadmap &amp; platform feature release tracking
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
                <span style={{ color: '#9CA3AF' }}>4 Items in roadmap</span>
                <Link href="/admin/dashboard/upcoming-features" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
              </div>
            </div>

            {/* Card 9: Announcements */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FDF2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    📢
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>3</div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Announcements</div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                  Global site header tickers &amp; alert popups
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
                <span style={{ color: '#9CA3AF' }}>2 Active broadcasts</span>
                <Link href="/admin/dashboard/announcements" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
              </div>
            </div>

            {/* Card 10: Homepage Banners */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    🖼️
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>3</div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Homepage Banners</div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                  Hero carousel banners &amp; promo highlight cards
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
                <span style={{ color: '#9CA3AF' }}>3 Banners configured</span>
                <Link href="/admin/dashboard/homepage-banners" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
              </div>
            </div>

            {/* Card 11: Navigation Menu */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    📑
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>6</div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Navigation Menu</div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                  Header, footer &amp; mobile menu links hierarchy
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
                <span style={{ color: '#9CA3AF' }}>Published site links</span>
                <Link href="/admin/dashboard/navigation-menu" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
              </div>
            </div>

            {/* Card 12: Sources Library */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    📚
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>4</div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Sources Library</div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                  Scriptural texts, puranas &amp; scholarly citations
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
                <span style={{ color: '#9CA3AF' }}>4 Verified texts</span>
                <Link href="/admin/dashboard/sources-library" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
              </div>
            </div>

            {/* Card 13: FAQs Library */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    ❓
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>3</div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>FAQs Library</div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                  Frequently asked questions &amp; help documentation
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
                <span style={{ color: '#9CA3AF' }}>Platform Q&amp;A</span>
                <Link href="/admin/dashboard/faqs-library" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
              </div>
            </div>

            {/* Card 14: Founder Review Queue */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    🔍
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>3</div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Founder Review Queue</div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                  Draft review &amp; editorial approval queue
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
                <span style={{ color: '#9CA3AF' }}>1 Pending founder signoff</span>
                <Link href="/admin/dashboard/founder-review" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
              </div>
            </div>

            {/* Card 15: User Directory */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    👤
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>2</div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>User Directory</div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                  User accounts, roles &amp; RBAC access
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
                <span style={{ color: '#9CA3AF' }}>2 Users registered</span>
                <Link href="/admin/dashboard/user-directory" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
              </div>
            </div>

            {/* Card 16: Security Audit Logs */}
            <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    🛡️
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif' }}>4</div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>Security Audit Logs</div>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.4 }}>
                  Immutable activity &amp; authentication logs
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '11px' }}>
                <span style={{ color: '#9CA3AF' }}>Immutable audit log</span>
                <Link href="/admin/dashboard/security-audit" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Manage →</Link>
              </div>
            </div>
          </div>
        </div>

        {/* SYSTEM ENVIRONMENT STATUS BAR (Matching Screenshot 4) */}
        <div style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚡</span> System Environment Status
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '18px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '4px' }}>DATABASE STATUS</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10B981', fontSize: '10px' }}>●</span> Neon Postgre (Connected)
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
