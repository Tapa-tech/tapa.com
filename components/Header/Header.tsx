'use client';

import React, { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AnnouncementBar } from './AnnouncementBar';
import { TopNav } from './TopNav';
import { CategoryDropdowns } from './CategoryDropdowns';
import { useCart } from '@/context/CartContext';

const SearchOverlay = dynamic(() => import('./SearchOverlay').then((mod) => mod.SearchOverlay));
const AccountMenu = dynamic(() => import('./AccountMenu').then((mod) => mod.AccountMenu));
const MiniCart = dynamic(() => import('./MiniCart').then((mod) => mod.MiniCart));
const MobileDrawer = dynamic(() => import('./MobileDrawer').then((mod) => mod.MobileDrawer));

export const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleHoverCategory = useCallback((key: string | null) => {
    setOpenDropdownKey(key);
  }, []);

  const handleToggleWishlistAccount = useCallback(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else {
      setIsAccountOpen((prev) => !prev);
    }
  }, [isAuthenticated, router]);

  const handleToggleCart = useCallback(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else {
      setIsCartOpen(!isCartOpen);
    }
  }, [isAuthenticated, isCartOpen, router, setIsCartOpen]);

  const handleToggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  const handleToggleMobileDrawer = useCallback(() => {
    setIsMobileDrawerOpen((prev) => !prev);
  }, []);

  const handleCloseSearch = useCallback(() => setIsSearchOpen(false), []);
  const handleCloseAccount = useCallback(() => setIsAccountOpen(false), []);
  const handleCloseMiniCart = useCallback(() => setIsCartOpen(false), [setIsCartOpen]);
  const handleCloseMobileDrawer = useCallback(() => setIsMobileDrawerOpen(false), []);
  const handleMouseLeaveNav = useCallback(() => setOpenDropdownKey(null), []);

  const userName = useMemo(() => {
    return isAuthenticated ? (session?.user?.name || session?.user?.email?.split('@')[0] || 'User') : null;
  }, [isAuthenticated, session?.user?.name, session?.user?.email]);

  const cartCount = isAuthenticated ? totalItems : 0;

  return (
    <header style={{ position: 'relative', zIndex: 120 }}>
      <AnnouncementBar />
      <nav className="nav" onMouseLeave={handleMouseLeaveNav}>
        <TopNav
          openDropdownKey={openDropdownKey}
          onHoverCategory={handleHoverCategory}
          onToggleSearch={handleToggleSearch}
          onToggleAccount={handleToggleWishlistAccount}
          onToggleCart={handleToggleCart}
          onToggleMobileDrawer={handleToggleMobileDrawer}
          phase={2}
          cartCount={cartCount}
          userName={userName}
        />
        <CategoryDropdowns
          dropdownKey={openDropdownKey}
          onMouseLeaveNav={handleMouseLeaveNav}
        />
        <SearchOverlay isOpen={isSearchOpen} onClose={handleCloseSearch} />
        <AccountMenu isOpen={isAccountOpen} onClose={handleCloseAccount} />
        <MiniCart isOpen={isCartOpen} onClose={handleCloseMiniCart} />
      </nav>
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={handleCloseMobileDrawer}
        userName={userName}
      />
    </header>
  );
};

export default Header;

