'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchGroupedResults {
  guides: Array<{ id: string; title: string; subtitle?: string; slug: string; tag?: string; url: string }>;
  glossary: Array<{ id: string; title: string; subtitle?: string; slug: string; tag?: string; url: string }>;
  kits: Array<{ id: string; title: string; subtitle?: string; slug: string; tag?: string; url: string }>;
  festivals: Array<{ id: string; title: string; subtitle?: string; slug: string; tag?: string; url: string }>;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('ekad');
  const [debouncedQuery, setDebouncedQuery] = useState('ekad');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [groupedResults, setGroupedResults] = useState<SearchGroupedResults>({
    guides: [],
    glossary: [],
    kits: [],
    festivals: [],
  });
  const [totalCount, setTotalCount] = useState(0);

  // Debounce logic (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch search results from API when debouncedQuery changes
  useEffect(() => {
    if (!isOpen) return;

    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setGroupedResults({ guides: [], glossary: [], kits: [], festivals: [] });
      setTotalCount(0);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setIsError(false);

    fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Search request failed');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setGroupedResults(data.grouped || { guides: [], glossary: [], kits: [], festivals: [] });
          setTotalCount(data.total || 0);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('[SearchOverlay] Search error:', err);
        if (isMounted) {
          setIsError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, isOpen]);

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Highlight matching keyword substring
  const renderHighlighted = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <b key={i}>{part}</b> : part
    );
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const popularSearches = ['Ganesh Chaturthi', 'Rahu Kaal', 'Navratri colours', 'Sutak', 'Ekadashi', 'Hartalika Teej'];

  const hasAnyResults =
    groupedResults.guides.length > 0 ||
    groupedResults.glossary.length > 0 ||
    groupedResults.kits.length > 0 ||
    groupedResults.festivals.length > 0;

  return (
    <div className="so">
      <div className="so-f">
        <span style={{ fontSize: '17px', color: 'var(--sub-text)' }}>⌕</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search rituals, festivals, concepts…"
        />
        {isLoading && (
          <span style={{ fontSize: '11px', color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Searching…
          </span>
        )}
        <span className="so-esc" onClick={onClose}>ESC</span>
      </div>

      <div className="so-g">
        {/* RITUAL GUIDES SECTION */}
        {groupedResults.guides.length > 0 && (
          <div>
            <div className="so-h">RITUAL GUIDES</div>
            {groupedResults.guides.map((item) => (
              <Link key={item.id} href={item.url || `/ritual-guides/${item.slug}`} className="so-i" onClick={onClose}>
                {renderHighlighted(item.title, debouncedQuery)}
                <span>{item.tag || 'Guide'}</span>
              </Link>
            ))}
          </div>
        )}

        {/* GLOSSARY & DHARMIC CONCEPTS SECTION */}
        {groupedResults.glossary.length > 0 && (
          <div>
            <div className="so-h">GLOSSARY &amp; CONCEPTS</div>
            {groupedResults.glossary.map((item) => (
              <Link key={item.id} href={item.url || `/dharmic-concepts#${item.slug}`} className="so-i" onClick={onClose}>
                {renderHighlighted(item.title, debouncedQuery)}
                <span>{item.subtitle || item.tag || 'Glossary'}</span>
              </Link>
            ))}
          </div>
        )}

        {/* RITUAL KITS SECTION */}
        {groupedResults.kits.length > 0 && (
          <div>
            <div className="so-h">RITUAL KITS</div>
            {groupedResults.kits.map((item) => (
              <Link key={item.id} href={item.url || '/#prebook-kits'} className="so-i" onClick={onClose}>
                {renderHighlighted(item.title, debouncedQuery)}
                <span>{item.subtitle || item.tag || 'Kit'}</span>
              </Link>
            ))}
          </div>
        )}

        {/* FESTIVALS SECTION */}
        {groupedResults.festivals.length > 0 && (
          <div>
            <div className="so-h">FESTIVALS</div>
            {groupedResults.festivals.map((item) => (
              <Link key={item.id} href={item.url || '/panchang/vrat-calendar'} className="so-i" onClick={onClose}>
                {renderHighlighted(item.title, debouncedQuery)}
                <span>{item.tag || 'Festival'}</span>
              </Link>
            ))}
          </div>
        )}

        {/* NO RESULTS STATE */}
        {!isLoading && debouncedQuery.trim() !== '' && !hasAnyResults && !isError && (
          <div style={{ gridColumn: '1 / -1', padding: '16px 0', color: 'var(--sub-text)', fontSize: '13px' }}>
            No results found for &ldquo;<b>{debouncedQuery}</b>&rdquo;. Try searching for &ldquo;Ekadashi&rdquo;, &ldquo;Ganesh&rdquo;, or &ldquo;Teej&rdquo;.
          </div>
        )}

        {/* ERROR STATE */}
        {isError && (
          <div style={{ gridColumn: '1 / -1', padding: '16px 0', color: 'var(--pink)', fontSize: '13px' }}>
            Unable to complete search. Please try again.
          </div>
        )}

        {/* POPULAR SEARCHES CHIPS */}
        <div>
          <div className="so-h">POPULAR SEARCHES</div>
          {popularSearches.map((chip) => (
            <span key={chip} className="so-chip" onClick={() => handleChipClick(chip)}>
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
