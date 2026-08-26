'use client';

import React from 'react';

export const KitShelf: React.FC = () => {
  return (
    <section className="sec py-8 md:py-12" id="prebook-kits">
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="sec-head flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-4 mb-4 md:mb-8">
          <div>
            <div className="sec-ey">NOW OPEN FOR PRE-BOOKING</div>
            <div className="sec-t text-xl md:text-3xl font-bold">Ritual Kits</div>
            <p className="sec-s text-xs md:text-sm max-w-2xl">
              Everything the vidhi asks for, sourced and packed, delivered before the date. Nothing you cannot buy yourself — we have just done the finding.
            </p>
          </div>
          <a className="sec-all text-xs md:text-sm font-semibold whitespace-nowrap self-start md:self-auto" href="/ritual-kits">All kits ›</a>
        </div>

        <div className="kshelf grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="kcard lead">
            <div className="k-top k-ganesh">
              <span className="k-badge pre">PRE-BOOK</span>
              <span className="k-cut">ORDER BY 10 SEP</span>
            </div>
            <div className="k-b">
              <div className="k-n">Ganesh Sthapana Kit</div>
              <div className="k-for">For 14 September · Madhyahna muhurat</div>
              <p className="k-inc">
                Shadu mati idol, chowki cloth, kalash set, durva, modak mould, akshata, dhoop, 21-item samagri box, Gyan Patrika.
              </p>
              <div className="k-row">
                <span className="k-p">₹1,650</span>
                <span className="k-pn">incl. delivery</span>
              </div>
              <button className="k-cta">Pre-book now</button>
              <a className="k-guide" href="/ritual-guides/ganesh-chaturthi">Read the guide first ›</a>
            </div>
          </div>

          <div className="kcard">
            <div className="k-top k-teej">
              <span className="k-badge pre">PRE-BOOK</span>
              <span className="k-cut">ORDER BY 9 SEP</span>
            </div>
            <div className="k-b">
              <div className="k-n">Hartalika Teej Kit</div>
              <div className="k-for">For 13 September</div>
              <p className="k-inc">
                Sand-Shivalinga mould, bilva patra, green bangles, solah shringar set, phalahar essentials, Gyan Patrika.
              </p>
              <div className="k-row">
                <span className="k-p">₹950</span>
                <span className="k-pn">incl. delivery</span>
              </div>
              <button className="k-cta">Pre-book now</button>
              <a className="k-guide" href="/ritual-guides/hartalika-teej">Read the guide first ›</a>
            </div>
          </div>

          <div className="kcard">
            <div className="k-top k-navratri">
              <span className="k-badge">OPENS 20 SEP</span>
            </div>
            <div className="k-b">
              <div className="k-n">Navratri Ghatsthapana Kit</div>
              <div className="k-for">For Sharad Navratri, October</div>
              <p className="k-inc">
                Kalash, jau seeds and sowing tray, chunri, akhand jyot supplies, nine-day samagri, Gyan Patrika.
              </p>
              <div className="k-row">
                <span className="k-p">₹1,890</span>
                <span className="k-pn">estimated</span>
              </div>
              <button className="k-cta ghost">Notify me</button>
              <a className="k-guide" href="/ritual-guides">Read the guide first ›</a>
            </div>
          </div>

          <div className="kcard">
            <div className="k-top k-shiva">
              <span className="k-badge">ALL YEAR</span>
            </div>
            <div className="k-b">
              <div className="k-n">Shiva Puja Kit</div>
              <div className="k-for">Pradosh, Somwar, Shivratri</div>
              <p className="k-inc">
                Bilva patra, gangajal, panchamrit set, chandan, rudraksha mala, dhoop, abhishek vessel, Gyan Patrika.
              </p>
              <div className="k-row">
                <span className="k-p">₹1,180</span>
                <span className="k-pn">incl. delivery</span>
              </div>
              <button className="k-cta">Add to cart</button>
              <a className="k-guide" href="/ritual-guides">Read the guide first ›</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
