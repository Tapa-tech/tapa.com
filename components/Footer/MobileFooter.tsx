import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '../Header/Logo';
import { FooterConfigData, INITIAL_FOOTER_CONFIG } from '@/lib/footer-config';

interface MobileFooterProps {
  data?: FooterConfigData;
}

export const MobileFooter: React.FC<MobileFooterProps> = ({ data = INITIAL_FOOTER_CONFIG }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  const brand = data.brand || INITIAL_FOOTER_CONFIG.brand;
  const utility = data.utility || INITIAL_FOOTER_CONFIG.utility;
  const sitemap = data.sitemap || INITIAL_FOOTER_CONFIG.sitemap;
  const columns = data.columns || INITIAL_FOOTER_CONFIG.columns;
  const corrections = data.corrections || INITIAL_FOOTER_CONFIG.corrections;
  const legal = data.legal || INITIAL_FOOTER_CONFIG.legal;

  return (
    <div className="mf">
      {/* Brand Section */}
      <div className="tf-brand" style={{ padding: '34px 18px 26px' }}>
        <div className="tf-lot">
          <span className="tf-line"></span>
          <span style={{ color: 'var(--pink)', fontSize: '17px' }}>✽</span>
          <span className="tf-line"></span>
        </div>
        <div className="tf-tag" style={{ fontSize: '22px' }} dangerouslySetInnerHTML={{ __html: brand.tagline }} />
        <p className="tf-sub" style={{ fontSize: '13px' }}>{brand.subtitle}</p>
        <Link href={brand.ctaHref || '/editorial-method'}>
          <button className="tf-cta">{brand.ctaText}</button>
        </Link>
        <div className="tf-dev devanagari">{brand.hindiText}</div>
      </div>

      {/* Utility Section */}
      <div className="tf-util">
        <div className="tf-util-in" style={{ padding: '16px 18px', flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
          <div className="tf-srch" style={{ maxWidth: 'none' }}>
            <span style={{ color: '#8A7A68' }}>⌕</span>
            <span className="q">{utility.searchPlaceholder}</span>
            <button className="tf-srch-go">Search</button>
          </div>
          <div className="tf-auth" style={{ marginLeft: 0 }}>
            <Link href="/admin/login" style={{ flex: 1 }}>
              <button className="tf-b-g" style={{ width: '100%' }}>{utility.signInText}</button>
            </Link>
            <Link href="/admin/login?mode=signup" style={{ flex: 1 }}>
              <button className="tf-b-s" style={{ width: '100%' }}>{utility.signUpText}</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Accordion */}
      <div className="mf-acc">
        {sitemap.categories.map((cat, idx) => {
          const key = `cat-${idx}`;
          return (
            <div key={key}>
              <div className="mf-a" onClick={() => toggleSection(key)}>
                {cat.title} <span className="car">{openSection === key ? '▴' : '▾'}</span>
              </div>
              {openSection === key && (
                <div className="mf-sub">
                  {cat.links.map((link, lIdx) => (
                    <Link
                      key={lIdx}
                      className={`mf-s ${link.isLead ? 'lead' : ''}`}
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    className="mf-s"
                    href={cat.allLinkHref}
                    style={{ color: 'var(--pink)', fontWeight: 700 }}
                  >
                    {cat.allLinkText}
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Social Links */}
      <div style={{ padding: '16px 18px 0' }}>
        <div className="text-[10px] font-bold tracking-wider mb-2" style={{ color: '#8A7A68' }}>
          {columns.followSubheading}
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {columns.socialLinks.map((soc, sIdx) => (
            <a
              key={sIdx}
              className="text-xs font-bold px-2.5 py-1.5 rounded"
              href={soc.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: '#F5E6D3', color: '#111827' }}
            >
              {soc.title}
            </a>
          ))}
        </div>
      </div>

      {/* Footer Legal & Corrections */}
      <div className="tf-w" style={{ padding: '0 18px' }}>
        <div className="tf-corr" style={{ padding: '20px 0 22px' }}>
          <div className="tf-corr-t">{corrections.heading}</div>
          <p className="tf-corr-p">{corrections.paragraph}</p>
          <a className="tf-corr-a" href={corrections.reportCtaHref || '#'}>
            {corrections.reportCtaText}
          </a>
        </div>

        <div className="tf-legal" style={{ padding: '20px 0 26px' }}>
          <div className="tf-pol">
            {legal.policyLinks.slice(0, 4).map((link, pIdx) => (
              <span key={pIdx}>{link.label}</span>
            ))}
          </div>
          <div className="tf-gb">{legal.grievanceHeading}</div>
          <p className="tf-gt">
            <b>{legal.grievanceOfficerName}</b> · {legal.grievanceEmail} · {legal.grievancePhone}
          </p>
          <p className="tf-ent">{legal.companyEntityText}</p>
          <div className="tf-copy" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
            <div className="tf-mark">
              <Logo />
              <span className="tf-cl-l" style={{ marginLeft: '8px' }}>
                {legal.copyrightText}
              </span>
            </div>
            <span className="tf-made">{legal.locationTag}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
