'use client';

import React from 'react';
import Link from 'next/link';
import { SearchResultCard, SearchResultItem } from './SearchResultCard';

interface SearchEmptyStateProps {
  query: string;
  didYouMean?: string;
  closestMatches?: SearchResultItem[];
  tryInsteadChips?: string[];
  onSelectChip?: (q: string) => void;
  onRequestFeedback?: () => void;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  query,
  didYouMean,
  closestMatches = [],
  tryInsteadChips = ['ekadashi', 'vrat katha', 'parana', 'fasting rules'],
  onSelectChip,
  onRequestFeedback,
}) => {
  return (
    <div>
      {didYouMean && (
        <div className="tapa-dym">
          Did you mean{' '}
          <button type="button" onClick={() => onSelectChip?.(didYouMean)}>
            {didYouMean}
          </button>
          ? <b>Showing results for that instead.</b>
        </div>
      )}

      <div className="tapa-empty">
        <div className="tapa-e-i">⌕</div>
        <div className="tapa-e-t">Nothing matched that exactly</div>
        <p className="tapa-e-s">
          Spellings vary a great deal across regions, and ours is only one of them. Try a shorter word, or tell us what you were looking for — searches that come up empty are how this list grows.
        </p>
        <div className="tapa-e-b">
          <button
            type="button"
            className="tapa-eb pink"
            onClick={onRequestFeedback || (() => alert('Thank you! We have logged this search request.'))}
          >
            Tell us what you needed
          </button>
          <Link href="/ritual-guides" className="tapa-eb ghost">
            Browse Ritual Guides
          </Link>
        </div>
      </div>

      {closestMatches && closestMatches.length > 0 && (
        <div className="tapa-grp">
          <div className="tapa-grp-h">
            <span className="tapa-grp-t">CLOSEST MATCHES</span>
          </div>
          {closestMatches.map((item) => (
            <SearchResultCard key={item.id} item={item} searchQuery={query} />
          ))}
        </div>
      )}
    </div>
  );
};
