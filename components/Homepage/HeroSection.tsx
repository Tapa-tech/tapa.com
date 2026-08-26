'use client';

import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="hero relative w-full py-6 md:py-[52px]">
      <div className="hero-img absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1600&q=80"
          alt="Ganesh Sthapana Kit"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="hero-scrim absolute inset-0"></div>
      <div className="hero-wrap relative z-10 max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="hero-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[44px] items-center">
          <div>
            <div className="hero-cut text-xs md:text-sm">
              <span>✽</span> PRE-BOOKING OPEN · GANESH CHATURTHI 2026
            </div>
            <div className="hero-ey text-[11px] md:text-xs">LIMITED FIRST EDITION BATCH</div>
            <h1 className="hero-h1 text-2xl sm:text-3xl md:text-4xl leading-tight">
              Pre-book the <em>Ganesh Sthapana Kit</em>
            </h1>
            <div className="hero-price text-sm md:text-base mb-4 md:mb-6">
              Everything you need for an authentic, stress-free sthapana. Complete kit — <b>₹1,650</b>
            </div>
            <div className="hero-btns flex flex-row gap-2 md:gap-[14px]">
              <button
                className="hb-pink flex-1 md:flex-none text-xs md:text-sm py-3 px-3 md:px-6"
                onClick={() => {
                  const kitElement = document.getElementById('prebook-kits');
                  kitElement?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Pre-order now (₹1,650) ›
              </button>
              <button
                className="hb-ghost flex-1 md:flex-none text-xs md:text-sm py-3 px-3 md:px-6"
                onClick={() => {
                  const kitElement = document.getElementById('prebook-kits');
                  kitElement?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore the Kit
              </button>
            </div>
          </div>
          <div className="w-full max-w-full md:max-w-[420px] ml-auto">
            <div className="pcard w-full">
              <div className="pc-head flex items-center justify-between">
                <span className="pc-l">PANCHANG TODAY</span>
                <span className="pc-live">
                  <span className="livedot"></span>LIVE
                </span>
              </div>
              <div className="pc-date">
                <div className="pc-day text-sm md:text-base">Today · Aug 27, 2026</div>
                <div className="pc-sub text-xs">Bhadrapada Shukla Chaturthi · Vikram Samvat 2083</div>
              </div>
              <div className="pc-rows flex flex-col gap-2">
                <div className="pcr flex justify-between">
                  <span className="pck">TITHI</span>
                  <span className="pcv">Shukla Chaturthi (until 03:14 AM)</span>
                </div>
                <div className="pcr flex justify-between">
                  <span className="pck">NAKSHATRA</span>
                  <span className="pcv">Swati (until 05:42 PM)</span>
                </div>
                <div className="pcr flex justify-between">
                  <span className="pck">RASHI</span>
                  <span className="pcv">Tula (Libra)</span>
                </div>
                <div className="pcr flex justify-between">
                  <span className="pck">SUNRISE / SUNSET</span>
                  <span className="pcv">06:04 AM / 06:48 PM</span>
                </div>
              </div>
              <div className="pc-foot">
                <span className="pc-foot-t">
                  <b>Next major date —</b> Ganesh Chaturthi, 14 September. Madhyahna muhurat.
                </span>
                <span className="pc-foot-c">Open guide ›</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
