'use client';

import React, { useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface FeatureItem {
  id: string;
  title: string;
  category: string;
  status: 'In Planning' | 'In Development' | 'Beta Testing' | 'Released';
  targetRelease: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  requests: number;
}

const INITIAL_FEATURES: FeatureItem[] = [
  {
    id: 'feat-1',
    title: 'AI Panchang Muhurta Finder',
    category: 'Panchang Engine',
    status: 'In Development',
    targetRelease: 'Q4 2026',
    description: 'Personalized auspicious timing calculations based on city location, Lagna, and Tithi for home pujas.',
    priority: 'High',
    requests: 248,
  },
  {
    id: 'feat-2',
    title: 'WhatsApp Samagri Order Bot',
    category: 'Ecommerce',
    status: 'Beta Testing',
    targetRelease: 'Q3 2026',
    description: 'Direct 1-click Samagri kit order placement and delivery tracking via WhatsApp automation.',
    priority: 'High',
    requests: 184,
  },
  {
    id: 'feat-3',
    title: 'Audio Chanting & Shloka Practice Mode',
    category: 'Ritual Engine',
    status: 'In Planning',
    targetRelease: 'Q1 2027',
    description: 'Interactive audio player with syllable-by-syllable Sanskrit pronunciation guide for ritual mantras.',
    priority: 'Medium',
    requests: 112,
  },
  {
    id: 'feat-4',
    title: 'Offline Vrat Calendar PDF Generator',
    category: 'Content & Media',
    status: 'Released',
    targetRelease: 'Q3 2026',
    description: 'Downloadable high-resolution printable PDF calendar for daily Vrat observances.',
    priority: 'High',
    requests: 310,
  },
];

function UpcomingFeaturesContent() {
  const { data: session, status } = useSession();
  const [features, setFeatures] = useState<FeatureItem[]>(INITIAL_FEATURES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Ritual Engine');
  const [newStatus, setNewStatus] = useState<'In Planning' | 'In Development' | 'Beta Testing' | 'Released'>('In Planning');
  const [newTarget, setNewTarget] = useState('Q4 2026');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>Loading Upcoming Features Console...</div>
      </div>
    );
  }

  const userEmail = session?.user?.email || 'admin@tapa.co';
  const userRole = (session?.user as any)?.role?.toUpperCase() || 'SUPER_ADMIN';

  const filteredFeatures = features.filter((f) => {
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || f.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const item: FeatureItem = {
      id: `feat-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      status: newStatus,
      targetRelease: newTarget,
      description: newDesc.trim(),
      priority: newPriority,
      requests: 1,
    };
    setFeatures([item, ...features]);
    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this feature request from roadmap?')) {
      setFeatures(features.filter((f) => f.id !== id));
    }
  };

  const getStatusBadgeStyle = (st: string) => {
    switch (st) {
      case 'In Development':
        return { background: '#EFF6FF', color: '#2563EB' };
      case 'Beta Testing':
        return { background: '#F3E8FF', color: '#7C3AED' };
      case 'Released':
        return { background: '#ECFDF5', color: '#059669' };
      default:
        return { background: '#FEF3C7', color: '#D97706' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '12px' }}>
          DASHBOARD &gt; UPCOMING FEATURES
        </div>

        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: '0 0 6px' }}>
              Upcoming Features &amp; Roadmap
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              Track, prioritize, and announce upcoming Tapa platform features, rituals engine updates, and content releases.
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
            + Add Feature
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search upcoming features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '240px', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '9px 14px', fontSize: '13px' }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', background: '#FFFFFF' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="In Planning">In Planning</option>
            <option value="In Development">In Development</option>
            <option value="Beta Testing">Beta Testing</option>
            <option value="Released">Released</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', background: '#FFFFFF' }}
          >
            <option value="ALL">All Categories</option>
            <option value="Panchang Engine">Panchang Engine</option>
            <option value="Ritual Engine">Ritual Engine</option>
            <option value="Ecommerce">Ecommerce</option>
            <option value="Content & Media">Content &amp; Media</option>
          </select>
        </div>

        {/* Features List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {filteredFeatures.map((item) => {
            const badge = getStatusBadgeStyle(item.status);
            return (
              <div key={item.id} style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', background: '#FDF2F5', padding: '3px 8px', borderRadius: '6px' }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', ...badge }}>
                      {item.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px', color: '#111827' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5, margin: '0 0 16px' }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', color: '#6B7280' }}>
                    <span>Target: <strong>{item.targetRelease}</strong></span>
                    <span>Requests: <strong>{item.requests}</strong></span>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ background: 'none', border: 'none', color: '#EF4444', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Modal */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <form onSubmit={handleAddFeature} style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', maxWidth: '500px', width: '90%', border: '1px solid #EFEAE4' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 20px' }}>Add Upcoming Feature</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Feature Title</label>
                <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. AI Panchang Muhurta Finder" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Category</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }}>
                    <option value="Ritual Engine">Ritual Engine</option>
                    <option value="Panchang Engine">Panchang Engine</option>
                    <option value="Ecommerce">Ecommerce</option>
                    <option value="Content & Media">Content &amp; Media</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Status</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)} style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }}>
                    <option value="In Planning">In Planning</option>
                    <option value="In Development">In Development</option>
                    <option value="Beta Testing">Beta Testing</option>
                    <option value="Released">Released</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Description</label>
                <textarea rows={3} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Summary of the planned functionality..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#F3F4F6', color: '#374151', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Save Feature</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default function UpcomingFeaturesPage() {
  return (
    <SessionProvider>
      <UpcomingFeaturesContent />
    </SessionProvider>
  );
}
