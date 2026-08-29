'use client';

import React, { useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  location: 'Header Navigation' | 'Footer Links' | 'Mobile Menu';
  order: number;
  status: 'Published' | 'Hidden';
}

const INITIAL_MENU: MenuItem[] = [
  { id: 'm-1', label: 'Ritual Guides', url: '/ritual-guides', location: 'Header Navigation', order: 1, status: 'Published' },
  { id: 'm-2', label: 'Dharmic Concepts', url: '/dharmic-concepts', location: 'Header Navigation', order: 2, status: 'Published' },
  { id: 'm-3', label: 'Panchang & Vrats', url: '/panchang', location: 'Header Navigation', order: 3, status: 'Published' },
  { id: 'm-4', label: 'Samagri Kits', url: '/ritual-kits', location: 'Header Navigation', order: 4, status: 'Published' },
  { id: 'm-5', label: 'Editorial Method', url: '/editorial-method', location: 'Footer Links', order: 1, status: 'Published' },
  { id: 'm-6', label: 'About Us', url: '/about', location: 'Footer Links', order: 2, status: 'Published' },
];

function NavigationMenuContent() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [location, setLocation] = useState<'Header Navigation' | 'Footer Links' | 'Mobile Menu'>('Header Navigation');
  const [order, setOrder] = useState(1);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>Loading Navigation Menu Console...</div>
      </div>
    );
  }

  const userEmail = session?.user?.email || 'admin@tapa.co';
  const userRole = (session?.user as any)?.role?.toUpperCase() || 'SUPER_ADMIN';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;
    const newItem: MenuItem = {
      id: `m-${Date.now()}`,
      label: label.trim(),
      url: url.trim(),
      location,
      order: Number(order) || 1,
      status: 'Published',
    };
    setItems([...items, newItem]);
    setLabel('');
    setUrl('');
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, status: i.status === 'Published' ? 'Hidden' : 'Published' } : i)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this menu item?')) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '12px' }}>
          DASHBOARD &gt; NAVIGATION MENU
        </div>

        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: '0 0 6px' }}>
              Navigation Menu Structure
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              Configure header, footer, and mobile menu items, hierarchy, and links across the Tapa platform.
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
            + Add Menu Item
          </button>
        </div>

        {/* Table */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6', color: '#9CA3AF', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px' }}>ORDER</th>
                <th style={{ padding: '12px' }}>LABEL</th>
                <th style={{ padding: '12px' }}>TARGET URL</th>
                <th style={{ padding: '12px' }}>LOCATION</th>
                <th style={{ padding: '12px' }}>STATUS</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 700, color: '#9CA3AF' }}>#{item.order}</td>
                  <td style={{ padding: '14px 12px', fontWeight: 700, color: '#111827' }}>{item.label}</td>
                  <td style={{ padding: '14px 12px', color: '#DE1B59', fontWeight: 600 }}>{item.url}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ background: '#F3F4F6', color: '#374151', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                      {item.location}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ background: item.status === 'Published' ? '#ECFDF5' : '#F3F4F6', color: item.status === 'Published' ? '#059669' : '#6B7280', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button onClick={() => toggleStatus(item.id)} style={{ background: 'none', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                        {item.status === 'Published' ? 'Hide' : 'Publish'}
                      </button>
                      <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', color: '#EF4444', fontWeight: 600, cursor: 'pointer', fontSize: '11px' }}>
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
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 20px' }}>Add Menu Item</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Menu Label</label>
                <input type="text" required value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Vrat Calendar" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Target URL Path</label>
                <input type="text" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="e.g. /vrat-calendar" style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Location</label>
                  <select value={location} onChange={(e) => setLocation(e.target.value as any)} style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }}>
                    <option value="Header Navigation">Header Navigation</option>
                    <option value="Footer Links">Footer Links</option>
                    <option value="Mobile Menu">Mobile Menu</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Display Order</label>
                  <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#F3F4F6', color: '#374151', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Save Item</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default function NavigationMenuPage() {
  return (
    <SessionProvider>
      <NavigationMenuContent />
    </SessionProvider>
  );
}
