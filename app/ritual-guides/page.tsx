'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface RitualGuide {
  id?: string | number;
  slug?: string;
  title?: string;
  guideTitle?: string;
  bannerTitle?: string;
  subtitle?: string;
  guideSubtitle?: string;
  bannerSubtitle?: string;
  bannerEyebrow?: string;
  category?: string;
  description?: string;
  festivalName?: string;
  bannerDate?: string;
  date?: string;
  badge?: string;
  readTime?: string;
  correction?: string;
  imageClass?: string;
  kathaImage?: string;
  status?: string;
}

interface ApiResponse {
  success?: boolean;
  data?: RitualGuide[];
}

type CategoryKey = keyof typeof CATEGORY_MATCHERS;

const CATEGORY_MATCHERS = {
  beginner: [
    "beginner's guides",
    'beginners guides',
    'beginner guides',
    "beginner's guide",
  ],
  festive: ['festive pujans', 'festive pujan'],
  allYear: [
    'all-year pujans',
    'all year pujans',
    'all-year pujan',
    'all year pujan',
  ],
  sanskar: [
    'sanskar & life events',
    'sanskar and life events',
    'sanskar life events',
    'sanskar & life event',
  ],
} as const;

const filters = [
  'Coming up',
  'This month',
  'Shiva',
  'Vishnu',
  'Devi',
  'Ganesha',
];

const getGuideTitle = (guide: RitualGuide) =>
  guide.title || guide.guideTitle || guide.bannerTitle || '';

const getGuideSubtitle = (guide: RitualGuide) =>
  guide.guideSubtitle ||
  guide.description ||
  guide.bannerSubtitle ||
  '';

const getGuideDate = (guide: RitualGuide) =>
  guide.festivalName || guide.bannerDate || guide.date || '';

const getGuideWhen = (guide: RitualGuide) =>
  guide.date || guide.festivalName || '';

const matchesCategory = (
  guide: RitualGuide,
  key: CategoryKey,
) => {
  const category = String(guide.category || '')
    .trim()
    .toLowerCase();

  return (CATEGORY_MATCHERS[key] as readonly string[]).includes(category);
};

const getApiData = (response: ApiResponse | null): RitualGuide[] =>
  response?.success && Array.isArray(response.data)
    ? response.data
    : [];

