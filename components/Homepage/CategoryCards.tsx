import React from 'react';

export const CategoryCards: React.FC = () => {
  return (
    <section className="sec py-8 md:py-12" id="ritual-guides">
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="sec-head mb-4 md:mb-8">
          <div>
            <div className="sec-ey">THREE WAYS IN</div>
            <div className="sec-t text-xl md:text-3xl font-bold">Start wherever you are</div>
          </div>
        </div>
        <div className="cats grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <a className="cat" href="/ritual-guides">
            <div className="cat-i a">🪔</div>
            <div className="cat-t font-bold text-base md:text-lg">Ritual Guides</div>
            <p className="cat-s text-xs md:text-sm">
              The complete vidhi for a festival or vrat — step by step, every claim tagged and sourced. Start with Beginner's Guides if this is your first time.
            </p>
            <div className="cat-links flex flex-wrap gap-1.5 my-3">
              <span className="cat-chip text-[11px] px-2 py-0.5 rounded">Beginner's Guides</span>
              <span className="cat-chip text-[11px] px-2 py-0.5 rounded">Festive</span>
              <span className="cat-chip text-[11px] px-2 py-0.5 rounded">All-Year</span>
              <span className="cat-chip text-[11px] px-2 py-0.5 rounded">Navagraha</span>
            </div>
            <span className="cat-c text-xs font-bold">Browse ritual guides ›</span>
          </a>
          <a className="cat" href="/panchang">
            <div className="cat-i b">☀</div>
            <div className="cat-t font-bold text-base md:text-lg">Panchang</div>
            <p className="cat-s text-xs md:text-sm">
              Today's tithi, paksha, nakshatra and sunrise — and the year's full vrat calendar. Learn to read it yourself instead of asking every time.
            </p>
            <div className="cat-links flex flex-wrap gap-1.5 my-3">
              <span className="cat-chip text-[11px] px-2 py-0.5 rounded">Today</span>
              <span className="cat-chip text-[11px] px-2 py-0.5 rounded">2026 Vrat Calendar</span>
              <span className="cat-chip text-[11px] px-2 py-0.5 rounded">Eclipses</span>
            </div>
            <span className="cat-c text-xs font-bold">Open Panchang ›</span>
          </a>
          <a className="cat" href="/dharmic-concepts">
            <div className="cat-i c">🌿</div>
            <div className="cat-t font-bold text-base md:text-lg">Dharmic Concepts</div>
            <p className="cat-s text-xs md:text-sm">
              Why bilva and not tulsi. Why midnight and not dawn. The object in your hand has a story, and it is usually older than the ritual.
            </p>
            <div className="cat-links flex flex-wrap gap-1.5 my-3">
              <span className="cat-chip text-[11px] px-2 py-0.5 rounded">Materials</span>
              <span className="cat-chip text-[11px] px-2 py-0.5 rounded">Practices</span>
              <span className="cat-chip text-[11px] px-2 py-0.5 rounded">Ideas</span>
            </div>
            <span className="cat-c text-xs font-bold">Explore concepts ›</span>
          </a>
        </div>
      </div>
    </section>
  );
};
