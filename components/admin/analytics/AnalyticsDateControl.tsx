'use client';

import React from 'react';

export interface DateRangeState {
  range: string;
  startDate: string;
  endDate: string;
}

interface AnalyticsDateControlProps {
  value: DateRangeState;
  onChange: (newValue: DateRangeState) => void;
  onRefresh: () => void;
  loading?: boolean;
}

const RANGES = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: '90d', label: 'Last 90 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'this_year', label: 'This Year' },
  { id: 'custom', label: 'Custom Range' },
];

export const AnalyticsDateControl: React.FC<AnalyticsDateControlProps> = ({
  value,
  onChange,
  onRefresh,
  loading = false,
}) => {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #EFEAE4',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>📅</span> Analytics Period:
        </span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {RANGES.map((r) => {
            const isActive = value.range === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onChange({ ...value, range: r.id })}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #DE1B59' : '1px solid #E5E7EB',
                  background: isActive ? '#DE1B59' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#4B5563',
                  transition: 'all 0.15s ease',
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {value.range === 'custom' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: '2px' }}>From</label>
            <input
              type="date"
              value={value.startDate}
              onChange={(e) => onChange({ ...value, startDate: e.target.value })}
              style={{
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '12px',
                outline: 'none',
                background: '#F9FAFB',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: '2px' }}>To</label>
            <input
              type="date"
              value={value.endDate}
              onChange={(e) => onChange({ ...value, endDate: e.target.value })}
              style={{
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '12px',
                outline: 'none',
                background: '#F9FAFB',
              }}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        style={{
          background: '#F3F4F6',
          color: '#374151',
          border: '1px solid #E5E7EB',
          padding: '7px 14px',
          borderRadius: '10px',
          fontWeight: 700,
          fontSize: '12px',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginLeft: 'auto',
        }}
      >
        {loading ? '⏳ Updating...' : '🔄 Refresh Data'}
      </button>
    </div>
  );
};
