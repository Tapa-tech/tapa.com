'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CategoryCardItem, INITIAL_HOMEPAGE_SECTIONS } from '@/lib/homepage-sections';

interface CategoryCardsProps {
  cards?: CategoryCardItem[];
}

export const CategoryCards: React.FC<CategoryCardsProps> = React.memo(({ cards: initialCards }) => {
  const [cards, setCards] = useState<CategoryCardItem[]>(initialCards || INITIAL_HOMEPAGE_SECTIONS.categoryCards);

  useEffect(() => {
    if (initialCards) return;
    let isMounted = true;
    async function loadSections() {
      try {
        const res = await fetch('/api/public/homepage-sections');
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data?.categoryCards) && isMounted) {
          setCards(data.data.categoryCards);
        }
      } catch (err) {
        console.warn('[CategoryCards] Failed to fetch homepage category cards:', err);
      }
    }
    loadSections();
    return () => {
      isMounted = false;
    };
  }, [initialCards]);

  return (
    <section className="sec py-8 md:py-12" id="ritual-guides">
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="sec-head mb-4 md:mb-8">
          <div>
            <div className="sec-ey">THREE WAYS IN</div>
            <div className="sec-t text-xl md:text-3xl font-bold">Start wherever you are</div>
          </div>
        </div>
        <div className="cats grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {cards.map((card, idx) => (
            <Link key={card.key || card.title || `card-${idx}`} className="cat" href={card.href || '/ritual-guides'}>
              <div className={`cat-i ${card.themeClass}`}>{card.icon}</div>
              <div className="cat-t font-bold text-base md:text-lg">{card.title}</div>
              <p className="cat-s text-xs md:text-sm">{card.description}</p>
              <div className="cat-links flex flex-wrap gap-1.5 my-3">
                {card.chips.map((chip, cIdx) => (
                  <span key={`${chip}-${cIdx}`} className="cat-chip text-[11px] px-2 py-0.5 rounded">
                    {chip}
                  </span>
                ))}
              </div>
              <span className="cat-c text-xs font-bold">{card.ctaText}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

CategoryCards.displayName = 'CategoryCards';
