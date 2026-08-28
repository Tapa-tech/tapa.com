'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './concepts.css';

interface Concept {
  id?: string;
  title?: string;
  slug?: string;
  category?: string;
  body?: any;
  status?: string;
  summary?: string;
  deity?: string;
  readTime?: string;
  myth?: string;
  correction?: string;
  threeStoriesGalleryJson?: string;
}

// Category naam backend se jis bhi spelling/spacing me aaye, sab yahan match ho jayega.
const CATEGORY_MATCHERS: Record<string, string[]> = {
  materials: ['materials'],
  meanings: ['meanings & practices', 'meanings and practices', 'meanings & practice'],
  dailyPuja: ['daily puja', 'daily-puja'],
  dharmaVsPratha: ['dharma vs pratha', 'dharma-vs-pratha', 'dharma versus pratha'],
  mantras: ['mantras', 'mantra'],
};

function matchesCategory(concept: any, key: keyof typeof CATEGORY_MATCHERS) {
  const cat = (concept.category || '').toString().trim().toLowerCase();
  return CATEGORY_MATCHERS[key].includes(cat);
}

function parseGalleryImage(concept: any): string {
  try {
    const gallery = JSON.parse(concept.threeStoriesGalleryJson || '[]');
    const first = Array.isArray(gallery) ? gallery[0] : null;
    return first?.image || first?.imageUrl || first?.imageURL || first?.src || '';
  } catch {
    return '';
  }
}

// DHARMA rating pill + Classification pill (PURANIC, SHASTRA, etc.) — dono
// backend field se dynamically banaye jaate hain, jaisa static cards me hai.
function buildPills(concept: any): [string, string][] {
  const pills: [string, string][] = [];

  const rating = concept.bannerRating || concept.rating || '4/5';
  const category = (concept.category || '').toString().toUpperCase() || 'DHARMA';
  pills.push(['d', `${category} · ${rating}`]);

  const classification =
    concept.bannerClassification || concept.classification || '';
  if (classification) {
    pills.push(['n', classification.toString().toUpperCase()]);
  }

  return pills;
}

