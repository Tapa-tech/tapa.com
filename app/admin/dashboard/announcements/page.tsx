'use client';

import React, { useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  type: 'Header Banner' | 'Modal Popup' | 'In-App Alert';
  targetUrl?: string;
  status: 'Active' | 'Scheduled' | 'Expired';
  createdAt: string;
}

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Navratri Mahotsav 2026 Specials',
    message: 'Navratri Sthan & Ghatasthapana Shubh Muhurta details are live now. Access scriptural vidhi.',
    type: 'Header Banner',
    targetUrl: '/ritual-guides/navratri',
    status: 'Active',
    createdAt: '25/8/2026',
  },
  {
    id: 'ann-2',
    title: 'New Samagri Kits Delivery Region Expansion',
    message: 'Puja kits ordering is now active across Delhi-NCR and Mumbai metro areas.',
    type: 'In-App Alert',
    targetUrl: '/ritual-kits',
    status: 'Active',
    createdAt: '20/8/2026',
  },
  {
    id: 'ann-3',
    title: 'System Maintenance Completed',
    message: 'Panchang engine database migration and calculation updates are complete.',
    type: 'Modal Popup',
    targetUrl: '/panchang',
    status: 'Expired',
    createdAt: '15/8/2026',
  },
];

function AnnouncementsContent() {
  const { data: session, status } = useSession();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'Header Banner' | 'Modal Popup' | 'In-App Alert'>('Header Banner');
  const [targetUrl, setTargetUrl] = useState('');

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>Loading Announcements Console...</div>
      </div>
    );
  }

  const userEmail = session?.user?.email || 'admin@tapa.co';
  const userRole = (session?.user as any)?.role?.toUpperCase() || 'SUPER_ADMIN';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    const newItem: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      type,
      targetUrl: targetUrl.trim() || undefined,
      status: 'Active',
      createdAt: new Date().toLocaleDateString(),
    };
    setAnnouncements([newItem, ...announcements]);
    setTitle('');
    setMessage('');
    setTargetUrl('');
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setAnnouncements(
      announcements.map((a) => {
        if (a.id === id) {
          return { ...a, status: a.status === 'Active' ? 'Expired' : 'Active' };
        }
        return a;
      })
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this announcement?')) {
      setAnnouncements(announcements.filter((a) => a.id !== id));
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '12px' }}>
          DASHBOARD &gt; ANNOUNCEMENTS
        </div>

        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: '0 0 6px' }}>
              Announcements &amp; Broadcasts
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              Manage global site announcements, header ticker banners, and popup notifications for Tapa pujan practitioners.
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
            + New Announcement
          </button>
        </div>

        {/* Announcements Table */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6', color: '#9CA3AF', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px' }}>ANNOUNCEMENT TITLE</th>
                <th style={{ padding: '12px' }}>TYPE</th>
                <th style={{ padding: '12px' }}>MESSAGE SUMMARY</th>
                <th style={{ padding: '12px' }}>STATUS</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                  <td style={{ padding: '16px 12px', fontWeight: 700, color: '#111827' }}>
                    {item.title}
                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 400 }}>Created: {item.createdAt}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ background: '#F3F4F6', color: '#374151', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', color: '#4B5563', maxWidth: '300px' }}>
                    {item.message}
                    {item.targetUrl && (
                      <div style={{ fontSize: '11px', color: '#DE1B59', fontWeight: 600, marginTop: '2px' }}>Link: {item.targetUrl}</div>
                    )}
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span
                      style={{
                        background: item.status === 'Active' ? '#ECFDF5' : '#F3F4F6',
                        color: item.status === 'Active' ? '#059669' : '#6B7280',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        onClick={() => toggleStatus(item.id)}
                        style={{ background: 'none', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        {item.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', fontWeight: 600, cursor: 'pointer', fontSize: '11px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <form onSubmit={handleCreate} style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', maxWidth: '500px', width: '90%', border: '1px solid #EFEAE4' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 20px' }}>Create New Announcement</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Announcement Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Special Navratri Updates" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as any)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }}>
                  <option value="Header Banner">Header Banner Ticker</option>
                  <option value="In-App Alert">In-App Alert Card</option>
                  <option value="Modal Popup">Modal Dialog Popup</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Message Body</label>
                <textarea rows={3} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter details to broadcast..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Target Link URL (Optional)</label>
                <input type="text" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="e.g. /ritual-guides/navratri" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#F3F4F6', color: '#374151', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Broadcast Announcement</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AnnouncementsPage() {
  return (
    <SessionProvider>
      <AnnouncementsContent />
    </SessionProvider>
  );
}
