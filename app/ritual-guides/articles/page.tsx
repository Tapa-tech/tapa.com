'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface ArticleItem {
  id?: string;
  cat: 'bg' | 'rg' | 'dc';
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  readTime?: string;
  status: 'live' | 'soon';
  headerClass: string;
  pills?: Array<[string, string]>;
  myth?: string;
}

const DEFAULT_ARTICLES: ArticleItem[] = [
  // ---- BEGINNER'S GUIDES (bg) ----
  {
    cat: 'bg',
    slug: 'what-is-a-vrat',
    title: 'What is a vrat?',
    subtitle: 'Step 1 · Fundamentals',
    description: 'The basic idea of a vrat, why people keep one, and the handful of rules that genuinely matter.',
    readTime: '6 min',
    status: 'live',
    headerClass: 'h-beg',
    pills: [['n', 'NO SANSKRIT NEEDED']],
  },
  {
    cat: 'bg',
    slug: 'first-puja',
    title: 'Your first puja at home',
    subtitle: 'Step 2 · Fundamentals',
    description: 'What to buy, what to say, how long it takes, and what genuinely does not matter as much as you have been told.',
    readTime: '8 min',
    status: 'live',
    headerClass: 'h-beg',
    pills: [['n', 'UNDER ₹300 TO START']],
  },
  {
    cat: 'bg',
    slug: 'ganesh-chaturthi-beginners',
    title: 'Ganesh Chaturthi for beginners',
    subtitle: 'Step 3 · Festive',
    description: 'A simplified walk-through for your very first Ganesh Chaturthi, with nothing assumed.',
    readTime: '9 min',
    status: 'live',
    headerClass: 'h-ganesh',
    pills: [['n', 'FOR 14 SEPTEMBER']],
  },
  {
    cat: 'bg',
    slug: 'diwali-beginners',
    title: 'Diwali for beginners',
    subtitle: 'Step 4 · Festive',
    description: 'Lakshmi Puja, the diyas, and the parts of Diwali that are actually about the ritual, not the shopping.',
    readTime: '9 min',
    status: 'live',
    headerClass: 'h-gold',
    pills: [['n', 'FOR NOVEMBER']],
  },
  {
    cat: 'bg',
    slug: 'seven-kandas',
    title: 'The seven kandas',
    subtitle: 'Step 5 · Fundamentals',
    description: 'The structure of the Ramayana in plain language, so every reference in a ritual guide makes sense.',
    readTime: '6 min',
    status: 'live',
    headerClass: 'h-earth',
    pills: [['n', 'NO SANSKRIT REQUIRED']],
  },
  {
    cat: 'bg',
    slug: 'reading-panchang-first-time',
    title: 'How to read a Panchang for the first time',
    subtitle: 'Extra · Fundamentals',
    description: 'Tithi, nakshatra and Rahu Kaal — what each line on a Panchang actually tells you.',
    readTime: '7 min',
    status: 'live',
    headerClass: 'h-thread',
    pills: [['n', '5 MIN TO LEARN']],
  },
  {
    cat: 'bg',
    slug: 'setting-up-puja-room',
    title: 'Setting up your first puja room',
    subtitle: 'Extra · Fundamentals',
    description: 'Direction, height, and the short list of things that belong on the shelf — and what does not.',
    readTime: '8 min',
    status: 'soon',
    headerClass: 'h-vishnu',
    pills: [['n', 'COMING SOON']],
  },

  // ---- RITUAL GUIDES (rg) ----
  {
    cat: 'rg',
    slug: 'hartalika-teej',
    title: 'Hartalika Teej',
    subtitle: 'Festive Pujans · 13 September',
    description: 'The sand Shivalinga, the night vigil, and why this is a different vrat from Hariyali Teej.',
    readTime: '9 min',
    status: 'live',
    headerClass: 'h-teej',
    pills: [['d', 'DHARMA · 4/5']],
    myth: '"Nirjala or the vrat doesn’t count."',
  },
  {
    cat: 'rg',
    slug: 'ganesh-chaturthi',
    title: 'Ganesh Chaturthi',
    subtitle: 'Festive Pujans · 14 September',
    description: 'Prana pratishtha at the Madhyahna muhurat, and what a pandit is genuinely for.',
    readTime: '11 min',
    status: 'live',
    headerClass: 'h-ganesh',
    pills: [['d', 'DHARMA · 4/5']],
    myth: '"Only a pandit can perform this."',
  },
  {
    cat: 'rg',
    slug: 'sharad-navratri',
    title: 'Sharad Navratri',
    subtitle: 'Festive Pujans · 11–19 October',
    description: 'Nine nights, nine forms, one Mother. Ghatasthapana to Maha Navami, day by day.',
    readTime: '18 min',
    status: 'live',
    headerClass: 'h-devi',
    pills: [['d', 'DHARMA · 4/5']],
    myth: '"If the Akhand Jyoti goes out, it is wasted."',
  },
  {
    cat: 'rg',
    slug: 'karwa-chauth',
    title: 'Karwa Chauth',
    subtitle: 'Festive Pujans · October',
    description: 'The sargi, the sieve, and moonrise timing city by city — with the parts that are genuinely optional.',
    readTime: '10 min',
    status: 'live',
    headerClass: 'h-karwa',
    pills: [['d', 'DHARMA · 3/5'], ['p', 'PRATHA']],
  },
  {
    cat: 'rg',
    slug: 'diwali',
    title: 'Diwali',
    subtitle: 'Festive Pujans · November',
    description: 'Lakshmi–Ganesh Puja, the muhurat, and the five days of the festival explained in order.',
    readTime: '14 min',
    status: 'live',
    headerClass: 'h-gold',
    pills: [['d', 'DHARMA · 4/5']],
  },
  {
    cat: 'rg',
    slug: 'chhath-puja',
    title: 'Chhath Puja',
    subtitle: 'Festive Pujans · November',
    description: 'Nahay Khay to Usha Arghya — the four days, and why the Sun and Chhathi Maiya are both invoked.',
    readTime: '12 min',
    status: 'live',
    headerClass: 'h-chhath',
    pills: [['d', 'DHARMA · 5/5']],
  },
  {
    cat: 'rg',
    slug: 'sawan-somwar',
    title: 'Sawan Somwar Vrat',
    subtitle: 'All-Year Pujans · Every Monday of Shravan',
    description: 'Jalabhishek, the bilva offering, and the fasting forms that are genuinely accepted.',
    readTime: '12 min',
    status: 'live',
    headerClass: 'h-shiva',
    pills: [['d', 'DHARMA · 4/5']],
    myth: '"Missing one Monday invalidates all of them."',
  },
  {
    cat: 'rg',
    slug: 'sundarkand-path',
    title: 'Sundarkand Path',
    subtitle: 'All-Year Pujans · Most often on Tuesday',
    description: 'The fifth kanda, recited at home. What you need, how long it takes, and the parts people skip.',
    readTime: '13 min',
    status: 'live',
    headerClass: 'h-earth',
    pills: [['d', 'DHARMA · 4/5']],
  },
  {
    cat: 'rg',
    slug: 'satyanarayan-katha',
    title: 'Satyanarayan Katha',
    subtitle: 'All-Year Pujans · Purnima, or any auspicious day',
    description: 'The five-chapter katha, the prasad, and why this is the most performed household puja in North India.',
    readTime: '14 min',
    status: 'live',
    headerClass: 'h-vishnu',
    pills: [['d', 'DHARMA · 4/5']],
  },
  {
    cat: 'rg',
    slug: 'pradosh-vrat',
    title: 'Pradosh Vrat',
    subtitle: 'All-Year Pujans · Twice a lunar month',
    description: 'The evening Shiva puja kept on Trayodashi, and how its date is worked out from the Panchang.',
    readTime: '9 min',
    status: 'live',
    headerClass: 'h-shiva',
    pills: [['d', 'DHARMA · 4/5']],
  },
  {
    cat: 'rg',
    slug: 'ekadashi-vrat',
    title: 'Ekadashi Vrat',
    subtitle: 'All-Year Pujans · Twice a lunar month',
    description: 'The grain-avoidance day kept for Vishnu, and the genuine exceptions for age and health.',
    readTime: '8 min',
    status: 'live',
    headerClass: 'h-vishnu',
    pills: [['d', 'DHARMA · 4/5']],
  },
  {
    cat: 'rg',
    slug: 'naamkaran',
    title: 'Naamkaran',
    subtitle: 'Sanskar & Life Events · Birth & childhood',
    description: 'Naming the child. When it is done, who does it, and what the ceremony actually requires.',
    readTime: '10 min',
    status: 'live',
    headerClass: 'h-sanskar',
    pills: [['d', 'DHARMA · 5/5']],
  },
  {
    cat: 'rg',
    slug: 'griha-pravesh',
    title: 'Griha Pravesh',
    subtitle: 'Sanskar & Life Events · Home & space',
    description: 'Entering a new home. The kalash, the boiling of milk, and the muhurat that matters.',
    readTime: '12 min',
    status: 'live',
    headerClass: 'h-sanskar',
    pills: [['d', 'DHARMA · 4/5']],
  },
  {
    cat: 'rg',
    slug: 'shraddha',
    title: 'Shraddha & Pitru Karma',
    subtitle: 'Sanskar & Life Events · End of life',
    description: 'Tarpan, the sixteen days of Pitru Paksha, and what is asked of the one performing it.',
    readTime: '16 min',
    status: 'live',
    headerClass: 'h-sanskar',
    pills: [['d', 'DHARMA · 5/5']],
    myth: '"Skipping shraddha harms the departed."',
  },
  {
    cat: 'rg',
    slug: 'mundan-sanskar',
    title: 'Mundan Sanskar',
    subtitle: 'Sanskar & Life Events · Birth & childhood',
    description: 'The first haircut, why it is done, and how families choose a year rather than a fixed age.',
    readTime: '9 min',
    status: 'live',
    headerClass: 'h-sanskar',
    pills: [['d', 'DHARMA · 4/5']],
  },
  {
    cat: 'rg',
    slug: 'vivah-sanskar',
    title: 'Vivah Sanskar — an overview',
    subtitle: 'Sanskar & Life Events · Marriage',
    description: 'The seven pheras and the core rites, separated from the many regional customs layered on top.',
    readTime: '15 min',
    status: 'soon',
    headerClass: 'h-sanskar',
    pills: [['n', 'COMING SOON']],
  },
  {
    cat: 'rg',
    slug: 'chaitra-navratri',
    title: 'Chaitra Navratri',
    subtitle: 'Festive Pujans · March–April',
    description: 'The spring Navratri, less crowded but observed the same way as its autumn counterpart.',
    readTime: '11 min',
    status: 'soon',
    headerClass: 'h-devi',
    pills: [['n', 'COMING SOON']],
  },
  {
    cat: 'rg',
    slug: 'sankashti-chaturthi',
    title: 'Sankashti Chaturthi',
    subtitle: 'All-Year Pujans · Monthly',
    description: 'The monthly moon-sighting vrat for Ganesha, and how the fasting window is actually calculated.',
    readTime: '7 min',
    status: 'soon',
    headerClass: 'h-ganesh',
    pills: [['n', 'COMING SOON']],
  },

  // ---- DHARMIC CONCEPTS (dc) ----
  {
    cat: 'dc',
    slug: 'why-is-bilva-dear-to-mahadev',
    title: 'Why is bilva dear to Mahadev?',
    subtitle: 'Materials · Shiva',
    description: 'Three leaves on one stem. The tree did not study scripture to grow that way — the tradition recognised what it saw.',
    readTime: '12 min',
    status: 'live',
    headerClass: 'h-shiva',
    pills: [['d', 'DHARMA · 4/5'], ['n', 'PURANIC']],
  },
  {
    cat: 'dc',
    slug: 'why-is-tulsi-sacred-to-vishnu',
    title: 'Why is tulsi sacred to Vishnu?',
    subtitle: 'Materials · Vishnu',
    description: 'Lakshmi’s form as a plant, present in every Vishnu and Krishna puja — and never offered to Shiva.',
    readTime: '—',
    status: 'soon',
    headerClass: 'h-vishnu',
    pills: [['n', 'COMING SOON']],
  },
  {
    cat: 'dc',
    slug: 'why-is-durva-offered-to-ganesha',
    title: 'Why is durva offered to Ganesha?',
    subtitle: 'Materials · Ganesha',
    description: 'The grass offered on his head, in bunches of twenty-one. Named in the Ganesha Purana.',
    readTime: '—',
    status: 'soon',
    headerClass: 'h-ganesh',
    pills: [['n', 'COMING SOON']],
  },
  {
    cat: 'dc',
    slug: 'three-stories-one-thread',
    title: 'Three Stories, One Thread',
    subtitle: 'Meanings & Practices · The raksha sutra',
    description: 'Wife, friend, devotee — three relationships, one act of protection. Not one of them is a sister and a brother.',
    readTime: '7 min',
    status: 'live',
    headerClass: 'h-thread',
    pills: [['d', 'DHARMA · 4/5'], ['n', 'PURANIC']],
    myth: '"All three stories are about siblings."',
  },
  {
    cat: 'dc',
    slug: 'sankalp-saying-it-out-loud',
    title: 'Sankalp — saying it out loud',
    subtitle: 'Meanings & Practices',
    description: 'The resolve stated at the start of a vrat. Why it is said, what it must contain, and what it does not need.',
    readTime: '—',
    status: 'soon',
    headerClass: 'h-earth',
    pills: [['n', 'COMING SOON']],
  },
  {
    cat: 'dc',
    slug: 'yajna-havan-or-homa',
    title: 'Yajna, Havan or Homa?',
    subtitle: 'Meanings & Practices',
    description: 'Three words used interchangeably, for three different things. The distinction is older than the confusion.',
    readTime: '—',
    status: 'soon',
    headerClass: 'h-shiva',
    pills: [['n', 'COMING SOON']],
  },
  {
    cat: 'dc',
    slug: 'puja-room-setup-where-and-how',
    title: 'Puja room setup — where and how',
    subtitle: 'Daily Puja',
    description: 'Direction, height, what belongs on the shelf and what does not.',
    readTime: '8 min',
    status: 'soon',
    headerClass: 'h-earth',
    pills: [['n', 'COMING SOON']],
  },
  {
    cat: 'dc',
    slug: 'morning-sandhya-and-panch-upachara',
    title: 'Morning sandhya and panch-upachara',
    subtitle: 'Daily Puja',
    description: 'The five-offering form, in about ten minutes.',
    readTime: '9 min',
    status: 'soon',
    headerClass: 'h-vishnu',
    pills: [['n', 'COMING SOON']],
  },
  {
    cat: 'dc',
    slug: '10-things-you-think-are-mandatory',
    title: '10 things you think are mandatory',
    subtitle: 'Dharma vs Pratha',
    description: 'And are not. Each one traced to where it actually came from — usually a region, sometimes a shop.',
    readTime: '—',
    status: 'soon',
    headerClass: 'h-gold',
    pills: [['n', 'COMING SOON']],
  },
  {
    cat: 'dc',
    slug: 'can-women-do-puja-during-menstruation',
    title: 'Can women do puja during menstruation?',
    subtitle: 'Dharma vs Pratha',
    description: 'Genuinely contested. We present the range of positions with sources, and say plainly where no scriptural restriction exists.',
    readTime: '—',
    status: 'soon',
    headerClass: 'h-gold',
    pills: [['n', 'COMING SOON']],
  },
  {
    cat: 'dc',
    slug: 'panchakshara-om-namah-shivaya',
    title: 'Panchakshara — Om Namah Shivaya',
    subtitle: 'Mantras',
    description: 'The five syllables, and why the count matters.',
    readTime: '6 min',
    status: 'soon',
    headerClass: 'h-shiva',
    pills: [['n', 'COMING SOON']],
  },
  {
    cat: 'dc',
    slug: 'gayatri-mantra-the-full-guide',
    title: 'Gayatri Mantra — the full guide',
    subtitle: 'Mantras',
    description: 'Who may recite it, when, and the answer to the question everyone asks.',
    readTime: '10 min',
    status: 'soon',
    headerClass: 'h-vishnu',
    pills: [['n', 'COMING SOON']],
  },
];

