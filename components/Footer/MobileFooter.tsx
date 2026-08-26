import React, { useState } from 'react';
import { Logo } from '../Header/Logo';

export const MobileFooter: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <div className="mf">
      <div className="tf-brand" style={{ padding: '34px 18px 26px' }}>
        <div className="tf-lot">
          <span className="tf-line"></span>
          <span style={{ color: 'var(--pink)', fontSize: '17px' }}>✽</span>
          <span className="tf-line"></span>
        </div>
        <div className="tf-tag" style={{ fontSize: '22px' }}>
          Not fear. <em>Only devotion.</em>
        </div>
        <p className="tf-sub" style={{ fontSize: '13px' }}>Every ritual explained from a named source.</p>
        <button className="tf-cta">Read our editorial method ›</button>
        <div className="tf-dev devanagari">हर अनुष्ठान, सही विधि से</div>
      </div>

      <div className="tf-util">
        <div className="tf-util-in" style={{ padding: '16px 18px', flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
          <div className="tf-srch" style={{ maxWidth: 'none' }}>
            <span style={{ color: '#8A7A68' }}>⌕</span>
            <span className="q">Search rituals</span>
            <button className="tf-srch-go">Search</button>
          </div>
          <div className="tf-auth" style={{ marginLeft: 0 }}>
            <button className="tf-b-g" style={{ flex: 1 }}>Sign in</button>
            <button className="tf-b-s" style={{ flex: 1 }}>Create account</button>
          </div>
        </div>
      </div>

      <div className="mf-acc">
        <div>
          <div className="mf-a" onClick={() => toggleSection('rg')}>
            Ritual Guides <span className="car">{openSection === 'rg' ? '▴' : '▾'}</span>
          </div>
          {openSection === 'rg' && (
            <div className="mf-sub">
              <a className="mf-s lead" href="#">Beginner's Guides</a>
              <a className="mf-s" href="#">Festive Pujans</a>
              <a className="mf-s" href="#">All-Year Pujans</a>
              <a className="mf-s" href="#" style={{ color: 'var(--pink)', fontWeight: 700 }}>All Ritual Guides ›</a>
            </div>
          )}
        </div>

        <div>
          <div className="mf-a" onClick={() => toggleSection('pa')}>
            Panchang <span className="car">{openSection === 'pa' ? '▴' : '▾'}</span>
          </div>
          {openSection === 'pa' && (
            <div className="mf-sub">
              <a className="mf-s" href="#">Today's Panchang</a>
              <a className="mf-s" href="#">Vrat Calendar</a>
              <a className="mf-s" href="#">Festival Calendar</a>
              <a className="mf-s" href="#">Eclipses</a>
            </div>
          )}
        </div>

        <div>
          <div className="mf-a" onClick={() => toggleSection('dc')}>
            Dharmic Concepts <span className="car">{openSection === 'dc' ? '▴' : '▾'}</span>
          </div>
          {openSection === 'dc' && (
            <div className="mf-sub">
              <a className="mf-s" href="#">Materials</a>
              <a className="mf-s" href="#">Meanings &amp; Practices</a>
              <a className="mf-s" href="#">Daily Puja</a>
            </div>
          )}
        </div>

        <div>
          <div className="mf-a" onClick={() => toggleSection('about')}>
            About <span className="car">{openSection === 'about' ? '▴' : '▾'}</span>
          </div>
          {openSection === 'about' && (
            <div className="mf-sub">
              <a className="mf-s" href="#">Why तप्</a>
              <a className="mf-s" href="#">Our Editorial Method</a>
              <a className="mf-s" href="#">Scripture References</a>
              <a className="mf-s" href="#">Glossary</a>
            </div>
          )}
        </div>

        <div>
          <div className="mf-a" onClick={() => toggleSection('help')}>
            Help <span className="car">{openSection === 'help' ? '▴' : '▾'}</span>
          </div>
          {openSection === 'help' && (
            <div className="mf-sub">
              <a className="mf-s" href="#">Track Order</a>
              <a className="mf-s" href="#">Shipping &amp; Delivery</a>
              <a className="mf-s" href="#">FAQs</a>
              <a className="mf-s" href="#">Contact Support</a>
            </div>
          )}
        </div>
      </div>

      <div className="tf-w" style={{ padding: '0 18px' }}>
        <div className="tf-corr" style={{ padding: '20px 0 22px' }}>
          <div className="tf-corr-t">Every article carries a named source.</div>
          <p className="tf-corr-p">Scripture is cited. Custom is named as custom. Misconceptions are corrected.</p>
          <a className="tf-corr-a" href="#">Report a correction ›</a>
        </div>

        <div className="tf-legal" style={{ padding: '20px 0 26px' }}>
          <div className="tf-pol">
            <span>Terms of Use</span>
            <span>Privacy Policy</span>
            <span>Grievance Redressal</span>
            <span>Sitemap</span>
          </div>
          <div className="tf-gb">GRIEVANCE OFFICER</div>
          <p className="tf-gt"><b>[Name]</b> · grievance@thetapaco.com · +91 124 456 7890</p>
          <p className="tf-ent">Tale Scale Networks Private Limited · CIN U74999HR2026PTC123456</p>
          <div className="tf-copy" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
            <div className="tf-mark">
              <Logo />
              <span className="tf-cl-l" style={{ marginLeft: '8px' }}>© 2026 <b>Tale Scale Networks</b></span>
            </div>
            <span className="tf-made">Made in Gurgaon</span>
          </div>
        </div>
      </div>
    </div>
  );
};
