'use client';

import React from 'react';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  totalResults: number;
  activeQuery: string;
  counts: {
    glossary: number;
    guides: number;
    panchang: number;
    concepts: number;
    kits: number;
  };
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onSearchSubmit,
  onClear,
  totalResults,
  activeQuery,
  counts,
}) => {
  return (
    <div className="tapa-sbar">
      <div className="tapa-sbar-in">
        <form onSubmit={onSearchSubmit} className="tapa-sf">
          <span style={{ fontSize: '19px', color: 'var(--dim)' }}>⌕</span>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search rituals, festivals, concepts…"
            aria-label="Search query"
          />
          {query && (
            <span className="tapa-sf-x" onClick={onClear} title="Clear search">
              ✕
            </span>
          )}
          <button type="submit" className="tapa-sf-go">
            Search
          </button>
        </form>

        {activeQuery.trim() !== '' && (
          <p className="tapa-sres">
            <b>{totalResults} result{totalResults === 1 ? '' : 's'}</b> for <b>&ldquo;{activeQuery}&rdquo;</b>
            {totalResults > 0 && (
              <>
                {counts.glossary > 0 && ` · ${counts.glossary} definition${counts.glossary > 1 ? 's' : ''}`}
                {counts.guides > 0 && ` · ${counts.guides} guide${counts.guides > 1 ? 's' : ''}`}
                {counts.panchang > 0 && ` · ${counts.panchang} date${counts.panchang > 1 ? 's' : ''}`}
                {counts.concepts > 0 && ` · ${counts.concepts} concept${counts.concepts > 1 ? 's' : ''}`}
                {counts.kits > 0 && ` · ${counts.kits} kit${counts.kits > 1 ? 's' : ''}`}
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};
