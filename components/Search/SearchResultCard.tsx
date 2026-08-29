'use client';

import React from 'react';
import Link from 'next/link';

export interface SearchResultItem {
  id: string;
  categoryLabel: string;
  title: string;
  snippet: string;
  url: string;
  gradientClass?: string;
  iconEmoji?: string;
  pills?: Array<{ text: string; variant: 'd' | 'n' | 'dt' }>;
}

interface SearchResultCardProps {
  item: SearchResultItem;
  searchQuery: string;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({ item, searchQuery }) => {
  const renderHighlighted = (text: string, term: string) => {
    if (!term || !term.trim()) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <em key={i}>{part}</em> : part
    );
  };

  const defaultGradient = item.gradientClass || 'h-vishnu';

  return (
    <Link href={item.url} className="tapa-r">
      <span className={`tapa-r-th ${defaultGradient}`}>
        {item.iconEmoji || ''}
      </span>
      <span className="tapa-r-n">
        <span className="tapa-r-c">{item.categoryLabel}</span>
        <span className="tapa-r-t">{renderHighlighted(item.title, searchQuery)}</span>
        <span className="tapa-r-s">{renderHighlighted(item.snippet, searchQuery)}</span>
        {item.pills && item.pills.length > 0 && (
          <span className="tapa-r-m">
            {item.pills.map((pill, idx) => (
              <span key={idx} className={`tapa-pill ${pill.variant}`}>
                {pill.text}
              </span>
            ))}
          </span>
        )}
      </span>
    </Link>
  );
};
