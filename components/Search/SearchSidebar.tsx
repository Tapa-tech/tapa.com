'use client';

import React from 'react';

interface RelatedSearch {
  query: string;
  subtitle: string;
}

interface SearchSidebarProps {
  relatedSearches?: RelatedSearch[];
  popularChips?: string[];
  onSelectQuery?: (q: string) => void;
  infoTitle?: string;
  infoText?: string;
}

export const SearchSidebar: React.FC<SearchSidebarProps> = ({
  relatedSearches = [
    { query: 'parana time', subtitle: 'when to break the fast' },
    { query: 'ekadashi 2026 list', subtitle: 'all 24 dates' },
    { query: 'what counts as a grain', subtitle: 'the rule that applies to all' },
    { query: 'nirjala ekadashi', subtitle: 'the waterless form' },
  ],
  popularChips = [
    'Ganesh Chaturthi',
    'Rahu Kaal',
    'Navratri colours',
    'Sutak',
    'Sankalp',
    'Bilva',
  ],
  onSelectQuery,
  infoTitle = 'HOW RESULTS ARE ORDERED',
  infoText = 'A definition comes first when the query is a term. Then guides, then dates, then kits — knowledge before commerce, in the results as everywhere else.',
}) => {
  return (
    <aside className="tapa-side">
      {relatedSearches && relatedSearches.length > 0 && (
        <div className="tapa-sbx">
          <div className="tapa-sbx-h">Related searches</div>
          {relatedSearches.map((item) => (
            <a
              key={item.query}
              className="tapa-sbx-i"
              onClick={() => onSelectQuery?.(item.query)}
            >
              {item.query}
              <span>{item.subtitle}</span>
            </a>
          ))}
        </div>
      )}

      {popularChips && popularChips.length > 0 && (
        <div className="tapa-sbx">
          <div className="tapa-sbx-h">Popular right now</div>
          <div className="tapa-chips">
            {popularChips.map((chip) => (
              <a
                key={chip}
                className="tapa-chip"
                onClick={() => onSelectQuery?.(chip)}
              >
                {chip}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="tapa-sbn">
        <div className="tapa-sbn-h">{infoTitle}</div>
        <p
          className="tapa-sbn-t"
          dangerouslySetInnerHTML={{ __html: infoText.replace(/definition comes first/, '<b>definition comes first</b>') }}
        />
      </div>
    </aside>
  );
};
