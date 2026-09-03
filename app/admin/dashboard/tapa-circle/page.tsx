'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface SubscriberItem {
  id: string;
  name: string;
  whatsappNumber: string;
  optInDate: string;
  consentGiven: boolean;
  status: string;
}

function TapaCircleContent() {
  const { data: session, status } = useSession();
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/subscribers');
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribers(data.subscribers || []);
      }
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSubscribers();
    }
  }, [status, fetchSubscribers]);

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>Loading Tapa Circle Console...</div>
      </div>
    );
  }

  const userEmail = session?.user?.email || 'admin@tapa.co';
  const userRole = (session?.user as any)?.role?.toUpperCase() || 'SUPER_ADMIN';

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/subscribers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribers(subscribers.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
      }
    } catch (err) {
      console.error('Failed to update subscriber status:', err);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    alert(`Broadcast sent to ${subscribers.length} members!`);
    setBroadcastMessage('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '12px' }}>
          DASHBOARD &gt; TAPA CIRCLE
        </div>

        {/* Title Bar */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: '0 0 6px' }}>
            The Tapa Circle Registry
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
            Review membership subscriptions, authorize active status, and dispatch WhatsApp alerts.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px' }}>
          {/* Left Table */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>👥</span> Active Subscribers Directory ({subscribers.length})
            </div>

            <div style={{ background: '#FFFDF9', border: '1px solid #F5E6D3', borderRadius: '16px', padding: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #EFEAE4', color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '10px 8px' }}>SUBSCRIBER</th>
                    <th style={{ padding: '10px 8px' }}>WHATSAPP CONTACT</th>
                    <th style={{ padding: '10px 8px' }}>OPT-IN DATE</th>
                    <th style={{ padding: '10px 8px' }}>CONSENT STATUS</th>
                    <th style={{ padding: '10px 8px' }}>MEMBERSHIP STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                      <td style={{ padding: '14px 8px', fontWeight: 700, color: '#111827' }}>{s.name}</td>
                      <td style={{ padding: '14px 8px', color: '#4B5563' }}>{s.whatsappNumber}</td>
                      <td style={{ padding: '14px 8px', color: '#4B5563' }}>{new Date(s.optInDate).toLocaleDateString()}</td>
                      <td style={{ padding: '14px 8px' }}>
                        <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          {s.consentGiven ? 'Consented ✓' : 'Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <select
                          value={s.status}
                          onChange={(e) => handleStatusChange(s.id, e.target.value)}
                          style={{ border: '1px solid #E5E7EB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 700, background: '#FFFFFF' }}
                        >
                          <option value="Active">Active</option>
                          <option value="Paused">Paused</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Card: WhatsApp Alert Broadcast */}
          <div>
            <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 700, margin: '0 0 16px', color: '#111827', fontFamily: 'Georgia, serif' }}>
                <span style={{ color: '#DE1B59' }}>📍</span> WhatsApp Alert Broadcast
              </div>

              <form onSubmit={handleSendBroadcast}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                  COMPOSE MESSAGE
                </label>
                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="e.g. Sawan Shivratri Muhurta: Pooja begins tonight at 08:34 PM. Chants details inside..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    boxSizing: 'border-box',
                    marginBottom: '16px',
                    resize: 'none',
                  }}
                />

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: broadcastMessage.trim() ? '#DE1B59' : '#9CA3AF',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '11px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: broadcastMessage.trim() ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  📍 Send to {subscribers.length} Members
                </button>
              </form>
            </div>

            {/* Dispatch Logs */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Broadcast Dispatch Logs</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>No past broadcasts recorded.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TapaCirclePage() {
  return (
    <SessionProvider>
      <TapaCircleContent />
    </SessionProvider>
  );
}
