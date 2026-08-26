'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_KITS } from '@/lib/mock-data';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function RitualKitDetailPage({ params }: PageProps) {
  const { slug } = params;
  const kit = MOCK_KITS.find(
    (k) => k.id === slug || k.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  ) || MOCK_KITS[0];

  return (
    <div className="wrap stage" style={{ padding: '40px 0 80px' }}>
      <div className="bcrumb" style={{ marginBottom: '24px' }}>
        <Link href="/">Home</Link> › <Link href="/ritual-kits">Ritual Kits</Link> › <b>{kit.name}</b>
      </div>
      <div className="sec-ey">{kit.isPrebook ? 'PRE-BOOKING OPEN' : 'AVAILABLE NOW'}</div>
      <h1 className="sec-t" style={{ fontSize: '36px', marginBottom: '12px' }}>
        {kit.name}
      </h1>
      <p className="sec-s" style={{ marginBottom: '24px' }}>
        {kit.occasion} · {kit.cutoffDate}
      </p>

      <div className="kcard lead" style={{ maxWidth: '640px' }}>
        <div className={`k-top ${kit.themeClass}`}>
          <span className={`k-badge ${kit.isPrebook ? 'pre' : ''}`}>
            {kit.isPrebook ? 'PRE-BOOKING' : 'ALL-YEAR'}
          </span>
          <span className="k-cut">{kit.cutoffDate}</span>
        </div>
        <div className="k-b">
          <div className="k-n">{kit.name}</div>
          <div className="k-for">{kit.occasion}</div>
          <div className="k-inc">{kit.includes}</div>
          <div className="k-row" style={{ margin: '20px 0' }}>
            <span className="k-p" style={{ fontSize: '28px' }}>₹{kit.price.toLocaleString('en-IN')}</span>
            {kit.priceNote && <span className="k-pn">· {kit.priceNote}</span>}
          </div>
          <button
            className="k-cta"
            onClick={() => alert(`Pre-book for ${kit.name} initiated! (Static Stub)`)}
          >
            {kit.isPrebook ? 'Pre-book now ›' : 'View kit details ›'}
          </button>
        </div>
      </div>
    </div>
  );
}
