'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SearchGroupedResults {
  guides: Array<{ id: string; title: string; subtitle?: string; slug: string; tag?: string; url: string }>;
  glossary: Array<{ id: string; title: string; subtitle?: string; slug: string; tag?: string; url: string }>;
  kits: Array<{ id: string; title: string; subtitle?: string; slug: string; tag?: string; url: string }>;
  festivals: Array<{ id: string; title: string; subtitle?: string; slug: string; tag?: string; url: string }>;
}

export default function SearchPage() {
  const [query, setQuery] = useState('Ganesh Chaturthi');
  const [debouncedQuery, setDebouncedQuery] = useState('Ganesh Chaturthi');
  const [isLoading, setIsLoading] = useState(false);
  const [groupedResults, setGroupedResults] = useState<SearchGroupedResults>({
    guides: [],
    glossary: [],
    kits: [],
    festivals: [],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setGroupedResults({ guides: [], glossary: [], kits: [], festivals: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
      .then((res) => res.json())
      .then((data) => {
        setGroupedResults(data.grouped || { guides: [], glossary: [], kits: [], festivals: [] });
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [debouncedQuery]);

  const renderHighlighted = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <b key={i}>{part}</b> : part
    );
  };

  const hasAnyResults =
    groupedResults.guides.length > 0 ||
    groupedResults.glossary.length > 0 ||
    groupedResults.kits.length > 0 ||
    groupedResults.festivals.length > 0;

  return (
    <div className="wrap stage max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden" style={{ padding: '40px 0 80px' }}>
      <div className="sec-ey">SEARCH RESULTS</div>
      <h1 className="sec-t" style={{ fontSize: '32px', marginBottom: '12px' }}>
        Search The Tapa Co.
      </h1>
      <p className="sec-s" style={{ marginBottom: '32px' }}>
        Find ritual guides, festival dates, dharmic concepts, and puja kits.
      </p>

      <div className="so-f" style={{ margin: '0 0 30px 0' }}>
        <span style={{ fontSize: '17px', color: 'var(--sub-text)' }}>⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search rituals, festivals, concepts…"
        />
        {isLoading && (
          <span style={{ fontSize: '11px', color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Searching…
          </span>
        )}
      </div>

      <div className="so-g grid grid-cols-1 md:grid-cols-2 gap-6">
        {groupedResults.guides.length > 0 && (
          <div>
            <div className="so-h">RITUAL GUIDES</div>
            {groupedResults.guides.map((item) => (
              <Link key={item.id} className="so-i" href={item.url || `/ritual-guides/${item.slug}`}>
                {renderHighlighted(item.title, debouncedQuery)}
                <span>{item.tag || 'Guide'}</span>
              </Link>
            ))}
          </div>
        )}

        {groupedResults.glossary.length > 0 && (
          <div>
            <div className="so-h">GLOSSARY &amp; CONCEPTS</div>
            {groupedResults.glossary.map((item) => (
              <Link key={item.id} className="so-i" href={item.url || `/dharmic-concepts#${item.slug}`}>
                {renderHighlighted(item.title, debouncedQuery)}
                <span>{item.subtitle || 'Glossary'}</span>
              </Link>
            ))}
          </div>
        )}

        {groupedResults.kits.length > 0 && (
          <div>
            <div className="so-h">KITS</div>
            {groupedResults.kits.map((item) => (
              <Link key={item.id} className="so-i" href={item.url || '/#prebook-kits'}>
                {renderHighlighted(item.title, debouncedQuery)}
                <span>{item.subtitle || 'Kit'}</span>
              </Link>
            ))}
          </div>
        )}

        {groupedResults.festivals.length > 0 && (
          <div>
            <div className="so-h">FESTIVALS</div>
            {groupedResults.festivals.map((item) => (
              <Link key={item.id} className="so-i" href={item.url || '/panchang/vrat-calendar'}>
                {renderHighlighted(item.title, debouncedQuery)}
                <span>{item.tag || 'Festival'}</span>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && debouncedQuery.trim() !== '' && !hasAnyResults && (
          <div style={{ gridColumn: '1 / -1', padding: '16px 0', color: 'var(--sub-text)', fontSize: '13px' }}>
            No results found for &ldquo;<b>{debouncedQuery}</b>&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
