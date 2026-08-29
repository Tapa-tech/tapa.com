'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type CategoryKey = 'rg' | 'pa' | 'dc' | 'rk';

interface CardData {
  h: string;
  when?: string;
  now?: boolean;
  rt?: string;
  t: string;
  d?: string;
  s: string;
  pills?: [string, string][];
  read?: string;
  myth?: string;
}

export default function KnowledgeLandingPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('rg');
  const [activeFilter, setActiveFilter] = useState<number>(0);

  return (
    <div>
      {/* Category Switcher Bar */}
      <div className="prev flex flex-wrap items-center gap-2 px-4 py-2 md:px-10 bg-[#2E2260]">
        <span className="prev-l text-[#B9A9DC] text-[9.5px] font-bold tracking-[.7px] uppercase">
          PARENT CATEGORY LANDINGS
        </span>
        <button
          className={`prev-b text-[11.5px] font-semibold px-3 py-1.5 rounded-md border transition-all ${
            activeCategory === 'rg'
              ? 'bg-white text-[#2E2260] border-white'
              : 'bg-white/10 border-white/20 text-[#D8CEF0] hover:bg-white/20'
          }`}
          onClick={() => {
            setActiveCategory('rg');
            setActiveFilter(0);
          }}
        >
          Ritual Guides
        </button>
        <button
          className={`prev-b text-[11.5px] font-semibold px-3 py-1.5 rounded-md border transition-all ${
            activeCategory === 'pa'
              ? 'bg-white text-[#2E2260] border-white'
              : 'bg-white/10 border-white/20 text-[#D8CEF0] hover:bg-white/20'
          }`}
          onClick={() => {
            setActiveCategory('pa');
            setActiveFilter(0);
          }}
        >
          Panchang
        </button>
        <button
          className={`prev-b text-[11.5px] font-semibold px-3 py-1.5 rounded-md border transition-all ${
            activeCategory === 'dc'
              ? 'bg-white text-[#2E2260] border-white'
              : 'bg-white/10 border-white/20 text-[#D8CEF0] hover:bg-white/20'
          }`}
          onClick={() => {
            setActiveCategory('dc');
            setActiveFilter(0);
          }}
        >
          Dharmic Concepts
        </button>
        <button
          className={`prev-b text-[11.5px] font-semibold px-3 py-1.5 rounded-md border transition-all ${
            activeCategory === 'rk'
              ? 'bg-white text-[#2E2260] border-white'
              : 'bg-white/10 border-white/20 text-[#D8CEF0] hover:bg-white/20'
          }`}
          onClick={() => {
            setActiveCategory('rk');
            setActiveFilter(0);
          }}
        >
          Ritual Kits
        </button>
        <span className="prev-n hidden md:inline ml-auto text-[10.5px] text-[#9A8AC0] italic">
          Sub-categories live in the nav dropdown — never as tabs here
        </span>
      </div>

      {/* Breadcrumbs */}
      <div className="bcrumb bg-[var(--card)] border-b border-[var(--border)] px-4 md:px-10">
        <div className="bc-in max-w-[1280px] mx-auto py-2.5 text-[12px] md:text-[13px] text-[var(--sub-text)]">
          <div className="bc-l">
            <Link href="/" className="hover:underline">Home</Link> ›{' '}
            <b>
              {activeCategory === 'rg' && 'Ritual Guides'}
              {activeCategory === 'pa' && 'Panchang'}
              {activeCategory === 'dc' && 'Dharmic Concepts'}
              {activeCategory === 'rk' && 'Ritual Kits'}
            </b>
          </div>
        </div>
      </div>

      {/* Category Hero */}
      <section className={`chero ${activeCategory} py-8 md:py-11 px-4 md:px-10 relative overflow-hidden`}>
        <div className="max-w-[1280px] mx-auto">
          {activeCategory === 'rg' && (
            <div className="chero-in grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr] gap-6 md:gap-11 items-center">
              <div>
                <p className="ch-ey text-[#E3B567] text-[10px] tracking-[1px] mb-2.5 font-bold uppercase">
                  RITUAL GUIDES
                </p>
                <h1 className="ch-h1 text-[29px] md:text-[40px] font-bold text-[var(--hero-text)] leading-[1.12] tracking-[-.8px] mb-3">
                  Every ritual, the right way
                </h1>
                <p className="ch-p text-[14px] md:text-[15.5px] text-[rgba(255,253,245,.7)] leading-[1.8] max-w-[520px] mb-4.5">
                  The complete vidhi for festivals, vrats and life events — the steps, the story behind them, and a clear line between what scripture says and what your family does. Free, always.
                </p>
                <div className="ch-meta flex flex-wrap gap-4 md:gap-[22px]">
                  <span className="ch-m text-[12px] text-[rgba(255,253,245,.55)]">
                    <b className="text-[#E3B567] font-bold text-[14px]">34</b> guides live
                  </span>
                  <span className="ch-m text-[12px] text-[rgba(255,253,245,.55)]">
                    <b className="text-[#E3B567] font-bold text-[14px]">21</b> more by December
                  </span>
                  <span className="ch-m text-[12px] text-[rgba(255,253,245,.55)]">
                    <b className="text-[#E3B567] font-bold text-[14px]">4</b> sub-categories
                  </span>
                </div>
              </div>
              <div className="ch-side bg-white/10 border border-white/15 rounded-2xl p-5 md:p-5.5">
                <div className="chs-l text-[9.5px] font-bold text-[#E3B567] tracking-[.7px] mb-2.5 uppercase">
                  ◔ NEW TO ALL OF THIS?
                </div>
                <div className="chs-t text-[17px] font-bold text-white leading-[1.35] mb-1.5">
                  Start with Beginner's Guides
                </div>
                <p className="chs-d text-[12.5px] text-[rgba(255,253,245,.6)] leading-[1.65] mb-3.5">
                  No tags, no citations, no Sanskrit you have to look up. Just what to do.
                </p>
                <Link
                  href="/ritual-guides"
                  className="chs-c inline-block bg-[var(--pink)] border-none rounded-xl px-[18px] py-[10px] text-[12.5px] font-bold text-white hover:opacity-90"
                >
                  Start here ›
                </Link>
              </div>
            </div>
          )}

          {activeCategory === 'pa' && (
            <div className="chero-in grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr] gap-6 md:gap-11 items-center">
              <div>
                <p className="ch-ey text-[#E3B567] text-[10px] tracking-[1px] mb-2.5 font-bold uppercase">
                  PANCHANG
                </p>
                <h1 className="ch-h1 text-[29px] md:text-[40px] font-bold text-[var(--hero-text)] leading-[1.12] tracking-[-.8px] mb-3">
                  The calendar that follows the Moon
                </h1>
                <p className="ch-p text-[14px] md:text-[15.5px] text-[rgba(255,253,245,.7)] leading-[1.8] max-w-[520px] mb-4.5">
                  Today's tithi, the year's vrat dates, and how to read any of it yourself. Computed for your city — because a festival date genuinely differs between Delhi and Mumbai, and both are correct.
                </p>
                <div className="ch-meta flex flex-wrap gap-4 md:gap-[22px]">
                  <span className="ch-m text-[12px] text-[rgba(255,253,245,.55)]">
                    <b className="text-[#E3B567] font-bold text-[14px]">365</b> days computed
                  </span>
                  <span className="ch-m text-[12px] text-[rgba(255,253,245,.55)]">
                    <b className="text-[#E3B567] font-bold text-[14px]">142</b> vrat dates in 2026
                  </span>
                  <span className="ch-m text-[12px] text-[rgba(255,253,245,.55)]">
                    <b className="text-[#E3B567] font-bold text-[14px]">5</b> sub-categories
                  </span>
                </div>
              </div>
              <div className="ch-side bg-white/10 border border-white/15 rounded-2xl p-5 md:p-5.5">
                <div className="chs-l text-[9.5px] font-bold text-[#E3B567] tracking-[.7px] mb-2.5 uppercase">
                  ☀ COMPUTED FOR
                </div>
                <div className="chs-t text-[17px] font-bold text-white leading-[1.35] mb-1.5">
                  New Delhi · Purnimanta
                </div>
                <p className="chs-d text-[12.5px] text-[rgba(255,253,245,.6)] leading-[1.65] mb-3.5">
                  Entered and verified manually. We do not auto-fetch, because a page served from your own IP returns the wrong city.
                </p>
                <button
                  className="chs-c bg-[var(--pink)] border-none rounded-xl px-[18px] py-[10px] text-[12.5px] font-bold text-white hover:opacity-90"
                  onClick={() => alert('City selector modal opened! (Static Stub)')}
                >
                  Change city ›
                </button>
              </div>
            </div>
          )}

          {activeCategory === 'dc' && (
            <div className="chero-in grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr] gap-6 md:gap-11 items-center">
              <div>
                <p className="ch-ey text-[#E3B567] text-[10px] tracking-[1px] mb-2.5 font-bold uppercase">
                  DHARMIC CONCEPTS
                </p>
                <h1 className="ch-h1 text-[29px] md:text-[40px] font-bold text-[var(--hero-text)] leading-[1.12] tracking-[-.8px] mb-3">
                  The object in your hand has a story
                </h1>
                <p className="ch-p text-[14px] md:text-[15.5px] text-[rgba(255,253,245,.7)] leading-[1.8] max-w-[520px] mb-4.5">
                  Why bilva and not tulsi. Why three stories and not one. These sit behind every ritual guide — when a samagri list says "bilva leaves", this is where the reason lives.
                </p>
                <div className="ch-meta flex flex-wrap gap-4 md:gap-[22px]">
                  <span className="ch-m text-[12px] text-[rgba(255,253,245,.55)]">
                    <b className="text-[#E3B567] font-bold text-[14px]">2</b> live
                  </span>
                  <span className="ch-m text-[12px] text-[rgba(255,253,245,.55)]">
                    <b className="text-[#E3B567] font-bold text-[14px]">14</b> planned by March
                  </span>
                  <span className="ch-m text-[12px] text-[rgba(255,253,245,.55)]">
                    <b className="text-[#E3B567] font-bold text-[14px]">5</b> sub-categories
                  </span>
                </div>
              </div>
              <div className="ch-side bg-white/10 border border-white/15 rounded-2xl p-5 md:p-5.5">
                <div className="chs-l text-[9.5px] font-bold text-[#E3B567] tracking-[.7px] mb-2.5 uppercase">
                  ◗ LOOK UP ANY TERM
                </div>
                <div className="chs-t text-[17px] font-bold text-white leading-[1.35] mb-1.5">
                  The Glossary
                </div>
                <p className="chs-d text-[12.5px] text-[rgba(255,253,245,.6)] leading-[1.65] mb-3.5">
                  142 words defined once, in plain language, with the Devanagari and how to say it out loud.
                </p>
                <Link
                  href="/glossary"
                  className="chs-c inline-block bg-[var(--pink)] border-none rounded-xl px-[18px] py-[10px] text-[12.5px] font-bold text-white hover:opacity-90"
                >
                  Open the glossary ›
                </Link>
              </div>
            </div>
          )}

          {activeCategory === 'rk' && (
            <div className="chero-in grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr] gap-6 md:gap-11 items-center">
              <div>
                <p className="ch-ey text-[#E3B567] text-[10px] tracking-[1px] mb-2.5 font-bold uppercase">
                  RITUAL KITS · PRE-BOOKING OPEN
                </p>
                <h1 className="ch-h1 text-[29px] md:text-[40px] font-bold text-[var(--hero-text)] leading-[1.12] tracking-[-.8px] mb-3">
                  Everything the vidhi asks for, in one box
                </h1>
                <p className="ch-p text-[14px] md:text-[15.5px] text-[rgba(255,253,245,.7)] leading-[1.8] max-w-[520px] mb-4.5">
                  Sourced, packed and delivered before the date. Nothing you could not buy yourself — we have just done the finding. Every samagri list stays free on the guide.
                </p>
                <div className="ch-meta flex flex-wrap gap-4 md:gap-[22px]">
                  <span className="ch-m text-[12px] text-[rgba(255,253,245,.55)]">
                    <b className="text-[#E3B567] font-bold text-[14px]">14</b> kits
                  </span>
                  <span className="ch-m text-[12px] text-[rgba(255,253,245,.55)]">
                    <b className="text-[#E3B567] font-bold text-[14px]">4</b> sub-categories
                  </span>
                  <span className="ch-m text-[12px] text-[rgba(255,253,245,.55)]">
                    <b className="text-[#E3B567] font-bold text-[14px]">Free</b> cancellation until dispatch
                  </span>
                </div>
              </div>
              <div className="ch-side bg-white/10 border border-white/15 rounded-2xl p-5 md:p-5.5">
                <div className="chs-l text-[9.5px] font-bold text-[#E3B567] tracking-[.7px] mb-2.5 uppercase">
                  ◷ WORTH SAYING PLAINLY
                </div>
                <div className="chs-t text-[17px] font-bold text-white leading-[1.35] mb-1.5">
                  You do not need a kit
                </div>
                <p className="chs-d text-[12.5px] text-[rgba(255,253,245,.6)] leading-[1.65] mb-3.5">
                  Every samagri list is free and complete. A kit saves you a morning in the market. It does not make the puja more valid.
                </p>
                <Link
                  href="/ritual-guides"
                  className="chs-c inline-block bg-[var(--pink)] border-none rounded-xl px-[18px] py-[10px] text-[12.5px] font-bold text-white hover:opacity-90"
                >
                  Read a guide instead ›
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filter Bar */}
      <div className="filters bg-[var(--card)] border-b border-[var(--border)] px-4 md:px-10 py-3 sticky top-[72px] z-50 overflow-x-auto">
        <div className="f-in max-w-[1280px] mx-auto flex items-center gap-2.2 flex-nowrap md:flex-wrap">
          <span className="f-l text-[9.5px] font-bold text-[var(--gold)] tracking-[.6px] uppercase mr-1 flex-shrink-0">
            FILTER
          </span>

          {activeCategory === 'rg' && (
            <>
              {['Coming up', 'This month', 'Shiva', 'Vishnu', 'Devi', 'Ganesha'].map((f, i) => (
                <button
                  key={i}
                  className={`fc px-3.5 py-1.5 rounded-[9px] text-[12.5px] font-medium border whitespace-nowrap transition-all ${
                    activeFilter === i
                      ? 'bg-[#FFF0F5] border-[var(--pink)] text-[var(--pink)] font-bold'
                      : 'bg-[var(--bg)] border-[var(--border)] text-[var(--body-text)] hover:border-[var(--pink)]'
                  }`}
                  onClick={() => setActiveFilter(i)}
                >
                  {f}
                </button>
              ))}
              <span className="f-sort hidden md:inline ml-auto text-[12.5px] text-[var(--sub-text)]">
                Sort — <b className="text-[var(--body-text)] font-semibold">Date — soonest first</b> ▾
              </span>
            </>
          )}

          {activeCategory === 'pa' && (
            <>
              {['All', 'Ekadashi', 'Pradosh', 'Purnima', 'Amavasya'].map((f, i) => (
                <button
                  key={i}
                  className={`fc px-3.5 py-1.5 rounded-[9px] text-[12.5px] font-medium border whitespace-nowrap transition-all ${
                    activeFilter === i
                      ? 'bg-[#FFF0F5] border-[var(--pink)] text-[var(--pink)] font-bold'
                      : 'bg-[var(--bg)] border-[var(--border)] text-[var(--body-text)] hover:border-[var(--pink)]'
                  }`}
                  onClick={() => setActiveFilter(i)}
                >
                  {f}
                </button>
              ))}
              <span className="f-sort hidden md:inline ml-auto text-[12.5px] text-[var(--sub-text)]">
                Sort — <b className="text-[var(--body-text)] font-semibold">Date — soonest first</b> ▾
              </span>
            </>
          )}

          {activeCategory === 'dc' && (
            <>
              {['All', 'Shiva', 'Vishnu', 'Devi', 'Ganesha'].map((f, i) => (
                <button
                  key={i}
                  className={`fc px-3.5 py-1.5 rounded-[9px] text-[12.5px] font-medium border whitespace-nowrap transition-all ${
                    activeFilter === i
                      ? 'bg-[#FFF0F5] border-[var(--pink)] text-[var(--pink)] font-bold'
                      : 'bg-[var(--bg)] border-[var(--border)] text-[var(--body-text)] hover:border-[var(--pink)]'
                  }`}
                  onClick={() => setActiveFilter(i)}
                >
                  {f}
                </button>
              ))}
              <span className="f-sort hidden md:inline ml-auto text-[12.5px] text-[var(--sub-text)]">
                Sort — <b className="text-[var(--body-text)] font-semibold">Most read</b> ▾
              </span>
            </>
          )}

          {activeCategory === 'rk' && (
            <>
              {['All kits', 'Pre-book', 'In stock', 'Under ₹1,000', '₹1,000–2,000'].map((f, i) => (
                <button
                  key={i}
                  className={`fc px-3.5 py-1.5 rounded-[9px] text-[12.5px] font-medium border whitespace-nowrap transition-all ${
                    activeFilter === i
                      ? 'bg-[#FFF0F5] border-[var(--pink)] text-[var(--pink)] font-bold'
                      : 'bg-[var(--bg)] border-[var(--border)] text-[var(--body-text)] hover:border-[var(--pink)]'
                  }`}
                  onClick={() => setActiveFilter(i)}
                >
                  {f}
                </button>
              ))}
              <span className="f-sort hidden md:inline ml-auto text-[12.5px] text-[var(--sub-text)]">
                Sort — <b className="text-[var(--body-text)] font-semibold">Cut-off — soonest first</b> ▾
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Stage Content */}
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 pb-[10px]">
        {/* RITUAL GUIDES STAGE */}
        {activeCategory === 'rg' && (
          <>
            <div className="sec mt-[30px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    START HERE
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    Beginner's Guides
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    Plain language, no citations, no Sanskrit to look up. Read in order — it takes about half an hour.
                  </p>
                </div>
                <Link href="/ritual-guides" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">5 guides</span>View all ›
                </Link>
              </div>

              <div className="fcard grid grid-cols-1 md:grid-cols-2 rounded-[18px] overflow-hidden border border-[var(--border)]">
                <div className="fc-l beg bg-gradient-to-br from-[#6B3410] to-[#2A1408] p-6 md:p-[34px] flex flex-col justify-center">
                  <span className="fc-tag inline-flex self-start bg-white/20 border border-white/30 rounded-[7px] px-3 py-1 text-[10px] font-bold text-white tracking-[.4px] mb-3.5 uppercase">
                    READ IN THIS ORDER
                  </span>
                  <div className="fc-t text-[22px] md:text-[27px] font-bold text-white leading-[1.2] tracking-[-.5px] mb-2.5">
                    Nobody is born knowing the vidhi
                  </div>
                  <p className="fc-d text-[13.5px] text-white/70 leading-[1.7] mb-4">
                    Five guides that assume nothing. What to buy, what to say, how long it takes, and what genuinely does not matter as much as you have been told.
                  </p>
                  <button className="fc-c bg-white border-none rounded-xl px-5 py-[11px] text-[12.5px] font-bold text-[var(--dark)] self-start hover:bg-white/90">
                    Start at step 1 ›
                  </button>
                </div>
                <div className="fc-r bg-[var(--card)] p-6 md:p-[32px] flex flex-col justify-center gap-2.5">
                  <Link href="/ritual-guides/what-is-a-vrat" className="fc-i flex items-center justify-between gap-3 py-2.5 border-b border-[var(--border-light)] hover:opacity-80">
                    <span>
                      <span className="fc-in block text-[14.5px] font-semibold text-[var(--dark)]">1 · What is a vrat?</span>
                      <span className="fc-is block text-[11.5px] text-[var(--sub-text)] mt-[2px]">6 min read</span>
                    </span>
                    <span className="fc-ia text-[16px] text-[var(--pink)]">›</span>
                  </Link>
                  <Link href="/ritual-guides/first-puja" className="fc-i flex items-center justify-between gap-3 py-2.5 border-b border-[var(--border-light)] hover:opacity-80">
                    <span>
                      <span className="fc-in block text-[14.5px] font-semibold text-[var(--dark)]">2 · Your first puja at home</span>
                      <span className="fc-is block text-[11.5px] text-[var(--sub-text)] mt-[2px]">8 min · under ₹300 to start</span>
                    </span>
                    <span className="fc-ia text-[16px] text-[var(--pink)]">›</span>
                  </Link>
                  <Link href="/ritual-guides/ganesh-chaturthi" className="fc-i flex items-center justify-between gap-3 py-2.5 border-b border-[var(--border-light)] hover:opacity-80">
                    <span>
                      <span className="fc-in block text-[14.5px] font-semibold text-[var(--dark)]">3 · Ganesh Chaturthi for beginners</span>
                      <span className="fc-is block text-[11.5px] text-[var(--sub-text)] mt-[2px]">9 min · for 14 September</span>
                    </span>
                    <span className="fc-ia text-[16px] text-[var(--pink)]">›</span>
                  </Link>
                  <Link href="/ritual-guides/diwali-beginners" className="fc-i flex items-center justify-between gap-3 py-2.5 border-b border-[var(--border-light)] hover:opacity-80">
                    <span>
                      <span className="fc-in block text-[14.5px] font-semibold text-[var(--dark)]">4 · Diwali for beginners</span>
                      <span className="fc-is block text-[11.5px] text-[var(--sub-text)] mt-[2px]">9 min · for November</span>
                    </span>
                    <span className="fc-ia text-[16px] text-[var(--pink)]">›</span>
                  </Link>
                  <Link href="/ritual-guides/seven-kandas" className="fc-i flex items-center justify-between gap-3 py-2.5 border-b border-[var(--border-light)] hover:opacity-80">
                    <span>
                      <span className="fc-in block text-[14.5px] font-semibold text-[var(--dark)]">5 · The seven kandas</span>
                      <span className="fc-is block text-[11.5px] text-[var(--sub-text)] mt-[2px]">6 min · no Sanskrit required</span>
                    </span>
                    <span className="fc-ia text-[16px] text-[var(--pink)]">›</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="sec mt-[38px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    FIXED TO A TITHI
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    Festive Pujans
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    The date moves each year because it follows the lunar calendar, not the Gregorian one. Every guide states both.
                  </p>
                </div>
                <Link href="/ritual-guides" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">18 guides</span>View all ›
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <RenderCard
                  card={{
                    h: 'h-teej',
                    when: 'IN 6 DAYS',
                    now: true,
                    t: 'Hartalika Teej',
                    d: '13 September',
                    s: 'The sand Shivalinga, the night vigil, and why this is a different vrat from Hariyali Teej.',
                    pills: [['d', 'DHARMA · 4/5']],
                    read: '9 min',
                    myth: '"Nirjala or the vrat doesn’t count."',
                  }}
                  href="/ritual-guides/hartalika-teej"
                />
                <RenderCard
                  card={{
                    h: 'h-ganesh',
                    when: 'IN 7 DAYS',
                    now: true,
                    t: 'Ganesh Chaturthi',
                    d: '14 September',
                    s: 'Prana pratishtha at the Madhyahna muhurat, and what a pandit is genuinely for.',
                    pills: [['d', 'DHARMA · 4/5']],
                    read: '11 min',
                    myth: '"Only a pandit can perform this."',
                  }}
                  href="/ritual-guides/ganesh-chaturthi"
                />
                <RenderCard
                  card={{
                    h: 'h-devi',
                    when: 'IN 34 DAYS',
                    t: 'Sharad Navratri',
                    d: '11–19 October',
                    s: 'Nine nights, nine forms, one Mother. Ghatasthapana to Maha Navami, day by day.',
                    pills: [['d', 'DHARMA · 4/5']],
                    read: '18 min',
                    myth: '"If the Akhand Jyoti goes out, it is wasted."',
                  }}
                  href="/ritual-guides/sharad-navratri"
                />
              </div>
            </div>

            <div className="sec mt-[38px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    NOT TIED TO ONE DATE
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    All-Year Pujans
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    Recurring observances and household rituals. Kept when the household needs them, not when the calendar says so.
                  </p>
                </div>
                <Link href="/ritual-guides" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">11 guides</span>View all ›
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <RenderCard
                  card={{
                    h: 'h-shiva',
                    t: 'Sawan Somwar Vrat',
                    d: 'Every Monday of Shravan',
                    s: 'Jalabhishek, the bilva offering, and the fasting forms that are genuinely accepted.',
                    pills: [['d', 'DHARMA · 4/5']],
                    read: '12 min',
                    myth: '"Missing one Monday invalidates all of them."',
                  }}
                  href="/ritual-guides/sawan-somwar"
                />
                <RenderCard
                  card={{
                    h: 'h-earth',
                    t: 'Sundarkand Path',
                    d: 'Most often on Tuesday',
                    s: 'The fifth kanda, recited at home. What you need, how long it takes, and the parts people skip.',
                    pills: [['d', 'DHARMA · 4/5']],
                    read: '13 min',
                  }}
                  href="/ritual-guides/sundarkand-path"
                />
                <RenderCard
                  card={{
                    h: 'h-vishnu',
                    t: 'Satyanarayan Katha',
                    d: 'Purnima, or any auspicious day',
                    s: 'The five-chapter katha, the prasad, and why this is the most performed household puja in North India.',
                    pills: [['d', 'DHARMA · 4/5']],
                    read: '14 min',
                  }}
                  href="/ritual-guides/satyanarayan-katha"
                />
              </div>
            </div>

            <div className="sec mt-[38px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    ONCE IN A LIFE
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    Sanskar &amp; Life Events
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    The sixteen sacraments, from before birth to after death. Written with care, and without fear.
                  </p>
                </div>
                <Link href="/ritual-guides" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">8 guides</span>View all ›
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <RenderCard
                  card={{
                    h: 'h-sanskar',
                    t: 'Naamkaran',
                    d: 'Birth & childhood',
                    s: 'Naming the child. When it is done, who does it, and what the ceremony actually requires.',
                    pills: [['d', 'DHARMA · 5/5']],
                    read: '10 min',
                  }}
                  href="/ritual-guides/naamkaran"
                />
                <RenderCard
                  card={{
                    h: 'h-sanskar',
                    t: 'Griha Pravesh',
                    d: 'Home & space',
                    s: 'Entering a new home. The kalash, the boiling of milk, and the muhurat that matters.',
                    pills: [['d', 'DHARMA · 4/5']],
                    read: '12 min',
                  }}
                  href="/ritual-guides/griha-pravesh"
                />
                <RenderCard
                  card={{
                    h: 'h-sanskar',
                    t: 'Shraddha & Pitru Karma',
                    d: 'End of life',
                    s: 'Tarpan, the sixteen days of Pitru Paksha, and what is asked of the one performing it.',
                    pills: [['d', 'DHARMA · 5/5']],
                    read: '16 min',
                    myth: '"Skipping shraddha harms the departed."',
                  }}
                  href="/ritual-guides/shraddha"
                />
              </div>
            </div>
          </>
        )}

        {/* PANCHANG STAGE */}
        {activeCategory === 'pa' && (
          <>
            <div className="sec mt-[30px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    RIGHT NOW
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    Today's Panchang
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    The full day — tithi, nakshatra, yoga, karana, sunrise, sunset and Rahu Kaal.
                  </p>
                </div>
                <Link href="/panchang" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">updated daily</span>Open today ›
                </Link>
              </div>

              <div className="fcard grid grid-cols-1 md:grid-cols-2 rounded-[18px] overflow-hidden border border-[var(--border)]">
                <div className="fc-l today bg-gradient-to-br from-[#1B3A52] to-[#0C1A26] p-6 md:p-[34px] flex flex-col justify-center">
                  <span className="fc-tag inline-flex self-start bg-white/20 border border-white/30 rounded-[7px] px-3 py-1 text-[10px] font-bold text-white tracking-[.4px] mb-3.5 uppercase">
                    MONDAY, 7 SEPTEMBER 2026
                  </span>
                  <div className="fc-t text-[22px] md:text-[27px] font-bold text-white leading-[1.2] tracking-[-.5px] mb-2.5">
                    Bhadrapada Krishna Ekadashi
                  </div>
                  <p className="fc-d text-[13.5px] text-white/70 leading-[1.7] mb-4">
                    Krishna paksha, waning. Aja Ekadashi — grain avoidance today, parana tomorrow morning.
                  </p>
                  <Link href="/panchang" className="fc-c inline-block bg-white border-none rounded-xl px-5 py-[11px] text-[12.5px] font-bold text-[var(--dark)] self-start hover:bg-white/90">
                    Open today's Panchang ›
                  </Link>
                </div>
                <div className="fc-r bg-[var(--card)] p-6 md:p-[32px] flex flex-col justify-center gap-2.5">
                  <div className="fc-live flex items-center gap-2.5 bg-[var(--data-bg)] border border-[var(--data-bd)] rounded-xl p-3.5">
                    <span className="fcl-d w-2.5 h-2.5 rounded-full bg-[#3FBF6A] shadow-[0_0_0_3px_rgba(63,191,106,.2)] flex-shrink-0"></span>
                    <span>
                      <span className="fcl-t block text-[9.5px] font-bold text-[var(--data-tx)] tracking-[.5px] uppercase">
                        DELHI-NCR · LIVE
                      </span>
                      <span className="fcl-v block text-[15px] font-bold text-[var(--data-tx)] mt-[2px]">
                        Sunrise 5:58 AM
                      </span>
                    </span>
                  </div>
                  <Link href="/panchang" className="fc-i flex items-center justify-between gap-3 py-2.5 border-b border-[var(--border-light)] hover:opacity-80">
                    <span>
                      <span className="fc-in block text-[14.5px] font-semibold text-[var(--dark)]">Nakshatra</span>
                      <span className="fc-is block text-[11.5px] text-[var(--sub-text)] mt-[2px]">Ardra, until 3:12 PM</span>
                    </span>
                    <span className="fc-ia text-[16px] text-[var(--pink)]">›</span>
                  </Link>
                  <Link href="/panchang" className="fc-i flex items-center justify-between gap-3 py-2.5 border-b border-[var(--border-light)] hover:opacity-80">
                    <span>
                      <span className="fc-in block text-[14.5px] font-semibold text-[var(--dark)]">Rahu Kaal</span>
                      <span className="fc-is block text-[11.5px] text-[var(--sub-text)] mt-[2px]">7:32 – 9:05 AM</span>
                    </span>
                    <span className="fc-ia text-[16px] text-[var(--pink)]">›</span>
                  </Link>
                  <Link href="/panchang" className="fc-i flex items-center justify-between gap-3 py-2.5 border-b border-[var(--border-light)] hover:opacity-80">
                    <span>
                      <span className="fc-in block text-[14.5px] font-semibold text-[var(--dark)]">Next major date</span>
                      <span className="fc-is block text-[11.5px] text-[var(--sub-text)] mt-[2px]">Ganesh Chaturthi, 14 September</span>
                    </span>
                    <span className="fc-ia text-[16px] text-[var(--pink)]">›</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="sec mt-[38px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    EVERY OBSERVANCE
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    Vrat Calendar
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    Ekadashi, Pradosh, Chaturthi, Purnima and Amavasya — with the tithi each one follows, so you can check it against your own panchang.
                  </p>
                </div>
                <Link href="/panchang/vrat-calendar" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">142 dates</span>View all ›
                </Link>
              </div>

              <div className="rows bg-[var(--card)] border border-[var(--border)] rounded-[15px] overflow-hidden">
                <RenderRow title="Aja Ekadashi · 8 September" sub="Grain avoidance · parana window 9 September morning" href="/panchang/vrat-calendar" />
                <RenderRow title="Pradosh Vrat · 9 September" sub="Evening Shiva puja · Bhadrapada Krishna Trayodashi" href="/panchang/vrat-calendar" />
                <RenderRow title="Amavasya · 11 September" sub="Pithori Amavasya · Shraddha observed" href="/panchang/vrat-calendar" />
                <RenderRow title="Sharad Navratri · 11–19 October" sub="Day-by-day panchang with Ghatasthapana muhurat" href="/panchang/vrat-calendar" />
              </div>
            </div>

            <div className="sec mt-[38px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    MONTH BY MONTH
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    Festival Calendar
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    For anyone who plans in months rather than tithis. Gregorian dates first, tithi beneath.
                  </p>
                </div>
                <Link href="/panchang/festival-calendar" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">48 festivals</span>View all ›
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <RenderCard
                  card={{
                    h: 'h-data',
                    rt: 'SEPTEMBER',
                    t: '6 festivals',
                    d: 'Bhadrapada into Ashwin',
                    s: 'Janmashtami, Hartalika Teej, Ganesh Chaturthi, Radha Ashtami, Anant Chaturdashi, Pitru Paksha.',
                    pills: [['n', 'MONTH VIEW']],
                  }}
                  href="/panchang/festival-calendar"
                />
                <RenderCard
                  card={{
                    h: 'h-data',
                    rt: 'OCTOBER',
                    t: '9 festivals',
                    d: 'Ashwin into Kartik',
                    s: 'Sharad Navratri, Durga Ashtami, Vijayadashami, Karwa Chauth, Dhanteras.',
                    pills: [['n', 'MONTH VIEW']],
                  }}
                  href="/panchang/festival-calendar"
                />
                <RenderCard
                  card={{
                    h: 'h-data',
                    rt: 'NOVEMBER',
                    t: '7 festivals',
                    d: 'Kartik',
                    s: 'Diwali, Govardhan Puja, Bhai Dooj, Dev Uthani Ekadashi, Tulsi Vivah, Kartik Purnima.',
                    pills: [['n', 'MONTH VIEW']],
                  }}
                  href="/panchang/festival-calendar"
                />
              </div>
            </div>

            <div className="sec mt-[38px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    VISIBILITY DECIDES
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    Eclipses
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    Where an eclipse cannot be seen, Sutak Kaal is not observed. That single fact is what forwarded warnings leave out.
                  </p>
                </div>
                <Link href="/panchang/eclipses" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">2 in 2026</span>View all ›
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <RenderCard
                  card={{
                    h: 'h-data',
                    rt: '12 AUGUST',
                    t: 'Surya Grahan',
                    d: 'Total solar eclipse',
                    s: 'Not visible from India. Path runs across the Arctic, Greenland, Iceland and northern Spain.',
                    pills: [['n', 'NOT VISIBLE']],
                    read: '6 min',
                  }}
                  href="/panchang/eclipses"
                />
                <RenderCard
                  card={{
                    h: 'h-data',
                    rt: '28 AUGUST',
                    t: 'Chandra Grahan',
                    d: 'Partial lunar eclipse',
                    s: 'India visibility unconfirmed across sources. Falls on the same day as Raksha Bandhan.',
                    pills: [['n', 'UNCONFIRMED']],
                    read: '6 min',
                    myth: '"Every eclipse affects everyone in India."',
                  }}
                  href="/panchang/eclipses"
                />
              </div>
            </div>
          </>
        )}

        {/* DHARMIC CONCEPTS STAGE */}
        {activeCategory === 'dc' && (
          <>
            <div className="sec mt-[30px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    OBJECTS AND WHAT THEY MEAN
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    Materials
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    The things you hold, offer and light. Each one has a story, a source and a set of offering rules.
                  </p>
                </div>
                <Link href="/dharmic-concepts" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">9 planned · 1 live</span>View all ›
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <RenderCard
                  card={{
                    h: 'h-shiva',
                    rt: 'LIVE',
                    t: 'Why is bilva dear to Mahadev?',
                    d: 'Materials · Shiva',
                    s: 'Three leaves on one stem. The tree did not study scripture to grow that way — the tradition recognised what it saw.',
                    pills: [['d', 'DHARMA · 4/5'], ['n', 'PURANIC']],
                    read: '12 min',
                  }}
                  href="/dharmic-concepts/bilva"
                />
                <RenderCard
                  card={{
                    h: 'h-vishnu',
                    rt: 'SOON',
                    t: 'Why is tulsi sacred to Vishnu?',
                    d: 'Materials · Vishnu',
                    s: 'Lakshmi’s form as a plant, present in every Vishnu and Krishna puja — and never offered to Shiva.',
                    pills: [['n', 'COMING SOON']],
                    read: '—',
                  }}
                  href="/dharmic-concepts/tulsi"
                />
                <RenderCard
                  card={{
                    h: 'h-ganesh',
                    rt: 'SOON',
                    t: 'Why is durva offered to Ganesha?',
                    d: 'Materials · Ganesha',
                    s: 'The grass offered on his head, in bunches of twenty-one. Named in the Ganesha Purana.',
                    pills: [['n', 'COMING SOON']],
                    read: '—',
                  }}
                  href="/dharmic-concepts/durva"
                />
              </div>
            </div>

            <div className="sec mt-[38px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    ACTS AND IDEAS
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    Meanings &amp; Practices
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    What you do, and what it means. Sankalpa, abhishek, avahana — the acts every vidhi assumes you already understand.
                  </p>
                </div>
                <Link href="/dharmic-concepts" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">12 planned · 1 live</span>View all ›
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <RenderCard
                  card={{
                    h: 'h-thread',
                    rt: 'LIVE',
                    t: 'Three Stories, One Thread',
                    d: 'The raksha sutra',
                    s: 'Wife, friend, devotee — three relationships, one act of protection. Not one of them is a sister and a brother.',
                    pills: [['d', 'DHARMA · 4/5'], ['n', 'PURANIC']],
                    read: '7 min',
                    myth: '"All three stories are about siblings."',
                  }}
                  href="/dharmic-concepts/raksha-sutra"
                />
                <RenderCard
                  card={{
                    h: 'h-earth',
                    rt: 'SOON',
                    t: 'Sankalp — saying it out loud',
                    d: 'Meanings & Practices',
                    s: 'The resolve stated at the start of a vrat. Why it is said, what it must contain, and what it does not need.',
                    pills: [['n', 'COMING SOON']],
                    read: '—',
                  }}
                  href="/dharmic-concepts/sankalp"
                />
                <RenderCard
                  card={{
                    h: 'h-shiva',
                    rt: 'SOON',
                    t: 'Yajna, Havan or Homa?',
                    d: 'Meanings & Practices',
                    s: 'Three words used interchangeably, for three different things. The distinction is older than the confusion.',
                    pills: [['n', 'COMING SOON']],
                    read: '—',
                  }}
                  href="/dharmic-concepts/yajna-havan"
                />
              </div>
            </div>

            <div className="sec mt-[38px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    EVERY MORNING
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    Daily Puja
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    The practice that is not attached to a festival. Room setup, the diya, the aarti, and what a daily puja actually asks of you.
                  </p>
                </div>
                <Link href="/dharmic-concepts" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">7 planned</span>View all ›
                </Link>
              </div>

              <div className="rows bg-[var(--card)] border border-[var(--border)] rounded-[15px] overflow-hidden">
                <RenderRow title="Puja room setup — where and how" sub="Direction, height, what belongs on the shelf and what does not" href="/dharmic-concepts" />
                <RenderRow title="Morning sandhya and panch-upachara" sub="The five-offering form, in about ten minutes" href="/dharmic-concepts" />
                <RenderRow title="Tulsi Puja — the daily practice" sub="Watering, the evening diya, and the days it is not plucked" href="/dharmic-concepts" />
                <RenderRow title="Deepa Daan — when, why and how" sub="The lamp as offering rather than decoration" href="/dharmic-concepts" />
              </div>
            </div>

            <div className="sec mt-[38px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    THE SIGNATURE SERIES
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    Dharma vs Pratha
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    Twenty articles by December. Each one takes a practice everyone assumes is mandatory and shows exactly where it comes from.
                  </p>
                </div>
                <Link href="/dharmic-concepts" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">20 planned</span>View all ›
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <RenderCard
                  card={{
                    h: 'h-gold',
                    rt: 'SOON',
                    t: '10 things you think are mandatory',
                    d: 'Dharma vs Pratha',
                    s: 'And are not. Each one traced to where it actually came from — usually a region, sometimes a shop.',
                    pills: [['n', 'COMING SOON']],
                    read: '—',
                  }}
                  href="/dharmic-concepts"
                />
                <RenderCard
                  card={{
                    h: 'h-gold',
                    rt: 'SOON',
                    t: 'Can women do puja during menstruation?',
                    d: 'Dharma vs Pratha',
                    s: 'Genuinely contested. We present the range of positions with sources, and say plainly where no scriptural restriction exists.',
                    pills: [['n', 'COMING SOON']],
                    read: '—',
                  }}
                  href="/dharmic-concepts"
                />
                <RenderCard
                  card={{
                    h: 'h-gold',
                    rt: 'SOON',
                    t: 'Regional practice myths',
                    d: 'Dharma vs Pratha',
                    s: 'Your way is not wrong because it differs from theirs. An ongoing series on what varies and why.',
                    pills: [['n', 'COMING SOON']],
                    read: '—',
                  }}
                  href="/dharmic-concepts"
                />
              </div>
            </div>
          </>
        )}

        {/* RITUAL KITS STAGE */}
        {activeCategory === 'rk' && (
          <>
            <div className="sec mt-[30px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    DATED · CUT-OFF APPLIES
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    By festival
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    Prepaid, no COD. The cut-off is real — perishable samagri is packed to order and cannot be resold.
                  </p>
                </div>
                <Link href="/ritual-kits" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">9 kits</span>View all ›
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <RenderCard
                  card={{
                    h: 'h-ganesh',
                    when: 'ORDER BY 10 SEP',
                    now: true,
                    t: 'Ganesh Sthapana Kit',
                    d: '₹1,650 · incl. delivery',
                    s: 'Shadu mati idol, chowki cloth, kalash set, durva, modak mould, akshata, dhoop. 21-item samagri box with Gyan Patrika.',
                    pills: [['pr', 'PRE-BOOK']],
                  }}
                  href="/ritual-kits"
                />
                <RenderCard
                  card={{
                    h: 'h-devi',
                    when: 'ORDER BY 8 OCT',
                    t: 'Shakti Kit',
                    d: '₹1,751 · Navratri',
                    s: 'Kalash set, barley and pot, chunri, akhand jyoti vessel, Saptashati, puja powders and the Kanya Pujan items.',
                    pills: [['pr', 'PRE-BOOK']],
                  }}
                  href="/ritual-kits"
                />
                <RenderCard
                  card={{
                    h: 'h-gold',
                    when: 'ORDER BY 1 NOV',
                    t: 'Shubh Akshaya',
                    d: '₹1,251 · Diwali',
                    s: 'The beginner’s kit. Lakshmi and Ganesha idols, diyas and wicks, kalash, puja powders and a booklet explaining each item.',
                    pills: [['pr', 'PRE-BOOK']],
                  }}
                  href="/ritual-kits"
                />
              </div>
            </div>

            <div className="sec mt-[38px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    ALL YEAR · COD AVAILABLE
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    By ritual
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    Not tied to a date. Order when the household needs it.
                  </p>
                </div>
                <Link href="/ritual-kits" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">7 kits</span>View all ›
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <RenderCard
                  card={{
                    h: 'h-shiva',
                    t: 'Rudrabhishek Kit',
                    d: '₹1,451',
                    s: 'Gangajal, panchamrit items, dried bilva patra, white chandan and the vidhi card.',
                    pills: [['n', 'IN STOCK']],
                  }}
                  href="/ritual-kits"
                />
                <RenderCard
                  card={{
                    h: 'h-vishnu',
                    t: 'Satyanarayan Kit',
                    d: '₹1,951',
                    s: 'Panchamrit, panchmeva, supari, banana leaves and the five-chapter katha booklet.',
                    pills: [['n', 'IN STOCK']],
                  }}
                  href="/ritual-kits"
                />
                <RenderCard
                  card={{
                    h: 'h-earth',
                    t: 'Sundarkand Kit',
                    d: '₹2,151',
                    s: 'Gita Press edition, asan, deepak and wicks, chandan, akshat and the recitation card.',
                    pills: [['n', 'IN STOCK']],
                  }}
                  href="/ritual-kits"
                />
              </div>
            </div>

            <div className="sec mt-[38px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    ONCE IN A LIFE
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    Griha &amp; Life Events
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    Higher-value kits for a house, a vehicle, a shop or a sanskar. Purohit booking available alongside from November.
                  </p>
                </div>
                <Link href="/ritual-kits" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">10 kits</span>View all ›
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <RenderCard
                  card={{
                    h: 'h-sanskar',
                    t: 'Griha Pravesh Kit',
                    d: '₹3,451',
                    s: 'Kalash, navgrah samagri, havan samagri, mauli and the full vidhi booklet.',
                    pills: [['n', 'IN STOCK']],
                  }}
                  href="/ritual-kits"
                />
                <RenderCard
                  card={{
                    h: 'h-sanskar',
                    t: 'Vahan Pujan Kit',
                    d: '₹651',
                    s: 'Lemon, chilli, mauli, kumkum, diya and the vidhi card. The smallest kit we make.',
                    pills: [['n', 'IN STOCK']],
                  }}
                  href="/ritual-kits"
                />
                <RenderCard
                  card={{
                    h: 'h-sanskar',
                    t: 'Shraddha Samagri Kit',
                    d: '₹1,851',
                    s: 'Til, jau, ghee, kush and pind ingredients, with the tarpan vidhi card.',
                    pills: [['n', 'IN STOCK']],
                  }}
                  href="/ritual-kits"
                />
              </div>
            </div>

            <div className="sec mt-[38px]">
              <div className="sec-h flex flex-col md:flex-row md:items-end justify-between gap-[9px] md:gap-5 mb-4 pb-3 border-b border-[var(--border)]">
                <div>
                  <div className="sec-ey text-[10px] font-bold text-[var(--pink)] tracking-[.8px] mb-1.5 uppercase">
                    THE THINGS THAT RUN OUT
                  </div>
                  <div className="sec-t text-[20px] md:text-[24px] font-bold text-[var(--dark)] tracking-[-.4px] leading-[1.25]">
                    Daily Puja Essentials
                  </div>
                  <p className="sec-s text-[13.5px] text-[var(--sub-text)] leading-[1.7] mt-1.5 max-w-[640px]">
                    Consumables and temple essentials. Buy once, reorder when you need to — or set a monthly box from next year.
                  </p>
                </div>
                <Link href="/ritual-kits" className="sec-a text-[12.5px] text-[var(--pink)] font-bold whitespace-nowrap flex-shrink-0">
                  <span className="text-[var(--sub-text)] font-normal mr-2">2 groups</span>View all ›
                </Link>
              </div>

              <div className="rows bg-[var(--card)] border border-[var(--border)] rounded-[15px] overflow-hidden">
                <RenderRow title="Consumables" sub="Dhoop · agarbatti · camphor · kumkum · akshat · chandan · pure ghee · cotton wicks" href="/ritual-kits" />
                <RenderRow title="Temple essentials" sub="Diyas in brass and clay · bell · copper kalash · panchpatra · asana · rudraksha, tulsi and sphatik mala" href="/ritual-kits" />
                <RenderRow title="Monthly Essentials Box — from 2027" sub="Curated replenishment, delivered monthly. Not open yet." href="/ritual-kits" />
              </div>
            </div>
          </>
        )}

        {/* Editorial Method Banner */}
        <div className="methodband bg-[var(--darkbar)] rounded-[18px] p-[24px] md:p-[30px_34px] grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-[22px] md:gap-[34px] items-center mt-11">
          <div>
            <div className="mb-ey text-[10px] font-bold text-[#E3B567] tracking-[.8px] mb-2.5 uppercase">
              HOW WE DECIDE WHAT IS TRUE
            </div>
            <div className="mb-t text-[19px] md:text-[22px] font-bold text-[var(--hero-text)] leading-[1.3] tracking-[-.4px] mb-2.5">
              Every badge on this page means something specific
            </div>
            <p className="mb-p text-[14px] text-[#C4A882] leading-[1.82] mb-4">
              Dharma, Pratha or Bhranti — with a confidence score you can check. If we cannot name the text a reader could open, we do not make the claim.
            </p>
            <Link href="/editorial-method" className="mb-c inline-block bg-[var(--pink)] border-none rounded-[11px] px-[22px] py-[11px] text-[12.5px] font-bold text-white hover:opacity-90">
              Read our editorial method ›
            </Link>
          </div>
          <div className="mb-r flex flex-col gap-2">
            <div className="mbr bg-white/5 rounded-[11px] p-[11px_15px] border-l-4 border-[#7BD69B]">
              <div className="mbr-k text-[11.5px] font-bold text-[#7BD69B] mb-0.5">DHARMA</div>
              <div className="mbr-v text-[11.5px] text-[#A99070] leading-[1.6]">Named in a text you could open yourself.</div>
            </div>
            <div className="mbr bg-white/5 rounded-[11px] p-[11px_15px] border-l-4 border-[var(--amber)]">
              <div className="mbr-k text-[11.5px] font-bold text-[var(--amber)] mb-0.5">PRATHA</div>
              <div className="mbr-v text-[11.5px] text-[#A99070] leading-[1.6]">Regional or family custom. Real — not scripture.</div>
            </div>
            <div className="mbr bg-white/5 rounded-[11px] p-[11px_15px] border-l-4 border-[#B8A184]">
              <div className="mbr-k text-[11.5px] font-bold text-[#D4B58A] mb-0.5">BHRANTI</div>
              <div className="mbr-v text-[11.5px] text-[#A99070] leading-[1.6]">A misconception. Corrected in every guide it appears in.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponents for Cards & Rows
function RenderCard({ card, href }: { card: CardData; href: string }) {
  return (
    <Link href={href} className="c bg-[var(--card)] border border-[var(--border)] hover:border-[var(--pink)] rounded-[15px] overflow-hidden flex flex-col transition-all group">
      <div className={`c-top ${card.h} h-[100px] relative flex items-start justify-between p-[12px_14px]`}>
        {card.when && (
          <span className={`c-when text-[9.5px] font-bold tracking-[.4px] px-[9px] py-[3px] rounded-[5px] text-white border border-white/30 ${card.now ? 'bg-[var(--pink)] border-[var(--pink)]' : 'bg-white/20'}`}>
            {card.when}
          </span>
        )}
        {card.rt && (
          <span className="c-when text-[9.5px] font-bold tracking-[.4px] px-[9px] py-[3px] rounded-[5px] bg-white/20 text-white border border-white/30">
            {card.rt}
          </span>
        )}
      </div>
      <div className="c-b p-[15px_17px_17px] flex-1 flex flex-col">
        <div className="c-t text-[16.5px] font-bold text-[var(--dark)] leading-[1.28] mb-[5px] group-hover:text-[var(--pink)]">
          {card.t}
        </div>
        {card.d && <div className="c-d text-[11.5px] font-semibold text-[var(--gold)] mb-[9px]">{card.d}</div>}
        <p className="c-s text-[12.5px] text-[var(--sub-text)] leading-[1.68] mb-[13px] flex-1">{card.s}</p>
        <div className="c-f flex items-center gap-[7px] flex-wrap">
          {(card.pills || []).map(([type, label], idx) => (
            <span
              key={idx}
              className={`pill text-[10px] px-[9px] py-[3px] rounded-[5px] font-bold ${
                type === 'd'
                  ? 'bg-[var(--d-bg)] text-[var(--d-tx)] border border-[var(--d-bd)]'
                  : type === 'p'
                  ? 'bg-[var(--p-bg)] text-[var(--p-tx)] border border-[var(--p-bd)]'
                  : type === 'pr'
                  ? 'bg-[#FFF0F5] text-[var(--pink)] border border-[#F7C0D6]'
                  : 'bg-[var(--bg)] text-[var(--sub-text)] border border-[var(--border)]'
              }`}
            >
              {label}
            </span>
          ))}
          {card.read && <span className="c-read text-[11px] text-[var(--sub-text)] ml-auto">{card.read}</span>}
        </div>
      </div>
      {card.myth && (
        <div className="myth bg-[var(--b-bg)] border-t border-[var(--b-bd)] p-[10px_17px] text-[11.5px] leading-[1.6] text-[var(--b-tx)]">
          <b>Corrects:</b> {card.myth}
        </div>
      )}
    </Link>
  );
}

function RenderRow({ title, sub, href }: { title: string; sub: string; href: string }) {
  return (
    <Link href={href} className="row flex items-center gap-3 md:gap-4 p-[14px_16px] md:p-[15px_20px] border-b border-[var(--border-light)] last:border-b-0 hover:bg-[#FCFAF6]">
      <span className="row-n flex-1 min-w-0">
        <span className="row-t block text-[15.5px] font-semibold text-[var(--dark)] leading-[1.3]">{title}</span>
        <span className="row-s block text-[12.5px] text-[var(--sub-text)] mt-[3px] leading-[1.6]">{sub}</span>
      </span>
      <span className="row-a text-[16px] text-[var(--pink)] flex-shrink-0">›</span>
    </Link>
  );
}
