'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RitualGuidesPage() {
  const [activeFilter, setActiveFilter] = useState<number>(0);

  const filters = ['Coming up', 'This month', 'Shiva', 'Vishnu', 'Devi', 'Ganesha'];

  return (
    <div className="plp-page">
      {/* Breadcrumb */}
      <div className="bcrumb">
        <div className="bc-in">
          <Link href="/">Home</Link> › <b>Ritual Guides</b>
        </div>
      </div>

      {/* Hero Section */}
      <section className="chero rg">
        <div className="wrap">
          <div className="chero-in">
            <div>
              <p className="ch-ey">RITUAL GUIDES</p>
              <h1 className="ch-h1">Every ritual, the right way</h1>
              <p className="ch-p">
                The complete vidhi for festivals, vrats and life events — the steps, the story behind them, and a clear line between what scripture says and what your family does. Free, always.
              </p>
              <div className="ch-meta">
                <span className="ch-m"><b>34</b> guides live</span>
                <span className="ch-m"><b>21</b> more by December</span>
                <span className="ch-m"><b>4</b> sub-categories</span>
              </div>
            </div>
            <div className="ch-side">
              <div className="chs-l">◔ NEW TO ALL OF THIS?</div>
              <div className="chs-t">Start with Beginner's Guides</div>
              <p className="chs-d">
                No tags, no citations, no Sanskrit you have to look up. Just what to do.
              </p>
              <button
                className="chs-c"
                onClick={() => {
                  const beginnersSection = document.getElementById('beginners-guides');
                  beginnersSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start here ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="filters">
        <div className="f-in">
          <span className="f-l">FILTER</span>
          {filters.map((f, i) => (
            <button
              key={i}
              className={`fc ${activeFilter === i ? 'on' : ''}`}
              onClick={() => setActiveFilter(i)}
            >
              {f}
            </button>
          ))}
          <span className="f-sort">
            Sort — <b>Date — soonest first</b> ▾
          </span>
        </div>
      </div>

      {/* Main Content Stage */}
      <div className="wrap">
        <div className="pagepad">
          {/* Beginner's Guides Section */}
          <div className="sec" id="beginners-guides">
            <div className="sec-h">
              <div>
                <div className="sec-ey">START HERE</div>
                <div className="sec-t">Beginner's Guides</div>
                <p className="sec-s">
                  Plain language, no citations, no Sanskrit to look up. Read in order — it takes about half an hour.
                </p>
              </div>
              <Link className="sec-a" href="/ritual-guides">
                <span>5 guides</span>View all ›
              </Link>
            </div>

            <div className="fcard">
              <div className="fc-l beg">
                <span className="fc-tag">READ IN THIS ORDER</span>
                <div className="fc-t">Nobody is born knowing the vidhi</div>
                <p className="fc-d">
                  Five guides that assume nothing. What to buy, what to say, how long it takes, and what genuinely does not matter as much as you have been told.
                </p>
                <Link className="fc-c" href="/ritual-guides/what-is-a-vrat">
                  Start at step 1 ›
                </Link>
              </div>
              <div className="fc-r">
                <Link className="fc-i" href="/ritual-guides/what-is-a-vrat">
                  <span>
                    <span className="fc-in">1 · What is a vrat?</span>
                    <span className="fc-is">6 min read</span>
                  </span>
                  <span className="fc-ia">›</span>
                </Link>
                <Link className="fc-i" href="/ritual-guides/first-puja">
                  <span>
                    <span className="fc-in">2 · Your first puja at home</span>
                    <span className="fc-is">8 min · under ₹300 to start</span>
                  </span>
                  <span className="fc-ia">›</span>
                </Link>
                <Link className="fc-i" href="/ritual-guides/ganesh-chaturthi">
                  <span>
                    <span className="fc-in">3 · Ganesh Chaturthi for beginners</span>
                    <span className="fc-is">9 min · for 14 September</span>
                  </span>
                  <span className="fc-ia">›</span>
                </Link>
                <Link className="fc-i" href="/ritual-guides/diwali-beginners">
                  <span>
                    <span className="fc-in">4 · Diwali for beginners</span>
                    <span className="fc-is">9 min · for November</span>
                  </span>
                  <span className="fc-ia">›</span>
                </Link>
                <Link className="fc-i" href="/ritual-guides/seven-kandas">
                  <span>
                    <span className="fc-in">5 · The seven kandas</span>
                    <span className="fc-is">6 min · no Sanskrit required</span>
                  </span>
                  <span className="fc-ia">›</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Festive Pujans Section */}
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">FIXED TO A TITHI</div>
                <div className="sec-t">Festive Pujans</div>
                <p className="sec-s">
                  The date moves each year because it follows the lunar calendar, not the Gregorian one. Every guide states both.
                </p>
              </div>
              <Link className="sec-a" href="/ritual-guides">
                <span>18 guides</span>View all ›
              </Link>
            </div>

            <div className="grid">
              <Link className="c" href="/ritual-guides/hartalika-teej">
                <div className="c-top h-teej">
                  <span className="c-when now">IN 6 DAYS</span>
                </div>
                <div className="c-b">
                  <div className="c-t">Hartalika Teej</div>
                  <div className="c-d">13 September</div>
                  <p className="c-s">
                    The sand Shivalinga, the night vigil, and why this is a different vrat from Hariyali Teej.
                  </p>
                  <div className="c-f">
                    <span className="pill d">DHARMA · 4/5</span>
                    <span className="c-read">9 min</span>
                  </div>
                </div>
                <div className="myth">
                  <b>Corrects:</b> "Nirjala or the vrat doesn’t count."
                </div>
              </Link>

              <Link className="c" href="/ritual-guides/ganesh-chaturthi">
                <div className="c-top h-ganesh">
                  <span className="c-when now">IN 7 DAYS</span>
                </div>
                <div className="c-b">
                  <div className="c-t">Ganesh Chaturthi</div>
                  <div className="c-d">14 September</div>
                  <p className="c-s">
                    Prana pratishtha at the Madhyahna muhurat, and what a pandit is genuinely for.
                  </p>
                  <div className="c-f">
                    <span className="pill d">DHARMA · 4/5</span>
                    <span className="c-read">11 min</span>
                  </div>
                </div>
                <div className="myth">
                  <b>Corrects:</b> "Only a pandit can perform this."
                </div>
              </Link>

              <Link className="c" href="/ritual-guides/sharad-navratri">
                <div className="c-top h-devi">
                  <span className="c-when">IN 34 DAYS</span>
                </div>
                <div className="c-b">
                  <div className="c-t">Sharad Navratri</div>
                  <div className="c-d">11–19 October</div>
                  <p className="c-s">
                    Nine nights, nine forms, one Mother. Ghatasthapana to Maha Navami, day by day.
                  </p>
                  <div className="c-f">
                    <span className="pill d">DHARMA · 4/5</span>
                    <span className="c-read">18 min</span>
                  </div>
                </div>
                <div className="myth">
                  <b>Corrects:</b> "If the Akhand Jyoti goes out, it is wasted."
                </div>
              </Link>
            </div>
          </div>

          {/* All-Year Pujans Section */}
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">NOT TIED TO ONE DATE</div>
                <div className="sec-t">All-Year Pujans</div>
                <p className="sec-s">
                  Recurring observances and household rituals. Kept when the household needs them, not when the calendar says so.
                </p>
              </div>
              <Link className="sec-a" href="/ritual-guides">
                <span>11 guides</span>View all ›
              </Link>
            </div>

            <div className="grid">
              <Link className="c" href="/ritual-guides/sawan-somwar">
                <div className="c-top h-shiva"></div>
                <div className="c-b">
                  <div className="c-t">Sawan Somwar Vrat</div>
                  <div className="c-d">Every Monday of Shravan</div>
                  <p className="c-s">
                    Jalabhishek, the bilva offering, and the fasting forms that are genuinely accepted.
                  </p>
                  <div className="c-f">
                    <span className="pill d">DHARMA · 4/5</span>
                    <span className="c-read">12 min</span>
                  </div>
                </div>
                <div className="myth">
                  <b>Corrects:</b> "Missing one Monday invalidates all of them."
                </div>
              </Link>

              <Link className="c" href="/ritual-guides/sundarkand-path">
                <div className="c-top h-earth"></div>
                <div className="c-b">
                  <div className="c-t">Sundarkand Path</div>
                  <div className="c-d">Most often on Tuesday</div>
                  <p className="c-s">
                    The fifth kanda, recited at home. What you need, how long it takes, and the parts people skip.
                  </p>
                  <div className="c-f">
                    <span className="pill d">DHARMA · 4/5</span>
                    <span className="c-read">13 min</span>
                  </div>
                </div>
              </Link>

              <Link className="c" href="/ritual-guides/satyanarayan-katha">
                <div className="c-top h-vishnu"></div>
                <div className="c-b">
                  <div className="c-t">Satyanarayan Katha</div>
                  <div className="c-d">Purnima, or any auspicious day</div>
                  <p className="c-s">
                    The five-chapter katha, the prasad, and why this is the most performed household puja in North India.
                  </p>
                  <div className="c-f">
                    <span className="pill d">DHARMA · 4/5</span>
                    <span className="c-read">14 min</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Sanskar & Life Events Section */}
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">ONCE IN A LIFE</div>
                <div className="sec-t">Sanskar &amp; Life Events</div>
                <p className="sec-s">
                  The sixteen sacraments, from before birth to after death. Written with care, and without fear.
                </p>
              </div>
              <Link className="sec-a" href="/ritual-guides">
                <span>8 guides</span>View all ›
              </Link>
            </div>

            <div className="grid">
              <Link className="c" href="/ritual-guides/naamkaran">
                <div className="c-top h-sanskar"></div>
                <div className="c-b">
                  <div className="c-t">Naamkaran</div>
                  <div className="c-d">Birth &amp; childhood</div>
                  <p className="c-s">
                    Naming the child. When it is done, who does it, and what the ceremony actually requires.
                  </p>
                  <div className="c-f">
                    <span className="pill d">DHARMA · 5/5</span>
                    <span className="c-read">10 min</span>
                  </div>
                </div>
              </Link>

              <Link className="c" href="/ritual-guides/griha-pravesh">
                <div className="c-top h-sanskar"></div>
                <div className="c-b">
                  <div className="c-t">Griha Pravesh</div>
                  <div className="c-d">Home &amp; space</div>
                  <p className="c-s">
                    Entering a new home. The kalash, the boiling of milk, and the muhurat that matters.
                  </p>
                  <div className="c-f">
                    <span className="pill d">DHARMA · 4/5</span>
                    <span className="c-read">12 min</span>
                  </div>
                </div>
              </Link>

              <Link className="c" href="/ritual-guides/shraddha">
                <div className="c-top h-sanskar"></div>
                <div className="c-b">
                  <div className="c-t">Shraddha &amp; Pitru Karma</div>
                  <div className="c-d">End of life</div>
                  <p className="c-s">
                    Tarpan, the sixteen days of Pitru Paksha, and what is asked of the one performing it.
                  </p>
                  <div className="c-f">
                    <span className="pill d">DHARMA · 5/5</span>
                    <span className="c-read">16 min</span>
                  </div>
                </div>
                <div className="myth">
                  <b>Corrects:</b> "Skipping shraddha harms the departed."
                </div>
              </Link>
            </div>
          </div>

          {/* Editorial Method Band */}
          <div className="methodband">
            <div>
              <div className="mb-ey">HOW WE DECIDE WHAT IS TRUE</div>
              <div className="mb-t">Every badge on this page means something specific</div>
              <p className="mb-p">
                Dharma, Pratha or Bhranti — with a confidence score you can check. If we cannot name the text a reader could open, we do not make the claim.
              </p>
              <Link className="mb-c" href="/editorial-method">
                Read our editorial method ›
              </Link>
            </div>
            <div className="mb-r">
              <div className="mbr d">
                <div className="mbr-k">DHARMA</div>
                <div className="mbr-v">Named in a text you could open yourself.</div>
              </div>
              <div className="mbr p">
                <div className="mbr-k">PRATHA</div>
                <div className="mbr-v">Regional or family custom. Real — not scripture.</div>
              </div>
              <div className="mbr b">
                <div className="mbr-k">BHRANTI</div>
                <div className="mbr-v">A misconception. Corrected in every guide it appears in.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