const getImageStyle = (image?: string): React.CSSProperties | undefined =>
  image
    ? {
      backgroundImage: `url("${image}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }
    : undefined;

interface RitualCardProps {
  guide: RitualGuide;
  fallbackClass: string;
  index: number;
  variant: 'festive' | 'allYear' | 'sanskar';
}

function RitualCard({
  guide,
  fallbackClass,
  index,
  variant,
}: RitualCardProps) {
  const cardClass =
    guide.imageClass ||
    (variant === 'sanskar'
      ? fallbackClass
      : variant === 'festive'
        ? index % 3 === 0
          ? 'h-teej'
          : index % 3 === 1
            ? 'h-ganesh'
            : 'h-devi'
        : index % 3 === 0
          ? 'h-shiva'
          : index % 3 === 1
            ? 'h-earth'
            : 'h-vishnu');

  return (
    <Link
      className="c"
      href={`/ritual-guides/${guide.slug}`}
      key={guide.id || guide.slug || `${variant}-${index}`}
    >
      <div
        className={`c-top ${cardClass}`}
        style={getImageStyle(guide.kathaImage)}
      >
        <span className="c-when">{getGuideWhen(guide)}</span>
      </div>

      <div className="c-b">
        <div className="c-t">{getGuideTitle(guide)}</div>

        <div className="c-d">{getGuideDate(guide)}</div>

        <p className="c-s">{getGuideSubtitle(guide)}</p>

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
  );
}

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  count: number;
  href: string;
}

function SectionHeader({
  eyebrow,
  title,
  description,
  count,
  href,
}: SectionHeaderProps) {
  return (
    <div className="sec-h">
      <div>
        <div className="sec-ey">{eyebrow}</div>
        <div className="sec-t">{title}</div>
        <p className="sec-s">{description}</p>
      </div>

      <Link className="sec-a" href={href}>
        <span>{count} guides</span>
        View all ›
      </Link>
    </div>
  );
}

export default function RitualGuidesPage() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [beginnerGuides, setBeginnerGuides] = useState<RitualGuide[]>([]);
  const [festivePujans, setFestivePujans] = useState<RitualGuide[]>([]);
  const [allYearPujans, setAllYearPujans] = useState<RitualGuide[]>([]);
  const [sanskarEvents, setSanskarEvents] = useState<RitualGuide[]>([]);

  useEffect(() => {
    const loadGuides = async () => {
      try {
        const [beginnerRes, ritualRes] = await Promise.all([
          fetch('/api/public/beginner-guides', {
            cache: 'no-store',
          }),
          fetch('/api/public/ritual-guides', {
            cache: 'no-store',
          }),
        ]);

        const [beginnerJson, ritualJson] = await Promise.all([
          beginnerRes.ok
            ? beginnerRes.json()
            : Promise.resolve(null),
          ritualRes.ok
            ? ritualRes.json()
            : Promise.resolve(null),
        ]);

        const beginnerData = getApiData(beginnerJson);
        const ritualData = getApiData(ritualJson);

        const publishedBeginners = beginnerData.filter(
          (guide) => guide.status === 'PUBLISHED',
        );

        const publishedRitualGuides = ritualData.filter(
          (guide) => guide.status === 'PUBLISHED',
        );

        const beginnerFromRitual = publishedRitualGuides.filter(
          (guide) => matchesCategory(guide, 'beginner'),
        );

        setBeginnerGuides([
          ...publishedBeginners,
          ...beginnerFromRitual,
        ]);

        setFestivePujans(
          publishedRitualGuides.filter((guide) =>
            matchesCategory(guide, 'festive'),
          ),
        );

        setAllYearPujans(
          publishedRitualGuides.filter((guide) =>
            matchesCategory(guide, 'allYear'),
          ),
        );

        setSanskarEvents(
          publishedRitualGuides.filter((guide) =>
            matchesCategory(guide, 'sanskar'),
          ),
        );
      } catch (error) {
        console.error('Failed to load ritual guides:', error);

        setBeginnerGuides([]);
        setFestivePujans([]);
        setAllYearPujans([]);
        setSanskarEvents([]);
      }
    };

    loadGuides();
  }, []);

  const firstGuideSlug =
    beginnerGuides[0]?.slug || 'what-is-a-vrat';

  const scrollToBeginners = () => {
    document
      .getElementById('beginners-guides')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="plp-page">
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <b>Ritual Guides</b>
          </div>
        </div>
      </div>

      <section className="chero rg">
        <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden">
          <div className="chero-in">
            <div>
              <p className="ch-ey">RITUAL GUIDES</p>

              <h1 className="ch-h1">
                Every ritual, the right way
              </h1>

              <p className="ch-p">
                The complete vidhi for festivals, vrats and life
                events — the steps, the story behind them, and a
                clear line between what scripture says and what your
                family does. Free, always.
              </p>

              <div className="ch-meta">
                <span className="ch-m">
                  <b>34</b> guides live
                </span>

                <span className="ch-m">
                  <b>21</b> more by December
                </span>

                <span className="ch-m">
                  <b>4</b> sub-categories
                </span>
              </div>
            </div>

            <div className="ch-side">
              <div className="chs-l">
                ◔ NEW TO ALL OF THIS?
              </div>

              <div className="chs-t">
                Start with Beginner's Guides
              </div>

              <p className="chs-d">
                No tags, no citations, no Sanskrit you have to look
                up. Just what to do.
              </p>

              <button
                className="chs-c"
                onClick={scrollToBeginners}
              >
                Start here ›
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="filters">
        <div className="f-in">
          <span className="f-l">FILTER</span>

          {filters.map((filter, index) => (
            <button
              key={filter}
              className={`fc ${activeFilter === index ? 'on' : ''}`}
              onClick={() => setActiveFilter(index)}
            >
              {filter}
            </button>
          ))}

          <span className="f-sort">
            Sort — <b>Date — soonest first</b> ▾
          </span>
        </div>
      </div>

      <div className="wrap">
        <div className="pagepad">
          <div className="sec" id="beginners-guides">
            <SectionHeader
              eyebrow="START HERE"
              title="Beginner's Guides"
              description="Plain language, no citations, no Sanskrit to look up. Read in order — it takes about half an hour."
              count={beginnerGuides.length}
              href="/ritual-guides/beginner-guides"
            />

            <div className="fcard">
              <div className="fc-l beg">
                <span className="fc-tag">
                  READ IN THIS ORDER
                </span>

                <div className="fc-t">
                  Nobody is born knowing the vidhi
                </div>

                <p className="fc-d">
                  {beginnerGuides.length} guides that assume
                  nothing. What to buy, what to say, how long it
                  takes, and what genuinely does not matter as much
                  as you have been told.
                </p>

                <Link
                  className="fc-c"
                  href={`/ritual-guides/${firstGuideSlug}`}
                >
                  Start at step 1 ›
                </Link>
              </div>

              <div className="fc-r">
                {beginnerGuides.map((guide, index) => (
                  <Link
                    className="fc-i"
                    href={`/ritual-guides/${guide.slug}`}
                    key={
                      guide.id ||
                      guide.slug ||
                      `beginner-${index}`
                    }
                  >
                    <span>
                      <span className="fc-in">
                        {index + 1} · {getGuideTitle(guide)}
                      </span>

                      <span className="fc-is">
                        {guide.subtitle ||
                          guide.guideSubtitle ||
                          guide.bannerEyebrow ||
                          guide.category ||
                          'Guide'}
                      </span>
                    </span>

                    <span className="fc-ia">›</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="sec" id="festive-pujans">
            <SectionHeader
              eyebrow="FIXED TO A TITHI"
              title="Festive Pujans"
              description="The date moves each year because it follows the lunar calendar, not the Gregorian one. Every guide states both."
              count={festivePujans.length}
              href="/ritual-guides/articles?tab=rg"
            />

            <div className="grid">
              {festivePujans.map((guide, index) => (
                <RitualCard
                  key={
                    guide.id ||
                    guide.slug ||
                    `festive-${index}`
                  }
                  guide={guide}
                  fallbackClass="h-teej"
                  index={index}
                  variant="festive"
                />
              ))}
            </div>
          </div>

          <div className="sec" id="all-year-pujans">
            <SectionHeader
              eyebrow="NOT TIED TO ONE DATE"
              title="All-Year Pujans"
              description="Recurring observances and household rituals. Kept when the household needs them, not when the calendar says so."
              count={allYearPujans.length}
              href="/ritual-guides/articles?tab=rg"
            />

            <div className="grid">
              <Link
                className="c"
                href="/ritual-guides/sawan-somwar"
              >
                <div className="c-top h-shiva"></div>

                <div className="c-b">
                  <div className="c-t">
                    Sawan Somwar Vrat
                  </div>

                  <div className="c-d">
                    Every Monday of Shravan
                  </div>

                  <p className="c-s">
                    Jalabhishek, the bilva offering, and the
                    fasting forms that are genuinely accepted.
                  </p>

                  <div className="c-f">
                    <span className="pill d">
                      DHARMA · 4/5
                    </span>

                    <span className="c-read">12 min</span>
                  </div>
                </div>

                <div className="myth">
                  <b>Corrects:</b> "Missing one Monday
                  invalidates all of them."
                </div>
              </Link>

              <Link
                className="c"
                href="/ritual-guides/sundarkand-path"
              >
                <div className="c-top h-earth"></div>

                <div className="c-b">
                  <div className="c-t">
                    Sundarkand Path
                  </div>

                  <div className="c-d">
                    Most often on Tuesday
                  </div>

                  <p className="c-s">
                    The fifth kanda, recited at home. What you
                    need, how long it takes, and the parts people
                    skip.
                  </p>

                  <div className="c-f">
                    <span className="pill d">
                      DHARMA · 4/5
                    </span>

                    <span className="c-read">13 min</span>
                  </div>
                </div>
              </Link>

              <Link
                className="c"
                href="/ritual-guides/satyanarayan-katha"
              >
                <div className="c-top h-vishnu"></div>

                <div className="c-b">
                  <div className="c-t">
                    Satyanarayan Katha
                  </div>

                  <div className="c-d">
                    Purnima, or any auspicious day
                  </div>

                  <p className="c-s">
                    The five-chapter katha, the prasad, and why
                    this is the most performed household puja in
                    North India.
                  </p>

                  <div className="c-f">
                    <span className="pill d">
                      DHARMA · 4/5
                    </span>

                    <span className="c-read">14 min</span>
                  </div>
                </div>
              </Link>

              {allYearPujans.map((guide, index) => (
                <RitualCard
                  key={
                    guide.id ||
                    guide.slug ||
                    `allyear-${index}`
                  }
                  guide={guide}
                  fallbackClass="h-shiva"
                  index={index}
                  variant="allYear"
                />
              ))}
            </div>
          </div>

          <div className="sec" id="sanskar-life-events">
            <SectionHeader
              eyebrow="ONCE IN A LIFE"
              title="Sanskar & Life Events"
              description="The sixteen sacraments, from before birth to after death. Written with care, and without fear."
              count={sanskarEvents.length}
              href="/ritual-guides/articles?tab=rg"
            />

            <div className="grid">
              <Link
                className="c"
                href="/ritual-guides/naamkaran"
              >
                <div className="c-top h-sanskar"></div>

                <div className="c-b">
                  <div className="c-t">Naamkaran</div>

                  <div className="c-d">
                    Birth &amp; childhood
                  </div>

                  <p className="c-s">
                    Naming the child. When it is done, who does
                    it, and what the ceremony actually requires.
                  </p>

                  <div className="c-f">
                    <span className="pill d">
                      DHARMA · 5/5
                    </span>

                    <span className="c-read">10 min</span>
                  </div>
                </div>
              </Link>

              <Link
                className="c"
                href="/ritual-guides/griha-pravesh"
              >
                <div className="c-top h-sanskar"></div>

                <div className="c-b">
                  <div className="c-t">Griha Pravesh</div>

                  <div className="c-d">
                    Home &amp; space
                  </div>

                  <p className="c-s">
                    Entering a new home. The kalash, the boiling
                    of milk, and the muhurat that matters.
                  </p>

                  <div className="c-f">
                    <span className="pill d">
                      DHARMA · 4/5
                    </span>

                    <span className="c-read">12 min</span>
                  </div>
                </div>
              </Link>

              <Link
                className="c"
                href="/ritual-guides/shraddha"
              >
                <div className="c-top h-sanskar"></div>

                <div className="c-b">
                  <div className="c-t">
                    Shraddha &amp; Pitru Karma
                  </div>

                  <div className="c-d">
                    End of life
                  </div>

                  <p className="c-s">
                    Tarpan, the sixteen days of Pitru Paksha,
                    and what is asked of the one performing it.
                  </p>

                  <div className="c-f">
                    <span className="pill d">
                      DHARMA · 5/5
                    </span>

                    <span className="c-read">16 min</span>
                  </div>
                </div>

                <div className="myth">
                  <b>Corrects:</b> "Skipping shraddha harms the
                  departed."
                </div>
              </Link>

              {sanskarEvents.map((guide, index) => (
                <RitualCard
                  key={
                    guide.id ||
                    guide.slug ||
                    `sanskar-${index}`
                  }
                  guide={guide}
                  fallbackClass="h-sanskar"
                  index={index}
                  variant="sanskar"
                />
              ))}
            </div>
          </div>

          <div className="methodband">
            <div>
              <div className="mb-ey">
                HOW WE DECIDE WHAT IS TRUE
              </div>

              <div className="mb-t">
                Every badge on this page means something specific
              </div>

              <p className="mb-p">
                Dharma, Pratha or Bhranti — with a confidence score
                you can check. If we cannot name the text a reader
                could open, we do not make the claim.
              </p>

              <Link
                className="mb-c"
                href="/editorial-method"
              >
                Read our editorial method ›
              </Link>
            </div>

            <div className="mb-r">
              <div className="mbr d">
                <div className="mbr-k">DHARMA</div>
                <div className="mbr-v">
                  Named in a text you could open yourself.
                </div>
              </div>

              <div className="mbr p">
                <div className="mbr-k">PRATHA</div>
                <div className="mbr-v">
                  Regional or family custom. Real — not scripture.
                </div>
              </div>

              <div className="mbr b">
                <div className="mbr-k">BHRANTI</div>
                <div className="mbr-v">
                  A misconception. Corrected in every guide it
                  appears in.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}