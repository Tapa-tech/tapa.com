'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DynamicKitItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string | null;
  dispatchInfo?: string | null;
  category?: string | null;
  themeClass?: string;
  badge?: string;
  badgeIsPre?: boolean;
  cutoffText?: string;
  occasionText?: string;
  priceNote?: string;
  ctaText?: string;
  ctaIsGhost?: boolean;
  guideHref?: string;
  isLead?: boolean;
}

const DEFAULT_SHELF_KITS: DynamicKitItem[] = [
  {
    id: 'kit-ganesh',
    name: 'Ganesh Sthapana Kit',
    slug: 'ganesh-sthapana-kit',
    price: 1650,
    description: 'Shadu mati idol, chowki cloth, kalash set, durva, modak mould, akshata, dhoop, 21-item samagri box, Gyan Patrika.',
    themeClass: 'k-top k-ganesh',
    badge: 'PRE-BOOK',
    badgeIsPre: true,
    cutoffText: 'ORDER BY 10 SEP',
    occasionText: 'For 14 September · Madhyahna muhurat',
    priceNote: 'incl. delivery',
    ctaText: 'Pre-book now',
    guideHref: '/ritual-guides/ganesh-chaturthi',
    isLead: true,
  },
  {
    id: 'kit-teej',
    name: 'Hartalika Teej Kit',
    slug: 'teej-pujan-kit',
    price: 950,
    description: 'Sand-Shivalinga mould, bilva patra, green bangles, solah shringar set, phalahar essentials, Gyan Patrika.',
    themeClass: 'k-top k-teej',
    badge: 'PRE-BOOK',
    badgeIsPre: true,
    cutoffText: 'ORDER BY 9 SEP',
    occasionText: 'For 13 September',
    priceNote: 'incl. delivery',
    ctaText: 'Pre-book now',
    guideHref: '/ritual-guides/hartalika-teej',
  },
  {
    id: 'kit-navratri',
    name: 'Navratri Ghatsthapana Kit',
    slug: 'shakti-kit',
    price: 1890,
    description: 'Kalash, jau seeds and sowing tray, chunri, akhand jyot supplies, nine-day samagri, Gyan Patrika.',
    themeClass: 'k-top k-navratri',
    badge: 'OPENS 20 SEP',
    occasionText: 'For Sharad Navratri, October',
    priceNote: 'estimated',
    ctaText: 'Notify me',
    ctaIsGhost: true,
    guideHref: '/ritual-guides',
  },
  {
    id: 'kit-shiva',
    name: 'Shiva Puja Kit',
    slug: 'rudrabhishek-kit',
    price: 1180,
    description: 'Bilva patra, gangajal, panchamrit set, chandan, rudraksha mala, dhoop, abhishek vessel, Gyan Patrika.',
    themeClass: 'k-top k-shiva',
    badge: 'ALL YEAR',
    occasionText: 'Pradosh, Somwar, Shivratri',
    priceNote: 'incl. delivery',
    ctaText: 'Add to cart',
    guideHref: '/ritual-guides',
  },
];

export interface KitShelfProps {
  initialKits?: DynamicKitItem[];
}

export const KitShelf: React.FC<KitShelfProps> = ({ initialKits }) => {
  const [kits, setKits] = useState<DynamicKitItem[]>(initialKits || DEFAULT_SHELF_KITS);

  useEffect(() => {
    if (initialKits && initialKits.length > 0) return;

    let isMounted = true;
    async function loadDynamicKits() {
      try {
        const res = await fetch('/api/public/products');
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
          const mapped: DynamicKitItem[] = json.data.slice(0, 4).map((p: any, idx: number) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            description: p.description,
            dispatchInfo: p.dispatchInfo,
            category: p.category,
            themeClass: idx === 0 ? 'k-top k-ganesh' : idx === 1 ? 'k-top k-teej' : idx === 2 ? 'k-top k-navratri' : 'k-top k-shiva',
            badge: idx === 0 || idx === 1 ? 'PRE-BOOK' : 'ALL YEAR',
            badgeIsPre: idx === 0 || idx === 1,
            cutoffText: 'ORDER BY 8 OCT',
            priceNote: 'incl. delivery',
            ctaText: 'View Kit Details',
            guideHref: `/product/${p.slug}`,
            isLead: idx === 0,
          }));
          setKits(mapped);
        }
      } catch (err) {
        console.warn('[KitShelf] Failed to fetch dynamic products:', err);
      }
    }
    loadDynamicKits();
    return () => {
      isMounted = false;
    };
  }, [initialKits]);

  return (
    <section className="sec py-8 md:py-12 bg-[#FAF6F0]">
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="sec-head flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-4 mb-4 md:mb-8">
          <div>
            <div className="sec-ey">SEASON 1 · NAVRATRI PUJAN</div>
            <div className="sec-t text-xl md:text-3xl font-bold">Puja kits, complete for the vidhi</div>
            <p className="sec-s text-xs md:text-sm">Weighed and sealed separately. Assembled so you do not need a second trip to the market.</p>
          </div>
          <Link className="sec-all text-xs md:text-sm font-semibold whitespace-nowrap self-start md:self-auto" href="/ritual-kits/all">
            Browse all kits ›
          </Link>
        </div>

        <div className="kits grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {kits.map((kit) => (
            <div key={kit.id || kit.slug} className={`kit ${kit.isLead ? 'k-lead' : ''}`}>
              <div className={kit.themeClass || 'k-top'}>
                {kit.badge && (
                  <span className={`k-badge ${kit.badgeIsPre ? 'pre' : ''}`}>{kit.badge}</span>
                )}
                {kit.cutoffText && <div className="k-cut">{kit.cutoffText}</div>}
                <div className="k-name text-lg font-bold">{kit.name}</div>
                {kit.occasionText && <div className="k-occ">{kit.occasionText}</div>}
              </div>
              <div className="k-body flex flex-col justify-between flex-1 p-4">
                <p className="k-desc text-xs color-[#5A4D3E] line-clamp-3 mb-3">{kit.description}</p>
                <div>
                  <div className="k-price flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold">₹{kit.price.toLocaleString('en-IN')}</span>
                    {kit.priceNote && <span className="k-pnote text-[11px] text-gray-500">{kit.priceNote}</span>}
                  </div>
                  <Link
                    href={`/product/${kit.slug}`}
                    className={`k-cta block text-center py-2 px-4 rounded-lg text-xs font-bold ${
                      kit.ctaIsGhost ? 'bg-transparent border border-gray-400 text-gray-800' : 'bg-[#DE1B59] text-white'
                    }`}
                  >
                    {kit.ctaText || 'View details ›'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
