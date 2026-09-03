'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateProductJsonLd } from '@/lib/seo';
import { useCart } from '@/context/CartContext';
import '../../app/ritual-kits/ritual-kits.css';

interface SamagriItem {
  id?: string;
  itemName?: string;
  name?: string;
  quantity?: string;
  unit?: string;
  order?: number;
}

interface HowToUseStep {
  text: string;
  order?: number;
}

const DEFAULT_SHAKTI_SAMAGRI = [
  'Kumkum', 'Chandan', 'Akshat',
  'Mauli', 'Haldi', 'Roli',
  'Gangajal', 'Kapur', 'Dhoop',
  'Cotton Wicks', 'Samagri', 'Custom'
];

const EXTENDED_SAMAGRI = [
  'Raw Rice', 'Ganesh Idol', 'Navgrah', 'Supari', 'Clove', 'Honey',
  'Yellow Thread', 'Attar', 'Elaichi', 'Mishri', 'Pooja Thali', 'Gulal',
  'Kaala Til', 'Ashwagandha', 'Kalash', 'Janeu', 'Rawa Samagri', 'Chunri',
  'Red Cloth', 'Saptamrit', 'Sambrani Dhoop', 'Bhasma', 'Durga Saptashati', 'Mantra Sheet', 'Pure Ghee', 'Brass Diya'
];