const TABS = [
  {
    k: 'all',
    label: 'All Articles',
    ey: 'ALL ARTICLES',
    t: 'Every article',
    s: "Everything published across Ritual Guides, Dharmic Concepts and the Beginner's track.",
  },
  {
    k: 'bg',
    label: "Beginner's Guides",
    ey: 'START HERE',
    t: "Beginner's Guides",
    s: 'Plain language, no citations, no Sanskrit to look up. Read in order — it takes about half an hour.',
  },
  {
    k: 'rg',
    label: 'Ritual Guides',
    ey: 'THE COMPLETE VIDHI',
    t: 'Ritual Guides',
    s: 'Festive pujans, all-year observances and the sixteen sanskars — every step, sourced.',
  },
  {
    k: 'dc',
    label: 'Dharmic Concepts',
    ey: 'THE STORY BEHIND IT',
    t: 'Dharmic Concepts',
    s: 'The materials, meanings and mantras that every ritual guide assumes you already know.',
  },
];

const PAGE_SIZE = 9;

function getCatBadge(cat: 'bg' | 'rg' | 'dc'): string {
  if (cat === 'bg') return "BEGINNER'S GUIDE";
  if (cat === 'dc') return 'DHARMIC CONCEPT';
  return 'RITUAL GUIDE';
}

function ArticlesListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get('tab') || searchParams.get('category') || 'bg';
  const initialTab = TABS.some((t) => t.k === tabParam) ? tabParam : 'bg';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'soon'>('all');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [articles, setArticles] = useState<ArticleItem[]>(DEFAULT_ARTICLES);

  useEffect(() => {
    async function loadDynamicArticles() {
      try {
        const [bgRes, rgRes, dcRes] = await Promise.all([
          fetch('/api/public/beginner-guides').catch(() => null),
          fetch('/api/public/ritual-guides').catch(() => null),
          fetch('/api/public/dharmic-concepts').catch(() => null),
        ]);

        const newItems: ArticleItem[] = [];

        if (bgRes && bgRes.ok) {
          const bgJson = await bgRes.json();
          const bgData = bgJson.success && Array.isArray(bgJson.data) ? bgJson.data : [];
          bgData.forEach((item: any) => {
            newItems.push({
              id: item.id,
              cat: 'bg',
              slug: item.slug,
              title: item.title || item.bannerTitle || 'Beginner Guide',
              subtitle: item.category || item.bannerEyebrow || 'Step 1 · Fundamentals',
              description: item.bannerDescription || item.introDescription || 'Introductory guide for beginners.',
              readTime: '6 min',
              status: item.status === 'PUBLISHED' ? 'live' : 'soon',
              headerClass: 'h-beg',
              pills: [['n', 'NO SANSKRIT NEEDED']],
            });
          });
        }

        if (rgRes && rgRes.ok) {
          const rgJson = await rgRes.json();
          const rgData = rgJson.success && Array.isArray(rgJson.data) ? rgJson.data : [];
          rgData.forEach((item: any) => {
            newItems.push({
              id: item.id,
              cat: 'rg',
              slug: item.slug,
              title: item.guideTitle || item.title,
              subtitle: item.sectionLabel || item.category || 'Festive Pujans',
              description: item.guideSubtitle || item.storyIntroduction || 'Complete vidhi and scriptural guide.',
              readTime: '11 min',
              status: item.status === 'PUBLISHED' ? 'live' : 'soon',
              headerClass: 'h-devi',
              pills: [['d', 'DHARMA · 4/5']],
            });
          });
        }

        if (dcRes && dcRes.ok) {
          const dcJson = await dcRes.json();
          const dcData = dcJson.success && Array.isArray(dcJson.data) ? dcJson.data : [];
          dcData.forEach((item: any) => {
            newItems.push({
              id: item.id,
              cat: 'dc',
              slug: item.slug,
              title: item.title,
              subtitle: item.category || 'Dharmic Concepts',
              description: item.summary || 'The story and meaning behind the ritual.',
              readTime: '7 min',
              status: item.status === 'PUBLISHED' ? 'live' : 'soon',
              headerClass: 'h-thread',
              pills: [['d', 'DHARMA · 4/5']],
            });
          });
        }

        if (newItems.length > 0) {
          setArticles(newItems);
        }
      } catch (err) {
        console.error('Failed to load dynamic articles:', err);
      }
    }
    loadDynamicArticles();
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setVisibleCount(PAGE_SIZE);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentTabObj = TABS.find((x) => x.k === activeTab) || TABS[0];

  const filteredArticles = useMemo(() => {
    let list = articles.filter((a) => (activeTab === 'all' ? true : a.cat === activeTab));
    if (activeFilter === 'live') list = list.filter((a) => a.status === 'live');
    if (activeFilter === 'soon') list = list.filter((a) => a.status === 'soon');
    return list;
  }, [articles, activeTab, activeFilter]);

  const shownArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  const bgCount = useMemo(() => articles.filter((a) => a.cat === 'bg').length, [articles]);
  const rgCount = useMemo(() => articles.filter((a) => a.cat === 'rg').length, [articles]);
  const dcCount = useMemo(() => articles.filter((a) => a.cat === 'dc').length, [articles]);

  const handleCardClick = (article: ArticleItem) => {
    if (article.cat === 'dc') {
      router.push(`/dharmic-concepts/${article.slug}`);
    } else {
      router.push(`/ritual-guides/${article.slug}`);
    }
  };

  return (
    <div className="plp-page min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <Link href="/ritual-guides">Ritual Guides</Link> › <b>All Articles</b>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="chero">
        <div className="wrap">
          <div className="chero-in">
            <p className="ch-ey">ALL ARTICLES</p>
            <h1 className="ch-h1">Every guide, from beginner to advanced</h1>
            <p className="ch-p">
              One place for everything we've published — the beginner track, the full ritual guides, and the dharmic concepts behind them. Pulled live from what's published in the admin panel, so this list is always current.
            </p>
            <div className="ch-meta">
              <span className="ch-m">
                <b>{articles.length}</b> articles total
              </span>
              <span className="ch-m">
                <b>{bgCount}</b> Beginner's Guides
              </span>
              <span className="ch-m">
                <b>{rgCount}</b> Ritual Guides
              </span>
              <span className="ch-m">
                <b>{dcCount}</b> Dharmic Concepts
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="tabs-wrap">
        <div className="tabs-in">
          {TABS.map((tb) => {
            const count = tb.k === 'all' ? articles.length : articles.filter((a) => a.cat === tb.k).length;
            const isOn = tb.k === activeTab;
            return (
              <button
                key={tb.k}
                className={`tab ${isOn ? 'on' : ''}`}
                onClick={() => handleTabChange(tb.k)}
              >
                {tb.label}
                <span className="cnt">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters">
        <div className="f-in">
          <span className="f-l">FILTER</span>
          <button
            className={`fc ${activeFilter === 'all' ? 'on' : ''}`}
            onClick={() => {
              setActiveFilter('all');
              setVisibleCount(PAGE_SIZE);
            }}
          >
            All levels
          </button>
          <button
            className={`fc ${activeFilter === 'live' ? 'on' : ''}`}
            onClick={() => {
              setActiveFilter('live');
              setVisibleCount(PAGE_SIZE);
            }}
          >
            Published
          </button>
          <button
            className={`fc ${activeFilter === 'soon' ? 'on' : ''}`}
            onClick={() => {
              setActiveFilter('soon');
              setVisibleCount(PAGE_SIZE);
            }}
          >
            Coming soon
          </button>
          <span className="f-sort">
            Sort — <b>Newest first</b> ▾
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="wrap">
        <div className="pagepad">
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">{currentTabObj.ey}</div>
                <div className="sec-t">{currentTabObj.t}</div>
                <p className="sec-s">{currentTabObj.s}</p>
              </div>
              <div className="sec-a">
                <b>{filteredArticles.length}</b> articles shown
              </div>
            </div>

            {filteredArticles.length > 0 && (
              <div className="count-line" style={{ marginBottom: '16px', fontSize: '12.5px', color: 'var(--sub-text)' }}>
                Showing <b>{shownArticles.length}</b> of <b>{filteredArticles.length}</b> articles
              </div>
            )}

            {filteredArticles.length === 0 ? (
              <div className="empty" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--sub-text)', fontSize: '13.5px' }}>
                No articles published in this category yet — check back soon.
              </div>
            ) : (
              <div className="grid">
                {shownArticles.map((item, idx) => (
                  <div
                    key={item.id || item.slug || idx}
                    className="c cursor-pointer"
                    onClick={() => handleCardClick(item)}
                  >
                    <div className={`c-top ${item.headerClass}`}>
                      {activeTab === 'all' ? (
                        <span className="c-cat">{getCatBadge(item.cat)}</span>
                      ) : (
                        <span></span>
                      )}
                      {item.status === 'soon' && <span className="c-when">COMING SOON</span>}
                    </div>
                    <div className="c-b">
                      <div className="c-t">{item.title}</div>
                      <div className="c-d">{item.subtitle}</div>
                      <p className="c-s">{item.description}</p>
                      <div className="c-f">
                        {(item.pills || []).map((p, pIdx) => (
                          <span key={pIdx} className={`pill ${p[0]}`}>
                            {p[1]}
                          </span>
                        ))}
                        <span className="c-read">{item.status === 'live' ? item.readTime : ''}</span>
                      </div>
                    </div>
                    {item.myth && (
                      <div className="myth">
                        <b>Corrects:</b> {item.myth}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {shownArticles.length < filteredArticles.length && (
              <div className="loadmore-wrap" style={{ display: 'flex', justifyContent: 'center', margin: '28px 0 6px' }}>
                <button
                  className="loadmore"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                >
                  Load more articles ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editorial Method Band */}
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

export default function ArticlesListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 text-center">Loading articles...</div>}>
      <ArticlesListingContent />
    </Suspense>
  );
}
