'use client';

import React, { useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  status: 'Active' | 'Hidden';
  gradient: string;
}

const INITIAL_BANNERS: BannerItem[] = [
  {
    id: 'ban-1',
    title: 'Ashwin Navratri Mahotsav 2026',
    subtitle: 'Nine nights of divine worship. Access authentic scriptural guides & daily vidhi.',
    ctaText: 'Explore Navratri Guides →',
    ctaLink: '/ritual-guides/navratri',
    order: 1,
    status: 'Active',
    gradient: 'linear-gradient(135deg, #DE1B59 0%, #8B1138 100%)',
  },
  {
    id: 'ban-2',
    title: 'Authentic Puja Samagri Kits',
    subtitle: 'Handpicked, scripturally verified samagri items delivered directly to your doorstep.',
    ctaText: 'Order Puja Kits →',
    ctaLink: '/ritual-kits',
    order: 2,
    status: 'Active',
    gradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
  },
  {
    id: 'ban-3',
    title: 'Panchang & Daily Vrat Calendar',
    subtitle: 'Accurate Tithi, Nakshtra, and Muhurta timings verified for Delhi-NCR and major cities.',
    ctaText: 'View Today Panchang →',
    ctaLink: '/panchang',
    order: 3,
    status: 'Hidden',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
  },
];

function HomepageBannersContent() {
  const { data: session, status } = useSession();
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_BANNERS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [order, setOrder] = useState(1);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>Loading Banners Console...</div>
      </div>
    );
  }

  const userEmail = session?.user?.email || 'admin@tapa.co';
  const userRole = (session?.user as any)?.role?.toUpperCase() || 'SUPER_ADMIN';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newBanner: BannerItem = {
      id: `ban-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      ctaText: ctaText.trim() || 'Learn More →',
      ctaLink: ctaLink.trim() || '/',
      order: Number(order) || 1,
      status: 'Active',
      gradient: 'linear-gradient(135deg, #DE1B59 0%, #8B1138 100%)',
    };
    setBanners([...banners, newBanner]);
    setTitle('');
    setSubtitle('');
    setCtaText('');
    setCtaLink('');
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setBanners(
      banners.map((b) => (b.id === id ? { ...b, status: b.status === 'Active' ? 'Hidden' : 'Active' } : b))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this homepage banner?')) {
      setBanners(banners.filter((b) => b.id !== id));
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '12px' }}>
          DASHBOARD &gt; HOMEPAGE BANNERS
        </div>

        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: '0 0 6px' }}>
              Homepage Banners Management
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              Control hero carousel banners, promotional cards, and seasonal campaign highlights on tapa.co homepage.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              background: '#DE1B59',
              color: '#FFFFFF',
              border: 'none',
              padding: '11px 20px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(222, 27, 89, 0.2)',
            }}
          >
            + Add Banner
          </button>
        </div>

        {/* Banners Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {banners.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #EFEAE4',
                borderRadius: '16px',
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: '240px 1fr 140px',
                gap: '24px',
                alignItems: 'center',
              }}
            >
              {/* Visual Banner Card Preview */}
              <div
                style={{
                  background: item.gradient,
                  borderRadius: '12px',
                  padding: '20px',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '120px',
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>Position #{item.order}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1.2 }}>{item.title}</div>
                  <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.9 }}>{item.ctaText}</div>
                </div>
              </div>

              {/* Text Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{item.title}</h3>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: item.status === 'Active' ? '#ECFDF5' : '#F3F4F6',
                      color: item.status === 'Active' ? '#059669' : '#6B7280',
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 8px', lineHeight: 1.4 }}>{item.subtitle}</p>
                <div style={{ fontSize: '12px', color: '#DE1B59', fontWeight: 600 }}>
                  CTA Link: {item.ctaLink} ({item.ctaText})
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                <button
                  onClick={() => toggleStatus(item.id)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  {item.status === 'Active' ? 'Hide Banner' : 'Show Banner'}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{ background: 'none', border: 'none', color: '#EF4444', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <form onSubmit={handleCreate} style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', maxWidth: '500px', width: '90%', border: '1px solid #EFEAE4' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 20px' }}>Add Homepage Banner</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Banner Heading</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Diwali Shubh Muhurta 2026" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Subtitle</label>
                <textarea rows={2} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Short banner description..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>CTA Button Text</label>
                  <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="e.g. Explore Guide →" style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>CTA Target Link</label>
                  <input type="text" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} placeholder="e.g. /ritual-guides/diwali" style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Display Order Position</label>
                <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#F3F4F6', color: '#374151', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Save Banner</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default function HomepageBannersPage() {
  return (
    <SessionProvider>
      <HomepageBannersContent />
    </SessionProvider>
  );
}
