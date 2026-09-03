'use client';

import React, { useState, useEffect } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface SamagriRow {
  id: string;
  itemName: string;
  quantity: string;
  unit: string;
}

interface StepRow {
  id: string;
  text: string;
}

function AddProductFormContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  // 1. Basic Product Information
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('BY_FESTIVAL');


  // 2. Pricing & Inventory
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [productStatus, setProductStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  // 3. Product Images (Multiple product images + Exactly ONE featured image)
  const [images, setImages] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // 4. Samagri Items Breakdown
  const [samagriItems, setSamagriItems] = useState<SamagriRow[]>([
    { id: 'sam-1', itemName: 'Ganga Jal', quantity: '25', unit: 'ml' },
    { id: 'sam-2', itemName: 'Roli Kumkum', quantity: '50', unit: 'g' },
    { id: 'sam-3', itemName: 'Akshat Rice', quantity: '100', unit: 'g' },
  ]);

  // 5. Significance & How to Use
  const [significanceLabel, setSignificanceLabel] = useState('SIGNIFICANCE');
  const [significanceHeading, setSignificanceHeading] = useState('');
  const [significanceDescription, setSignificanceDescription] = useState('');

  const [whatsInsideLabel, setWhatsInsideLabel] = useState("WHAT'S INSIDE");
  const [whatsInsideHeading, setWhatsInsideHeading] = useState('');
  const [whatsInsideDescription, setWhatsInsideDescription] = useState('');

  const [howToUseLabel, setHowToUseLabel] = useState('HOW TO USE');
  const [howToUseHeading, setHowToUseHeading] = useState('');
  const [howToUseSteps, setHowToUseSteps] = useState<StepRow[]>([
    { id: 'step-1', text: '' },
  ]);

  const [supportingText, setSupportingText] = useState('');

  // 6. Delivery & Policies
  // Subsection 1: Delivery
  const [dispatchInfo, setDispatchInfo] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [serviceableAreas, setServiceableAreas] = useState('');
  const [courierInfo, setCourierInfo] = useState('');

  // Subsection 2: Cancellation, Returns & Damage
  const [cancellationInfo, setCancellationInfo] = useState('');
  const [cancellationPolicyText, setCancellationPolicyText] = useState('');
  const [cancellationPolicyUrl, setCancellationPolicyUrl] = useState('');

  const [returnsInfo, setReturnsInfo] = useState('');
  const [returnsPolicyText, setReturnsPolicyText] = useState('');
  const [returnsPolicyUrl, setReturnsPolicyUrl] = useState('');

  const [damageInTransitInfo, setDamageInTransitInfo] = useState('');
  const [damageClaimText, setDamageClaimText] = useState('');
  const [damageClaimUrl, setDamageClaimUrl] = useState('');

  // Form State
  const [loadingEditData, setLoadingEditData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load existing product if in Edit mode
  useEffect(() => {
    if (editId) {
      setLoadingEditData(true);
      fetch(`/api/admin/products/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.product) {
            const p = data.product;
            setName(p.name || '');
            setSlug(p.slug || '');
            setDescription(p.description || '');
            const catVal = String(p.category || '');
            if (['BY_FESTIVAL', 'BY_RITUAL', 'GRIHA_LIFE_EVENTS', 'DAILY_PUJA_ESSENTIALS'].includes(catVal)) {
              setCategory(catVal);
            } else if (catVal.toLowerCase().includes('ritual')) {
              setCategory('BY_RITUAL');
            } else if (catVal.toLowerCase().includes('griha') || catVal.toLowerCase().includes('life')) {
              setCategory('GRIHA_LIFE_EVENTS');
            } else if (catVal.toLowerCase().includes('daily') || catVal.toLowerCase().includes('essential')) {
              setCategory('DAILY_PUJA_ESSENTIALS');
            } else {
              setCategory('BY_FESTIVAL');
            }

            setPrice(p.price ? String(p.price) : '');
            setStock(p.stock !== undefined ? String(p.stock) : '0');
            setProductStatus(p.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE');

            let parsedImages: string[] = [];
            if (p.imagesJson) {
              try {
                parsedImages = JSON.parse(p.imagesJson);
              } catch (e) {}
            }
            setImages(parsedImages);

            if (p.featuredImage && parsedImages.includes(p.featuredImage)) {
              setFeaturedImage(p.featuredImage);
            } else if (parsedImages.length > 0) {
              setFeaturedImage(parsedImages[0]);
            } else {
              setFeaturedImage(null);
            }

            if (p.samagriItemsJson) {
              try {
                const parsedSamagri = JSON.parse(p.samagriItemsJson);
                if (Array.isArray(parsedSamagri)) {
                  const sorted = [...parsedSamagri].sort((a, b) => (a.order || 0) - (b.order || 0));
                  setSamagriItems(
                    sorted.map((item, idx) => ({
                      id: item.id || `sam-${Date.now()}-${idx}`,
                      itemName: item.itemName || item.name || '',
                      quantity: item.quantity || '',
                      unit: item.unit || '',
                    }))
                  );
                }
              } catch (e) {}
            }

            // Significance fields
            setSignificanceLabel(p.significanceLabel || 'SIGNIFICANCE');
            setSignificanceHeading(p.significanceHeading || '');
            setSignificanceDescription(p.significanceDescription || '');

            // What's Inside summary fields
            setWhatsInsideLabel(p.whatsInsideLabel || "WHAT'S INSIDE");
            setWhatsInsideHeading(p.whatsInsideHeading || '');
            setWhatsInsideDescription(p.whatsInsideDescription || '');

            // How To Use fields
            setHowToUseLabel(p.howToUseLabel || 'HOW TO USE');
            setHowToUseHeading(p.howToUseHeading || '');

            if (p.howToUseStepsJson) {
              try {
                const parsedSteps = JSON.parse(p.howToUseStepsJson);
                if (Array.isArray(parsedSteps)) {
                  const sortedSteps = [...parsedSteps].sort((a, b) => (a.order || 0) - (b.order || 0));
                  setHowToUseSteps(
                    sortedSteps.map((s, idx) => ({
                      id: `step-${Date.now()}-${idx}`,
                      text: typeof s === 'string' ? s : (s.text || ''),
                    }))
                  );
                }
              } catch (e) {}
            }

            setSupportingText(p.supportingText || '');

            // Delivery & Policies fields
            setDispatchInfo(p.dispatchInfo || '');
            setExpectedDelivery(p.expectedDelivery || '');
            setServiceableAreas(p.serviceableAreas || '');
            setCourierInfo(p.courierInfo || '');

            setCancellationInfo(p.cancellationInfo || '');
            setCancellationPolicyText(p.cancellationPolicyText || '');
            setCancellationPolicyUrl(p.cancellationPolicyUrl || '');

            setReturnsInfo(p.returnsInfo || '');
            setReturnsPolicyText(p.returnsPolicyText || '');
            setReturnsPolicyUrl(p.returnsPolicyUrl || '');

            setDamageInTransitInfo(p.damageInTransitInfo || '');
            setDamageClaimText(p.damageClaimText || '');
            setDamageClaimUrl(p.damageClaimUrl || '');
          }
        })
        .catch((err) => {
          console.error('Failed to load edit product data:', err);
        })
        .finally(() => {
          setLoadingEditData(false);
        });
    }
  }, [editId]);

  if (status === 'loading' || loadingEditData) {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>
          {editId ? 'Loading Product Data...' : 'Loading Product Form...'}
        </div>
      </div>
    );
  }

  const userEmail = session?.user?.email || 'admin@tapa.co';
  const userRole = (session?.user as any)?.role?.toUpperCase() || 'SUPER_ADMIN';

  // Slug auto-formatter on title change
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editId && (!slug || slug === name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''))) {
      const generatedSlug = val.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
      setSlug(generatedSlug);
    }
  };

  // Image Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const imgUrl = reader.result as string;
          setImages((prev) => {
            const next = [...prev, imgUrl];
            if (!featuredImage && next.length > 0) {
              setFeaturedImage(next[0]);
            }
            return next;
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!customImageUrl.trim()) return;
    const url = customImageUrl.trim();
    setImages((prev) => {
      const next = [...prev, url];
      if (!featuredImage && next.length > 0) {
        setFeaturedImage(next[0]);
      }
      return next;
    });
    setCustomImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    const removedUrl = images[index];
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    if (featuredImage === removedUrl) {
      if (updatedImages.length > 0) {
        setFeaturedImage(updatedImages[0]);
      } else {
        setFeaturedImage(null);
      }
    }
  };

  const handleSetFeaturedImage = (url: string) => {
    setFeaturedImage(url);
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    setImages(updated);
  };

  // Samagri Item Handlers
  const handleAddSamagriRow = () => {
    setSamagriItems((prev) => [
      ...prev,
      { id: `sam-${Date.now()}`, itemName: '', quantity: '1', unit: 'pcs' },
    ]);
  };

  const handleUpdateSamagriRow = (index: number, field: keyof SamagriRow, value: string) => {
    setSamagriItems((prev) => {
      const arr = [...prev];
      arr[index] = { ...arr[index], [field]: value };
      return arr;
    });
  };

  const handleRemoveSamagriRow = (index: number) => {
    setSamagriItems((prev) => prev.filter((_, i) => i !== index));
  };

  // How To Use Steps Handlers
  const handleAddStepRow = () => {
    setHowToUseSteps((prev) => [
      ...prev,
      { id: `step-${Date.now()}`, text: '' },
    ]);
  };

  const handleUpdateStepRow = (index: number, text: string) => {
    setHowToUseSteps((prev) => {
      const arr = [...prev];
      arr[index] = { ...arr[index], text };
      return arr;
    });
  };

  const handleRemoveStepRow = (index: number) => {
    setHowToUseSteps((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please provide a product name.');
      return;
    }

    if (!slug.trim()) {
      setErrorMsg('Please provide a unique product slug.');
      return;
    }

    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      setErrorMsg('Please enter a valid numeric selling price in INR.');
      return;
    }

    // IMAGE & FEATURED IMAGE VALIDATION
    if (images.length > 0) {
      if (!featuredImage || !images.includes(featuredImage)) {
        setErrorMsg('Exactly ONE image must be selected as the Featured Image. Please click "Set as Featured" on an image.');
        return;
      }
    }

    // SAMAGRI VALIDATION
    for (let i = 0; i < samagriItems.length; i++) {
      const item = samagriItems[i];
      const hasName = item.itemName.trim().length > 0;
      const hasQty = item.quantity.trim().length > 0;
      const hasUnit = item.unit.trim().length > 0;

      if (!hasName && !hasQty && !hasUnit) continue;

      if (!hasName) {
        setErrorMsg(`Item Name is required for Samagri row #${i + 1}.`);
        return;
      }

      if (hasQty && !hasUnit) {
        setErrorMsg(`Unit is required for Samagri row #${i + 1} when Quantity is specified.`);
        return;
      }
    }

    // Clean Samagri items payload with 1-indexed order
    const cleanSamagri = samagriItems
      .filter((item) => item.itemName.trim().length > 0)
      .map((item, idx) => ({
        name: item.itemName.trim(),
        itemName: item.itemName.trim(),
        quantity: item.quantity.trim(),
        unit: item.unit.trim(),
        order: idx + 1,
      }));

    // Clean How To Use steps payload with 1-indexed order
    const cleanHowToUseSteps = howToUseSteps
      .filter((s) => s.text.trim().length > 0)
      .map((s, idx) => ({
        text: s.text.trim(),
        order: idx + 1,
      }));

    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        category: category.trim(),
        price: parseInt(price, 10),
        stock: parseInt(stock || '0', 10),
        status: productStatus,
        featuredImage,
        images,
        samagriItems: cleanSamagri,

        significanceLabel: significanceLabel.trim(),
        significanceHeading: significanceHeading.trim(),
        significanceDescription: significanceDescription.trim(),

        whatsInsideLabel: whatsInsideLabel.trim(),
        whatsInsideHeading: whatsInsideHeading.trim(),
        whatsInsideDescription: whatsInsideDescription.trim(),

        howToUseLabel: howToUseLabel.trim(),
        howToUseHeading: howToUseHeading.trim(),
        howToUseSteps: cleanHowToUseSteps,

        supportingText: supportingText.trim(),

        dispatchInfo: dispatchInfo.trim(),
        expectedDelivery: expectedDelivery.trim(),
        serviceableAreas: serviceableAreas.trim(),
        courierInfo: courierInfo.trim(),

        cancellationInfo: cancellationInfo.trim(),
        cancellationPolicyText: cancellationPolicyText.trim(),
        cancellationPolicyUrl: cancellationPolicyUrl.trim(),

        returnsInfo: returnsInfo.trim(),
        returnsPolicyText: returnsPolicyText.trim(),
        returnsPolicyUrl: returnsPolicyUrl.trim(),

        damageInTransitInfo: damageInTransitInfo.trim(),
        damageClaimText: damageClaimText.trim(),
        damageClaimUrl: damageClaimUrl.trim(),
      };

      const apiUrl = editId ? `/api/admin/products/${editId}` : '/api/admin/products';
      const apiMethod = editId ? 'PUT' : 'POST';

      const res = await fetch(apiUrl, {
        method: apiMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(editId ? 'Product updated successfully!' : 'Product created successfully!');
        setTimeout(() => {
          router.push('/admin/products');
        }, 1200);
      } else {
        setErrorMsg(data.error || 'Failed to save product.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Server error occurred while saving product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1080px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '12px' }}>
          DASHBOARD &gt; PRODUCTS &gt; {editId ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
        </div>

        {/* Title Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/admin/products" style={{ color: '#4B5563', textDecoration: 'none', fontSize: '18px', fontWeight: 700 }}>
              ←
            </Link>
            <div>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: 0 }}>
                {editId ? 'Edit Product' : 'Add Product'}
              </h1>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0' }}>
                Configure product details, pricing, inventory, images, samagri breakdown, significance guide, and delivery policies.
              </p>
            </div>
          </div>
        </div>

        {/* Alert Notifications */}
        {errorMsg && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, marginBottom: '24px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, marginBottom: '24px' }}>
            ✓ {successMsg}
          </div>
        )}

        {/* MAIN FORM CONTAINER */}
        <form onSubmit={handleSubmit}>
          {/* SECTION 1: BASIC PRODUCT INFORMATION */}
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, margin: '0 0 18px', color: '#111827', borderBottom: '1px solid #F3F4F6', paddingBottom: '10px' }}>
              1. Basic Product Information
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                  PRODUCT NAME *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Shakti"
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                  SLUG (UNIQUE ID) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. shakti-kit"
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                PRODUCT CATEGORY *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', background: '#FFFFFF', fontWeight: 600, color: '#111827' }}
              >
                <option value="BY_FESTIVAL">By Festival</option>
                <option value="BY_RITUAL">By Ritual</option>
                <option value="GRIHA_LIFE_EVENTS">Griha &amp; Life Events</option>
                <option value="DAILY_PUJA_ESSENTIALS">Daily Puja Essentials</option>
              </select>
            </div>


            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                PRODUCT DESCRIPTION
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter complete product details and ritual usage context..."
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* SECTION 2: PRICING & INVENTORY */}
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, margin: '0 0 18px', color: '#111827', paddingBottom: '10px', borderBottom: '1px solid #F3F4F6' }}>
              2. Pricing &amp; Inventory
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                  SELLING PRICE (₹ INR) *
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#6B7280', fontSize: '14px', fontWeight: 700 }}>₹</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1751"
                    style={{ width: '100%', padding: '11px 14px 11px 28px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '4px' }}>Store numeric value without currency symbol</div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                  STOCK QUANTITY *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
                  STATUS
                </label>
                <select
                  value={productStatus}
                  onChange={(e) => setProductStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                  style={{ width: '100%', padding: '11px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '13px', background: '#FFFFFF', boxSizing: 'border-box' }}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: PRODUCT IMAGES & FEATURED IMAGE SELECTION */}
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>
              3. Product Images
            </h2>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 18px' }}>
              Upload multiple product images and select <strong>EXACTLY ONE</strong> as the Featured Image.
            </p>

            {/* Upload Controls */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
              <label
                style={{
                  background: '#DE1B59',
                  color: '#FFFFFF',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>📁 Upload Image Files</span>
                <input type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>

              <div style={{ flex: 1, display: 'flex', gap: '8px', minWidth: '280px' }}>
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Or paste image URL (e.g. https://example.com/shakti-1.jpg)"
                  style={{ flex: 1, padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '12.5px' }}
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  style={{ background: '#F3F4F6', color: '#374151', border: '1px solid #D1D5DB', padding: '9px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add URL
                </button>
              </div>
            </div>

            {/* Image Previews Grid */}
            {images.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {images.map((imgUrl, idx) => {
                  const isFeatured = featuredImage === imgUrl;

                  return (
                    <div
                      key={idx}
                      style={{
                        border: isFeatured ? '2px solid #059669' : '1px solid #E5E7EB',
                        borderRadius: '14px',
                        padding: '10px',
                        background: isFeatured ? '#ECFDF5' : '#FAF9F6',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxShadow: isFeatured ? '0 4px 12px rgba(5, 150, 105, 0.15)' : 'none',
                      }}
                    >
                      <div style={{ width: '100%', height: '140px', borderRadius: '10px', overflow: 'hidden', background: '#E5E7EB', marginBottom: '10px', position: 'relative' }}>
                        <img src={imgUrl} alt={`Product Image ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        
                        {isFeatured && (
                          <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#059669', color: '#FFFFFF', fontSize: '9.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
                            ★ FEATURED
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                        {isFeatured ? (
                          <div
                            style={{
                              background: '#059669',
                              color: '#FFFFFF',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 700,
                              textAlign: 'center',
                            }}
                          >
                            ✓ Featured Image
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetFeaturedImage(imgUrl)}
                            style={{
                              background: '#FFFFFF',
                              color: '#374151',
                              border: '1px solid #D1D5DB',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Set as Featured
                          </button>
                        )}

                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between', marginTop: '2px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, 'up')}
                              style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                              title="Move Left"
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              disabled={idx === images.length - 1}
                              onClick={() => handleMoveImage(idx, 'down')}
                              style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', cursor: idx === images.length - 1 ? 'not-allowed' : 'pointer' }}
                              title="Move Right"
                            >
                              →
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ border: '2px dashed #E5E7EB', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>
                No product images added yet. Click "Upload Image Files" or paste image URLs above.
              </div>
            )}
          </div>

          {/* SECTION 4: SAMAGRI / WHAT'S INSIDE */}
          <div style={{ background: '#FFFDF9', border: '1px solid #F5E6D3', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, margin: 0, color: '#111827' }}>
                  WHAT'S INSIDE / SAMAGRI
                </h2>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>
                  Add individual Samagri items included in this kit. The serial index (#1, #2, #3...) is automatically assigned based on item order.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSamagriRow}
                style={{
                  background: '#DE1B59',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(222, 27, 89, 0.2)',
                }}
              >
                + Add Item
              </button>
            </div>

            {samagriItems.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr 40px', gap: '12px', fontSize: '10.5px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', textTransform: 'uppercase', padding: '0 4px' }}>
                  <div>#</div>
                  <div>ITEM NAME</div>
                  <div>QUANTITY</div>
                  <div>UNIT</div>
                  <div></div>
                </div>

                {samagriItems.map((item, idx) => (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr 40px', gap: '12px', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textAlign: 'center' }}>
                      #{idx + 1}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Kumkum"
                      value={item.itemName}
                      onChange={(e) => handleUpdateSamagriRow(idx, 'itemName', e.target.value)}
                      style={{ padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', background: '#FFFFFF' }}
                    />
                    <input
                      type="text"
                      placeholder="e.g. 25"
                      value={item.quantity}
                      onChange={(e) => handleUpdateSamagriRow(idx, 'quantity', e.target.value)}
                      style={{ padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', background: '#FFFFFF' }}
                    />
                    <input
                      type="text"
                      placeholder="e.g. gm, ml, pcs"
                      value={item.unit}
                      onChange={(e) => handleUpdateSamagriRow(idx, 'unit', e.target.value)}
                      style={{ padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', background: '#FFFFFF' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSamagriRow(idx)}
                      style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '8px', height: '36px', width: '36px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Remove Item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF', fontSize: '13px' }}>
                No Samagri items added. Click "+ Add Item" above to add items.
              </div>
            )}
          </div>

          {/* SECTION 5: SIGNIFICANCE & HOW TO USE */}
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, margin: '0 0 18px', color: '#111827', borderBottom: '1px solid #F3F4F6', paddingBottom: '10px' }}>
              5. Significance &amp; How to Use Guide
            </h2>

            {/* SUBSECTION 1: SIGNIFICANCE */}
            <div style={{ background: '#FAF9F6', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                SECTION 1 — SIGNIFICANCE
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '4px', textTransform: 'uppercase' }}>
                    SIGNIFICANCE LABEL / EYEBROW
                  </label>
                  <input
                    type="text"
                    value={significanceLabel}
                    onChange={(e) => setSignificanceLabel(e.target.value)}
                    placeholder="e.g. SIGNIFICANCE"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '4px', textTransform: 'uppercase' }}>
                    SIGNIFICANCE HEADING
                  </label>
                  <input
                    type="text"
                    value={significanceHeading}
                    onChange={(e) => setSignificanceHeading(e.target.value)}
                    placeholder="e.g. The samagri is the vidhi, held as objects"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '4px', textTransform: 'uppercase' }}>
                  SIGNIFICANCE DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={significanceDescription}
                  onChange={(e) => setSignificanceDescription(e.target.value)}
                  placeholder="Enter detailed description of ritual significance..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
            </div>

            {/* SUBSECTION 2: WHAT'S INSIDE SUMMARY */}
            <div style={{ background: '#FAF9F6', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                SECTION 2 — WHAT IS INSIDE SUMMARY
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '4px', textTransform: 'uppercase' }}>
                    WHAT'S INSIDE LABEL / EYEBROW
                  </label>
                  <input
                    type="text"
                    value={whatsInsideLabel}
                    onChange={(e) => setWhatsInsideLabel(e.target.value)}
                    placeholder="e.g. WHAT IS INSIDE"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '4px', textTransform: 'uppercase' }}>
                    WHAT'S INSIDE HEADING
                  </label>
                  <input
                    type="text"
                    value={whatsInsideHeading}
                    onChange={(e) => setWhatsInsideHeading(e.target.value)}
                    placeholder="e.g. Thirty-eight items, weighed and sealed separately"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '4px', textTransform: 'uppercase' }}>
                  WHAT'S INSIDE DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={whatsInsideDescription}
                  onChange={(e) => setWhatsInsideDescription(e.target.value)}
                  placeholder="Enter summary context of items included..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
            </div>

            {/* SUBSECTION 3: HOW TO USE */}
            <div style={{ background: '#FAF9F6', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  SECTION 3 — HOW TO USE
                </div>
                <button
                  type="button"
                  onClick={handleAddStepRow}
                  style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add Step
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '4px', textTransform: 'uppercase' }}>
                    HOW TO USE LABEL / EYEBROW
                  </label>
                  <input
                    type="text"
                    value={howToUseLabel}
                    onChange={(e) => setHowToUseLabel(e.target.value)}
                    placeholder="e.g. HOW TO USE"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '4px', textTransform: 'uppercase' }}>
                    HOW TO USE HEADING
                  </label>
                  <input
                    type="text"
                    value={howToUseHeading}
                    onChange={(e) => setHowToUseHeading(e.target.value)}
                    placeholder="e.g. Lay it out before you begin, not during"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* DYNAMIC HOW TO USE STEPS */}
              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '8px', textTransform: 'uppercase' }}>
                  HOW TO USE STEPS LIST
                </label>

                {howToUseSteps.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {howToUseSteps.map((step, idx) => (
                      <div key={step.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 40px', gap: '10px', alignItems: 'center' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textAlign: 'center' }}>
                          #{idx + 1}
                        </div>
                        <input
                          type="text"
                          placeholder={`Step instruction #${idx + 1}...`}
                          value={step.text}
                          onChange={(e) => handleUpdateStepRow(idx, e.target.value)}
                          style={{ padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', background: '#FFFFFF' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveStepRow(idx)}
                          style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '8px', height: '36px', width: '36px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Remove Step"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px', color: '#9CA3AF', fontSize: '12px', background: '#FFFFFF', borderRadius: '8px', border: '1px dashed #E5E7EB' }}>
                    No steps added. Click "+ Add Step" above.
                  </div>
                )}
              </div>
            </div>

            {/* SUBSECTION 4: SUPPORTING / DOWNLOAD TEXT */}
            <div style={{ background: '#FAF9F6', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                SECTION 4 — SUPPORTING / DOWNLOAD TEXT
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '4px', textTransform: 'uppercase' }}>
                  SUPPORTING / DOWNLOAD TEXT
                </label>
                <input
                  type="text"
                  value={supportingText}
                  onChange={(e) => setSupportingText(e.target.value)}
                  placeholder="e.g. Included in the box · also downloadable"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 6: DELIVERY & POLICIES */}
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '20px', padding: '28px', marginBottom: '28px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, margin: '0 0 18px', color: '#111827', borderBottom: '1px solid #F3F4F6', paddingBottom: '10px' }}>
              6. Delivery &amp; Policies
            </h2>

            {/* SUBSECTION 1: DELIVERY */}
            <div style={{ background: '#FAF9F6', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
                SECTION 1 — DELIVERY
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '4px', textTransform: 'uppercase' }}>
                    DISPATCH
                  </label>
                  <textarea
                    rows={2}
                    value={dispatchInfo}
                    onChange={(e) => setDispatchInfo(e.target.value)}
                    placeholder="e.g. Within 1 day from order confirmation"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '4px', textTransform: 'uppercase' }}>
                    EXPECTED DELIVERY
                  </label>
                  <input
                    type="text"
                    value={expectedDelivery}
                    onChange={(e) => setExpectedDelivery(e.target.value)}
                    placeholder="e.g. 2–3 days"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '4px', textTransform: 'uppercase' }}>
                    SERVICEABLE AREAS
                  </label>
                  <input
                    type="text"
                    value={serviceableAreas}
                    onChange={(e) => setServiceableAreas(e.target.value)}
                    placeholder="e.g. All major pincodes across India"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4B5563', marginBottom: '4px', textTransform: 'uppercase' }}>
                    COURIER
                  </label>
                  <textarea
                    rows={2}
                    value={courierInfo}
                    onChange={(e) => setCourierInfo(e.target.value)}
                    placeholder="e.g. Assigned at dispatch depending on location"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* SUBSECTION 2: CANCELLATION, RETURNS & DAMAGE */}
            <div style={{ background: '#FAF9F6', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
                SECTION 2 — CANCELLATION, RETURNS &amp; DAMAGE
              </div>

              {/* 1. CANCELLATION */}
              <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#111827', marginBottom: '6px', textTransform: 'uppercase' }}>
                  CANCELLATION
                </label>
                <textarea
                  rows={2}
                  value={cancellationInfo}
                  onChange={(e) => setCancellationInfo(e.target.value)}
                  placeholder="Enter cancellation policy details..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', marginBottom: '10px' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#6B7280', marginBottom: '3px' }}>POLICY LINK TEXT</label>
                    <input
                      type="text"
                      value={cancellationPolicyText}
                      onChange={(e) => setCancellationPolicyText(e.target.value)}
                      placeholder="e.g. Cancellation policy"
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#6B7280', marginBottom: '3px' }}>POLICY LINK / URL</label>
                    <input
                      type="text"
                      value={cancellationPolicyUrl}
                      onChange={(e) => setCancellationPolicyUrl(e.target.value)}
                      placeholder="e.g. /policies/cancellation"
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. RETURNS */}
              <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#111827', marginBottom: '6px', textTransform: 'uppercase' }}>
                  RETURNS
                </label>
                <textarea
                  rows={2}
                  value={returnsInfo}
                  onChange={(e) => setReturnsInfo(e.target.value)}
                  placeholder="Enter returns & refunds policy details..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', marginBottom: '10px' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#6B7280', marginBottom: '3px' }}>POLICY LINK TEXT</label>
                    <input
                      type="text"
                      value={returnsPolicyText}
                      onChange={(e) => setReturnsPolicyText(e.target.value)}
                      placeholder="e.g. Returns & refunds"
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#6B7280', marginBottom: '3px' }}>POLICY LINK / URL</label>
                    <input
                      type="text"
                      value={returnsPolicyUrl}
                      onChange={(e) => setReturnsPolicyUrl(e.target.value)}
                      placeholder="e.g. /policies/returns"
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* 3. DAMAGE IN TRANSIT */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#111827', marginBottom: '6px', textTransform: 'uppercase' }}>
                  DAMAGE IN TRANSIT
                </label>
                <textarea
                  rows={2}
                  value={damageInTransitInfo}
                  onChange={(e) => setDamageInTransitInfo(e.target.value)}
                  placeholder="Enter damage in transit policy details..."
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', marginBottom: '10px' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#6B7280', marginBottom: '3px' }}>CLAIM LINK TEXT</label>
                    <input
                      type="text"
                      value={damageClaimText}
                      onChange={(e) => setDamageClaimText(e.target.value)}
                      placeholder="e.g. Raise a claim"
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#6B7280', marginBottom: '3px' }}>CLAIM LINK / URL</label>
                    <input
                      type="text"
                      value={damageClaimUrl}
                      onChange={(e) => setDamageClaimUrl(e.target.value)}
                      placeholder="e.g. /contact?reason=damage"
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 7: FORM ACTIONS */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', paddingTop: '12px' }}>
            <Link
              href="/admin/products"
              style={{
                background: '#F3F4F6',
                color: '#374151',
                border: '1px solid #D1D5DB',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '13px',
              }}
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              style={{
                background: '#DE1B59',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.6 : 1,
                boxShadow: '0 4px 14px rgba(222, 27, 89, 0.25)',
              }}
            >
              {submitting ? (editId ? 'Updating Product...' : 'Saving Product...') : editId ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <SessionProvider>
      <React.Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#DE1B59', fontWeight: 600 }}>Loading Form...</div>}>
        <AddProductFormContent />
      </React.Suspense>
    </SessionProvider>
  );
}

