import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

interface TopNavProps {
  openDropdownKey: string | null;
  onHoverCategory: (key: string | null) => void;
  onToggleSearch: () => void;
  onToggleAccount: () => void;
  onToggleCart: () => void;
  onToggleMobileDrawer: () => void;
  phase?: 1 | 2;
  cartCount?: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  openDropdownKey,
  onHoverCategory,
  onToggleSearch,
  onToggleAccount,
  onToggleCart,
  onToggleMobileDrawer,
  phase = 1,
  cartCount = 2,
}) => {
  return (
    <div className="nav-in max-w-[1280px] mx-auto px-3 md:px-7 h-[70px] md:h-[72px] flex items-center justify-between gap-2 md:gap-4">
      <button className="burger flex md:hidden flex-col gap-[4.5px] p-[7px]" onClick={onToggleMobileDrawer} aria-label="Open Mobile Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <Logo />

      <div className="cats hidden md:flex items-center gap-2">
        <button
          className={`cat ${openDropdownKey === 'rg' ? 'on' : ''}`}
          onMouseEnter={() => onHoverCategory('rg')}
        >
          Ritual Guides <span className="car">▾</span>
        </button>
        <button
          className={`cat ${openDropdownKey === 'pa' ? 'on' : ''}`}
          onMouseEnter={() => onHoverCategory('pa')}
        >
          Panchang <span className="car">▾</span>
        </button>
        <button
          className={`cat ${openDropdownKey === 'dc' ? 'on' : ''}`}
          onMouseEnter={() => onHoverCategory('dc')}
        >
          Dharmic Concepts <span className="car">▾</span>
        </button>
        {phase === 2 && (
          <button
            className={`cat ${openDropdownKey === 'rk' ? 'on' : ''}`}
            onMouseEnter={() => onHoverCategory('rk')}
          >
            Ritual Kits <span className="new">NEW</span> <span className="car">▾</span>
          </button>
        )}
      </div>

      <div className="right ml-auto flex items-center gap-2 md:gap-3">
        <div className="srch hidden md:flex items-center gap-2" onClick={onToggleSearch} style={{ cursor: 'pointer' }}>
          <span>⌕</span>
          <span>{phase === 2 ? 'Search rituals, kits…' : 'Search rituals'}</span>
        </div>

        <div className="lang hidden md:flex items-center">
          <button className="on">EN</button>
          <button>हिं</button>
        </div>

        <div className="ico cursor-pointer" style={{ cursor: 'pointer' }}>♡</div>

        {phase === 2 ? (
          <>
            <div className="ico cursor-pointer" style={{ cursor: 'pointer' }} onClick={onToggleCart}>
              🛒
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </div>
            <Link href="/admin/login">
              <button className="signin hidden md:block">
                Sign in
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/admin/login">
              <button className="signin hidden md:block">
                Sign in
              </button>
            </Link>
            <Link href="/admin/login?mode=signup">
              <button className="signup hidden md:block">
                Create account
              </button>
            </Link>
          </>
        )}

      </div>
    </div>
  );
};
