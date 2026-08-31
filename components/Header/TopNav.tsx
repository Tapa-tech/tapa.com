import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  userName?: string | null;
}

export const TopNav: React.FC<TopNavProps> = ({
  openDropdownKey,
  onHoverCategory,
  onToggleSearch,
  onToggleAccount,
  onToggleCart,
  onToggleMobileDrawer,
  phase = 1,
  cartCount = 0,
  userName,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const activeKey =
    pathname?.startsWith('/panchang')
      ? 'pa'
      : pathname?.startsWith('/dharmic-concepts')
        ? 'dc'
        : pathname?.startsWith('/ritual-kits')
          ? 'rk'
          : pathname?.startsWith('/ritual-guides') || pathname === '/'
            ? 'rg'
            : null;

  return (
    <div className="nav-in max-w-[1280px] mx-auto px-3 md:px-7 h-[70px] md:h-[72px] flex items-center justify-between gap-2 md:gap-4">

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="burger flex md:hidden flex-col gap-[4.5px] p-[7px]"
        onClick={onToggleMobileDrawer}
        aria-label="Open Mobile Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Logo */}
      <div
        onMouseEnter={() => onHoverCategory(null)}
      >
        <Logo />
      </div>

      {/* Main Navigation */}
      <div className="cats hidden md:flex items-stretch h-full gap-2">

        {/* Ritual Guides */}
        <button
          type="button"
          className={`cat ${activeKey === 'rg' ? 'on' : ''}`}
          onMouseEnter={() => onHoverCategory('rg')}
          onClick={() => {
            onHoverCategory(null);
            router.push('/ritual-guides');
          }}
        >
          Ritual Guides <span className="car">▾</span>
        </button>

        {/* Panchang */}
        <button
          type="button"
          className={`cat ${activeKey === 'pa' ? 'on' : ''}`}
          onMouseEnter={() => onHoverCategory('pa')}
          onClick={() => {
            onHoverCategory(null);
            router.push('/panchang');
          }}
        >
          Panchang <span className="car">▾</span>
        </button>

        {/* Dharmic Concepts */}
        <button
          type="button"
          className={`cat ${activeKey === 'dc' ? 'on' : ''}`}
          onMouseEnter={() => onHoverCategory('dc')}
          onClick={() => {
            onHoverCategory(null);
            router.push('/dharmic-concepts');
          }}
        >
          Dharmic Concepts <span className="car">▾</span>
        </button>

        {/* Ritual Kits */}
        {phase === 2 && (
          <button
            type="button"
            className={`cat ${activeKey === 'rk' ? 'on' : ''}`}
            onMouseEnter={() => onHoverCategory('rk')}
            onClick={() => {
              onHoverCategory(null);
              router.push('/ritual-kits');
            }}
          >
            Ritual Kits{' '}
            <span className="new">NEW</span>{' '}
            <span className="car">▾</span>
          </button>
        )}
      </div>

      {/* Right Side Navigation */}
      <div
        className="right ml-auto flex items-center gap-2 md:gap-3"
        onMouseEnter={() => onHoverCategory(null)}
      >

        {/* Search */}
        <div
          className="srch hidden md:flex items-center gap-2"
          onClick={onToggleSearch}
          style={{ cursor: 'pointer' }}
        >
          <span>⌕</span>

          <span>
            {phase === 2
              ? 'Search rituals'
              : 'Search rituals'}
          </span>
        </div>

        {/* Wishlist */}
        <div
          className="ico cursor-pointer"
          style={{ cursor: 'pointer' }}
          onClick={onToggleAccount}
        >
          ♡
        </div>

        {phase === 2 ? (
          <>
            {/* Cart */}
            <div
              className="ico cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={onToggleCart}
            >
              🛒

              {cartCount > 0 && (
                <span className="badge">
                  {cartCount}
                </span>
              )}
            </div>

            {/* Sign In / User Name */}
            {userName ? (
              <button
                type="button"
                className="signin hidden md:block"
                onClick={onToggleAccount}
              >
                {userName}
              </button>
            ) : (
              <Link href="/admin/login">
                <button
                  type="button"
                  className="signin hidden md:block"
                >
                  Sign in
                </button>
              </Link>
            )}
          </>
        ) : (
          <>
            {/* Sign In / User Name */}
            {userName ? (
              <button
                type="button"
                className="signin hidden md:block"
                onClick={onToggleAccount}
              >
                {userName}
              </button>
            ) : (
              <>
                <Link href="/admin/login">
                  <button
                    type="button"
                    className="signin hidden md:block"
                  >
                    Sign in
                  </button>
                </Link>

                {/* Create Account */}
                <Link href="/admin/login?mode=signup">
                  <button
                    type="button"
                    className="signup hidden md:block"
                  >
                    Create account
                  </button>
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};