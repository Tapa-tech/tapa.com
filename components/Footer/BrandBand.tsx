import React from 'react';
import Link from 'next/link';
import { BrandBandData, INITIAL_FOOTER_CONFIG } from '@/lib/footer-config';

interface BrandBandProps {
  data?: BrandBandData;
}

export const BrandBand: React.FC<BrandBandProps> = ({ data = INITIAL_FOOTER_CONFIG.brand }) => {
  return (
    <div className="tf-brand">
      <div className="tf-lot">
        <span className="tf-line"></span>
        <span style={{ color: 'var(--pink)', fontSize: '19px' }}>✽</span>
        <span className="tf-line"></span>
      </div>
      <div className="tf-tag" dangerouslySetInnerHTML={{ __html: data.tagline }} />
      <p className="tf-sub">{data.subtitle}</p>
      <Link href={data.ctaHref || '/editorial-method'}>
        <button className="tf-cta">{data.ctaText}</button>
      </Link>
      <div className="tf-dev devanagari">{data.hindiText}</div>
    </div>
  );
};
