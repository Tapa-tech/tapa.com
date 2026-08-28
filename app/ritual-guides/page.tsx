'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const defaultBeginnerGuides = [
  { slug: 'what-is-a-vrat', title: 'What is a vrat?', subtitle: '6 min read' },
  { slug: 'first-puja', title: 'Your first puja at home', subtitle: '8 min · under ₹300 to start' },
  { slug: 'ganesh-chaturthi', title: 'Ganesh Chaturthi for beginners', subtitle: '9 min · for 14 September' },
  { slug: 'diwali-beginners', title: 'Diwali for beginners', subtitle: '9 min · for November' },
  { slug: 'seven-kandas', title: 'The seven kandas', subtitle: '6 min · no Sanskrit required' },
];


const CATEGORY_MATCHERS: Record<string, string[]> = {
  beginner: [
    "beginner's guides",
    'beginners guides',
    'beginner guides',
    "beginner's guide",
  ],
  festive: ['festive pujans', 'festive pujan'],
  allYear: ['all-year pujans', 'all year pujans', 'all-year pujan', 'all year pujan'],
  sanskar: [
    'sanskar & life events',
    'sanskar and life events',
    'sanskar life events',
    'sanskar & life event',
  ],
};

function matchesCategory(guide: any, key: keyof typeof CATEGORY_MATCHERS) {
  const cat = (guide.category || '').toString().trim().toLowerCase();
  return CATEGORY_MATCHERS[key].includes(cat);
}

