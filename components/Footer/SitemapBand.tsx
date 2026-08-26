import React from 'react';
import Link from 'next/link';

export const SitemapBand: React.FC = () => {
  return (
    <div className="tf-w max-w-[1280px] mx-auto px-4 md:px-10">
      <div className="tf-map py-7 border-b border-white/10">
        <div className="tf-map-h text-[10px] font-bold text-[#E3B567] tracking-wider mb-4">BROWSE BY CATEGORY</div>
        <div className="tf-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="tf-cat">
            <div className="tf-cat-t font-bold text-sm mb-2 border-b border-white/10 pb-2">Ritual Guides</div>
            <Link className="tf-s lead block py-1 text-xs" href="/ritual-guides">Beginner's Guides</Link>
            <Link className="tf-s block py-1 text-xs" href="/ritual-guides">Festive Pujans</Link>
            <Link className="tf-s block py-1 text-xs" href="/ritual-guides">All-Year Pujans</Link>
            <Link className="tf-s block py-1 text-xs" href="/ritual-guides">Sanskar &amp; Life Events</Link>
            <Link className="tf-all block pt-2 text-xs font-semibold" href="/ritual-guides">All Ritual Guides ›</Link>
          </div>
          <div className="tf-cat">
            <div className="tf-cat-t font-bold text-sm mb-2 border-b border-white/10 pb-2">Panchang</div>
            <Link className="tf-s block py-1 text-xs" href="/panchang">Today's Panchang</Link>
            <Link className="tf-s block py-1 text-xs" href="/panchang/vrat-calendar">Vrat Calendar</Link>
            <Link className="tf-s block py-1 text-xs" href="/panchang/festival-calendar">Festival Calendar</Link>
            <Link className="tf-s block py-1 text-xs" href="/panchang">Tithi &amp; Paksha</Link>
            <Link className="tf-s block py-1 text-xs" href="/panchang/eclipses">Eclipses</Link>
            <Link className="tf-all block pt-2 text-xs font-semibold" href="/panchang">All Panchang ›</Link>
          </div>
          <div className="tf-cat">
            <div className="tf-cat-t font-bold text-sm mb-2 border-b border-white/10 pb-2">Dharmic Concepts</div>
            <Link className="tf-s block py-1 text-xs" href="/dharmic-concepts">Materials</Link>
            <Link className="tf-s block py-1 text-xs" href="/dharmic-concepts">Meanings &amp; Practices</Link>
            <Link className="tf-s block py-1 text-xs" href="/dharmic-concepts">Daily Puja</Link>
            <Link className="tf-s block py-1 text-xs" href="/dharmic-concepts">Dharma vs Pratha</Link>
            <Link className="tf-s block py-1 text-xs" href="/dharmic-concepts">Mantras</Link>
            <Link className="tf-all block pt-2 text-xs font-semibold" href="/dharmic-concepts">All Concepts ›</Link>
          </div>
          <div className="tf-cat">
            <div className="tf-cat-t font-bold text-sm mb-2 border-b border-white/10 pb-2">Ritual Kits</div>
            <Link className="tf-s block py-1 text-xs" href="/ritual-kits">Ganesh Sthapana Kit</Link>
            <Link className="tf-s block py-1 text-xs" href="/ritual-kits">Hartalika Teej Kit</Link>
            <Link className="tf-s block py-1 text-xs" href="/ritual-kits">Shakti Kit</Link>
            <Link className="tf-s block py-1 text-xs" href="/ritual-kits">Shiva Puja Kit</Link>
            <Link className="tf-all block pt-2 text-xs font-semibold" href="/ritual-kits">All Kits ›</Link>
          </div>
        </div>

        <div className="tf-grid pre grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          <div className="tf-cat locked">
            <div className="tf-cat-t font-bold text-sm mb-1">Ritual Kits Pre-Booking</div>
            <span className="tf-when block text-xs">Open now for Ganesh Chaturthi &amp; Teej</span>
            <span className="tf-when-s block text-[11px]">Prepaid orders only · Free cancellation until dispatch</span>
          </div>
          <div className="tf-cat locked">
            <div className="tf-cat-t font-bold text-sm mb-1">Purohit &amp; Puja Booking</div>
            <span className="tf-when block text-xs">November 2026</span>
            <span className="tf-when-s block text-[11px]">Verified purohits, fixed dakhshina · <Link href="/about">Join network ›</Link></span>
          </div>
          <div className="tf-cat locked">
            <div className="tf-cat-t font-bold text-sm mb-1">Bhajan Mandali</div>
            <span className="tf-when block text-xs">Coming soon</span>
            <span className="tf-when-s block text-[11px]">Verified singers for kirtan and chowki</span>
          </div>
        </div>
      </div>
    </div>
  );
};
