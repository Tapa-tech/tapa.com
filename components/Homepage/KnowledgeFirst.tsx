'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { KnowledgeFirstConfig, INITIAL_HOMEPAGE_SECTIONS } from '@/lib/homepage-sections';

interface KnowledgeFirstProps {
  data?: KnowledgeFirstConfig;
}

export const KnowledgeFirst: React.FC<KnowledgeFirstProps> = ({ data: initialData }) => {
  const [config, setConfig] = useState<KnowledgeFirstConfig>(initialData || INITIAL_HOMEPAGE_SECTIONS.knowledgeFirst);

  useEffect(() => {
    if (initialData) return;
    let isMounted = true;
    async function loadSections() {
      try {
        const res = await fetch('/api/public/homepage-sections');
        const data = await res.json();
        if (res.ok && data.success && data.data?.knowledgeFirst && isMounted) {
          setConfig(data.data.knowledgeFirst);
        }
      } catch (err) {
        console.warn('[KnowledgeFirst] Failed to fetch homepage knowledgeFirst section:', err);
      }
    }
    loadSections();
    return () => {
      isMounted = false;
    };
  }, [initialData]);

  return (
    <section className="sec py-8 md:py-12">
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="kfirst grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-11 p-6 md:p-10 rounded-2xl">
          <div>
            <div className="kf-ey text-xs">{config.eyebrow}</div>
            <div className="kf-t text-xl md:text-2xl font-bold mb-3">{config.title}</div>
            <p className="kf-p text-xs md:text-sm leading-relaxed mb-4">{config.description}</p>
            <Link href={config.ctaHref || '/ritual-guides'}>
              <button className="kf-c text-xs md:text-sm font-bold">{config.ctaText}</button>
            </Link>
          </div>
          <div className="kf-list flex flex-col gap-4 justify-center">
            {config.items.map((item, idx) => (
              <div key={idx} className="kf-i flex items-start gap-3">
                <span className="kf-ic text-xl">{item.icon}</span>
                <div>
                  <div className="kf-it font-bold text-sm">{item.title}</div>
                  <div className="kf-is text-xs">{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
