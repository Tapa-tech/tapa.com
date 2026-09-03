'use client';

import React, { useState, useEffect } from 'react';
import { MythsSectionData, INITIAL_HOMEPAGE_PART3 } from '@/lib/homepage-part3';

interface MythsSectionProps {
  data?: MythsSectionData;
}

export const MythsSection: React.FC<MythsSectionProps> = ({ data: initialData }) => {
  const [myths, setMyths] = useState<MythsSectionData>(initialData || INITIAL_HOMEPAGE_PART3.myths);

  useEffect(() => {
    if (initialData) return;
    let isMounted = true;
    async function loadPart3() {
      try {
        const res = await fetch('/api/public/homepage-part3');
        const data = await res.json();
        if (res.ok && data.success && data.data?.myths && isMounted) {
          setMyths(data.data.myths);
        }
      } catch (err) {
        console.warn('[MythsSection] Failed to fetch myths section data:', err);
      }
    }
    loadPart3();
    return () => {
      isMounted = false;
    };
  }, [initialData]);

  return (
    <section className="sec py-8 md:py-12">
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="myths p-6 md:p-10 rounded-2xl">
          <div className="my-ey text-xs">{myths.eyebrow}</div>
          <div className="my-t text-xl md:text-3xl font-bold mb-2">{myths.title}</div>
          <p className="my-s text-xs md:text-sm max-w-2xl mb-6">{myths.description}</p>
          <div className="my-grid grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {myths.items.map((item, idx) => (
              <div key={idx} className="mycard p-4 md:p-5 rounded-xl">
                <div className="my-q flex items-start gap-2 mb-3">
                  <span className="my-ic flex-shrink-0 text-red-500 font-bold">✕</span>
                  <span className="my-tx text-xs md:text-sm font-semibold">{item.question}</span>
                </div>
                <div className="my-a flex items-start gap-2">
                  <span className="my-ic flex-shrink-0 text-green-600 font-bold">✓</span>
                  <span className="my-tx text-xs leading-relaxed">{item.correction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
