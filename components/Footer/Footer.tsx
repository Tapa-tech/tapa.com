'use client';

import React, { useState, useEffect } from 'react';
import { BrandBand } from './BrandBand';
import { UtilityBand } from './UtilityBand';
import { SitemapBand } from './SitemapBand';
import { ColumnsBand } from './ColumnsBand';
import { CorrectionsBand } from './CorrectionsBand';
import { LegalBand } from './LegalBand';
import { MobileFooter } from './MobileFooter';
import { FooterConfigData, INITIAL_FOOTER_CONFIG } from '@/lib/footer-config';

export const Footer: React.FC = () => {
  const [footerConfig, setFooterConfig] = useState<FooterConfigData>(INITIAL_FOOTER_CONFIG);

  useEffect(() => {
    let isMounted = true;
    async function loadFooterConfig() {
      try {
        const res = await fetch('/api/public/footer-config');
        const data = await res.json();
        if (res.ok && data.success && data.data && isMounted) {
          setFooterConfig(data.data);
        }
      } catch (err) {
        console.warn('[Footer] Failed to fetch live footer config, using initial config:', err);
      }
    }
    loadFooterConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="tf" style={{ marginTop: '56px' }}>
      {/* Desktop 6-Band Footer */}
      <div className="hidden md:block">
        <BrandBand data={footerConfig.brand} />
        <UtilityBand data={footerConfig.utility} />
        <SitemapBand data={footerConfig.sitemap} />
        <ColumnsBand data={footerConfig.columns} />
        <CorrectionsBand data={footerConfig.corrections} />
        <LegalBand data={footerConfig.legal} />
      </div>

      {/* Mobile Accordion Footer */}
      <div className="block md:hidden">
        <MobileFooter data={footerConfig} />
      </div>
    </footer>
  );
};

export default Footer;
