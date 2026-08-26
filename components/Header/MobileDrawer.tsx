import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const [openSection, setOpenSection] = useState<string | null>('rg');

  if (!isOpen) return null;

  const toggleSection = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <div className="mob-drawer-overlay" onClick={onClose}>
      <div className="mob" onClick={(e) => e.stopPropagation()}>
        <div className="mob-top">
          <Logo />
          <button className="mob-close" onClick={onClose}>✕</button>
        </div>

        <div className="mob-srch">
          <span>⌕</span>
          <span>Search rituals, festivals…</span>
        </div>

        <div className="mob-acc">
          <div>
            <div className="mob-a" onClick={() => toggleSection('rg')}>
              Ritual Guides <span className="car">{openSection === 'rg' ? '▴' : '▾'}</span>
            </div>
            {openSection === 'rg' && (
              <div className="mob-sub">
                <a className="mob-s lead" href="#">Beginner's Guides</a>
                <a className="mob-s" href="#">Festive Pujans</a>
                <a className="mob-s" href="#">All-Year Pujans</a>
                <a className="mob-s" href="#" style={{ color: 'var(--pink)', fontWeight: 700 }}>All Ritual Guides ›</a>
              </div>
            )}
          </div>

          <div>
            <div className="mob-a" onClick={() => toggleSection('pa')}>
              Panchang <span className="car">{openSection === 'pa' ? '▴' : '▾'}</span>
            </div>
            {openSection === 'pa' && (
              <div className="mob-sub">
                <a className="mob-s" href="#">Today's Panchang</a>
                <a className="mob-s" href="#">Vrat Calendar</a>
                <a className="mob-s" href="#">Festival Calendar</a>
                <a className="mob-s" href="#">Eclipses</a>
              </div>
            )}
          </div>

          <div>
            <div className="mob-a" onClick={() => toggleSection('dc')}>
              Dharmic Concepts <span className="car">{openSection === 'dc' ? '▴' : '▾'}</span>
            </div>
            {openSection === 'dc' && (
              <div className="mob-sub">
                <a className="mob-s" href="#">Materials</a>
                <a className="mob-s" href="#">Meanings &amp; Practices</a>
                <a className="mob-s" href="#">Daily Puja</a>
              </div>
            )}
          </div>

          <div>
            <div className="mob-a" onClick={() => toggleSection('rk')}>
              Ritual Kits <span className="car">{openSection === 'rk' ? '▴' : '▾'}</span>
            </div>
            {openSection === 'rk' && (
              <div className="mob-sub">
                <a className="mob-s" href="#">Ganesh Sthapana Kit</a>
                <a className="mob-s" href="#">Hartalika Teej Kit</a>
                <a className="mob-s" href="#">Shakti Kit</a>
              </div>
            )}
          </div>
        </div>

        <div className="mob-util">
          <a className="mob-u" href="#">Glossary</a>
          <a className="mob-u" href="#">Scripture References</a>
          <a className="mob-u" href="#">Our Editorial Method</a>
          <a className="mob-u" href="#">Contact</a>
        </div>

        <div className="mob-cta">
          <button className="mob-b wa">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23z"/>
            </svg>
            Join the Tapa Circle · ₹499/yr
          </button>
          <Link href="/admin/login?mode=signup" onClick={onClose} style={{ display: 'block', width: '100%' }}>
            <button className="mob-b pink" style={{ width: '100%' }}>Create account</button>
          </Link>
          <Link href="/admin/login" onClick={onClose} style={{ display: 'block', width: '100%' }}>
            <button className="mob-b ghost" style={{ width: '100%' }}>Sign in</button>
          </Link>
        </div>

        <div className="mob-lang">
          <button className="on">English</button>
          <button>हिंदी</button>
        </div>
      </div>
    </div>
  );
};
