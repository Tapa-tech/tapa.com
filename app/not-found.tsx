'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="w-full min-h-[70vh] flex flex-col justify-center items-center px-4 py-12 md:py-20" style={{ background: '#F8F5EE' }}>
      <div className="max-w-2xl w-full text-center">
        {/* Eyebrow */}
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#A07800' }}>
          404 · PAGE NOT FOUND
        </p>

        {/* Heading */}
        <h1 className="text-2xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif', color: '#111827' }}>
          The page you are looking for does not exist
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto" style={{ color: '#6B7280' }}>
          The ritual guide, product kit, or page may have moved or is no longer available. Try searching below or explore popular sections.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md mx-auto mb-10">
          <div className="flex-1 flex items-center bg-white border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 shadow-sm focus-within:border-[#DE1B59]">
            <span className="text-gray-400 mr-2">⌕</span>
            <input
              type="text"
              placeholder="Search rituals, kits, festivals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: '#DE1B59' }}
          >
            Search
          </button>
        </form>

        {/* Recommended Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 text-left">
          <Link
            href="/ritual-guides"
            className="p-4 rounded-xl border border-[#F5E6D3] bg-[#FFFDF9] hover:border-[#DE1B59] transition-colors group"
          >
            <div className="text-xl mb-1">🪔</div>
            <div className="text-xs font-bold text-gray-900 group-hover:text-[#DE1B59]">Ritual Guides</div>
            <div className="text-[11px] text-gray-500">Authentic vidhi &amp; katha</div>
          </Link>

          <Link
            href="/ritual-kits"
            className="p-4 rounded-xl border border-[#F5E6D3] bg-[#FFFDF9] hover:border-[#DE1B59] transition-colors group"
          >
            <div className="text-xl mb-1">📦</div>
            <div className="text-xs font-bold text-gray-900 group-hover:text-[#DE1B59]">Ritual Kits</div>
            <div className="text-[11px] text-gray-500">Complete samagri boxes</div>
          </Link>

          <Link
            href="/panchang"
            className="p-4 rounded-xl border border-[#F5E6D3] bg-[#FFFDF9] hover:border-[#DE1B59] transition-colors group"
          >
            <div className="text-xl mb-1">📅</div>
            <div className="text-xs font-bold text-gray-900 group-hover:text-[#DE1B59]">Panchang</div>
            <div className="text-[11px] text-gray-500">Vrats, tithis &amp; muhurats</div>
          </Link>

          <Link
            href="/dharmic-concepts"
            className="p-4 rounded-xl border border-[#F5E6D3] bg-[#FFFDF9] hover:border-[#DE1B59] transition-colors group"
          >
            <div className="text-xl mb-1">📖</div>
            <div className="text-xs font-bold text-gray-900 group-hover:text-[#DE1B59]">Dharmic Concepts</div>
            <div className="text-[11px] text-gray-500">Scriptural meanings</div>
          </Link>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap justify-center items-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl text-xs font-bold border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 transition-colors"
          >
            ‹ Return to Homepage
          </Link>
          <Link
            href="/ritual-guides"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: '#DE1B59' }}
          >
            Explore Ritual Guides ›
          </Link>
        </div>
      </div>
    </div>
  );
}
