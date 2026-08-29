'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface AdminSidebarProps {
  userEmail?: string;
  userRole?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  userEmail = 'admin@tapa.co',
  userRole = 'SUPER_ADMIN',
}) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '🩼', exact: true },
    { href: '/admin/dashboard/ritual-guides', label: 'Ritual Guides', icon: '📖' },
    { href: '/admin/dashboard/dharmic-concepts', label: 'Dharmic Concepts', icon: '🧭' },
    { href: '/admin/dashboard/panchang', label: 'Panchang & Vrats', icon: '📅' },
    { href: '/admin/products', label: 'Products & Kits', icon: '📦' },
    { href: '/admin/orders', label: 'Orders Management', icon: '🛒' },
    { href: '/admin/tapa-circle', label: 'Tapa Circle', icon: '👥' },
    { href: '/admin/dashboard/upcoming-features', label: 'Upcoming Features', icon: '✨' },
    { href: '/admin/dashboard/announcements', label: 'Announcements', icon: '📢' },
    { href: '/admin/dashboard/homepage-banners', label: 'Homepage Banners', icon: '🖼️' },
    { href: '/admin/dashboard/navigation-menu', label: 'Navigation Menu', icon: '📑' },
    { href: '/admin/dashboard/sources-library', label: 'Sources Library', icon: '📚' },
    { href: '/admin/dashboard/faqs-library', label: 'FAQs Library', icon: '❓' },
    { href: '/admin/dashboard/founder-review', label: 'Founder Review Queue', icon: '🔍' },
    { href: '/admin/dashboard/user-directory', label: 'User Directory', icon: '👤' },
    { href: '/admin/dashboard/security-audit', label: 'Security Audit Logs', icon: '🛡️' },
  ];

  const isActive = (itemHref: string, exact?: boolean) => {
    if (!pathname) return false;
    if (exact) {
      return pathname === itemHref || pathname === '/admin';
    }
    return pathname.startsWith(itemHref) || (itemHref.startsWith('/admin/') && pathname.startsWith('/admin/dashboard/' + itemHref.replace('/admin/', '')));
  };

  return (
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
        minHeight: '100vh',
      }}
    >
      <div>
        {/* Logo Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', marginBottom: '24px' }}>
          <span style={{ fontFamily: "'Tiro Devanagari Hindi', Georgia, serif", fontSize: '26px', fontWeight: 900, color: '#DE1B59' }}>
            तप
          </span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>The Tapa Co.</div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.5px' }}>CMS CONSOLE</div>
          </div>
        </div>

        {/* User Account Banner */}
        <div style={{ paddingLeft: '8px', paddingRight: '8px', marginBottom: '20px' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.8px', marginBottom: '4px' }}>
            LOGGED IN AS
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {userEmail}
          </div>
          <div style={{ marginTop: '4px' }}>
            <span style={{ background: '#FDF2F5', color: '#DE1B59', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', display: 'inline-block' }}>
              {userRole}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  background: active ? '#DE1B59' : 'transparent',
                  color: active ? '#FFFFFF' : '#4B5563',
                  borderRadius: '12px',
                  padding: '9px 12px',
                  fontSize: '12.5px',
                  fontWeight: active ? 700 : 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '14px' }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid #F3F4F6', marginTop: '20px' }}>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          style={{
            width: '100%',
            background: '#FFFFFF',
            color: '#DE1B59',
            border: '1px solid #DE1B59',
            borderRadius: '9999px',
            padding: '9px 14px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '10px',
          }}
        >
          ↳ Sign Out
        </button>
        <div style={{ fontSize: '10px', color: '#9CA3AF', textAlign: 'center' }}>
          Legal Entity: Tale Scale Networks
        </div>
      </div>
    </aside>
  );
};
