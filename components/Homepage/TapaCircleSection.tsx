'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TapaCircleSectionData, INITIAL_HOMEPAGE_PART3 } from '@/lib/homepage-part3';

interface TapaCircleSectionProps {
  data?: TapaCircleSectionData;
}

export const TapaCircleSection: React.FC<TapaCircleSectionProps> = ({ data: initialData }) => {
  const [circ, setCirc] = useState<TapaCircleSectionData>(initialData || INITIAL_HOMEPAGE_PART3.tapaCircle);

  useEffect(() => {
    if (initialData) return;
    let isMounted = true;
    async function loadPart3() {
      try {
        const res = await fetch('/api/public/homepage-part3');
        const data = await res.json();
        if (res.ok && data.success && data.data?.tapaCircle && isMounted) {
          setCirc(data.data.tapaCircle);
        }
      } catch (err) {
        console.warn('[TapaCircleSection] Failed to fetch tapa circle section data:', err);
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
        <div className="circ flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 p-6 md:p-8 rounded-2xl">
          <div className="circ-i flex-shrink-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#1F9D52">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23z"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="circ-l text-xs font-bold mb-1">{circ.badge}</div>
            <div className="circ-t text-base md:text-xl font-bold mb-1">{circ.title}</div>
            <p className="circ-s text-xs md:text-sm">{circ.description}</p>
          </div>
          <Link href={circ.ctaHref || '/account'} className="w-full md:w-auto">
            <button className="circ-b text-xs md:text-sm font-bold px-6 py-3 rounded-xl w-full md:w-auto whitespace-nowrap">
              {circ.ctaText}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
