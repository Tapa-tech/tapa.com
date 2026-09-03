import React from 'react';
import Link from 'next/link';
import { SitemapBandData, INITIAL_FOOTER_CONFIG } from '@/lib/footer-config';

interface SitemapBandProps {
  data?: SitemapBandData;
}

export const SitemapBand: React.FC<SitemapBandProps> = React.memo(({ data = INITIAL_FOOTER_CONFIG.sitemap }) => {
  return (
    <div className="tf-w max-w-[1280px] mx-auto px-4 md:px-10">
      <div className="tf-map py-7 border-b border-white/10">
        <div className="tf-map-h text-[10px] font-bold text-[#E3B567] tracking-wider mb-4">
          {data.browseHeading}
        </div>
        <div className="tf-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {data.categories.map((cat, idx) => (
            <div key={cat.title || `cat-${idx}`} className="tf-cat">
              <div className="tf-cat-t font-bold text-sm mb-2 border-b border-white/10 pb-2">
                {cat.title}
              </div>
              {cat.links.map((link, lIdx) => (
                <Link
                  key={`${link.label}-${link.href}-${lIdx}`}
                  className={`tf-s ${link.isLead ? 'lead' : ''} block py-1 text-xs`}
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
              <Link className="tf-all block pt-2 text-xs font-semibold" href={cat.allLinkHref}>
                {cat.allLinkText}
              </Link>
            </div>
          ))}
        </div>

        <div className="tf-grid pre grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {data.preBookingBoxes.map((box, bIdx) => (
            <div key={box.title || `box-${bIdx}`} className="tf-cat locked">
              <div className="tf-cat-t font-bold text-sm mb-1">{box.title}</div>
              <span className="tf-when block text-xs">{box.statusText}</span>
              <span className="tf-when-s block text-[11px]">
                {box.statusSubtext}
                {box.linkText && box.linkHref && (
                  <Link href={box.linkHref}> {box.linkText}</Link>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

SitemapBand.displayName = 'SitemapBand';
