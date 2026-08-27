'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

interface PanchangEntryItem {
  id: string;
  date: string;
  dateObj: string;
  year: number;
  tithiName: string;
  tithiDetail: string;
  paksha: string;
  pakshaDetail: string;
  nakshatra: string;
  isAuspicious: boolean;
  sunrise: string;
  sunset: string;
  location: string;
  source: string;
  lastSynced: string | null;
  status: string;
}

function PanchangCmsContent() {
  const { data: session, status } = useSession();

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'daily' | 'csv' | 'vrat'>('daily');

  // Data & Filters
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [entries, setEntries] = useState<PanchangEntryItem[]>([]);
  const [totalEntriesCount, setTotalEntriesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [pakshaFilter, setPakshaFilter] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: '1/1/2026',
    tithiName: 'Trayodashi',
    tithiDetail: '13th day',
    paksha: 'Shukla',
    pakshaDetail: 'Waxing moon',
    nakshatra: 'Rohini',
    isAuspicious: true,
    sunrise: '6:53',
    sunset: '15:49',
    location: 'New Delhi, India',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const userRole = (session?.user as { role?: string })?.role?.toUpperCase() || 'USER';
  const isAuthorized = ['ADMIN', 'EDITOR', 'SUPER_ADMIN'].includes(userRole);
  const userEmail = session?.user?.email || (session?.user as any)?.phone || 'admin@tapa.co';

  // Fetch Panchang entries for selected year
  const fetchPanchangData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        year: selectedYear.toString(),
        limit: '366',
      });
      if (search) params.set('search', search);
      if (pakshaFilter !== 'ALL') params.set('paksha', pakshaFilter);

      const res = await fetch(`/api/admin/panchang?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setEntries(data.data || []);
        setTotalEntriesCount(data.total || (data.data || []).length);
      }
    } catch (err) {
      console.error('Failed to fetch Panchang entries:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, search, pakshaFilter]);

  useEffect(() => {
    if (status === 'authenticated' && isAuthorized) {
      fetchPanchangData();
    }
  }, [status, isAuthorized, fetchPanchangData]);

  // Trigger 45-Day Sync
  const handleTrigger45DaySync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/panchang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync-45-days', days: 45 }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(`✓ 45-Day Panchang Sync Completed (${data.syncedCount} entries updated).`);
        fetchPanchangData();
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setSyncing(false);
    }
  };

  // Trigger Full Year 365 Days Sync
  const handleTriggerFullYearSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/panchang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync-year', year: selectedYear }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(`✓ Generated & Synced ${data.syncedCount} daily Panchang entries for Year ${selectedYear}!`);
        fetchPanchangData();
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.error('Full year sync error:', err);
    } finally {
      setSyncing(false);
    }
  };

  // Refresh single record
  const handleRefreshRecord = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/panchang/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('✓ Entry recalculated and refreshed.');
        fetchPanchangData();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Refresh error:', err);
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      date: `1/1/${selectedYear}`,
      tithiName: 'Trayodashi',
      tithiDetail: '13th day',
      paksha: 'Shukla',
      pakshaDetail: 'Waxing moon',
      nakshatra: 'Rohini',
      isAuspicious: true,
      sunrise: '6:53',
      sunset: '15:49',
      location: 'New Delhi, India',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (entry: PanchangEntryItem) => {
    setEditingId(entry.id);
    setFormData({
      date: entry.date,
      tithiName: entry.tithiName,
      tithiDetail: entry.tithiDetail,
      paksha: entry.paksha,
      pakshaDetail: entry.pakshaDetail,
      nakshatra: entry.nakshatra,
      isAuspicious: entry.isAuspicious,
      sunrise: entry.sunrise,
      sunset: entry.sunset,
      location: entry.location || 'New Delhi, India',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Save (Create/Update) entry
  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.date.trim()) {
      setFormError('Date is required.');
      return;
    }
    if (!formData.tithiName.trim()) {
      setFormError('Tithi is required.');
      return;
    }
    if (!formData.nakshatra.trim()) {
      setFormError('Nakshatra is required.');
      return;
    }

    setFormLoading(true);
    try {
      const url = editingId ? `/api/admin/panchang/${editingId}` : '/api/admin/panchang';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || 'Failed to save entry.');
      } else {
        setSuccessMessage(editingId ? '✓ Panchang entry updated.' : '✓ Panchang entry created.');
        setIsModalOpen(false);
        fetchPanchangData();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete entry
  const handleDeleteEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/panchang/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage('✓ Entry deleted.');
        setDeleteId(null);
        fetchPanchangData();
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <div style={{ fontSize: '14px', color: '#DE1B59', fontWeight: 600 }}>Loading Panchang &amp; Calendar Console...</div>
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
            Only users with <strong>EDITOR</strong> or <strong>ADMIN</strong> roles can manage content. Your current role is <strong>{userRole}</strong>.
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

      {/* MAIN CMS CONTENT */}
      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1280px' }}>
        {/* HEADER BAR */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>
              Panchang &amp; Calendar
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
              Maintain daily astrological variables and vrat notifications. Supports individual inputs and bulk csv loads.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleTrigger45DaySync}
              disabled={syncing}
              style={{
                background: '#FFFFFF',
                color: '#374151',
                border: '1px solid #D1D5DB',
                padding: '9px 18px',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: syncing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              🔄 {syncing ? 'Syncing...' : 'Trigger 45-Day Sync'}
            </button>

            <button
              type="button"
              onClick={handleTriggerFullYearSync}
              disabled={syncing}
              style={{
                background: '#FFFFFF',
                color: '#DE1B59',
                border: '1px solid #FCE7F3',
                padding: '9px 18px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: syncing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              ⚡ Generate Full Year ({selectedYear})
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              style={{
                background: '#DE1B59',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(222, 27, 89, 0.25)',
              }}
            >
              + Add Entry
            </button>
          </div>
        </div>

        {/* SUCCESS NOTIFICATION */}
        {successMessage && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '20px' }}>
            {successMessage}
          </div>
        )}

        {/* TABS NAVIGATION */}
        <div style={{ display: 'flex', gap: '28px', borderBottom: '1px solid #E5E7EB', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            style={{
              background: 'transparent',
              color: activeTab === 'daily' ? '#DE1B59' : '#6B7280',
              border: 'none',
              borderBottom: activeTab === 'daily' ? '3px solid #DE1B59' : '3px solid transparent',
              borderRadius: '0',
              padding: '10px 4px 14px 4px',
              fontSize: '14px',
              fontWeight: activeTab === 'daily' ? 700 : 500,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            Daily Panchang Entries ({totalEntriesCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('csv')}
            style={{
              background: 'transparent',
              color: activeTab === 'csv' ? '#DE1B59' : '#6B7280',
              border: 'none',
              borderBottom: activeTab === 'csv' ? '3px solid #DE1B59' : '3px solid transparent',
              borderRadius: '0',
              padding: '10px 4px 14px 4px',
              fontSize: '14px',
              fontWeight: activeTab === 'csv' ? 700 : 500,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            Bulk Load CSV
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vrat')}
            style={{
              background: 'transparent',
              color: activeTab === 'vrat' ? '#DE1B59' : '#6B7280',
              border: 'none',
              borderBottom: activeTab === 'vrat' ? '3px solid #DE1B59' : '3px solid transparent',
              borderRadius: '0',
              padding: '10px 4px 14px 4px',
              fontSize: '14px',
              fontWeight: activeTab === 'vrat' ? 700 : 500,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            Vrat Calendar
          </button>
        </div>

        {/* SEARCH, YEAR & PAKSHA FILTERS */}
        {activeTab === 'daily' && (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                placeholder="Filter by date (e.g. 1/1/2026), tithi, or nakshatra..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827', padding: '9px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#111827', padding: '9px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, outline: 'none' }}
              >
                <option value={2026}>2026 (365 Days)</option>
                <option value={2027}>2027 (365 Days)</option>
                <option value={2028}>2028 (366 Days Leap)</option>
                <option value={2025}>2025 (365 Days)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Paksha:</label>
              <select
                value={pakshaFilter}
                onChange={(e) => setPakshaFilter(e.target.value)}
                style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#374151', padding: '9px 14px', borderRadius: '10px', fontSize: '13px', outline: 'none' }}
              >
                <option value="ALL">All Pakshas</option>
                <option value="Shukla">Shukla (Waxing)</option>
                <option value="Krishna">Krishna (Waning)</option>
              </select>
            </div>
          </div>
        )}

        {/* DAILY PANCHANG ENTRIES TABLE matching Screenshot visual spec */}
        {activeTab === 'daily' && (
          <>
            {loading ? (
              <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
                Calculating and loading {selectedYear} daily Panchang entries...
              </div>
            ) : entries.length === 0 ? (
              <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                  No Panchang Entries Found for {selectedYear}
                </h3>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px' }}>
                  Generate all 365 daily entries for {selectedYear} calculated using New Delhi solar/lunar position vectors.
                </p>
                <button
                  type="button"
                  onClick={handleTriggerFullYearSync}
                  style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '10px 24px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  ⚡ Generate {selectedYear} Panchang (365 Entries)
                </button>
              </div>
            ) : (
              <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEAE4', color: '#6B7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 700 }}>
                      <th style={{ padding: '16px 20px' }}>DATE</th>
                      <th style={{ padding: '16px 20px' }}>TITHI / DETAIL</th>
                      <th style={{ padding: '16px 20px' }}>PAKSHA</th>
                      <th style={{ padding: '16px 20px' }}>NAKSHATRA</th>
                      <th style={{ padding: '16px 20px' }}>TIMINGS (SR/SS)</th>
                      <th style={{ padding: '16px 20px' }}>SOURCE</th>
                      <th style={{ padding: '16px 20px', textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        {/* DATE */}
                        <td style={{ padding: '16px 20px', fontWeight: 700, color: '#111827', fontSize: '14px' }}>
                          {entry.date}
                        </td>

                        {/* TITHI / DETAIL */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>{entry.tithiName}</div>
                          <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{entry.tithiDetail}</div>
                        </td>

                        {/* PAKSHA */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 600, color: '#111827' }}>{entry.paksha}</div>
                          <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{entry.pakshaDetail}</div>
                        </td>

                        {/* NAKSHATRA */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {entry.nakshatra}
                            {entry.isAuspicious && (
                              <span style={{ background: '#E6F4EA', color: '#137333', fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '9999px', letterSpacing: '0.4px' }}>
                                AUSPICIOUS
                              </span>
                            )}
                          </div>
                        </td>

                        {/* TIMINGS (SR/SS) */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '12px', fontFamily: 'monospace' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <span>🌅</span> <span style={{ fontWeight: 600, color: '#374151' }}>{entry.sunrise}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <span>🌇</span> <span style={{ fontWeight: 600, color: '#374151' }}>{entry.sunset}</span>
                            </div>
                          </div>
                        </td>

                        {/* SOURCE */}
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ background: '#E0F2FE', color: '#0369A1', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', letterSpacing: '0.4px', display: 'inline-block' }}>
                            {entry.source || 'AUTO SYNCED'}
                          </span>
                          <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '3px' }}>
                            Synced: {entry.lastSynced || '25/08/2026'}
                          </div>
                        </td>

                        {/* ACTIONS */}
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={() => handleRefreshRecord(entry.id)}
                              title="Refresh / Recalculate"
                              style={{ background: '#FFFFFF', color: '#4B5563', border: '1px solid #D1D5DB', width: '32px', height: '32px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              🔄
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditModal(entry)}
                              title="Edit Entry"
                              style={{ background: '#FFFFFF', color: '#4B5563', border: '1px solid #D1D5DB', width: '32px', height: '32px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteId(entry.id)}
                              title="Delete Entry"
                              style={{ background: '#FDF2F5', color: '#DE1B59', border: '1px solid #FCE7F3', width: '32px', height: '32px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* BULK LOAD CSV TAB */}
        {activeTab === 'csv' && (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '36px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Bulk Load CSV Panchang Data</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 24px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
              Upload a standard Panchang CSV file containing Date, Tithi, Nakshatra, Sunrise, and Sunset values to bulk update entries.
            </p>
            <input type="file" accept=".csv" style={{ display: 'none' }} id="csv-file-input" />
            <label
              htmlFor="csv-file-input"
              style={{ display: 'inline-block', background: '#FFFFFF', color: '#DE1B59', border: '1px dashed #DE1B59', padding: '16px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
            >
              📄 Select CSV File to Upload
            </label>
          </div>
        )}

        {/* VRAT CALENDAR TAB */}
        {activeTab === 'vrat' && (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '36px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Vrat Calendar Observances</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px' }}>
              Special fasting notifications and major Vrat dates associated with daily Panchang Tithis.
            </p>
          </div>
        )}
      </main>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #EFEAE4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.8px', display: 'block', marginBottom: '2px' }}>
                  PANCHANG ENTRY
                </span>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
                  {editingId ? 'Edit Panchang Entry' : 'Create Panchang Entry'}
                </h2>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#F3F4F6', color: '#6B7280', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
                ✕
              </button>
            </div>

            {formError && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveEntry}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Date (D/M/YYYY) *</label>
                  <input
                    type="text"
                    placeholder="1/1/2026"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Location</label>
                  <input
                    type="text"
                    placeholder="New Delhi, India"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Tithi Name *</label>
                  <input
                    type="text"
                    placeholder="Trayodashi"
                    value={formData.tithiName}
                    onChange={(e) => setFormData({ ...formData, tithiName: e.target.value })}
                    style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Tithi Detail</label>
                  <input
                    type="text"
                    placeholder="13th day"
                    value={formData.tithiDetail}
                    onChange={(e) => setFormData({ ...formData, tithiDetail: e.target.value })}
                    style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Paksha *</label>
                  <select
                    value={formData.paksha}
                    onChange={(e) => setFormData({ ...formData, paksha: e.target.value, pakshaDetail: e.target.value === 'Shukla' ? 'Waxing moon' : 'Waning moon' })}
                    style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#374151', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                  >
                    <option value="Shukla">Shukla</option>
                    <option value="Krishna">Krishna</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Nakshatra *</label>
                  <input
                    type="text"
                    placeholder="Rohini"
                    value={formData.nakshatra}
                    onChange={(e) => setFormData({ ...formData, nakshatra: e.target.value })}
                    style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Sunrise Time</label>
                  <input
                    type="text"
                    placeholder="6:53"
                    value={formData.sunrise}
                    onChange={(e) => setFormData({ ...formData, sunrise: e.target.value })}
                    style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Sunset Time</label>
                  <input
                    type="text"
                    placeholder="15:49"
                    value={formData.sunset}
                    onChange={(e) => setFormData({ ...formData, sunset: e.target.value })}
                    style={{ width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#111827', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isAuspicious}
                    onChange={(e) => setFormData({ ...formData, isAuspicious: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#DE1B59', cursor: 'pointer' }}
                  />
                  Mark Nakshatra as AUSPICIOUS Badge
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: '#FFFFFF', color: '#374151', border: '1px solid #D1D5DB', padding: '12px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: formLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(222, 27, 89, 0.25)' }}
                >
                  {formLoading ? 'Saving...' : editingId ? 'Update Entry' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '400px', padding: '28px', textAlign: 'center', border: '1px solid #EFEAE4' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: '#DC2626', margin: '0 0 8px' }}>Confirm Deletion</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px', lineHeight: 1.4 }}>
              Are you sure you want to delete this Panchang entry? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                style={{ background: '#FFFFFF', color: '#374151', border: '1px solid #D1D5DB', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteEntry(deleteId)}
                style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PanchangCmsPage() {
  return (
    <SessionProvider>
      <PanchangCmsContent />
    </SessionProvider>
  );
}
