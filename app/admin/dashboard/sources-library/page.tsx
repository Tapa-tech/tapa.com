'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface SourceItem {
  id: string;
  title: string;
  sanskritTitle?: string | null;
  category: string;
  citationsCount: number;
  isVerified: boolean;
  notes?: string | null;
}

function SourcesLibraryContent() {
  const { data: session, status } = useSession();
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [sanskritTitle, setSanskritTitle] = useState('');
  const [category, setCategory] = useState<string>('Purana');
  const [notes, setNotes] = useState('');

  const fetchSources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sources');
      const data = await res.json();
      if (res.ok && data.success) {
        setSources(data.sources || []);
      }
    } catch (err) {
      console.error('Failed to fetch sources:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSources();
    }
  }, [status, fetchSources]);

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>Loading Sources Library...</div>
      </div>
    );
  }

  const userEmail = session?.user?.email || 'admin@tapa.co';
  const userRole = (session?.user as any)?.role?.toUpperCase() || 'SUPER_ADMIN';

  const filteredSources = sources.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.sanskritTitle && s.sanskritTitle.includes(search)) ||
      (s.notes && s.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          sanskritTitle: sanskritTitle.trim() || null,
          category,
          notes: notes.trim() || null,
          isVerified: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSources([data.source, ...sources]);
        setTitle('');
        setSanskritTitle('');
        setNotes('');
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to create source:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this source from library?')) return;

    try {
      const res = await fetch(`/api/admin/sources?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSources(sources.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete source:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '12px' }}>
          DASHBOARD &gt; SOURCES LIBRARY
        </div>

        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: '0 0 6px' }}>
              Scriptural Sources &amp; Citations Library
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              Catalog sacred texts, Puranas, Samhitas, and scholarly references used across Tapa guides and concepts.
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
            + Add Source
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Search by text title, Sanskrit name, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '10px', padding: '9px 14px', fontSize: '13px' }}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', background: '#FFFFFF' }}
          >
            <option value="ALL">All Categories</option>
            <option value="Purana">Purana</option>
            <option value="Veda">Veda</option>
            <option value="Smriti">Smriti Digest</option>
            <option value="Upanishad">Upanishad</option>
            <option value="Agama">Agama &amp; Tantra</option>
          </select>
        </div>

        {/* Sources Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {filteredSources.map((item) => (
            <div key={item.id} style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', background: '#FDF2F5', padding: '3px 8px', borderRadius: '6px' }}>
                    {item.category}
                  </span>
                  {item.isVerified && (
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '3px 8px', borderRadius: '6px' }}>
                      ✓ Verified Source
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>
                  {item.title}
                </h3>
                {item.sanskritTitle && (
                  <div style={{ fontFamily: "'Tiro Devanagari Hindi', serif", fontSize: '14px', color: '#DE1B59', marginBottom: '12px' }}>
                    {item.sanskritTitle}
                  </div>
                )}
                <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5, margin: '0 0 16px' }}>
                  {item.notes}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: '#6B7280' }}>Referenced in <strong>{item.citationsCount}</strong> guides &amp; concepts</span>
                <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#EF4444', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}>
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
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 20px' }}>Add Scriptural Source</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Source Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Markandeya Purana" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Sanskrit Title (Devanagari)</label>
                <input type="text" value={sanskritTitle} onChange={(e) => setSanskritTitle(e.target.value)} placeholder="e.g. मार्कण्डेयपुराणम्" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }}>
                  <option value="Purana">Purana</option>
                  <option value="Veda">Veda</option>
                  <option value="Smriti">Smriti Digest</option>
                  <option value="Upanishad">Upanishad</option>
                  <option value="Agama">Agama &amp; Tantra</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Notes / Context</label>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Usage details and scriptural background..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#F3F4F6', color: '#374151', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                  {submitting ? 'Saving...' : 'Save Source'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SourcesLibraryPage() {
  return (
    <SessionProvider>
      <SourcesLibraryContent />
    </SessionProvider>
  );
}
