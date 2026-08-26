'use client';

import React from 'react';
import { BrandBand } from './BrandBand';
import { UtilityBand } from './UtilityBand';
import { SitemapBand } from './SitemapBand';
import { ColumnsBand } from './ColumnsBand';
import { CorrectionsBand } from './CorrectionsBand';
import { LegalBand } from './LegalBand';
import { MobileFooter } from './MobileFooter';

export const Footer: React.FC = () => {
  return (
    <footer className="tf" style={{ marginTop: '56px' }}>
      {/* Desktop 6-Band Footer */}
      <div className="hidden md:block">
        <BrandBand />
        <UtilityBand />
        <SitemapBand />
        <ColumnsBand />
        <CorrectionsBand />
        <LegalBand />
      </div>

      {/* Mobile Accordion Footer */}
      <div className="block md:hidden">
        <MobileFooter />
      </div>
    </footer>
  );
};

export default Footer;