export default function DharmicConceptsPage() {
  const router = useRouter();
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    async function loadConcepts() {
      try {
        const res = await fetch('/api/public/dharmic-concepts', {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
              ? data.data
              : [];
          const publishedConcepts = list.filter(
            (concept: Concept) => concept.status === 'PUBLISHED'
          );

          setConcepts(publishedConcepts);
        } else {
          setConcepts([]);
        }
      } catch (err) {
        console.error('Failed to load concepts:', err);
        setConcepts([]);
      } finally {
        setLoading(false);
      }
    }
    loadConcepts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const materialsCards = [
    {
      h: 'h-shiva',
      rt: 'LIVE',
      t: 'Why is bilva dear to Mahadev?',
      d: 'Materials · Shiva',
      deity: 'Shiva',
      s: 'Three leaves on one stem. The tree did not study scripture to grow that way — the tradition recognised what it saw.',
      pills: [
        ['d', 'DHARMA · 4/5'],
        ['n', 'PURANIC'],
      ],
      read: '12 min',
      slug: 'why-is-bilva-dear-to-mahadev',
      isLive: true,
    },
    {
      h: 'h-vishnu',
      rt: 'SOON',
      t: 'Why is tulsi sacred to Vishnu?',
      d: 'Materials · Vishnu',
      deity: 'Vishnu',
      s: 'Lakshmi’s form as a plant, present in every Vishnu and Krishna puja — and never offered to Shiva.',
      pills: [['n', 'COMING SOON']],
      read: '—',
      slug: 'why-is-tulsi-sacred-to-vishnu',
      isLive: false,
    },
    {
      h: 'h-ganesh',
      rt: 'SOON',
      t: 'Why is durva offered to Ganesha?',
      d: 'Materials · Ganesha',
      deity: 'Ganesha',
      s: 'The grass offered on his head, in bunches of twenty-one. Named in the Ganesha Purana.',
      pills: [['n', 'COMING SOON']],
      read: '—',
      slug: 'why-is-durva-offered-to-ganesha',
      isLive: false,
    },
  ];

  const meaningsCards = [
    {
      h: 'h-thread',
      rt: 'LIVE',
      t: 'Three Stories, One Thread',
      d: 'The raksha sutra',
      deity: 'All',
      s: 'Wife, friend, devotee — three relationships, one act of protection. Not one of them is a sister and a brother.',
      pills: [
        ['d', 'DHARMA · 4/5'],
        ['n', 'PURANIC'],
      ],
      read: '7 min',
      myth: '"All three stories are about siblings."',
      slug: 'three-stories-one-thread',
      isLive: true,
    },
    {
      h: 'h-earth',
      rt: 'SOON',
      t: 'Sankalp — saying it out loud',
      d: 'Meanings & Practices',
      deity: 'All',
      s: 'The resolve stated at the start of a vrat. Why it is said, what it must contain, and what it does not need.',
      pills: [['n', 'COMING SOON']],
      read: '—',
      slug: 'sankalp-saying-it-out-loud',
      isLive: false,
    },
    {
      h: 'h-shiva',
      rt: 'SOON',
      t: 'Yajna, Havan or Homa?',
      d: 'Meanings & Practices',
      deity: 'Shiva',
      s: 'Three words used interchangeably, for three different things. The distinction is older than the confusion.',
      pills: [['n', 'COMING SOON']],
      read: '—',
      slug: 'yajna-havan-or-homa',
      isLive: false,
    },
  ];

  const dailyPujaRows = [
    {
      t: 'Puja room setup — where and how',
      s: 'Direction, height, what belongs on the shelf and what does not',
      slug: 'puja-room-setup',
    },
    {
      t: 'Morning sandhya and panch-upachara',
      s: 'The five-offering form, in about ten minutes',
      slug: 'morning-sandhya-and-panch-upachara',
    },
    {
      t: 'Tulsi Puja — the daily practice',
      s: 'Watering, the evening diya, and the days it is not plucked',
      slug: 'tulsi-puja-the-daily-practice',
    },
    {
      t: 'Deepa Daan — when, why and how',
      s: 'The lamp as offering rather than decoration',
      slug: 'deepa-daan-when-why-and-how',
    },
  ];

  const dharmaVsPrathaCards = [
    {
      h: 'h-gold',
      rt: 'SOON',
      t: '10 things you think are mandatory',
      d: 'Dharma vs Pratha',
      deity: 'All',
      s: 'And are not. Each one traced to where it actually came from — usually a region, sometimes a shop.',
      pills: [['n', 'COMING SOON']],
      read: '—',
      slug: '10-things-you-think-are-mandatory',
      isLive: false,
    },
    {
      h: 'h-gold',
      rt: 'SOON',
      t: 'Can women do puja during menstruation?',
      d: 'Dharma vs Pratha',
      deity: 'All',
      s: 'Genuinely contested. We present the range of positions with sources, and say plainly where no scriptural restriction exists.',
      pills: [['n', 'COMING SOON']],
      read: '—',
      slug: 'can-women-do-puja-during-menstruation',
      isLive: false,
    },
    {
      h: 'h-gold',
      rt: 'SOON',
      t: 'Regional practice myths',
      d: 'Dharma vs Pratha',
      deity: 'All',
      s: 'Your way is not wrong because it differs from theirs. An ongoing series on what varies and why.',
      pills: [['n', 'COMING SOON']],
      read: '—',
      slug: 'regional-practice-myths',
      isLive: false,
    },
  ];

  const mantrasRows = [
    {
      t: 'Panchakshara — Om Namah Shivaya',
      s: 'The five syllables, and why the count matters',
      slug: 'panchakshara-om-namah-shivaya',
    },
    {
      t: 'Mahamrityunjaya — meaning and use',
      s: 'What it asks for, and what it does not promise',
      slug: 'mahamrityunjaya-meaning-and-use',
    },
    {
      t: 'Gayatri Mantra — the full guide',
      s: 'Who may recite it, when, and the answer to the question everyone asks',
      slug: 'gayatri-mantra-the-full-guide',
    },
    {
      t: 'Mantras for daily puja',
      s: 'A short set, with audio, for the ten-minute morning',
      slug: 'mantras-for-daily-puja',
    },
  ];

  // ===== DYNAMIC — backend se aane wale concepts, category ke hisaab se split =====

  const dynamicMaterialsCards = concepts
    .filter((concept: any) => matchesCategory(concept, 'materials'))
    .map((concept: any, idx: number) => ({
      h: idx % 3 === 0 ? 'h-shiva' : idx % 3 === 1 ? 'h-vishnu' : 'h-ganesh',
      rt: concept.status === 'PUBLISHED' ? 'LIVE' : '',
      t: concept.title || '',
      d: concept.category || 'Materials',
      deity: concept.deity || 'All',
      s: concept.summary || '',
      pills: buildPills(concept),
      read: concept.readTime || '—',
      slug: concept.slug || '',
      isLive: true,
      imageUrl: parseGalleryImage(concept),
    }));

  const dynamicMeaningsCards = concepts
    .filter((concept: any) => matchesCategory(concept, 'meanings'))
    .map((concept: any, idx: number) => ({
      h: idx % 3 === 0 ? 'h-thread' : idx % 3 === 1 ? 'h-earth' : 'h-shiva',
      rt: 'LIVE',
      t: concept.title || '',
      d: concept.category || 'Meanings & Practices',
      deity: 'All',
      s: concept.summary || '',
      pills: buildPills(concept),
      read: concept.readTime || '—',
      slug: concept.slug || '',
      isLive: true,
      myth: concept.myth || concept.correction || '',
      imageUrl: parseGalleryImage(concept),
    }));

  const dynamicDailyPujaRows = concepts
    .filter((concept: any) => matchesCategory(concept, 'dailyPuja'))
    .map((concept: any) => ({
      t: concept.title || '',
      s: concept.summary || '',
      slug: concept.slug || '',
    }));

  const dynamicDharmaVsPrathaCards = concepts
    .filter((concept: any) => matchesCategory(concept, 'dharmaVsPratha'))
    .map((concept: any) => ({
      h: 'h-gold',
      rt: 'LIVE',
      t: concept.title || '',
      d: concept.category || 'Dharma vs Pratha',
      deity: concept.deity || 'All',
      s: concept.summary || '',
      pills: buildPills(concept),
      read: concept.readTime || '—',
      slug: concept.slug || '',
      isLive: true,
      imageUrl: parseGalleryImage(concept),
    }));

  const dynamicMantrasRows = concepts
    .filter((concept: any) => matchesCategory(concept, 'mantras'))
    .map((concept: any) => ({
      t: concept.title || '',
      s: concept.summary || '',
      slug: concept.slug || '',
    }));

  const isMatchFilter = (itemDeity?: string) => {
    if (activeFilter === 'All') return true;
    if (!itemDeity) return true;
    return itemDeity.toLowerCase().includes(activeFilter.toLowerCase()) || itemDeity === 'All';
  };

  const handleCardClick = (cardItem: { isLive?: boolean; slug: string; t: string }) => {
    if (cardItem.isLive) {
      router.push(`/dharmic-concepts/${cardItem.slug}`);
    } else {
      showToast(`"${cardItem.t}" is launching soon!`);
    }
  };

  const handleRowClick = (rowItem: { slug: string; t: string }, isLive: boolean = false) => {
    if (isLive) {
      router.push(`/dharmic-concepts/${rowItem.slug}`);
    } else {
      showToast(`"${rowItem.t}" is coming soon!`);
    }
  };

  return (
    <div className="concepts-page min-h-screen w-full max-w-full overflow-x-hidden">
      { }
      <div className="bcrumb">
        <div className="bc-in">
          <Link href="/">Home</Link> › <b>Dharmic Concepts</b>
        </div>
      </div>

      { }
      <section className="chero dc">
        <div className="wrap">
          <div className="chero-in">
            <div>
              <p className="ch-ey">DHARMIC CONCEPTS</p>
              <h1 className="ch-h1">The object in your hand has a story</h1>
              <p className="ch-p">
                Why bilva and not tulsi. Why three stories and not one. These sit behind every ritual guide —
                when a samagri list says "bilva leaves", this is where the reason lives.
              </p>
              <div className="ch-meta">
                <span className="ch-m"><b>2</b> live</span>
                <span className="ch-m"><b>14</b> planned by March</span>
                <span className="ch-m"><b>5</b> sub-categories</span>
              </div>
            </div>
            <div className="ch-side">
              <div className="chs-l">◗ LOOK UP ANY TERM</div>
              <div className="chs-t">The Glossary</div>
              <p className="chs-d">
                142 words defined once, in plain language, with the Devanagari and how to say it out loud.
              </p>
              <button className="chs-c" onClick={() => router.push('/glossary')}>
                Open the glossary ›
              </button>
            </div>
          </div>
        </div>
      </section>

      { }
      <div className="filters">
        <div className="f-in">
          <span className="f-l">FILTER</span>
          {['All', 'Shiva', 'Vishnu', 'Devi', 'Ganesha'].map((filterName) => (
            <button
              key={filterName}
              className={`fc ${activeFilter === filterName ? 'on' : ''}`}
              onClick={() => setActiveFilter(filterName)}
            >
              {filterName}
            </button>
          ))}
          <span className="f-sort">
            Sort — <b>Most read</b> ▾
          </span>
        </div>
      </div>

      { }
      <div className="wrap">
        <div className="pagepad">
          { }
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">OBJECTS AND WHAT THEY MEAN</div>
                <div className="sec-t">Materials</div>
                <p className="sec-s">
                  The things you hold, offer and light. Each one has a story, a source and a set of offering rules.
                </p>
              </div>
              <a className="sec-a">
                <span>{materialsCards.length + dynamicMaterialsCards.length} guides</span>View all ›
              </a>
            </div>
            <div className="grid">
              {materialsCards
                .filter((item) => isMatchFilter(item.deity))
                .map((cardItem) => (
                  <a
                    key={cardItem.slug}
                    className="c"
                    onClick={() => handleCardClick(cardItem)}
                  >
                    <div className={`c-top ${cardItem.h}`}>
                      {cardItem.rt && <span className="c-when">{cardItem.rt}</span>}
                    </div>
                    <div className="c-b">
                      <div className="c-t">{cardItem.t}</div>
                      {cardItem.d && <div className="c-d">{cardItem.d}</div>}
                      <p className="c-s">{cardItem.s}</p>
                      <div className="c-f">
                        {(cardItem.pills || []).map((p, idx) => (
                          <span key={idx} className={`pill ${p[0]}`}>
                            {p[1]}
                          </span>
                        ))}
                        <span className="c-read">{cardItem.read || ''}</span>
                      </div>
                    </div>
                  </a>
                ))}

              {dynamicMaterialsCards
                .filter((item) => isMatchFilter(item.deity))
                .map((cardItem, idx) => (
                  <a
                    key={cardItem.slug || `material-${idx}`}
                    className="c"
                    onClick={() => handleCardClick(cardItem)}
                  >
                    <div
                      className={`c-top ${cardItem.h}`}
                      style={
                        cardItem.imageUrl
                          ? {
                            backgroundImage: `url("${cardItem.imageUrl}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                          }
                          : undefined
                      }
                    >
                      {cardItem.rt && (
                        <span className="c-when">{cardItem.rt}</span>
                      )}
                    </div>

                    <div className="c-b">
                      <div className="c-t">{cardItem.t}</div>
                      {cardItem.d && (
                        <div className="c-d">{cardItem.d}</div>
                      )}
                      <p className="c-s">{cardItem.s}</p>
                      <div className="c-f">
                        {(cardItem.pills || []).map((p, pillIdx) => (
                          <span
                            key={pillIdx}
                            className={`pill ${p[0]}`}
                          >
                            {p[1]}
                          </span>
                        ))}
                        <span className="c-read">
                          {cardItem.read || ''}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </div>

          { }
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">ACTS AND IDEAS</div>
                <div className="sec-t">Meanings &amp; Practices</div>
                <p className="sec-s">
                  What you do, and what it means. Sankalpa, abhishek, avahana — the acts every vidhi assumes you already understand.
                </p>
              </div>
              <a className="sec-a">
                <span>{meaningsCards.length + dynamicMeaningsCards.length} guides</span>View all ›
              </a>
            </div>
            <div className="grid">
              {meaningsCards
                .filter((item) => isMatchFilter(item.deity))
                .map((cardItem) => (
                  <a
                    key={cardItem.slug}
                    className="c"
                    onClick={() => handleCardClick(cardItem)}
                  >
                    <div className={`c-top ${cardItem.h}`}>
                      {cardItem.rt && (
                        <span className="c-when">{cardItem.rt}</span>
                      )}
                    </div>

                    <div className="c-b">
                      <div className="c-t">{cardItem.t}</div>

                      {cardItem.d && (
                        <div className="c-d">{cardItem.d}</div>
                      )}

                      <p className="c-s">{cardItem.s}</p>

                      <div className="c-f">
                        {(cardItem.pills || []).map((p, idx) => (
                          <span
                            key={idx}
                            className={`pill ${p[0]}`}
                          >
                            {p[1]}
                          </span>
                        ))}

                        <span className="c-read">
                          {cardItem.read || ''}
                        </span>
                      </div>
                    </div>

                    {cardItem.myth && (
                      <div className="myth">
                        <b>Corrects:</b> {cardItem.myth}
                      </div>
                    )}
                  </a>
                ))}

              {dynamicMeaningsCards
                .filter((item) => isMatchFilter(item.deity))
                .map((cardItem, idx) => (
                  <a
                    key={cardItem.slug || `meaning-${idx}`}
                    className="c"
                    onClick={() => handleCardClick(cardItem)}
                  >
                    <div
                      className={`c-top ${cardItem.h}`}
                      style={
                        cardItem.imageUrl
                          ? {
                            backgroundImage: `url("${cardItem.imageUrl}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                          }
                          : undefined
                      }
                    >
                      {cardItem.rt && (
                        <span className="c-when">
                          {cardItem.rt}
                        </span>
                      )}
                    </div>

                    <div className="c-b">
                      <div className="c-t">
                        {cardItem.t}
                      </div>

                      {cardItem.d && (
                        <div className="c-d">
                          {cardItem.d}
                        </div>
                      )}

                      <p className="c-s">
                        {cardItem.s}
                      </p>

                      <div className="c-f">
                        {(cardItem.pills || []).map((p, pillIdx) => (
                          <span
                            key={pillIdx}
                            className={`pill ${p[0]}`}
                          >
                            {p[1]}
                          </span>
                        ))}

                        <span className="c-read">
                          {cardItem.read || ''}
                        </span>
                      </div>
                    </div>

                    {cardItem.myth && (
                      <div className="myth">
                        <b>Corrects:</b> "{cardItem.myth}"
                      </div>
                    )}
                  </a>
                ))}
            </div>
          </div>

          { }
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">EVERY MORNING</div>
                <div className="sec-t">Daily Puja</div>
                <p className="sec-s">
                  The practice that is not attached to a festival. Room setup, the diya, the aarti, and what a daily puja actually asks of you.
                </p>
              </div>
              <a className="sec-a">
                <span>{dailyPujaRows.length + dynamicDailyPujaRows.length} guides</span>View all ›
              </a>
            </div>
            <div className="rows">
              {dailyPujaRows.map((rowItem) => (
                <a
                  key={rowItem.slug}
                  className="row"
                  onClick={() => handleRowClick(rowItem)}
                >
                  <span className="row-n">
                    <span className="row-t">{rowItem.t}</span>
                    <span className="row-s">{rowItem.s}</span>
                  </span>
                  <span className="row-a">›</span>
                </a>
              ))}

              {dynamicDailyPujaRows.map((rowItem, idx) => (
                <a
                  key={rowItem.slug || `daily-puja-${idx}`}
                  className="row"
                  onClick={() => handleRowClick(rowItem, true)}
                >
                  <span className="row-n">
                    <span className="row-t">{rowItem.t}</span>
                    <span className="row-s">{rowItem.s}</span>
                  </span>
                  <span className="row-a">›</span>
                </a>
              ))}
            </div>
          </div>

          { }
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">THE SIGNATURE SERIES</div>
                <div className="sec-t">Dharma vs Pratha</div>
                <p className="sec-s">
                  Twenty articles by December. Each one takes a practice everyone assumes is mandatory and shows exactly where it comes from.
                </p>
              </div>
              <a className="sec-a">
                <span>{dharmaVsPrathaCards.length + dynamicDharmaVsPrathaCards.length} guides</span>View all ›
              </a>
            </div>
            <div className="grid">
              {dharmaVsPrathaCards
                .filter((item) => isMatchFilter(item.deity))
                .map((cardItem) => (
                  <a
                    key={cardItem.slug}
                    className="c"
                    onClick={() => handleCardClick(cardItem)}
                  >
                    <div className={`c-top ${cardItem.h}`}>
                      {cardItem.rt && <span className="c-when">{cardItem.rt}</span>}
                    </div>
                    <div className="c-b">
                      <div className="c-t">{cardItem.t}</div>
                      {cardItem.d && <div className="c-d">{cardItem.d}</div>}
                      <p className="c-s">{cardItem.s}</p>
                      <div className="c-f">
                        {(cardItem.pills || []).map((p, idx) => (
                          <span key={idx} className={`pill ${p[0]}`}>
                            {p[1]}
                          </span>
                        ))}
                        <span className="c-read">{cardItem.read || ''}</span>
                      </div>
                    </div>
                  </a>
                ))}

              {dynamicDharmaVsPrathaCards
                .filter((item) => isMatchFilter(item.deity))
                .map((cardItem, idx) => (
                  <a
                    key={cardItem.slug || `dharma-vs-pratha-${idx}`}
                    className="c"
                    onClick={() => handleCardClick(cardItem)}
                  >
                    <div
                      className={`c-top ${cardItem.h}`}
                      style={
                        cardItem.imageUrl
                          ? {
                            backgroundImage: `url("${cardItem.imageUrl}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                          }
                          : undefined
                      }
                    >
                      {cardItem.rt && <span className="c-when">{cardItem.rt}</span>}
                    </div>
                    <div className="c-b">
                      <div className="c-t">{cardItem.t}</div>
                      {cardItem.d && <div className="c-d">{cardItem.d}</div>}
                      <p className="c-s">{cardItem.s}</p>
                      <div className="c-f">
                        {(cardItem.pills || []).map((p, pillIdx) => (
                          <span key={pillIdx} className={`pill ${p[0]}`}>
                            {p[1]}
                          </span>
                        ))}
                        <span className="c-read">{cardItem.read || ''}</span>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </div>

          { }
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">SAID ALOUD</div>
                <div className="sec-t">Mantras</div>
                <p className="sec-s">
                  Meaning, pronunciation and use. Every one with audio, in both English transliteration and Devanagari.
                </p>
              </div>
              <a className="sec-a">
                <span>{mantrasRows.length + dynamicMantrasRows.length} guides</span>View all ›
              </a>
            </div>
            <div className="rows">
              {mantrasRows.map((rowItem) => (
                <a
                  key={rowItem.slug}
                  className="row"
                  onClick={() => handleRowClick(rowItem)}
                >
                  <span className="row-n">
                    <span className="row-t">{rowItem.t}</span>
                    <span className="row-s">{rowItem.s}</span>
                  </span>
                  <span className="row-a">›</span>
                </a>
              ))}

              {dynamicMantrasRows.map((rowItem, idx) => (
                <a
                  key={rowItem.slug || `mantra-${idx}`}
                  className="row"
                  onClick={() => handleRowClick(rowItem, true)}
                >
                  <span className="row-n">
                    <span className="row-t">{rowItem.t}</span>
                    <span className="row-s">{rowItem.s}</span>
                  </span>
                  <span className="row-a">›</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      { }
      <div className="wrap">
        <div className="methodband">
          <div>
            <div className="mb-ey">HOW WE DECIDE WHAT IS TRUE</div>
            <div className="mb-t">Every badge on this page means something specific</div>
            <p className="mb-p">
              Dharma, Pratha or Bhranti — with a confidence score you can check. If we cannot name the text a reader could open, we do not make the claim.
            </p>
            <button className="mb-c" onClick={() => router.push('/editorial-method')}>
              Read our editorial method ›
            </button>
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

      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
}