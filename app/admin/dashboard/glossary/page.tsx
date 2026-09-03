'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface GlossaryTermItem {
  id: string;
  term: string;
  slug: string;
  language: string;
  devanagari?: string | null;
  pronunciation?: string | null;
  category: string;
  definition: string;
  appearsInJson?: string | null;
  relatedConceptTitle?: string | null;
  relatedConceptSlug?: string | null;
  status: 'PUBLISHED' | 'DRAFT';
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

function GlossaryAdminContent() {
  const { data: session, status: authStatus } = useSession();
  const [terms, setTerms] = useState<GlossaryTermItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [languageFilter, setLanguageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GlossaryTermItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    term: '',
    slug: '',
    language: 'SANSKRIT',
    devanagari: '',
    pronunciation: '',
    category: 'PRACTICE',
    definition: '',
    appearsIn: '',
    relatedConceptTitle: '',
    relatedConceptSlug: '',
    status: 'PUBLISHED',
    displayOrder: 0,
  });

  const fetchTerms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/glossary');
      const data = await res.json();
      if (res.ok && data.success) {
        setTerms(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch glossary terms:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchTerms();
    }
  }, [authStatus, fetchTerms]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      term: '',
      slug: '',
      language: 'SANSKRIT',
      devanagari: '',
      pronunciation: '',
      category: 'PRACTICE',
      definition: '',
      appearsIn: '',
      relatedConceptTitle: '',
      relatedConceptSlug: '',
      status: 'PUBLISHED',
      displayOrder: terms.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GlossaryTermItem) => {
    setEditingItem(item);
    let appearsInStr = '';
    if (item.appearsInJson) {
      try {
        const parsed = JSON.parse(item.appearsInJson);
        if (Array.isArray(parsed)) appearsInStr = parsed.join(', ');
      } catch (e) {
        appearsInStr = item.appearsInJson;
      }
    }

    setFormData({
      term: item.term,
      slug: item.slug,
      language: item.language || 'SANSKRIT',
      devanagari: item.devanagari || '',
      pronunciation: item.pronunciation || '',
      category: item.category || 'PRACTICE',
      definition: item.definition || '',
      appearsIn: appearsInStr,
      relatedConceptTitle: item.relatedConceptTitle || '',
      relatedConceptSlug: item.relatedConceptSlug || '',
      status: item.status || 'PUBLISHED',
      displayOrder: item.displayOrder || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.term.trim() || !formData.definition.trim()) {
      setActionMsg({ type: 'error', text: 'Term and definition are required.' });
      return;
    }

    setIsSaving(true);
    setActionMsg(null);

    const appearsInArray = formData.appearsIn
      ? formData.appearsIn.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      appearsIn: appearsInArray,
    };

    try {
      const url = editingItem ? `/api/admin/glossary/${editingItem.id}` : '/api/admin/glossary';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionMsg({
          type: 'success',
          text: editingItem ? 'Glossary term updated successfully!' : 'Glossary term created successfully!',
        });
        setIsModalOpen(false);
        fetchTerms();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'Failed to save glossary term' });
      }
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err?.message || 'Error saving term' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this glossary term?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/glossary/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMsg({ type: 'success', text: 'Glossary term deleted successfully.' });
        fetchTerms();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'Failed to delete term.' });
      }
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err?.message || 'Delete error' });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTerms = terms.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      item.term.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q) ||
      (item.devanagari && item.devanagari.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === 'ALL' || item.category.toUpperCase() === categoryFilter.toUpperCase();
    const matchesLanguage = languageFilter === 'ALL' || item.language.toUpperCase() === languageFilter.toUpperCase();
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesLanguage && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB' }}>
      <AdminSidebar userEmail={session?.user?.email || 'admin@tapa.co'} userRole="SUPER_ADMIN" />

      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: 0 }}>
              Glossary Terms Management
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
              Manage scripture definitions, pronunciations, categories, and references for `/glossary`.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddModal}
            style={{
              background: '#DE1B59',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(222, 27, 89, 0.25)',
            }}
          >
            + Add New Term
          </button>
        </div>

        {/* Action Alert Banner */}
        {actionMsg && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '13px',
              fontWeight: 600,
              background: actionMsg.type === 'success' ? '#DEF7EC' : '#FDE8E8',
              color: actionMsg.type === 'success' ? '#03543F' : '#9B1C1C',
              border: actionMsg.type === 'success' ? '1px solid #BCF0DA' : '1px solid #F8B4B4',
            }}
          >
            {actionMsg.text}
          </div>
        )}

        {/* Controls Bar */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search by term, Devanagari, or definition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 13px', fontSize: '13px' }}
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 13px', fontSize: '13px', background: '#FFFFFF' }}
            >
              <option value="ALL">All Categories</option>
              <option value="MATERIAL">Material</option>
              <option value="PRACTICE">Practice</option>
              <option value="TIME">Time</option>
              <option value="TEXT">Text</option>
            </select>
          </div>

          <div>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 13px', fontSize: '13px', background: '#FFFFFF' }}
            >
              <option value="ALL">All Languages</option>
              <option value="SANSKRIT">Sanskrit</option>
              <option value="HINDI">Hindi</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 13px', fontSize: '13px', background: '#FFFFFF' }}
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>
            Total: {filteredTerms.length} terms
          </div>
        </div>

        {/* Terms Table */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#DE1B59', fontWeight: 700, fontSize: '14px' }}>
              Loading glossary terms...
            </div>
          ) : filteredTerms.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
              No glossary terms found matching your query.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#374151', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px 18px' }}>TERM &amp; DEVANAGARI</th>
                  <th style={{ padding: '12px 18px' }}>CATEGORY</th>
                  <th style={{ padding: '12px 18px' }}>LANGUAGE</th>
                  <th style={{ padding: '12px 18px' }}>DEFINITION</th>
                  <th style={{ padding: '12px 18px' }}>STATUS</th>
                  <th style={{ padding: '12px 18px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredTerms.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>{item.term}</div>
                      <div style={{ color: '#DE1B59', fontSize: '12px', marginTop: '2px', fontWeight: 600 }}>
                        {item.devanagari || '—'} {item.pronunciation ? `(${item.pronunciation})` : ''}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          background: item.category === 'MATERIAL' ? '#E0F2FE' : item.category === 'TIME' ? '#FEF3C7' : '#F3E8FF',
                          color: item.category === 'MATERIAL' ? '#0369A1' : item.category === 'TIME' ? '#92400E' : '#6B21A8',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '11px',
                        }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#4B5563', fontWeight: 600 }}>
                      {item.language}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#4B5563', maxWidth: '320px', lineHeight: 1.5 }}>
                      <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.definition}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          background: item.status === 'PUBLISHED' ? '#DEF7EC' : '#F3F4F6',
                          color: item.status === 'PUBLISHED' ? '#03543F' : '#6B7280',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '11px',
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          style={{ background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '5px 11px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === item.id}
                          onClick={() => handleDelete(item.id)}
                          style={{ background: '#FDF2F2', border: '1px solid #F8B4B4', borderRadius: '6px', padding: '5px 11px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#9B1C1C' }}
                        >
                          {deletingId === item.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E5E7EB', paddingBottom: '14px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>
                {editingItem ? 'Edit Glossary Term' : 'Add New Glossary Term'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9CA3AF' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Term Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.term}
                    onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                    placeholder="e.g. Sankalp"
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. sankalp"
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Devanagari / Hindi Text
                  </label>
                  <input
                    type="text"
                    value={formData.devanagari}
                    onChange={(e) => setFormData({ ...formData, devanagari: e.target.value })}
                    placeholder="e.g. सङ्कल्प"
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Pronunciation / Phonetic
                  </label>
                  <input
                    type="text"
                    value={formData.pronunciation}
                    onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                    placeholder="e.g. san-kalp"
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Category / Type *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', background: '#FFFFFF' }}
                  >
                    <option value="PRACTICE">Practice</option>
                    <option value="MATERIAL">Material</option>
                    <option value="TIME">Time &amp; Calendar</option>
                    <option value="TEXT">Text &amp; Terms</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Language *
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', background: '#FFFFFF' }}
                  >
                    <option value="SANSKRIT">Sanskrit</option>
                    <option value="HINDI">Hindi</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Definition *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.definition}
                  onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                  placeholder="Clear 40-word definition of the term..."
                  style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Appears In (Comma-separated guide names)
                </label>
                <input
                  type="text"
                  value={formData.appearsIn}
                  onChange={(e) => setFormData({ ...formData, appearsIn: e.target.value })}
                  placeholder="e.g. Sharad Navratri, Sawan Somwar Vrat"
                  style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Related Concept Title
                  </label>
                  <input
                    type="text"
                    value={formData.relatedConceptTitle}
                    onChange={(e) => setFormData({ ...formData, relatedConceptTitle: e.target.value })}
                    placeholder="e.g. Sankalp — saying it out loud"
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Related Concept Slug
                  </label>
                  <input
                    type="text"
                    value={formData.relatedConceptSlug}
                    onChange={(e) => setFormData({ ...formData, relatedConceptSlug: e.target.value })}
                    placeholder="e.g. sankalp"
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', background: '#FFFFFF' }}
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '9px 12px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', color: '#374151' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '10px 22px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isSaving ? 'Saving...' : editingItem ? 'Update Term' : 'Create Term'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GlossaryAdminPage() {
  return (
    <SessionProvider>
      <GlossaryAdminContent />
    </SessionProvider>
  );
}
