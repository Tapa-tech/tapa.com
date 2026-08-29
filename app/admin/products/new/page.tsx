'use client';

import React, { useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

function NewProductContent() {
  const { data: session, status } = useSession();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('Puja Kit');
  const [category, setCategory] = useState('Navratri');
  const [cod, setCod] = useState('Available');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [stock, setStock] = useState('');
  const [linkedGuide, setLinkedGuide] = useState('None (Not linked to any guide)');
  const [images, setImages] = useState('');
  const [description, setDescription] = useState('');
  const [samagriItems, setSamagriItems] = useState<{ name: string; qty: string }[]>([]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>Loading Create Product Console...</div>
      </div>
    );
  }

  const userEmail = session?.user?.email || 'admin@tapa.co';
  const userRole = (session?.user as any)?.role?.toUpperCase() || 'SUPER_ADMIN';

  const handleAddSamagriItem = () => {
    setSamagriItems([...samagriItems, { name: '', qty: '1' }]);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Product configuration saved locally!');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Link href="/admin/products" style={{ color: '#4B5563', textDecoration: 'none', fontSize: '18px', fontWeight: 700 }}>
            ←
          </Link>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: 0 }}>
              Create New Product
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0' }}>
              Manage complete product specifications, pricing, and catalog details.
            </p>
          </div>
        </div>

        {/* Form Container (Exact match to screenshot 3) */}
        <form onSubmit={handleSaveProduct} style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '20px', padding: '32px' }}>
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>PRODUCT NAME</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Shubh Sampada Diwali Kit" style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>PRODUCT ID (SLUG / UNIQUE ID)</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. shubh-sampada" style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>PRODUCT TYPE</label>
              <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: '11px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', background: '#FFFFFF', boxSizing: 'border-box' }}>
                <option value="Puja Kit">Puja Kit</option>
                <option value="Samagri Item">Samagri Item</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>CATEGORY (OCCASION TAG)</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '11px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', background: '#FFFFFF', boxSizing: 'border-box' }}>
                <option value="Navratri">Navratri</option>
                <option value="Diwali">Diwali</option>
                <option value="Shivratri">Shivratri</option>
                <option value="Daily Puja">Daily Puja</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>CASH ON DELIVERY (COD)</label>
              <select value={cod} onChange={(e) => setCod(e.target.value)} style={{ width: '100%', padding: '11px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', background: '#FFFFFF', boxSizing: 'border-box' }}>
                <option value="Available">Available</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>

          {/* Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>PRICE (₹ SELLING PRICE)</label>
              <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 2199" style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>MRP (₹ LIST PRICE - OPTIONAL)</label>
              <input type="text" value={mrp} onChange={(e) => setMrp(e.target.value)} placeholder="e.g. 2600" style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>INVENTORY STOCK LEVEL</label>
              <input type="text" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="e.g. 50" style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* Linked Companion Ritual Guide */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>LINKED COMPANION RITUAL GUIDE</label>
            <select value={linkedGuide} onChange={(e) => setLinkedGuide(e.target.value)} style={{ width: '100%', padding: '11px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', background: '#FFFFFF', boxSizing: 'border-box' }}>
              <option value="None (Not linked to any guide)">None (Not linked to any guide)</option>
              <option value="Navratri Complete Puja Guide">Navratri Complete Puja Guide</option>
            </select>
            <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '4px' }}>Linking a guide allows this product to automatically activate the checkout CTA inside the guide's samagri checklist.</div>
          </div>

          {/* Image URLs */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>IMAGE URLS (ONE ABSOLUTE URL PER LINE)</label>
            <textarea rows={3} value={images} onChange={(e) => setImages(e.target.value)} placeholder="e.g. https://example.com/images/diwali-kit-1.jpg" style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '12.5px', fontFamily: 'monospace', boxSizing: 'border-box' }} />
          </div>

          {/* Detailed Description Editor */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>DETAILED DESCRIPTION (RICH EDITOR)</label>
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
              {/* Toolbar */}
              <div style={{ background: '#FAF9F6', borderBottom: '1px solid #E5E7EB', padding: '8px 12px', display: 'flex', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#4B5563' }}>
                <span style={{ cursor: 'pointer' }}>B</span>
                <span style={{ cursor: 'pointer', fontStyle: 'italic' }}>I</span>
                <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>U</span>
                <span style={{ cursor: 'pointer' }}>🔗</span>
                <span style={{ cursor: 'pointer' }}>H1</span>
                <span style={{ cursor: 'pointer' }}>H2</span>
                <span style={{ cursor: 'pointer' }}>≡</span>
              </div>
              <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '14px', border: 'none', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* Puja Kit Samagri Checklist */}
          <div style={{ background: '#FFFDF9', border: '1px solid #F5E6D3', borderRadius: '16px', padding: '20px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 700, margin: 0, color: '#111827' }}>Puja Kit Samagri Checklist</h3>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>Add individual samagri items contained inside this kit package.</div>
              </div>
              <button
                type="button"
                onClick={handleAddSamagriItem}
                style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
              >
                + ADD ITEM
              </button>
            </div>

            {samagriItems.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
                {samagriItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Item name (e.g. Kalash)"
                      value={item.name}
                      onChange={(e) => {
                        const updated = [...samagriItems];
                        updated[idx].name = e.target.value;
                        setSamagriItems(updated);
                      }}
                      style={{ flex: 1, padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <input
                      type="text"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) => {
                        const updated = [...samagriItems];
                        updated[idx].qty = e.target.value;
                        setSamagriItems(updated);
                      }}
                      style={{ width: '80px', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Link href="/admin/products" style={{ background: '#F3F4F6', color: '#374151', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}>
              Cancel
            </Link>
            <button type="submit" style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              Save Product
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function NewProductPage() {
  return (
    <SessionProvider>
      <NewProductContent />
    </SessionProvider>
  );
}