export default function RitualGuidesPage() {
  const [activeFilter, setActiveFilter] = useState<number>(0);
  const [beginnerGuides, setBeginnerGuides] = useState<any[]>([]);
  const [festivePujans, setFestivePujans] = useState<any[]>([]);
  const [allYearPujans, setAllYearPujans] = useState<any[]>([]);
  const [sanskarEvents, setSanskarEvents] = useState<any[]>([]);

  useEffect(() => {
    async function loadGuides() {
      try {
        const beginnerRes = await fetch('/api/public/beginner-guides', {
          cache: 'no-store',
        });

        const ritualRes = await fetch('/api/public/ritual-guides', {
          cache: 'no-store',
        });

        const beginnerJson = beginnerRes.ok
          ? await beginnerRes.json()
          : null;

        const ritualJson = ritualRes.ok
          ? await ritualRes.json()
          : null;

        const beginnerData =
          beginnerJson?.success && Array.isArray(beginnerJson.data)
            ? beginnerJson.data
            : [];

        const ritualData =
          ritualJson?.success && Array.isArray(ritualJson.data)
            ? ritualJson.data
            : [];

        const publishedBeginners = beginnerData.filter(
          (guide: any) => guide.status === 'PUBLISHED'
        );

        const publishedRitualGuides = ritualData.filter(
          (guide: any) => guide.status === 'PUBLISHED'
        );

        // Ritual Guides table me bhi jo entries category = "Beginner's Guides"
        // rakhi gayi hon, unhe bhi beginner guides list me merge kar do
        const publishedBeginnersFromRitual = publishedRitualGuides.filter(
          (guide: any) => matchesCategory(guide, 'beginner')
        );

        const mergedBeginnerGuides = [
          ...publishedBeginners,
          ...publishedBeginnersFromRitual,
        ];

        const publishedFestive = publishedRitualGuides.filter((guide: any) =>
          matchesCategory(guide, 'festive')
        );

        const publishedAllYear = publishedRitualGuides.filter((guide: any) =>
          matchesCategory(guide, 'allYear')
        );

        const publishedSanskar = publishedRitualGuides.filter((guide: any) =>
          matchesCategory(guide, 'sanskar')
        );

        setBeginnerGuides(mergedBeginnerGuides);
        setFestivePujans(publishedFestive);
        setAllYearPujans(publishedAllYear);
        setSanskarEvents(publishedSanskar);
      } catch (err) {
        console.error('Failed to load ritual guides:', err);

        setBeginnerGuides([]);
        setFestivePujans([]);
        setAllYearPujans([]);
        setSanskarEvents([]);
      }
    }

    loadGuides();
  }, []);

  const filters = ['Coming up', 'This month', 'Shiva', 'Vishnu', 'Devi', 'Ganesha'];
  const firstGuideSlug = beginnerGuides[0]?.slug || 'what-is-a-vrat';

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
              <Link className="sec-a" href="/ritual-guides/beginner-guides">
                <span>{beginnerGuides.length} guides</span>View all ›
              </Link>
            </div>

            <div className="fcard">
              <div className="fc-l beg">
                <span className="fc-tag">READ IN THIS ORDER</span>
                <div className="fc-t">Nobody is born knowing the vidhi</div>
                <p className="fc-d">
                  {beginnerGuides.length} guides that assume nothing. What to buy, what to say, how long it takes, and what genuinely does not matter as much as you have been told.
                </p>
                <Link className="fc-c" href={`/ritual-guides/${firstGuideSlug}`}>
                  Start at step 1 ›
                </Link>
              </div>
              <div className="fc-r">
                {beginnerGuides.map((guide, idx) => (
                  <Link
                    className="fc-i"
                    href={`/ritual-guides/${guide.slug}`}
                    key={guide.id || guide.slug || idx}
                  >
                    <span>
                      <span className="fc-in">{idx + 1} · {guide.title || guide.guideTitle || guide.bannerTitle}</span>
                      <span className="fc-is">{guide.subtitle || guide.guideSubtitle || guide.bannerEyebrow || guide.category || 'Guide'}</span>
                    </span>
                    <span className="fc-ia">›</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Festive Pujans Section */}
          <div className="sec" id="festive-pujans">
            <div className="sec-h">
              <div>
                <div className="sec-ey">FIXED TO A TITHI</div>

                <div className="sec-t">Festive Pujans</div>

                <p className="sec-s">
                  The date moves each year because it follows the lunar calendar, not the Gregorian one. Every guide states both.
                </p>
              </div>

              <Link
                className="sec-a"
                href="/ritual-guides/articles?tab=rg"
              >
                <span>{festivePujans.length} guides</span>View all ›
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
              {festivePujans.map((guide: any, idx: number) => (
                <Link
                  className="c"
                  href={`/ritual-guides/${guide.slug}`}
                  key={guide.id || guide.slug || `festive-${idx}`}
                >
                  <div
                    className={`c-top ${guide.imageClass ||
                      (idx % 3 === 0
                        ? 'h-teej'
                        : idx % 3 === 1
                          ? 'h-ganesh'
                          : 'h-devi')
                      }`}
                    style={
                      guide.kathaImage
                        ? {
                          backgroundImage: `url("${guide.kathaImage}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }
                        : undefined
                    }
                  >
                    <span className="c-when">
                      {guide.date || guide.festivalName || ''}
                    </span>
                  </div>

                  <div className="c-b">
                    <div className="c-t">
                      {guide.title || guide.bannerTitle || ''}
                    </div>

                    <div className="c-d">
                      {guide.festivalName || guide.bannerDate || guide.date || ''}
                    </div>

                    <p className="c-s">
                      {guide.guideSubtitle ||
                        guide.description ||
                        guide.bannerSubtitle ||
                        ''}
                    </p>

                    <div className="c-f">
                      <span className="pill d">
                        {guide.badge || 'DHARMA · 4/5'}
                      </span>

                      <span className="c-read">
                        {guide.readTime || '9 min'}
                      </span>
                    </div>
                  </div>

                  {guide.correction && (
                    <div className="myth">
                      <b>Corrects:</b> "{guide.correction}"
                    </div>
                  )}
                </Link>
              ))}

            </div>
          </div>


          {/* All-Year Pujans Section */}
          <div className="sec" id="all-year-pujans">
            <div className="sec-h">
              <div>
                <div className="sec-ey">NOT TIED TO ONE DATE</div>
                <div className="sec-t">All-Year Pujans</div>
                <p className="sec-s">
                  Recurring observances and household rituals. Kept when the household needs them, not when the calendar says so.
                </p>
              </div>
              <Link className="sec-a" href="/ritual-guides/articles?tab=rg">
                <span>{allYearPujans.length} guides</span>View all ›
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

              {allYearPujans.map((guide: any, idx: number) => (
                <Link
                  className="c"
                  href={`/ritual-guides/${guide.slug}`}
                  key={guide.id || guide.slug || `allyear-${idx}`}
                >
                  <div
                    className={`c-top ${guide.imageClass ||
                      (idx % 3 === 0
                        ? 'h-shiva'
                        : idx % 3 === 1
                          ? 'h-earth'
                          : 'h-vishnu')
                      }`}
                    style={
                      guide.kathaImage
                        ? {
                          backgroundImage: `url("${guide.kathaImage}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }
                        : undefined
                    }
                  >
                    <span className="c-when">
                      {guide.date || guide.festivalName || ''}
                    </span>
                  </div>

                  <div className="c-b">
                    <div className="c-t">
                      {guide.title || guide.bannerTitle || ''}
                    </div>

                    <div className="c-d">
                      {guide.festivalName || guide.bannerDate || guide.date || ''}
                    </div>

                    <p className="c-s">
                      {guide.guideSubtitle ||
                        guide.description ||
                        guide.bannerSubtitle ||
                        ''}
                    </p>

                    <div className="c-f">
                      <span className="pill d">
                        {guide.badge || 'DHARMA · 4/5'}
                      </span>

                      <span className="c-read">
                        {guide.readTime || '9 min'}
                      </span>
                    </div>
                  </div>

                  {guide.correction && (
                    <div className="myth">
                      <b>Corrects:</b> "{guide.correction}"
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Sanskar & Life Events Section */}
          <div className="sec" id="sanskar-life-events">
            <div className="sec-h">
              <div>
                <div className="sec-ey">ONCE IN A LIFE</div>
                <div className="sec-t">Sanskar &amp; Life Events</div>
                <p className="sec-s">
                  The sixteen sacraments, from before birth to after death. Written with care, and without fear.
                </p>
              </div>
              <Link className="sec-a" href="/ritual-guides/articles?tab=rg">
                <span>{sanskarEvents.length} guides</span>View all ›
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

              {sanskarEvents.map((guide: any, idx: number) => (
                <Link
                  className="c"
                  href={`/ritual-guides/${guide.slug}`}
                  key={guide.id || guide.slug || `sanskar-${idx}`}
                >
                  <div
                    className={`c-top ${guide.imageClass || 'h-sanskar'}`}
                    style={
                      guide.kathaImage
                        ? {
                          backgroundImage: `url("${guide.kathaImage}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }
                        : undefined
                    }
                  >
                    <span className="c-when">
                      {guide.date || guide.festivalName || ''}
                    </span>
                  </div>

                  <div className="c-b">
                    <div className="c-t">
                      {guide.title || guide.bannerTitle || ''}
                    </div>

                    <div className="c-d">
                      {guide.festivalName || guide.bannerDate || guide.date || ''}
                    </div>

                    <p className="c-s">
                      {guide.guideSubtitle ||
                        guide.description ||
                        guide.bannerSubtitle ||
                        ''}
                    </p>

                    <div className="c-f">
                      <span className="pill d">
                        {guide.badge || 'DHARMA · 4/5'}
                      </span>

                      <span className="c-read">
                        {guide.readTime || '9 min'}
                      </span>
                    </div>
                  </div>

                  {guide.correction && (
                    <div className="myth">
                      <b>Corrects:</b> "{guide.correction}"
                    </div>
                  )}
                </Link>
              ))}
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