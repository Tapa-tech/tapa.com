'use client';

import React from 'react';

export type CategoryFilter = 'All' | 'Glossary' | 'Ritual Guides' | 'Panchang' | 'Dharmic Concepts' | 'Ritual Kits';

interface SearchFiltersProps {
  activeFilter: CategoryFilter;
  onFilterChange: (filter: CategoryFilter) => void;
  counts: {
    all: number;
    glossary: number;
    guides: number;
    panchang: number;
    concepts: number;
    kits: number;
  };
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  const filterList: Array<{ id: CategoryFilter; label: string; count: number }> = [
    { id: 'All', label: 'All', count: counts.all },
    { id: 'Glossary', label: 'Glossary', count: counts.glossary },
    { id: 'Ritual Guides', label: 'Ritual Guides', count: counts.guides },
    { id: 'Panchang', label: 'Panchang', count: counts.panchang },
    { id: 'Dharmic Concepts', label: 'Dharmic Concepts', count: counts.concepts },
    { id: 'Ritual Kits', label: 'Ritual Kits', count: counts.kits },
  ];

  return (
    <div className="tapa-filters">
      <div className="tapa-f-in">
        {filterList.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`tapa-fc ${activeFilter === item.id ? 'on' : ''}`}
            onClick={() => onFilterChange(item.id)}
          >
            {item.label}
            <span className="n">{item.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
