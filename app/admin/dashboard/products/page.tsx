'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  price: number;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE';
  featuredImage?: string | null;
  imagesJson?: string | null;
  samagriItemsJson?: string | null;
  createdAt?: string;
}

function ProductsContent() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Selection & Modal States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteAllConfirmInput, setDeleteAllConfirmInput] = useState('');
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // Duplicate Modal State
  const [duplicateProductTarget, setDuplicateProductTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProducts();
    }
  }, [status, fetchProducts]);

  const userEmail = session?.user?.email || 'admin@tapa.co';
  const userRole = (session?.user as any)?.role?.toUpperCase() || 'SUPER_ADMIN';

  // Search Filter
  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  // Checkbox Selection Logic
  const allFilteredIds = filteredProducts.map((p) => p.id);
  const isAllSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedIds.includes(id));
  const isSomeSelected = allFilteredIds.some((id) => selectedIds.includes(id)) && !isAllSelected;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all filtered products
      setSelectedIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      // Select all filtered products
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Individual Delete Handler
  const handleDeleteProduct = async (id: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete product "${productName}"?`)) return;
    setDeletingId(id);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMsg({ type: 'success', text: `Product "${productName}" deleted successfully.` });
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        fetchProducts();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'Failed to delete product.' });
      }
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err?.message || 'Error deleting product.' });
    } finally {
      setDeletingId(null);
    }
  };

  // Duplicate Product Handler
  const handleConfirmDuplicate = async () => {
    if (!duplicateProductTarget) return;
    setIsDuplicating(true);
    setActionMsg(null);

    try {
      const res = await fetch(`/api/admin/products/${duplicateProductTarget.id}/duplicate`, {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setActionMsg({
          type: 'success',
          text: data.message || `Product "${duplicateProductTarget.name}" duplicated successfully.`,
        });
        setDuplicateProductTarget(null);
        fetchProducts();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'Failed to duplicate product.' });
      }
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err?.message || 'Server error while duplicating product.' });
    } finally {
      setIsDuplicating(false);
    }
  };

  // Bulk Delete Selected Handler
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsDeletingBulk(true);
    setActionMsg(null);

    try {
      const res = await fetch('/api/admin/products/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const count = data.count || selectedIds.length;
        setActionMsg({ type: 'success', text: `${count} product(s) deleted successfully.` });
        setSelectedIds([]);
        setShowBulkDeleteModal(false);
        fetchProducts();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'Failed to delete selected products.' });
      }
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err?.message || 'Server error deleting selected products.' });
    } finally {
      setIsDeletingBulk(false);
    }
  };

  // Delete All Products Handler
  const handleConfirmDeleteAll = async () => {
    if (deleteAllConfirmInput.trim() !== 'DELETE ALL') return;
    setIsDeletingAll(true);
    setActionMsg(null);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setActionMsg({ type: 'success', text: 'All products deleted successfully from database catalog.' });
        setSelectedIds([]);
        setDeleteAllConfirmInput('');
        setShowDeleteAllModal(false);
        fetchProducts();
      } else {
        setActionMsg({ type: 'error', text: data.error || 'Failed to delete all products.' });
      }
    } catch (err: any) {
      setActionMsg({ type: 'error', text: err?.message || 'Server error during delete all products operation.' });
    } finally {
      setIsDeletingAll(false);
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>Loading Products Console...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1240px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '12px' }}>
          DASHBOARD &gt; PRODUCTS
        </div>

        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: '0 0 6px' }}>
              Inventory Products &amp; Kits
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              Manage Puja Kits and individual Samagri items, pricing, inventory stock status, and configurations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setShowDeleteAllModal(true)}
              style={{
                background: '#FFFFFF',
                color: '#DC2626',
                border: '1px solid #FCA5A5',
                padding: '10px 16px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
              }}
            >
              ⚠️ Delete All Products
            </button>

            <Link
              href="/admin/products/new"
              style={{
                background: '#DE1B59',
                color: '#FFFFFF',
                border: 'none',
                padding: '11px 20px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '13px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(222, 27, 89, 0.2)',
              }}
            >
              + New Product
            </Link>
          </div>
        </div>

        {/* Alert Notifications */}
        {actionMsg && (
          <div
            style={{
              background: actionMsg.type === 'success' ? '#ECFDF5' : '#FEE2E2',
              border: `1px solid ${actionMsg.type === 'success' ? '#A7F3D0' : '#FCA5A5'}`,
              color: actionMsg.type === 'success' ? '#065F46' : '#991B1B',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '24px',
            }}
          >
            {actionMsg.text}
          </div>
        )}

        {/* Search & Bulk Operations Toolbar */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <input
            type="text"
            placeholder="Search products by name, slug, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', boxSizing: 'border-box' }}
          />

          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => setShowBulkDeleteModal(true)}
            style={{
              background: selectedIds.length > 0 ? '#FEE2E2' : '#F3F4F6',
              color: selectedIds.length > 0 ? '#DC2626' : '#9CA3AF',
              border: `1px solid ${selectedIds.length > 0 ? '#FCA5A5' : '#E5E7EB'}`,
              padding: '9px 16px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            Delete Selected ({selectedIds.length})
          </button>
        </div>

        {/* Products Table or Empty State */}
        {loading ? (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
            Loading catalog products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            style={{
              background: '#FFFDF9',
              border: '1px solid #F5E6D3',
              borderRadius: '20px',
              padding: '64px 32px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                border: '2px solid #D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '16px',
                color: '#D97706',
              }}
            >
              📦
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 8px', color: '#111827' }}>
              No Products Found
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px', maxWidth: '440px', lineHeight: 1.5 }}>
              Create a new Puja Kit or Samagri item above to begin stocking the inventory.
            </p>
            <Link
              href="/admin/products/new"
              style={{ background: '#DE1B59', color: '#FFFFFF', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}
            >
              + Create Product
            </Link>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EFEAE4', color: '#9CA3AF', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 16px', width: '36px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isSomeSelected;
                      }}
                      onChange={handleToggleSelectAll}
                      style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                    />
                  </th>
                  <th style={{ padding: '14px 20px' }}>PRODUCT</th>
                  <th style={{ padding: '14px 20px' }}>CATEGORY</th>
                  <th style={{ padding: '14px 20px' }}>PRICE</th>
                  <th style={{ padding: '14px 20px' }}>STOCK</th>
                  <th style={{ padding: '14px 20px' }}>SAMAGRI ITEMS</th>
                  <th style={{ padding: '14px 20px' }}>STATUS</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const isSelected = selectedIds.includes(product.id);

                  let samagriCount = 0;
                  if (product.samagriItemsJson) {
                    try {
                      samagriCount = JSON.parse(product.samagriItemsJson).length;
                    } catch (e) {}
                  }

                  let coverImg = product.featuredImage || '';
                  if (!coverImg && product.imagesJson) {
                    try {
                      const imgs = JSON.parse(product.imagesJson);
                      if (Array.isArray(imgs) && imgs.length > 0) coverImg = imgs[0];
                    } catch (e) {}
                  }

                  const categoryLabel =
                    product.category === 'BY_FESTIVAL'
                      ? 'By Festival'
                      : product.category === 'BY_RITUAL'
                      ? 'By Ritual'
                      : product.category === 'GRIHA_LIFE_EVENTS'
                      ? 'Griha & Life Events'
                      : product.category === 'DAILY_PUJA_ESSENTIALS'
                      ? 'Daily Puja Essentials'
                      : product.category || 'General';

                  return (
                    <tr
                      key={product.id}
                      style={{
                        borderBottom: '1px solid #F3F4F6',
                        background: isSelected ? '#FEF2F5' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '16px 16px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(product.id)}
                          style={{ cursor: 'pointer', width: '15px', height: '15px' }}
                        />
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {coverImg ? (
                            <img src={coverImg} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E5E7EB' }} />
                          ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#FDF2F5', color: '#DE1B59', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                              📦
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>{product.name}</div>
                            <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace' }}>Slug: {product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#4B5563' }}>
                        <span style={{ background: '#F3F4F6', color: '#374151', fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px' }}>
                          {categoryLabel}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#111827' }}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontWeight: 600, color: product.stock > 0 ? '#059669' : '#DC2626' }}>
                          {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#6B7280' }}>
                        {samagriCount} items
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            background: product.status === 'ACTIVE' ? '#ECFDF5' : '#FEE2E2',
                            color: product.status === 'ACTIVE' ? '#059669' : '#DC2626',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <Link
                            href={`/admin/products/new?edit=${product.id}`}
                            style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none', fontSize: '12px' }}
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            disabled={isDuplicating && duplicateProductTarget?.id === product.id}
                            onClick={() => setDuplicateProductTarget({ id: product.id, name: product.name })}
                            style={{ background: 'none', border: 'none', color: '#D97706', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
                          >
                            {isDuplicating && duplicateProductTarget?.id === product.id ? 'Duplicating...' : 'Duplicate'}
                          </button>

                          <button
                            type="button"
                            disabled={deletingId === product.id}
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            style={{ background: 'none', border: 'none', color: '#DC2626', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
                          >
                            {deletingId === product.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL 0: DUPLICATE PRODUCT CONFIRMATION */}
        {duplicateProductTarget && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '28px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <div style={{ background: '#FEF3C7', color: '#D97706', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                📋
              </div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 10px', color: '#111827' }}>
                Duplicate "{duplicateProductTarget.name}"?
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px', lineHeight: 1.5 }}>
                A new independent product record will be created using the exact same product information, pricing, images, Samagri, Significance, and Delivery details.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  disabled={isDuplicating}
                  onClick={() => setDuplicateProductTarget(null)}
                  style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '12.5px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDuplicating}
                  onClick={handleConfirmDuplicate}
                  style={{ background: '#D97706', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '12.5px', cursor: isDuplicating ? 'not-allowed' : 'pointer', opacity: isDuplicating ? 0.6 : 1 }}
                >
                  {isDuplicating ? 'Duplicating...' : 'Duplicate Product'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: BULK DELETE CONFIRMATION */}
        {showBulkDeleteModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '28px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 10px', color: '#111827' }}>
                Delete {selectedIds.length} Selected Product(s)?
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px', lineHeight: 1.5 }}>
                Are you sure you want to delete the selected product(s) from the inventory catalog? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  disabled={isDeletingBulk}
                  onClick={() => setShowBulkDeleteModal(false)}
                  style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '12.5px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeletingBulk}
                  onClick={handleConfirmBulkDelete}
                  style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '12.5px', cursor: isDeletingBulk ? 'not-allowed' : 'pointer', opacity: isDeletingBulk ? 0.6 : 1 }}
                >
                  {isDeletingBulk ? 'Deleting...' : `Delete ${selectedIds.length} Products`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: DELETE ALL PRODUCTS STRONG CONFIRMATION */}
        {showDeleteAllModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '28px', maxWidth: '460px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)' }}>
              <div style={{ background: '#FEE2E2', color: '#DC2626', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>
                ⚠️
              </div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 10px', color: '#991B1B' }}>
                Delete All Products?
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 16px', lineHeight: 1.5 }}>
                This will permanently delete <strong>ALL</strong> products in the catalog database. This action cannot be undone.
              </p>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                  TYPE <span style={{ color: '#DC2626' }}>DELETE ALL</span> TO CONFIRM:
                </label>
                <input
                  type="text"
                  value={deleteAllConfirmInput}
                  onChange={(e) => setDeleteAllConfirmInput(e.target.value)}
                  placeholder="DELETE ALL"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  disabled={isDeletingAll}
                  onClick={() => {
                    setShowDeleteAllModal(false);
                    setDeleteAllConfirmInput('');
                  }}
                  style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '12.5px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteAllConfirmInput.trim() !== 'DELETE ALL' || isDeletingAll}
                  onClick={handleConfirmDeleteAll}
                  style={{
                    background: deleteAllConfirmInput.trim() === 'DELETE ALL' ? '#DC2626' : '#FCA5A5',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: deleteAllConfirmInput.trim() === 'DELETE ALL' && !isDeletingAll ? 'pointer' : 'not-allowed',
                    opacity: isDeletingAll ? 0.6 : 1,
                  }}
                >
                  {isDeletingAll ? 'Deleting All Products...' : 'Confirm Delete All'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <SessionProvider>
      <ProductsContent />
    </SessionProvider>
  );
}
