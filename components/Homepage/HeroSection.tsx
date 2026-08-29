'use client';

import React, { useEffect, useState } from 'react';

interface PanchangToday {
  dateLabel: string;
  tithiFull: string;
  tithiName: string;
  tithiEndTime: string | null;
  nakshatra: string;
  nakshatraEndTime: string | null;
  rashi: string;
  sunrise: string | null;
  sunset: string | null;
  nextMajorDate: {
    name: string;
    day: number;
    month: string;
    note: string;
    label: string;
  } | null;
}

export const HeroSection: React.FC = () => {
  const [panchang, setPanchang] = useState<PanchangToday | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPanchang = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await fetch('/api/panchang/today', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`Panchang API failed: ${res.status}`);
        }

        const data: PanchangToday = await res.json();
        setPanchang(data);
      } catch (err) {
        console.error('Panchang fetch failed:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPanchang();
  }, []);

  const scrollToKits = () => {
    const kitElement = document.getElementById('prebook-kits');

    if (kitElement) {
      kitElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <section className="hero relative w-full py-6 md:py-[52px]">
      {/* Hero Background */}
      <div className="hero-img absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1600&q=80"
          alt="Ganesh Sthapana Kit"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Hero Overlay */}
      <div className="hero-scrim absolute inset-0" />

      {/* Hero Content */}
      <div className="hero-wrap relative z-10 max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="hero-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[44px] items-center">

          {/* Left Content */}
          <div>
            <div className="hero-cut text-xs md:text-sm">
              <span>✽</span> PRE-BOOKING OPEN · GANESH CHATURTHI 2026
            </div>

            <div className="hero-ey text-[11px] md:text-xs">
              LIMITED FIRST EDITION BATCH
            </div>

            <h1 className="hero-h1 text-2xl sm:text-3xl md:text-4xl leading-tight">
              Pre-book the <em>Ganesh Sthapana Kit</em>
            </h1>

            <div className="hero-price text-sm md:text-base mb-4 md:mb-6">
              Everything you need for an authentic, stress-free sthapana.
              Complete kit — <b>₹1,650</b>
            </div>

            {/* CTA Buttons */}
            <div className="hero-btns flex flex-row gap-2 md:gap-[14px]">
              <button
                type="button"
                className="hb-pink flex-1 md:flex-none text-xs md:text-sm py-3 px-3 md:px-6"
                onClick={scrollToKits}
              >
                Pre-order now (₹1,650) ›
              </button>

              <button
                type="button"
                className="hb-ghost flex-1 md:flex-none text-xs md:text-sm py-3 px-3 md:px-6"
                onClick={scrollToKits}
              >
                Explore the Kit
              </button>
            </div>
          </div>

          {/* Right Panchang Card */}
          <div className="w-full max-w-full md:max-w-[420px] ml-auto">
            <div className="pcard w-full">

              {/* Card Header */}
              <div className="pc-head flex items-center justify-between">
                <span className="pc-l">PANCHANG TODAY</span>

                <span className="pc-live">
                  <span className="livedot" />
                  LIVE
                </span>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="pc-loading text-xs py-6 text-center">
                  Loading today's panchang…
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div className="pc-loading text-xs py-6 text-center">
                  Unable to load today's panchang.
                </div>
              )}

              {/* Panchang Data */}
              {!loading && !error && panchang && (
                <>
                  {/* Date */}
                  <div className="pc-date">
                    <div className="pc-day text-sm md:text-base">
                      Today · {panchang.dateLabel}
                    </div>

                    <div className="pc-sub text-xs">
                      {panchang.tithiFull}
                    </div>
                  </div>

                  {/* Panchang Rows */}
                  <div className="pc-rows flex flex-col gap-2">

                    {/* Tithi */}
                    <div className="pcr flex justify-between gap-4">
                      <span className="pck">
                        TITHI
                      </span>

                      <span className="pcv text-right">
                        {panchang.tithiName}

                        {panchang.tithiEndTime && (
                          <>
                            {' '}
                            (until {panchang.tithiEndTime})
                          </>
                        )}
                      </span>
                    </div>

                    {/* Nakshatra */}
                    <div className="pcr flex justify-between gap-4">
                      <span className="pck">
                        NAKSHATRA
                      </span>

                      <span className="pcv text-right">
                        {panchang.nakshatra}

                        {panchang.nakshatraEndTime && (
                          <>
                            {' '}
                            (until {panchang.nakshatraEndTime})
                          </>
                        )}
                      </span>
                    </div>

                    {/* Rashi */}
                    <div className="pcr flex justify-between gap-4">
                      <span className="pck">
                        RASHI
                      </span>

                      <span className="pcv text-right">
                        {panchang.rashi}
                      </span>
                    </div>

                    {/* Sunrise / Sunset */}
                    <div className="pcr flex justify-between gap-4">
                      <span className="pck">
                        SUNRISE / SUNSET
                      </span>

                      <span className="pcv text-right">
                        {panchang.sunrise ?? '—'}
                        {' / '}
                        {panchang.sunset ?? '—'}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Card Footer */}
              <div className="pc-foot">
                <span className="pc-foot-t">
                  <b>Next major date —</b>{' '}
                  {panchang?.nextMajorDate ? panchang.nextMajorDate.label : 'Loading…'}
                </span>

                <button
                  type="button"
                  className="pc-foot-c"
                  onClick={() => {
                    window.location.href = '/ritual-guides/ganesh-chaturthi';
                  }}
                >
                  Open guide ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};