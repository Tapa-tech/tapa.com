'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  HeaderCategoryStructure,
  INITIAL_HEADER_CATEGORIES,
} from '@/lib/header-categories';

interface CategoryDropdownsProps {
  dropdownKey: string | null;
  onMouseLeaveNav: () => void;
}

// Convert array to initial dictionary map for O(1) lookup
const getInitialMap = (): Record<string, HeaderCategoryStructure> => {
  const map: Record<string, HeaderCategoryStructure> = {};
  for (const cat of INITIAL_HEADER_CATEGORIES) {
    map[cat.key] = cat;
  }
  return map;
};

export const CategoryDropdowns: React.FC<CategoryDropdownsProps> = ({
  dropdownKey,
  onMouseLeaveNav,
}) => {
  const [categoriesMap, setCategoriesMap] = useState<Record<string, HeaderCategoryStructure>>(getInitialMap());

  useEffect(() => {
    let isMounted = true;
    async function fetchCategories() {
      try {
        const res = await fetch('/api/public/header-categories');
        const data = await res.json();
        if (res.ok && data.success && data.data && isMounted) {
          setCategoriesMap(data.data);
        }
      } catch (err) {
        console.warn('[Header Categories] Failed to fetch live header categories, using initial map:', err);
      }
    }
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!dropdownKey || !(dropdownKey in categoriesMap)) {
    return null;
  }

  const category = categoriesMap[dropdownKey];
  if (!category || category.status === 'HIDDEN') {
    return null;
  }

  const { columns = [], featured, footer } = category;

  const featClass = featured?.theme === 'data'
    ? 'feat data'
    : featured?.theme === 'amber'
      ? 'feat amber'
      : 'feat';

  return (
    <div className="dd open" onMouseLeave={onMouseLeaveNav}>
      <div className="dd-in">
        {columns.map((col, cIdx) => (
          <div key={col.header || `col-${cIdx}`}>
            <div className="col-h">{col.header}</div>
            {col.items.map((item, iIdx) => {
              const linkHref = item.href || '#';
              const isLeadClass = item.isLead ? 'dl lead' : 'dl';
              const itemKey = `${item.title}-${linkHref}-${iIdx}`;

              return (
                <React.Fragment key={itemKey}>
                  {/* Live Now Card for Panchang RIGHT NOW */}
                  {item.liveLocation && item.liveTithi && (
                    <div className="live-now">
                      <span className="ln-d"></span>
                      <span>
                        <span className="ln-t">{item.liveLocation}</span>
                        <span className="ln-v">{item.liveTithi}</span>
                      </span>
                    </div>
                  )}

                  <Link
                    className={isLeadClass}
                    href={linkHref}
                    style={item.styleColor ? { color: item.styleColor, fontWeight: 700 } : undefined}
                  >
                    <b>
                      {item.dotColor && <span className="dot" style={{ background: item.dotColor }}></span>}
                      {item.title}
                      {item.pill && (
                        <span className={`pill ${item.pill.type}`}>
                          {item.pill.text}
                        </span>
                      )}
                    </b>
                    {item.subtitle && (
                      <small>
                        {item.subtitle}
                        {item.when && <span className="when">{item.when}</span>}
                      </small>
                    )}
                  </Link>
                </React.Fragment>
              );
            })}
          </div>
        ))}

        {/* Featured Card */}
        {featured && (
          <div className={featClass}>
            <div className="feat-l">{featured.label}</div>
            <div className="feat-t">{featured.title}</div>
            <p className="feat-s">{featured.description}</p>
            {featured.isButton ? (
              <button className="feat-b">{featured.cta}</button>
            ) : (
              <Link
                className="feat-b"
                href={featured.href || '#'}
                style={{ textAlign: 'center', display: 'block' }}
              >
                {featured.cta}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Footer Stats Bar */}
      {footer && (
        <div className="dd-foot">
          <span dangerouslySetInnerHTML={{ __html: footer.statsText }} />
          <Link href={footer.linkHref || '#'}>{footer.linkText}</Link>
        </div>
      )}
    </div>
  );
};
