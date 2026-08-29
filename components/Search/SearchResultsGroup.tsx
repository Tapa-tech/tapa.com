'use client';

import React from 'react';
import { SearchResultCard, SearchResultItem } from './SearchResultCard';

interface SearchResultsGroupProps {
  title: string;
  count: number;
  items: SearchResultItem[];
  searchQuery: string;
  onSeeAll?: () => void;
}

export const SearchResultsGroup: React.FC<SearchResultsGroupProps> = ({
  title,
  count,
  items,
  searchQuery,
  onSeeAll,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="tapa-grp">
      <div className="tapa-grp-h">
        <span className="tapa-grp-t">
          {title.toUpperCase()} · {count}
        </span>
        {onSeeAll && (
          <span className="tapa-grp-a" onClick={onSeeAll}>
            See all ›
          </span>
        )}
      </div>
      {items.map((item) => (
        <SearchResultCard key={item.id} item={item} searchQuery={searchQuery} />
      ))}
    </div>
  );
};
