'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './beginner-listing.css';

interface BeginnerGuideItem {
  category: string;
  title: string;
  description: string;
  readTime: number;
  slug: string;
}

const STATIC_GUIDES: BeginnerGuideItem[] = [
  // Before you begin
  { category: 'Before you begin', title: 'What is a puja?', description: 'The word itself, and what it does not mean.', readTime: 7, slug: 'what-is-a-puja' },
  { category: 'Before you begin', title: 'What is a vrat?', description: 'Not a diet, and not a punishment. What the word means and the forms it takes.', readTime: 6, slug: 'what-is-a-vrat' },
  { category: 'Before you begin', title: 'What is a tithi?', description: 'Why a festival lands on a different date each year.', readTime: 7, slug: 'what-is-a-tithi' },
  { category: 'Before you begin', title: 'What is a muhurat?', description: 'The window, and why it is computed for your city.', readTime: 8, slug: 'what-is-a-muhurat' },
  { category: 'Before you begin', title: 'What is a mantra?', description: 'What makes a sound a mantra, and what happens if you say it wrong.', readTime: 7, slug: 'what-is-a-mantra' },
  { category: 'Before you begin', title: 'What is a sankalp?', description: 'The sentence said at the start, and what it has to contain.', readTime: 6, slug: 'what-is-a-sankalp' },
  { category: 'Before you begin', title: 'What is aarti?', description: 'The lamp, the circling, and the point it comes at.', readTime: 5, slug: 'what-is-aarti' },
  { category: 'Before you begin', title: 'What is prasad?', description: 'What changes when food is offered.', readTime: 6, slug: 'what-is-prasad' },
  { category: 'Before you begin', title: 'What is a katha?', description: 'The story read aloud, and why it is read aloud.', readTime: 6, slug: 'what-is-a-katha' },
  { category: 'Before you begin', title: 'Who is a purohit, and when you need one', description: 'Most household pujas do not require one. Here is when they do.', readTime: 9, slug: 'who-is-a-purohit' },

  // Your first puja at home
  { category: 'Your first puja at home', title: 'Setting up the space', description: 'Where to sit, which direction, and what goes on the chowki.', readTime: 8, slug: 'setting-up-the-space' },
  { category: 'Your first puja at home', title: 'What to buy the first time', description: 'A short list. Everything else can wait.', readTime: 7, slug: 'what-to-buy-the-first-time' },
  { category: 'Your first puja at home', title: 'The five-offering form', description: 'Panchopachara, start to finish, in about ten minutes.', readTime: 8, slug: 'the-five-offering-form' },
  { category: 'Your first puja at home', title: 'Lighting the diya', description: 'Ghee or oil, how many wicks, and where it stands.', readTime: 6, slug: 'lighting-the-diya' },
  { category: 'Your first puja at home', title: 'Saying the words you cannot pronounce', description: 'What to do when the Sanskrit defeats you. This is not the part that matters.', readTime: 7, slug: 'words-you-cannot-pronounce' },
  { category: 'Your first puja at home', title: 'Doing the aarti', description: 'The circling, the singing, and the part everyone joins in for.', readTime: 6, slug: 'doing-the-aarti' },
  { category: 'Your first puja at home', title: 'What to do with the offerings afterwards', description: 'Flowers, water, food. Where each one goes.', readTime: 6, slug: 'offerings-afterwards' },
  { category: 'Your first puja at home', title: 'How long it should take', description: 'Ten minutes is a puja. So is an hour.', readTime: 5, slug: 'how-long-it-should-take' },

  // Your first vrat
  { category: 'Your first vrat', title: 'Choosing which vrat to keep', description: 'Start with the one your household already keeps.', readTime: 7, slug: 'choosing-which-vrat-to-keep' },
  { category: 'Your first vrat', title: 'What you may eat', description: 'The forms of fasting, and the one most people actually keep.', readTime: 8, slug: 'what-you-may-eat' },
  { category: 'Your first vrat', title: 'Breaking the fast', description: 'The parana window, and what to eat first.', readTime: 7, slug: 'breaking-the-fast' },
  { category: 'Your first vrat', title: 'Keeping a vrat while working', description: 'A full office day, a commute, and no kitchen.', readTime: 7, slug: 'vrat-while-working' },
  { category: 'Your first vrat', title: 'Keeping a vrat when unwell', description: 'Medication, pregnancy, and the conditions under which you should not fast.', readTime: 8, slug: 'vrat-when-unwell' },
  { category: 'Your first vrat', title: 'Fasting and medication', description: 'Timing tablets around a vrat, and when to simply not keep it.', readTime: 7, slug: 'fasting-and-medication' },
  { category: 'Your first vrat', title: 'Missing a day', description: 'What actually happens. Less than you have been told.', readTime: 6, slug: 'missing-a-day' },
  { category: 'Your first vrat', title: 'Ending a vrat kept for years', description: 'Udyapan — how a long vrat is concluded.', readTime: 8, slug: 'ending-a-vrat-kept-for-years' },

  // Your first festivals
  { category: 'Your first festivals', title: 'Ganesh Chaturthi for beginners', description: 'Bringing the idol home, the ten days, and the visarjan.', readTime: 9, slug: 'ganesh-chaturthi-beginners' },
  { category: 'Your first festivals', title: 'Navratri for beginners', description: 'Nine nights, and what is actually asked of you on each.', readTime: 10, slug: 'navratri-beginners' },
  { category: 'Your first festivals', title: 'Diwali for beginners', description: 'Five days, four observances, one evening that matters most.', readTime: 9, slug: 'diwali-beginners' },
  { category: 'Your first festivals', title: 'Holi for beginners', description: 'The bonfire the night before, and what it is for.', readTime: 8, slug: 'holi-beginners' },
  { category: 'Your first festivals', title: 'Janmashtami for beginners', description: 'The midnight hour, and the fast that precedes it.', readTime: 8, slug: 'janmashtami-beginners' },
  { category: 'Your first festivals', title: 'Raksha Bandhan for beginners', description: 'The thread, and the three stories behind it.', readTime: 8, slug: 'raksha-bandhan-beginners' },
  { category: 'Your first festivals', title: 'Shivaratri for beginners', description: 'The night, the four prahars, and what a beginner can keep.', readTime: 9, slug: 'shivaratri-beginners' },
  { category: 'Your first festivals', title: 'Karwa Chauth for beginners', description: 'The sargi, the day, and the moonrise.', readTime: 9, slug: 'karwa-chauth-beginners' },
  { category: 'Your first festivals', title: 'Chhath for beginners', description: 'Four days, and why it is kept at the water.', readTime: 9, slug: 'chhath-beginners' },

  // The texts, in plain language
  { category: 'The texts, in plain language', title: 'What is a Purana?', description: 'Eighteen of them. What they are, and what they are not.', readTime: 8, slug: 'what-is-a-purana' },
  { category: 'The texts, in plain language', title: 'The seven kandas', description: 'The Ramayana in the shape it is actually recited.', readTime: 6, slug: 'seven-kandas' },
  { category: 'The texts, in plain language', title: 'Ramayana and Ramcharitmanas', description: 'Two texts, two languages, two different centuries.', readTime: 8, slug: 'ramayana-and-ramcharitmanas' },
  { category: 'The texts, in plain language', title: 'What is the Bhagavad Gita?', description: 'Seven hundred verses, and where they sit.', readTime: 8, slug: 'what-is-the-bhagavad-gita' },
  { category: 'The texts, in plain language', title: 'What is a stotra?', description: 'Praise, recited. And why it is not the same as scripture.', readTime: 7, slug: 'what-is-a-stotra' },
  { category: 'The texts, in plain language', title: 'Hanuman Chalisa — what it is', description: 'Beloved, recited daily, and written in the sixteenth century.', readTime: 7, slug: 'hanuman-chalisa-what-it-is' },
  { category: 'The texts, in plain language', title: 'The four Vedas', description: 'The oldest layer, and what almost nobody recites at home.', readTime: 9, slug: 'the-four-vedas' },
  { category: 'The texts, in plain language', title: 'Shruti and Smriti', description: 'The distinction that decides how much weight a text carries.', readTime: 8, slug: 'shruti-and-smriti' },

  // Doing it in a small home
  { category: 'Doing it in a small home', title: 'Puja in a rented flat', description: 'No shelf, no room, no permanent setup.', readTime: 7, slug: 'puja-in-a-rented-flat' },
  { category: 'Doing it in a small home', title: 'Without a puja room', description: 'A cupboard, a windowsill, a corner of a desk.', readTime: 6, slug: 'without-a-puja-room' },
  { category: 'Doing it in a small home', title: 'Without a murti', description: 'A photograph, a supari, or nothing at all.', readTime: 7, slug: 'without-a-murti' },
  { category: 'Doing it in a small home', title: 'With small children', description: 'Short, loud, and interrupted. Still a puja.', readTime: 6, slug: 'with-small-children' },
  { category: 'Doing it in a small home', title: 'When you live alone', description: 'Nothing in the vidhi requires a second person.', readTime: 6, slug: 'when-you-live-alone' },
  { category: 'Doing it in a small home', title: 'When the household disagrees', description: 'Two families, two ways, one kitchen.', readTime: 8, slug: 'when-the-household-disagrees' },
  { category: 'Doing it in a small home', title: 'Doing it in another country', description: 'No market, no river, and the wrong hemisphere.', readTime: 8, slug: 'doing-it-in-another-country' },
];

