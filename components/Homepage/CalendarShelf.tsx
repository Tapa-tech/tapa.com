import React from 'react';

export const CalendarShelf: React.FC = () => {
  return (
    <section className="sec py-8 md:py-12">
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="sec-head flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-4 mb-4 md:mb-8">
          <div>
            <div className="sec-ey">THE NEXT FOUR WEEKS</div>
            <div className="sec-t text-xl md:text-3xl font-bold">What's coming, and when</div>
            <p className="sec-s text-xs md:text-sm">Every guide is complete before the date arrives. Kit optional, always.</p>
          </div>
          <a className="sec-all text-xs md:text-sm font-semibold whitespace-nowrap self-start md:self-auto" href="/panchang/festival-calendar">Full 2026 calendar ›</a>
        </div>
        <div className="shelf grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <a className="scard" href="/ritual-guides/hartalika-teej">
            <div className="sc-top sc-hart">
              <span className="sc-when">IN 6 DAYS</span>
            </div>
            <div className="sc-b">
              <div className="sc-n">Hartalika Teej</div>
              <div className="sc-d">13 September · Bhadrapada Shukla Tritiya</div>
              <p className="sc-s">
                The sand Shivalinga, the nirjala question, and why this is not the same vrat as Hariyali Teej.
              </p>
              <div className="sc-links">
                <span className="sc-l1">Read guide ›</span>
                <span className="sc-l2">· Kit ₹950</span>
              </div>
            </div>
          </a>
          <a className="scard" href="/ritual-guides/ganesh-chaturthi">
            <div className="sc-top sc-gan">
              <span className="sc-when">IN 7 DAYS</span>
            </div>
            <div className="sc-b">
              <div className="sc-n">Ganesh Chaturthi</div>
              <div className="sc-d">14 September · Bhadrapada Shukla Chaturthi</div>
              <p className="sc-s">
                Prana pratishtha at midday. The moon-sighting story is a narrative, not a warning.
              </p>
              <div className="sc-links">
                <span className="sc-l1">Read guide ›</span>
                <span className="sc-l2">· Kit ₹1,650</span>
              </div>
            </div>
          </a>
          <a className="scard" href="/ritual-guides">
            <div className="sc-top sc-radha">
              <span className="sc-when">IN 12 DAYS</span>
            </div>
            <div className="sc-b">
              <div className="sc-n">Radha Ashtami</div>
              <div className="sc-d">19 September · Bhadrapada Shukla Ashtami</div>
              <p className="sc-s">
                Radha's appearance day. Observed most strongly in Barsana and the Braj region.
              </p>
              <div className="sc-links">
                <span className="sc-l1">Read guide ›</span>
              </div>
            </div>
          </a>
          <a className="scard" href="/ritual-guides">
            <div className="sc-top sc-anant">
              <span className="sc-when">IN 16 DAYS</span>
            </div>
            <div className="sc-b">
              <div className="sc-n">Anant Chaturdashi</div>
              <div className="sc-d">23 September · Ganesh Visarjan</div>
              <p className="sc-s">
                The closing of the ten-day observance. Immersion, and what to do if a water body is not available.
              </p>
              <div className="sc-links">
                <span className="sc-l1">Read guide ›</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
