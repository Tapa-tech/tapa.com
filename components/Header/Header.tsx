'use client';

import React, { useState } from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { TopNav } from './TopNav';
import { CategoryDropdowns } from './CategoryDropdowns';
import { SearchOverlay } from './SearchOverlay';
import { AccountMenu } from './AccountMenu';
import { MiniCart } from './MiniCart';
import { MobileDrawer } from './MobileDrawer';

export const Header: React.FC = () => {
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleHoverCategory = (key: string | null) => {
    setOpenDropdownKey(key);
  };

  return (
    <header style={{ position: 'relative', zIndex: 120 }}>
      <AnnouncementBar />
      <nav className="nav" onMouseLeave={() => setOpenDropdownKey(null)}>
        <TopNav
          openDropdownKey={openDropdownKey}
          onHoverCategory={handleHoverCategory}
          onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
          onToggleAccount={() => setIsAccountOpen(!isAccountOpen)}
          onToggleCart={() => setIsCartOpen(!isCartOpen)}
          onToggleMobileDrawer={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
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
      />
    </header>
  );
};

export default Header;
