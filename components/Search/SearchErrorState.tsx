'use client';

import React from 'react';

interface SearchErrorStateProps {
  onRetry?: () => void;
}

export const SearchErrorState: React.FC<SearchErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="tapa-search-error">
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
      <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>Unable to complete search</div>
      <p style={{ fontSize: '13px', color: 'var(--body-text)', marginBottom: '16px' }}>
        We encountered a network error while retrieving search results. Please check your connection and try again.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="tapa-eb pink"
          style={{ fontSize: '12px', padding: '8px 18px' }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};
