'use client';

import React from 'react';

export const SearchLoadingState: React.FC = () => {
  return (
    <div className="tapa-search-loading">
      <div style={{ fontSize: '24px', marginBottom: '12px' }}>⌕</div>
      <div style={{ fontWeight: 700, color: 'var(--dark)', marginBottom: '4px' }}>Searching The Tapa Co.</div>
      <div style={{ fontSize: '12px', color: 'var(--sub-text)' }}>Fetching ritual guides, panchang dates, and dharmic concepts…</div>
    </div>
  );
};
