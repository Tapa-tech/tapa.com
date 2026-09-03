'use client';

import React, { useState } from 'react';

export interface ChartDataPoint {
  date: string;
  revenue: number;
  ordersCount: number;
}

interface RevenueChartProps {
  data: ChartDataPoint[];
  loading?: boolean;
}

function formatINR(val: number): string {
  if (val >= 100000) return '₹' + (val / 100000).toFixed(1) + 'L';
  if (val >= 1000) return '₹' + (val / 1000).toFixed(1) + 'k';
  return '₹' + val;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data = [], loading }) => {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  if (loading) {
    return (
      <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', marginBottom: '36px', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600, fontSize: '13px' }}>Loading Revenue Analytics Chart...</div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1000);
  const maxOrders = Math.max(...data.map((d) => d.ordersCount), 5);

  const chartHeight = 180;
  const chartWidth = 700;
  const padding = 30;

  const pointsCount = data.length || 1;
  const stepX = (chartWidth - padding * 2) / Math.max(pointsCount - 1, 1);

  const linePoints = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = chartHeight - padding - (d.revenue / maxRevenue) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px', marginBottom: '36px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', fontFamily: 'Georgia, serif', margin: '0 0 4px' }}>
            📈 Revenue &amp; Order Volume Trend
          </h3>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
            Daily breakdown of successfully paid revenue and order count
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', background: '#DE1B59', borderRadius: '3px' }} />
            <span style={{ color: '#374151' }}>Paid Revenue</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', background: '#3B82F6', borderRadius: '50%' }} />
            <span style={{ color: '#374151' }}>Orders Count</span>
          </div>
        </div>
      </div>

      {/* SVG CHART CONTAINER */}
      {data.length === 0 ? (
        <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '13px', background: '#FAFAFA', borderRadius: '12px' }}>
          No order records in the selected date range.
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
          {/* HOVER TOOLTIP */}
          {hoveredPoint && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '20px',
                background: '#111827',
                color: '#FFFFFF',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '11px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              <div style={{ color: '#9CA3AF', marginBottom: '2px', fontWeight: 600 }}>Date: {hoveredPoint.date}</div>
              <div style={{ color: '#F472B6', fontWeight: 700 }}>Revenue: ₹{hoveredPoint.revenue.toLocaleString('en-IN')}</div>
              <div style={{ color: '#60A5FA', fontWeight: 700 }}>Orders: {hoveredPoint.ordersCount}</div>
            </div>
          )}

          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: '220px' }}>
            {/* GRID LINES */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = chartHeight - padding - ratio * (chartHeight - padding * 2);
              const val = Math.round(ratio * maxRevenue);
              return (
                <g key={ratio}>
                  <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#F3F4F6" strokeDasharray="4 4" />
                  <text x={padding - 5} y={y + 3} textAnchor="end" fontSize="9" fill="#9CA3AF">
                    {formatINR(val)}
                  </text>
                </g>
              );
            })}

            {/* BARS FOR REVENUE */}
            {data.map((d, i) => {
              const barWidth = Math.max(stepX * 0.6, 4);
              const x = padding + i * stepX - barWidth / 2;
              const h = (d.revenue / maxRevenue) * (chartHeight - padding * 2);
              const y = chartHeight - padding - h;
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(h, 2)}
                  fill={hoveredPoint?.date === d.date ? '#BE185D' : '#DE1B59'}
                  rx={2}
                  opacity={0.85}
                  onMouseEnter={() => setHoveredPoint(d)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                />
              );
            })}

            {/* LINE FOR ORDERS COUNT */}
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={linePoints}
            />

            {/* DOTS FOR ORDERS */}
            {data.map((d, i) => {
              const x = padding + i * stepX;
              const y = chartHeight - padding - (d.revenue / maxRevenue) * (chartHeight - padding * 2);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={hoveredPoint?.date === d.date ? 5 : 3}
                  fill="#3B82F6"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredPoint(d)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}

            {/* X AXIS DATES */}
            {data.map((d, i) => {
              // Show label every N steps depending on count
              const stepShow = Math.ceil(pointsCount / 8);
              if (i % stepShow !== 0 && i !== pointsCount - 1) return null;

              const x = padding + i * stepX;
              const dateLabel = d.date.split('-').slice(1).join('/');
              return (
                <text key={i} x={x} y={chartHeight - 8} textAnchor="middle" fontSize="9" fill="#6B7280">
                  {dateLabel}
                </text>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
};
