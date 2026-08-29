'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AnnouncementBar } from './AnnouncementBar';
import { TopNav } from './TopNav';
import { CategoryDropdowns } from './CategoryDropdowns';
import { SearchOverlay } from './SearchOverlay';
import { AccountMenu } from './AccountMenu';
import { MiniCart } from './MiniCart';
import { MobileDrawer } from './MobileDrawer';
import { useCart } from '@/context/CartContext';

export const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { totalItems } = useCart();
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleHoverCategory = (key: string | null) => {
    setOpenDropdownKey(key);
  };

  const handleToggleWishlistAccount = () => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else {
      setIsAccountOpen(!isAccountOpen);
    }
  };

  const handleToggleCart = () => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else {
      setIsCartOpen(!isCartOpen);
    }
  };

  const userName = isAuthenticated ? (session?.user?.name || session?.user?.email?.split('@')[0] || 'User') : null;

  return (
    <header style={{ position: 'relative', zIndex: 120 }}>
      <AnnouncementBar />
      <nav className="nav" onMouseLeave={() => setOpenDropdownKey(null)}>
        <TopNav
          openDropdownKey={openDropdownKey}
          onHoverCategory={handleHoverCategory}
          onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
          onToggleAccount={handleToggleWishlistAccount}
          onToggleCart={handleToggleCart}
          onToggleMobileDrawer={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          phase={2}
          cartCount={isAuthenticated ? totalItems : 0}
          userName={userName}
        />
        <CategoryDropdowns
          dropdownKey={openDropdownKey}
          onMouseLeaveNav={() => setOpenDropdownKey(null)}
        />
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <AccountMenu isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
        <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </nav>
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        userName={userName}
      />
    </header>
  );
};

export default Header;

