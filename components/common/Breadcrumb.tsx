import React, { useMemo } from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  containerClassName?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = React.memo(({ items, containerClassName = '' }) => {
  // Ensure "Home" is always the parent/root navigation if not explicitly provided
  const allItems = useMemo<BreadcrumbItem[]>(() => [
    { label: 'Home', href: '/' },
    ...items.filter((item) => item.label.toLowerCase() !== 'home'),
  ], [items]);

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E8E0D0',
        width: '100%',
      }}
      className={`bcrumb-standard ${containerClassName}`.trim()}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '10px 40px',
          fontSize: '13px',
          color: '#8A7A68',
        }}
      >
        <ol
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;

            return (
              <li key={item.label || `bc-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {index > 0 && (
                  <span style={{ color: '#8A7A68', opacity: 0.65, userSelect: 'none' }} aria-hidden="true">
                    &gt;
                  </span>
                )}

                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    style={{
                      color: '#2C2010',
                      fontWeight: 600,
                      maxWidth: '360px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    style={{
                      color: '#8A7A68',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                    }}
                    className="hover:text-[#DE1B59]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';