export interface ProductDetailClientProps {
  product: any;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isExpandedSamagri, setIsExpandedSamagri] = useState(false);
  const [addedStatus, setAddedStatus] = useState<string | null>(null);

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8F5EE', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', border: '2px solid #DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#DC2626', marginBottom: '16px' }}>
          ⚠️
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 700, margin: '0 0 10px', color: '#111827' }}>
          Product Not Found
        </h2>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 24px', maxWidth: '420px', lineHeight: 1.5 }}>
          The product you are looking for does not exist or may have been updated.
        </p>
        <Link href="/ritual-kits" style={{ background: '#DE1B59', color: '#FFFFFF', padding: '11px 22px', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '13px' }}>
          ‹ Explore All Ritual Kits
        </Link>
      </div>
    );
  }

  const cleanName = (product?.name || '')
    .replace(/\s*\([^)]*copy[^)]*\)/gi, '')
    .replace(/\s*\(\s*\)/g, '')
    .trim() || product?.name || 'Shakti';

  // Process Images
  let galleryImages: string[] = [];
  if (product.imagesJson) {
    try {
      const parsed = JSON.parse(product.imagesJson);
      if (Array.isArray(parsed) && parsed.length > 0) galleryImages = parsed;
    } catch (e) { }
  }

  if (galleryImages.length === 0 && product.featuredImage) {
    galleryImages = [product.featuredImage];
  } else if (galleryImages.length === 0) {
    galleryImages = ['/images/placeholder-kit.jpg'];
  }

  const activeMainImage = galleryImages[selectedImgIndex] || galleryImages[0] || product.featuredImage || '/images/placeholder-kit.jpg';

  // Process Samagri Items
  let samagriList: SamagriItem[] = [];
  if (product.samagriItemsJson) {
    try {
      const parsed = JSON.parse(product.samagriItemsJson);
      if (Array.isArray(parsed) && parsed.length > 0) samagriList = parsed;
    } catch (e) { }
  }

  if (samagriList.length === 0) {
    const fullList = [...DEFAULT_SHAKTI_SAMAGRI, ...EXTENDED_SAMAGRI];
    samagriList = fullList.map((item, idx) => ({
      itemName: item,
      order: idx + 1,
    }));
  }

  const visibleSamagri = isExpandedSamagri ? samagriList : samagriList.slice(0, 12);
  const remainingCount = samagriList.length - 12;

  // Process How To Use Steps
  let howToUseSteps: HowToUseStep[] = [];
  if (product.howToUseStepsJson) {
    try {
      const parsed = JSON.parse(product.howToUseStepsJson);
      if (Array.isArray(parsed) && parsed.length > 0) howToUseSteps = parsed;
    } catch (e) { }
  }

  if (howToUseSteps.length === 0) {
    howToUseSteps = [
      { text: 'Unpack the box and arrange as listed in insert.' },
      { text: 'Light the pure ghee diya and initiate the sthapana vidhi.' },
      { text: 'Recite Durga Saptashati text following enclosed guide.' },
      { text: 'Use the seven-day mantra insert during morning japa.' },
      { text: 'Keep water container covered during reading.' },
      { text: 'Perform evening aarti with kapur.' }
    ];
  }

  const handleAddToCart = (actionType: 'prebook' | 'add') => {
    addItem({
      id: product.id || product.slug,
      slug: product.slug,
      name: cleanName,
      price: product.price,
      image: activeMainImage || product.featuredImage,
      cutoff: 'ORDER BY 8 OCT · DISPATCHES IN 24 HOURS',
      quantity,
    });

    const statusMsg = actionType === 'prebook' ? '✓ Pre-booked' : '✓ Added to cart';
    setAddedStatus(statusMsg);
    setTimeout(() => {
      setAddedStatus(null);
    }, 2500);
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id || product.slug,
      slug: product.slug,
      name: cleanName,
      price: product.price,
      image: activeMainImage || product.featuredImage,
      cutoff: 'ORDER BY 8 OCT · DISPATCHES IN 24 HOURS',
      quantity,
    });
    router.push('/checkout');
  };

  const handlePincodeCheck = () => {
    if (!pincode || pincode.trim().length < 6) {
      setPincodeStatus('Please enter a valid 6-digit pincode.');
      return;
    }
    setPincodeStatus(`✓ Delivery available for ${pincode.trim()} (Standard: 2–3 days)`);
  };

  return (
    <div style={{ background: '#F8F5EE', color: '#2C2010', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <JsonLd data={generateProductJsonLd(product)} />
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Ritual Pujans', href: '/ritual-kits' },
        { label: product.category || 'Devi', href: '/ritual-kits' },
        { label: cleanName }
      ]} />

      <div className=" w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-10 overflow-x-hidden">
        {/* TOP HERO SECTION */}
        <div id="ProductDeatil" className=" grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-10 mb-10 md:mb-12 items-start">
          {/* LEFT GALLERY */}
          <div>
            <div className="bg-[#FAF6F0] border border-[#E5E0D8] rounded-[16px] overflow-hidden h-[360px] sm:h-[440px] md:h-[480px] flex items-center justify-center p-2 shadow-sm transition-all duration-300">
              <img
                src={activeMainImage}
                alt={cleanName}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            {galleryImages.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                {galleryImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: selectedImgIndex === idx ? '2px solid #DE1B59' : '1px solid #E5E0D8',
                      cursor: 'pointer',
                      background: '#FAF6F0',
                      boxShadow: selectedImgIndex === idx ? '0 2px 10px rgba(222, 27, 89, 0.2)' : 'none',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PRODUCT INFO */}
          <div  >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '4px' }}>
              NAVRATRI PUJAN · SEASON 1
            </div>

            <div style={{ color: '#DE1B59', fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 600, marginBottom: '2px' }}>
              {product.devanagariName || 'शक्ति'}
            </div>

            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '38px', fontWeight: 700, margin: '0 0 14px', color: '#111827', lineHeight: 1.15 }}>
              {cleanName}
            </h1>

            <p style={{ fontSize: '13.5px', color: '#5A4D3E', lineHeight: 1.6, marginBottom: '22px' }}>
              {product.description || 'Thirty-eight items for Navratri Pujan, weighed and sealed separately, with a Durga Saptashati booklet from Geeta Press and a seven-day mantra insert. Assembled so the vidhi can be followed without a second trip to the market.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '18px' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 700, color: '#111827' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '11px', color: '#8A7A68', letterSpacing: '0.5px' }}>
                INCLUSIVE OF ALL TAXES
              </span>
            </div>

            <div style={{ background: '#FFF9E6', border: '1px solid #FFE699', borderRadius: '8px', padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#8A6B00', marginBottom: '22px' }}>
              <span>⏱</span> ORDER BY 8 OCT · DISPATCHES IN 24 HOURS
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D1C7B7', borderRadius: '8px', overflow: 'hidden', background: '#FFFFFF' }}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ padding: '6px 14px', border: 'none', background: '#F8F5EE', cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: '#2C2010' }}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span style={{ padding: '6px 14px', fontSize: '13px', fontWeight: 700, color: '#111827', minWidth: '28px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{ padding: '6px 14px', border: 'none', background: '#F8F5EE', cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: '#2C2010' }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => handleAddToCart('prebook')}
                style={{
                  width: '100%',
                  background: '#DE1B59',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '15px 24px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(222, 27, 89, 0.25)',
                  transition: 'all 0.2s ease',
                }}
              >
                {addedStatus && addedStatus.includes('Pre-booked')
                  ? addedStatus
                  : `Add to cart — ₹${(product.price * quantity).toLocaleString('en-IN')}`}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  color: '#2C2010',
                  border: '1px solid #D1C7B7',
                  padding: '13px 24px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Buy now
              </button>
            </div>

            <div style={{ fontSize: '11.5px', color: '#8A7A68', marginBottom: '20px' }}>
              Prepaid order · Free cancellation until dispatch
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Enter pincode for delivery date"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                style={{ flex: 1, border: '1px solid #D1C7B7', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', background: '#FFFFFF' }}
              />
              <button
                type="button"
                onClick={handlePincodeCheck}
                style={{ background: '#FFFFFF', color: '#DE1B59', border: '1px solid #DE1B59', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, fontSize: '12.5px', cursor: 'pointer' }}
              >
                Check
              </button>
            </div>
            {pincodeStatus && (
              <p style={{ fontSize: '12px', color: pincodeStatus.startsWith('✓') ? '#27500A' : '#DC2626', marginTop: '8px' }}>
                {pincodeStatus}
              </p>
            )}
          </div>
        </div>

        {/* SAMAGRI CONTAINER */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E0D0', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px' }}>
          <div style={{ background: '#2C2010', color: '#FFFFFF', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              WHAT IS INSIDE THE BOX · {cleanName.toUpperCase()}
            </span>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#E8D2A0' }}>
              {product.devanagariName || 'शक्ति'}
            </span>
          </div>

          <div style={{ background: '#F5EFE6', padding: '12px 24px', borderBottom: '1px solid #E8E0D0', fontSize: '13px', fontWeight: 700, color: '#2C2010' }}>
            {samagriList.length} ITEMS
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {visibleSamagri.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#2C2010' }}>
                <span style={{ fontWeight: 700, color: '#8A7A68', minWidth: '22px' }}>
                  {idx + 1}
                </span>
                <span style={{ fontWeight: 500 }}>
                  {item.itemName || item.name}
                </span>
                {(item.quantity || item.unit) && (
                  <span style={{ fontSize: '11px', color: '#8A7A68', marginLeft: 'auto' }}>
                    {item.quantity} {item.unit}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={{ background: '#FAF6F0', borderTop: '1px solid #E8E0D0', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: '#8A7A68' }}>
            <span>{isExpandedSamagri ? `All ${samagriList.length} items shown` : `${remainingCount > 0 ? `${remainingCount} more items` : `Showing 12 of ${samagriList.length} items`}`}</span>
            <button
              type="button"
              onClick={() => setIsExpandedSamagri(!isExpandedSamagri)}
              style={{ background: '#FFFFFF', border: '1px solid #DE1B59', color: '#DE1B59', padding: '6px 14px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}
            >
              {isExpandedSamagri ? 'Show less ^' : `Show all ${samagriList.length} items v`}
            </button>
          </div>
        </div>

        {/* SIGNIFICANCE & HOW TO USE SIDE-BY-SIDE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* SIGNIFICANCE CARD */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E8E0D0', borderRadius: '16px', padding: '28px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.8px', marginBottom: '6px' }}>
              {product.significanceLabel || 'SIGNIFICANCE'}
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 10px', color: '#111827' }}>
              {product.significanceHeading || 'The samagri is the vidhi, held as objects'}
            </h3>
            <p style={{ fontSize: '13px', color: '#5A4D3E', lineHeight: 1.6, marginBottom: '24px' }}>
              {product.significanceDescription || 'Thirty-eight items for Navratri Pujan, weighed and sealed separately, with a Durga Saptashati booklet from Geeta Press, and a seven-day mantra insert. Assembled so the vidhi can be followed without a second trip to the market.'}
            </p>

            <div style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.8px', marginBottom: '6px' }}>
              {product.whatsInsideLabel || 'WHAT IS INSIDE'}
            </div>
            <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, margin: '0 0 10px', color: '#111827' }}>
              {product.whatsInsideHeading || 'Thirty-eight items, weighed and sealed separately'}
            </h4>
            <p style={{ fontSize: '13px', color: '#5A4D3E', lineHeight: 1.6, margin: 0 }}>
              {product.whatsInsideDescription || 'Thirty-eight items, weighed and sealed separately, with a Durga Saptashati booklet from Geeta Press, and a seven-day mantra insert.'}
            </p>
          </div>

          {/* HOW TO USE CARD */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E8E0D0', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.8px', marginBottom: '6px' }}>
                {product.howToUseLabel || 'HOW TO USE'}
              </div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 18px', color: '#111827' }}>
                {product.howToUseHeading || 'Lay it out before you begin, not during'}
              </h3>

              {/* PROCEDURE BOX */}
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E8E0D0', marginBottom: '18px' }}>
                <div style={{ background: '#2C2010', color: '#FFFFFF', padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 700, letterSpacing: '0.6px' }}>
                  <span>DHARMIC PROCEDURE · NAVRATRI PUJAN</span>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px', color: '#E8D2A0' }}>{product.devanagariName || 'शक्ति'}</span>
                </div>

                <div style={{ background: '#FAF6F0', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {howToUseSteps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '12.5px', color: '#2C2010', lineHeight: 1.5 }}>
                      <span style={{ color: '#DE1B59', fontWeight: 700 }}>{idx + 1}.</span>
                      <span>{step.text}</span>
                    </div>
                  ))}

                  <div style={{ borderTop: '1px dashed #E5E0D8', paddingTop: '10px', marginTop: '4px', fontSize: '11.5px', color: '#8A7A68' }}>
                    * Accessible here if you want to read text ahead. <a href="/ritual-guides/sharad-navratri" style={{ color: '#DE1B59', fontWeight: 700, textDecoration: 'none' }}>Download PDF ›</a>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '12.5px', color: '#5A4D3E', lineHeight: 1.5, marginBottom: '16px' }}>
                This is in the box, and accessible here if you want to read the text ahead — so you're not flipping through pages during the pujan.
              </p>
            </div>

            <Link
              href="/ritual-guides/sharad-navratri"
              style={{
                width: '100%',
                background: '#DE1B59',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              Read the guide ›
            </Link>
          </div>
        </div>

        {/* DISPATCH, DELIVERY & POLICIES */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E0D0', borderRadius: '16px', padding: '24px 28px', marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.8px', marginBottom: '16px' }}>
            DISPATCH, DELIVERY &amp; POLICIES
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] pb-2.5 border-b border-[#F3F4F6] gap-1">
              <span style={{ fontWeight: 700, color: '#2C2010' }}>Dispatch</span>
              <span style={{ color: '#5A4D3E' }}>{product.dispatchInfo || 'Within 1 day from order confirmation'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] pb-2.5 border-b border-[#F3F4F6] gap-1">
              <span style={{ fontWeight: 700, color: '#2C2010' }}>Expected Delivery</span>
              <span style={{ color: '#5A4D3E' }}>{product.expectedDelivery || '2–3 days'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] pb-2.5 border-b border-[#F3F4F6] gap-1">
              <span style={{ fontWeight: 700, color: '#2C2010' }}>Serviceable Areas</span>
              <span style={{ color: '#5A4D3E' }}>{product.serviceableAreas || 'Enter your pincode above to check'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1">
              <span style={{ fontWeight: 700, color: '#2C2010' }}>Courier</span>
              <span style={{ color: '#5A4D3E' }}>{product.courierInfo || 'Assigned at dispatch · Tracking link sent by SMS and email'}</span>
            </div>
          </div>
        </div>

        {/* CANCELLATION, RETURNS & DAMAGE */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E0D0', borderRadius: '16px', padding: '24px 28px', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.8px', marginBottom: '16px' }}>
            CANCELLATION, RETURNS &amp; DAMAGE
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] pb-2.5 border-b border-[#F3F4F6] gap-1">
              <span style={{ fontWeight: 700, color: '#2C2010' }}>Cancellation</span>
              <span style={{ color: '#5A4D3E' }}>
                {product.cancellationInfo || 'Within 24 hours of order placement'} · <a href={product.cancellationPolicyUrl || '#'} style={{ color: '#DE1B59', fontWeight: 600, textDecoration: 'none' }}>Cancellation policy ›</a>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] pb-2.5 border-b border-[#F3F4F6] gap-1">
              <span style={{ fontWeight: 700, color: '#2C2010' }}>Returns</span>
              <span style={{ color: '#5A4D3E' }}>
                {product.returnsInfo || 'Non-returnable item once opened'} · <a href={product.returnsPolicyUrl || '#'} style={{ color: '#DE1B59', fontWeight: 600, textDecoration: 'none' }}>Returns &amp; refunds ›</a>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1">
              <span style={{ fontWeight: 700, color: '#2C2010' }}>Damage in Transit</span>
              <span style={{ color: '#5A4D3E' }}>
                {product.damageInTransitInfo || 'Immediate replacement sent with photo/video of damaged box'} · <a href={product.damageClaimUrl || '#'} style={{ color: '#DE1B59', fontWeight: 600, textDecoration: 'none' }}>Raise a claim ›</a>
              </span>
            </div>
          </div>
        </div>

        {/* OTHER RITUAL KITS YOU MIGHT LIKE */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.8px', marginBottom: '16px', textTransform: 'uppercase' }}>
            OTHER RITUAL KITS YOU MIGHT LIKE
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Shubh Sampada */}
            <Link href="/product/shubh-sampada" className="c">
              <div className="c-top h-shiva" style={{ background: '#FAF6F0', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid #E8E0D0' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: '#D8CBB5', opacity: 0.6, userSelect: 'none' }}>
                  शुभ सम्पदा
                </span>
              </div>
              <div className="c-b">
                <div className="c-t">Shubh Sampada</div>
                <div className="c-d">Ganesh Pujan</div>
                <div className="pill pr" style={{ alignSelf: 'flex-start' }}>₹950</div>
              </div>
            </Link>

            {/* Card 2: Satyanarayan */}
            <Link href="/product/satyanarayan" className="c">
              <div className="c-top h-vishnu" style={{ background: '#FAF6F0', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid #E8E0D0' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: '#D8CBB5', opacity: 0.6, userSelect: 'none' }}>
                  सत्यनारायण
                </span>
              </div>
              <div className="c-b">
                <div className="c-t">Satyanarayan</div>
                <div className="c-d">Satyanarayan Puja</div>
                <div className="pill pr" style={{ alignSelf: 'flex-start' }}>₹950</div>
              </div>
            </Link>

            {/* Card 3: Sundarkand */}
            <Link href="/product/sundarkand" className="c">
              <div className="c-top h-earth" style={{ background: '#FAF6F0', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid #E8E0D0' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: '#D8CBB5', opacity: 0.6, userSelect: 'none' }}>
                  सुन्दरकाण्ड
                </span>
              </div>
              <div className="c-b">
                <div className="c-t">Sundarkand</div>
                <div className="c-d">Hanuman Pujan</div>
                <div className="pill pr" style={{ alignSelf: 'flex-start' }}>₹950</div>
              </div>
            </Link>

            {/* Card 4: Shubh Deepavali */}
            <Link href="/product/shubh-deepavali" className="c">
              <div style={{ background: '#FAF6F0', height: '140px', overflow: 'hidden', position: 'relative', borderBottom: '1px solid #E8E0D0' }}>
                <img
                  src={activeMainImage}
                  alt="Shubh Deepavali"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="c-b">
                <div className="c-t">Shubh Deepavali</div>
                <div className="c-d">Laxmi Ganesh Puja</div>
                <div className="pill pr" style={{ alignSelf: 'flex-start' }}>₹1,751</div>
              </div>
            </Link>
          </div>
        </div>

        {/* RELATED GUIDES & CONCEPTS */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.8px', marginBottom: '16px', textTransform: 'uppercase' }}>
            RELATED GUIDES &amp; CONCEPTS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Durga */}
            <Link href="/ritual-guides/sharad-navratri" style={{ background: '#FFFFFF', border: '1px solid #E8E0D0', borderRadius: '16px', overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#7C2D3B', padding: '24px', minHeight: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '38px', color: '#FAF6F0' }}>दुर्गा</span>
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.6px', marginBottom: '4px' }}>
                    RITUAL GUIDES · NAVRATRI PUJAN
                  </div>
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: '#111827' }}>
                    Sharad Navratri
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#5A4D3E', lineHeight: 1.5, margin: '0 0 16px' }}>
                    Nine nights, nine forms, one Mother. Silence the room to understand the system.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '10.5px', fontWeight: 700 }}>
                  <span style={{ background: '#E6F1E6', color: '#27500A', padding: '3px 8px', borderRadius: '5px', border: '1px solid #C9DFC9' }}>READ GUIDE (4/5)</span>
                  <span style={{ background: '#F8F5EE', color: '#8A7A68', padding: '3px 8px', borderRadius: '5px', border: '1px solid #E8E0D0' }}>14 MIN</span>
                </div>
              </div>
            </Link>

            {/* Card 2: Laxmi */}
            <Link href="/ritual-guides/laxmi-puja" style={{ background: '#FFFFFF', border: '1px solid #E8E0D0', borderRadius: '16px', overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#7C2D3B', padding: '24px', minHeight: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '38px', color: '#FAF6F0' }}>लक्ष्मी</span>
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.6px', marginBottom: '4px' }}>
                    RITUAL GUIDES · DEEPAVALI PUJAN
                  </div>
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: '#111827' }}>
                    Purva Phalguni
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#5A4D3E', lineHeight: 1.5, margin: '0 0 16px' }}>
                    The sign of divine fortune and grace, and how to harness it.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '10.5px', fontWeight: 700 }}>
                  <span style={{ background: '#E6F1E6', color: '#27500A', padding: '3px 8px', borderRadius: '5px', border: '1px solid #C9DFC9' }}>READ GUIDE (5/5)</span>
                  <span style={{ background: '#F8F5EE', color: '#8A7A68', padding: '3px 8px', borderRadius: '5px', border: '1px solid #E8E0D0' }}>11 MIN</span>
                </div>
              </div>
            </Link>

            {/* Card 3: Sankalpa */}
            <Link href="/dharmic-concepts/sankalpa" style={{ background: '#FFFFFF', border: '1px solid #E8E0D0', borderRadius: '16px', overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#3E2C1C', padding: '24px', minHeight: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '38px', color: '#FAF6F0' }}>संकल्प</span>
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#DE1B59', letterSpacing: '0.6px', marginBottom: '4px' }}>
                    DHARMIC CONCEPTS · MEANING &amp; PRACTICE
                  </div>
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: '#111827' }}>
                    Sankalpa
                  </h4>
                  <p style={{ fontSize: '12.5px', color: '#5A4D3E', lineHeight: 1.5, margin: '0 0 16px' }}>
                    The declaration of intent: what it is, how to speak it, and what happens if you break your vow.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '10.5px', fontWeight: 700 }}>
                  <span style={{ background: '#E6F1E6', color: '#27500A', padding: '3px 8px', borderRadius: '5px', border: '1px solid #C9DFC9' }}>READ CONCEPT (4/5)</span>
                  <span style={{ background: '#F8F5EE', color: '#8A7A68', padding: '3px 8px', borderRadius: '5px', border: '1px solid #E8E0D0' }}>8 MIN</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* EDITORIAL BANNER AT BOTTOM */}
        <div style={{ background: '#1A1208', color: '#FFFFFF', borderRadius: '20px', padding: '40px 32px', textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 700, margin: '0 0 12px', color: '#FFFFFF' }}>
            Not fear. <span style={{ color: '#DE1B59' }}>Only devotion.</span>
          </h2>
          <p style={{ fontSize: '13.5px', color: '#D8CBB5', maxWidth: '580px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Every ritual guide and kit is compiled from authentic source texts, translated for clarity, and designed for home practice.
          </p>
          <Link
            href="/editorial-method"
            style={{
              background: '#DE1B59',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Read about our editorial method ›
          </Link>
        </div>
      </div>
    </div>
  );
}
