'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EditorialMethodSectionData, INITIAL_HOMEPAGE_PART3 } from '@/lib/homepage-part3';

interface EditorialMethodSectionProps {
  data?: EditorialMethodSectionData;
}

export const EditorialMethodSection: React.FC<EditorialMethodSectionProps> = ({ data: initialData }) => {
  const [method, setMethod] = useState<EditorialMethodSectionData>(initialData || INITIAL_HOMEPAGE_PART3.editorialMethod);

  useEffect(() => {
    if (initialData) return;
    let isMounted = true;
    async function loadPart3() {
      try {
        const res = await fetch('/api/public/homepage-part3');
        const data = await res.json();
        if (res.ok && data.success && data.data?.editorialMethod && isMounted) {
          setMethod(data.data.editorialMethod);
        }
      } catch (err) {
        console.warn('[EditorialMethodSection] Failed to fetch editorial method section data:', err);
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
        <div className="method grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-11 p-6 md:p-10 rounded-2xl">
          <div>
            <div className="me-ey text-xs">{method.eyebrow}</div>
            <div className="me-t text-xl md:text-2xl font-bold mb-3">{method.title}</div>
            <p className="me-p text-xs md:text-sm leading-relaxed mb-4">{method.description}</p>
            <Link href={method.ctaHref || '/editorial-method'}>
              <button className="me-c text-xs md:text-sm font-bold">{method.ctaText}</button>
            </Link>
          </div>
          <div className="dpb flex flex-col gap-3 justify-center">
            {method.pillars.map((pillar, idx) => {
              const pillarClass =
                pillar.key === 'dharma'
                  ? 'dpb-r d p-3 md:p-4 rounded-xl'
                  : pillar.key === 'pratha'
                    ? 'dpb-r p p-3 md:p-4 rounded-xl'
                    : 'dpb-r b p-3 md:p-4 rounded-xl';
              return (
                <div key={idx} className={pillarClass}>
                  <div className="dpb-k font-bold text-xs mb-1">{pillar.title}</div>
                  <div className="dpb-v text-xs">{pillar.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
