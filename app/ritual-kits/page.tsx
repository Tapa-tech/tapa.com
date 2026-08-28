'use client';

import React from 'react';
import { MOCK_KITS } from '@/lib/mock-data';

export default function RitualKitsPage() {
  return (
    <div className="wrap stage max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden" style={{ padding: '40px 0 80px' }}>
      <div className="sec-ey">PRE-BOOKING OPEN</div>
      <h1 className="sec-t" style={{ fontSize: '32px', marginBottom: '12px' }}>
        Ritual Kits
      </h1>
      <p className="sec-s" style={{ marginBottom: '32px' }}>
        Authentic, scripture-verified puja kits with free delivery and prepaid pre-booking. Every item included has a named text citation.
      </p>

      <div className="kshelf grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {MOCK_KITS.map((kit) => (
          <div key={kit.id} className={`kcard ${kit.isLead ? 'lead' : ''}`}>
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
              <div className="k-row">
                <span className="k-p">₹{kit.price.toLocaleString('en-IN')}</span>
                {kit.priceNote && <span className="k-pn">· {kit.priceNote}</span>}
              </div>
              <button
                className={`k-cta ${!kit.isLead ? 'ghost' : ''}`}
                onClick={() => alert(`Pre-book for ${kit.name} initiated! (Static Stub)`)}
              >
                {kit.isPrebook ? 'Pre-book now ›' : 'View kit details ›'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
