'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './concepts.css';

interface Concept {
  id?: string;
  title?: string;
  slug?: string;
  category?: string;
  body?: unknown;
  status?: string;
  summary?: string;
  deity?: string;
  readTime?: string;
  myth?: string;
  correction?: string;
  threeStoriesGalleryJson?: string;
  storiesItemsJson?: string;
  bannerRating?: string;
  rating?: string;
  bannerClassification?: string;
  classification?: string;
}

const CATEGORY_MATCHERS: Record<string, string[]> = {
  materials: ['materials'],
  meanings: ['meanings & practices', 'meanings and practices', 'meanings & practice'],
  dailyPuja: ['daily puja', 'daily-puja'],
  dharmaVsPratha: ['dharma vs pratha', 'dharma-vs-pratha', 'dharma versus pratha'],
  mantras: ['mantras', 'mantra'],
};

function matchesCategory(concept: Concept, key: keyof typeof CATEGORY_MATCHERS) {
  const cat = (concept.category || '').toString().trim().toLowerCase();
  const match = CATEGORY_MATCHERS[key].some((m) => cat.includes(m) || m.includes(cat));
  if (match) return true;

  if (key === 'materials') {
    const matchedOther = Object.keys(CATEGORY_MATCHERS).some(
      (otherKey) => otherKey !== 'materials' && CATEGORY_MATCHERS[otherKey].some((m) => cat.includes(m) || m.includes(cat))
    );
    if (!matchedOther) return true;
  }
  return false;
}

function parseFirstStoryImage(concept: Concept): string {
  try {
    const stories = JSON.parse(concept.storiesItemsJson || '[]');
    const first = Array.isArray(stories) ? stories[0] : null;
    return first?.image || first?.imageUrl || first?.imageURL || first?.src || '';
  } catch {
    return '';
  }
}

function buildPills(concept: Concept): [string, string][] {
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
          const activeConcepts = list.filter(
            (concept: Concept) => concept.status !== 'ARCHIVED'
          );

          setConcepts(activeConcepts.length > 0 ? activeConcepts : list);
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

  const materialsCards: any[] = [];
  const meaningsCards: any[] = [];
  const dailyPujaRows: any[] = [];
  const dharmaVsPrathaCards: any[] = [];
  const mantrasRows: any[] = [];

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
      imageUrl: parseFirstStoryImage(concept),
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
      imageUrl: parseFirstStoryImage(concept),
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
      imageUrl: parseFirstStoryImage(concept),
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

      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <b>Dharmic Concepts</b>
          </div>
        </div>
      </div>


      <section className="chero dc">
        <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden">
          <div className="chero-in">
            <div>
              <p className="ch-ey">DHARMIC CONCEPTS</p>
              <h1 className="ch-h1">The object in your hand has a story</h1>
              <p className="ch-p">
                Why bilva and not tulsi. Why three stories and not one. These sit behind every ritual guide —
                when a samagri list says "bilva leaves", this is where the reason lives.
              </p>
              <div className="ch-meta">
                <span className="ch-m"><b>{concepts.length || 2}</b> live</span>
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


      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden">
        <div className="pagepad">
    
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

                      {(cardItem as any).storiesItems?.[0]?.image && (
                        <img
                          src={(cardItem as any).storiesItems[0].image}
                          alt={(cardItem as any).storiesItems[0].imageAltText || ''}
                          className="c-story-image"
                        />
                      )}
                    </div>
                    <div className="c-b">
                      <div className="c-t">{cardItem.t}</div>
                      {cardItem.d && <div className="c-d">{cardItem.d}</div>}
                      <p className="c-s">{cardItem.s}</p>
                      <div className="c-f">
                        {(cardItem.pills || []).map((p: any, idx: number) => (
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
                        {(cardItem.pills || []).map((p: any, idx: number) => (
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
                        {(cardItem.pills || []).map((p: any, idx: number) => (
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


      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden">
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