'use client';

import React, { useState, useEffect } from 'react';
import { TrustItem, INITIAL_HOMEPAGE_SECTIONS } from '@/lib/homepage-sections';

interface TrustStripProps {
  items?: TrustItem[];
}

export const TrustStrip: React.FC<TrustStripProps> = ({ items: initialItems }) => {
  const [items, setItems] = useState<TrustItem[]>(initialItems || INITIAL_HOMEPAGE_SECTIONS.trustItems);

  useEffect(() => {
    if (initialItems) return;
    let isMounted = true;
    async function loadSections() {
      try {
        const res = await fetch('/api/public/homepage-sections');
        const data = await res.json();
        if (res.ok && data.success && data.data?.trustItems && isMounted) {
          setItems(data.data.trustItems);
        }
      } catch (err) {
        console.warn('[TrustStrip] Failed to fetch homepage trust items:', err);
      }
    }
    loadSections();
    return () => {
      isMounted = false;
    };
  }, [initialItems]);

  return (
    <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
      <div className="ctrust grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
        {items.map((item, idx) => (
          <div key={idx} className="ct p-4 md:p-6">
            <div className="ct-t font-bold text-sm md:text-base mb-1">{item.title}</div>
            <div className="ct-s text-xs text-sub-text">{item.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