export default function BeginnerGuidesListingPage() {
  const router = useRouter();
  const [guidesList, setGuidesList] = useState<BeginnerGuideItem[]>(STATIC_GUIDES);

  useEffect(() => {
    async function loadCmsBeginnerGuides() {
      try {
        const res = await fetch('/api/public/beginner-guides');
        if (res.ok) {
          const json = await res.json();
          const data = json.success && Array.isArray(json.data) ? json.data : [];
          if (data.length > 0) {
            const cmsItems: BeginnerGuideItem[] = data.map((item: any) => ({
              category: item.category || 'Before you begin',
              title: item.title || item.bannerTitle || 'Beginner Guide',
              description: item.subtitle || item.bannerDescription || item.introDescription || 'Introductory guide for beginners.',
              readTime: 7,
              slug: item.slug,
            }));

            setGuidesList((prev) => {
              const cmsSlugs = new Set(cmsItems.map((c) => c.slug));
              const remainingDefaults = prev.filter((p) => !cmsSlugs.has(p.slug));
              return [...cmsItems, ...remainingDefaults];
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch CMS beginner guides:', err);
      }
    }
    loadCmsBeginnerGuides();
  }, []);

  const pathCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    guidesList.forEach((item) => {
      if (item.category) categoriesSet.add(item.category);
    });
    return Array.from(categoriesSet);
  }, [guidesList]);

  return (
    <div className="beginner-listing-page min-h-screen w-full max-w-full overflow-x-hidden">
      {/* BREADCRUMB */}
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <Link href="/ritual-guides">Ritual Guides</Link> › <b>Beginner's Guides</b>
          </div>
        </div>
      </div>

      {/* SIBLING RAIL */}
      <div className="subrail">
        <div className="sr-in">
          <span className="sr-l">IN THIS CATEGORY</span>
          <Link className="sr-i on" href="/ritual-guides/beginner-guides">
            Beginner's Guides
          </Link>
          <Link className="sr-i" href="/ritual-guides#festive-pujans">
            Festive Pujans
          </Link>
          <Link className="sr-i" href="/ritual-guides#all-year-pujans">
            All-Year Pujans
          </Link>
          <Link className="sr-i" href="/ritual-guides#sanskar-life-events">
            Sanskar &amp; Life Events
          </Link>
          <Link className="sr-up" href="/ritual-guides">
            All Ritual Guides ›
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="chero shero rg">
        <div className="wrap">
          <div className="chero-in">
            <div>
              <p className="sh-crumbline">
                RITUAL GUIDES <b>›</b> BEGINNER'S GUIDES
              </p>
              <h1 className="ch-h1 sh-h1">Nobody is born knowing the vidhi</h1>
              <p className="ch-p">
                Fifty guides that assume nothing. What to buy, what to say, how long it takes, and what genuinely does not matter as much as you have been told. Six paths — start any of them at step one.
              </p>
              <div className="ch-meta">
                <span className="ch-m">
                  <b>{guidesList.length}</b> guides
                </span>
                <span className="ch-m">
                  <b>{pathCategories.length}</b> paths
                </span>
                <span className="ch-m">
                  <b>No</b> Sanskrit required
                </span>
              </div>
            </div>

            <div className="ch-side">
              <div className="chs-l">◔ IF YOU READ ONE THING</div>
              <div className="chs-t">Before you begin</div>
              <p className="chs-d">
                Ten short guides covering every word the other five paths assume you already know.
              </p>
              <button
                type="button"
                className="chs-c"
                onClick={() => router.push('/ritual-guides/what-is-a-puja')}
              >
                Start at step 1 ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS BAR */}
      <div className="filters">
        <div className="f-in">
          <span className="f-sort">{guidesList.length} results</span>
        </div>
      </div>

      {/* STAGE LISTING (NO SIDEBAR / SOLO SHELL) */}
      <div className="wrap">
        <div className="shell solo">
          <div>
            <div className="rhead">
              <div className="rh-c">
                {guidesList.length}
                <span>guides · {pathCategories.length} paths</span>
              </div>
              <div className="rh-r">
                <span className="f-sort">
                  Sort — <b>Reading order</b>
                </span>
              </div>
            </div>

            {pathCategories.map((pathName) => {
              const pathItems = guidesList.filter((item) => item.category === pathName);
              return (
                <div key={pathName} className="grp">
                  <div className="grp-h">
                    <span className="grp-t">{pathName}</span>
                  </div>

                  <div className="seq">
                    {pathItems.map((item, idx) => (
                      <Link
                        key={item.slug || idx}
                        className="sq"
                        href={`/ritual-guides/${item.slug}`}
                      >
                        <span className="sq-n">{idx + 1}</span>
                        <span>
                          <span className="sq-t">{item.title}</span>
                          <span className="sq-s">{item.description}</span>
                          <span className="sq-m">
                            <span className="sq-read">{item.readTime} min read</span>
                          </span>
                        </span>
                        <span className="sq-a">Read ›</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* EDITORIAL METHOD BAND */}
      <div className="wrap">
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
  );
}
