'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SearchBar } from './SearchBar';
import { SearchFilters, CategoryFilter } from './SearchFilters';
import { GlossaryResult, GlossaryDefinition } from './GlossaryResult';
import { SearchResultsGroup } from './SearchResultsGroup';
import { SearchResultItem } from './SearchResultCard';
import { SearchSidebar } from './SearchSidebar';
import { SearchEmptyState } from './SearchEmptyState';
import { SearchLoadingState } from './SearchLoadingState';
import { SearchErrorState } from './SearchErrorState';

export type SystemViewMode = 'results' | 'empty' | 'e404' | 'e500' | 'off';

interface SearchSystemContainerProps {
  initialQuery?: string;
  showPreviewNav?: boolean;
}

// Built-in Glossary Dictionary for instant priority matching
const GLOSSARY_DICTIONARY: Record<string, GlossaryDefinition> = {
  ekadashi: {
    title: 'Ekadashi',
    devanagari: 'एकादशी',
    pronunciation: 'e-kaa-da-shee',
    tags: ['SANSKRIT', 'TIME'],
    definition: 'The eleventh lunar day of each fortnight, so twice a lunar month and twenty-four times a year. Kept as a vrat with grain avoidance, broken the next morning inside the parana window.',
    appearsIn: [
      { name: 'Aja Ekadashi', url: '/ritual-guides/aja-ekadashi' },
      { name: 'Vrat Calendar', url: '/panchang/vrat-calendar' },
      { name: 'Parana', url: '/glossary#parana' },
    ],
    glossaryUrl: '/glossary#ekadashi',
  },
  parana: {
    title: 'Parana',
    devanagari: 'पारणा',
    pronunciation: 'paa-ra-naa',
    tags: ['RITUAL', 'TIME'],
    definition: 'Breaking a fast at the prescribed auspicious time window after Dwadashi tithi commences.',
    appearsIn: [
      { name: 'Aja Ekadashi', url: '/ritual-guides/aja-ekadashi' },
      { name: 'Vrat Calendar', url: '/panchang/vrat-calendar' },
    ],
    glossaryUrl: '/glossary#parana',
  },
  sutak: {
    title: 'Sutak',
    devanagari: 'सूतक',
    pronunciation: 'soo-tak',
    tags: ['TIMING', 'PURITY'],
    definition: 'An inauspicious period observed during lunar or solar eclipses, requiring avoidance of auspicious ceremonies.',
    appearsIn: [
      { name: 'Eclipses 2026', url: '/panchang/eclipses' },
      { name: 'Panchang Daily', url: '/panchang' },
    ],
    glossaryUrl: '/glossary#sutak',
  },
  'rahu kaal': {
    title: 'Rahu Kaal',
    devanagari: 'राहु काल',
    pronunciation: 'raa-hoo kaal',
    tags: ['ASTROLOGY', 'TIMING'],
    definition: 'A 90-minute daily period ruled by Rahu, avoided for commencing new auspicious endeavors.',
    appearsIn: [
      { name: 'Daily Panchang', url: '/panchang' },
    ],
    glossaryUrl: '/panchang#rahu-kaal',
  },
  durva: {
    title: 'Durva',
    devanagari: 'दुर्वा',
    pronunciation: 'dur-vaa',
    tags: ['MATERIALS', 'DEITY'],
    definition: '21 blades of sacred green grass offered to Lord Ganesha during sthapana and daily pujan.',
    appearsIn: [
      { name: 'Ganesh Chaturthi', url: '/ritual-guides/ganesh-chaturthi' },
    ],
    glossaryUrl: '/dharmic-concepts#durva',
  },
  bilva: {
    title: 'Bilva Leaf',
    devanagari: 'बिल्व पत्र',
    pronunciation: 'bil-va pa-tra',
    tags: ['MATERIALS', 'SHIVA'],
    definition: 'Trifoliate sacred leaf beloved of Lord Shiva, offered during Shivratri and Monday pujans.',
    appearsIn: [
      { name: 'Maha Shivratri', url: '/panchang/vrat-calendar' },
    ],
    glossaryUrl: '/dharmic-concepts#bilva',
  },
};

export const SearchSystemContainer: React.FC<SearchSystemContainerProps> = ({
  initialQuery = 'ekadashi',
  showPreviewNav = true,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('All');
  const [viewMode, setViewMode] = useState<SystemViewMode>('results');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Grouped Search Results
  const [guidesResults, setGuidesResults] = useState<SearchResultItem[]>([]);
  const [panchangResults, setPanchangResults] = useState<SearchResultItem[]>([]);
  const [glossaryResults, setGlossaryResults] = useState<SearchResultItem[]>([]);
  const [conceptsResults, setConceptsResults] = useState<SearchResultItem[]>([]);
  const [kitsResults, setKitsResults] = useState<SearchResultItem[]>([]);


  const [matchedDefinition, setMatchedDefinition] = useState<GlossaryDefinition | null>(GLOSSARY_DICTIONARY['ekadashi']);

  const executeSearch = useCallback((searchQuery: string) => {
    const trimmed = searchQuery.trim().toLowerCase();
    setActiveQuery(searchQuery);

    if (!trimmed) {
      setGuidesResults([]);
      setPanchangResults([]);
      setGlossaryResults([]);
      setConceptsResults([]);
      setKitsResults([]);
      setMatchedDefinition(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    // 1. Priority Glossary Definition Lookup
    let foundDef: GlossaryDefinition | null = null;
    Object.keys(GLOSSARY_DICTIONARY).forEach((key) => {
      if (trimmed.includes(key) || key.includes(trimmed)) {
        foundDef = GLOSSARY_DICTIONARY[key];
      }
    });
    setMatchedDefinition(foundDef);

    // 2. Fetch API Search Results
    fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      })
      .then((data) => {
        const rawResults: any[] = data.results || [];

        // Map API results into structured SearchResultItem objects
        const guides: SearchResultItem[] = [];
        const panchang: SearchResultItem[] = [];
        const glossary: SearchResultItem[] = [];
        const concepts: SearchResultItem[] = [];
        const kits: SearchResultItem[] = [];

        rawResults.forEach((r) => {
          const item: SearchResultItem = {
            id: r.id || r.slug,
            categoryLabel: r.tag || r.category,
            title: r.title,
            snippet: r.subtitle || r.content || '',
            url: r.url || `/ritual-guides/${r.slug}`,
            gradientClass:
              r.category === 'KITS'
                ? 'h-vishnu'
                : r.category === 'FESTIVALS'
                  ? 'h-data'
                  : r.tag?.includes('Shiva')
                    ? 'h-shiva'
                    : r.tag?.includes('Devi')
                      ? 'h-devi'
                      : 'h-vishnu',
            pills: [
              { text: r.tag || 'GUIDE', variant: r.category === 'KITS' ? 'n' : 'd' },
              ...(r.badge ? [{ text: r.badge, variant: 'n' as const }] : []),
            ],
          };

          if (r.category === 'RITUAL GUIDES') guides.push(item);
          else if (r.category === 'GLOSSARY') glossary.push(item);
          else if (r.category === 'KITS') kits.push(item);
          else if (r.category === 'FESTIVALS') panchang.push(item);
          else concepts.push(item);
        });

        // Fallback default rich data if API returned limited items in dev
        if (guides.length === 0 && trimmed.includes('ekadashi')) {
          guides.push(
            {
              id: 'g-1',
              categoryLabel: 'ALL-YEAR PUJANS',
              title: 'Aja Ekadashi',
              snippet: 'Grain avoidance from sunrise, parana the next morning. The Ekadashi that falls in Bhadrapada Krishna Paksha.',
              url: '/ritual-guides/aja-ekadashi',
              gradientClass: 'h-vishnu',
              pills: [{ text: 'DHARMA · 4/5', variant: 'd' }, { text: '9 min read', variant: 'n' }],
            },
            {
              id: 'g-2',
              categoryLabel: 'ALL-YEAR PUJANS',
              title: 'Parsva Ekadashi',
              snippet: 'The Chaturmas midpoint. Vishnu is said to turn in his sleep, and the second half of the four months begins.',
              url: '/ritual-guides/parsva-ekadashi',
              gradientClass: 'h-vishnu',
              pills: [{ text: 'DHARMA · 4/5', variant: 'd' }, { text: '8 min read', variant: 'n' }],
            },
            {
              id: 'g-3',
              categoryLabel: 'ALL-YEAR PUJANS',
              title: 'Kamika Ekadashi',
              snippet: 'The Shravan Ekadashi. What counts as a grain, and what surprisingly does not.',
              url: '/ritual-guides/kamika-ekadashi',
              gradientClass: 'h-earth',
              pills: [{ text: 'DHARMA · 4/5', variant: 'd' }, { text: '9 min read', variant: 'n' }],
            }
          );
        }

        if (panchang.length === 0 && trimmed.includes('ekadashi')) {
          panchang.push(
            {
              id: 'p-1',
              categoryLabel: 'VRAT CALENDAR',
              title: 'All 24 Ekadashi dates in 2026',
              snippet: 'Every date with its name, tithi and parana window. Computed for New Delhi.',
              url: '/panchang/vrat-calendar',
              gradientClass: 'h-data',
              pills: [{ text: 'CALENDAR', variant: 'dt' }, { text: 'Updated for 2026', variant: 'n' }],
            },
            {
              id: 'p-2',
              categoryLabel: 'VRAT DETAIL',
              title: 'Aja Ekadashi — 8 September 2026',
              snippet: 'Parana 9 September, 6:02 – 8:17 AM. Fast begins at sunrise on the 8th.',
              url: '/panchang/vrat-calendar',
              gradientClass: 'h-data',
              pills: [{ text: 'UPCOMING', variant: 'dt' }, { text: 'New Delhi', variant: 'n' }],
            }
          );
        }

        if (kits.length === 0 && trimmed.includes('ekadashi')) {
          kits.push({
            id: 'k-1',
            categoryLabel: 'BY RITUAL',
            title: 'Satyanarayan Kit',
            snippet: 'Often kept alongside Ekadashi observance. Panchamrit, panchmeva, supari, banana leaves and the katha booklet.',
            url: '/#prebook-kits',
            gradientClass: 'h-vishnu',
            pills: [{ text: '₹1,951', variant: 'n' }, { text: 'IN STOCK', variant: 'n' }],
          });
        }

        setGuidesResults(guides);
        setPanchangResults(panchang);
        setGlossaryResults(glossary);
        setConceptsResults(concepts);
        setKitsResults(kits);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Search error:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    executeSearch(initialQuery);
  }, [initialQuery, executeSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    setActiveQuery('');
    setGuidesResults([]);
    setPanchangResults([]);
    setGlossaryResults([]);
    setConceptsResults([]);
    setKitsResults([]);
    setMatchedDefinition(null);
  };

  const handleSelectQuery = (q: string) => {
    setQuery(q);
    executeSearch(q);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Counts
  const counts = {
    glossary: (matchedDefinition ? 1 : 0) + glossaryResults.length,
    guides: guidesResults.length,
    panchang: panchangResults.length,
    concepts: conceptsResults.length,
    kits: kitsResults.length,
  };
  const totalResults = counts.glossary + counts.guides + counts.panchang + counts.concepts + counts.kits;

  // Filtered views based on CategoryFilter
  const showGlossary = activeFilter === 'All' || activeFilter === 'Glossary';
  const showGuides = activeFilter === 'All' || activeFilter === 'Ritual Guides';
  const showPanchang = activeFilter === 'All' || activeFilter === 'Panchang';
  const showConcepts = activeFilter === 'All' || activeFilter === 'Dharmic Concepts';
  const showKits = activeFilter === 'All' || activeFilter === 'Ritual Kits';

  return (
    <div>
      {/* OPTIONAL PREVIEW TOP BAR FOR SYSTEM PAGES AUDIT */}
      {showPreviewNav && (
        <div className="prev" style={{ background: '#2E2260', padding: '10px 40px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#B9A9DC', letterSpacing: '0.7px' }}>
            SEARCH SYSTEM &amp; PAGES
          </span>
          <button
            type="button"
            className={`prev-b ${viewMode === 'results' ? 'on' : ''}`}
            onClick={() => setViewMode('results')}
          >
            Results
          </button>
          <button
            type="button"
            className={`prev-b ${viewMode === 'empty' ? 'on' : ''}`}
            onClick={() => setViewMode('empty')}
          >
            No results
          </button>
          <button
            type="button"
            className={`prev-b ${viewMode === 'e404' ? 'on' : ''}`}
            onClick={() => setViewMode('e404')}
          >
            404
          </button>
          <button
            type="button"
            className={`prev-b ${viewMode === 'e500' ? 'on' : ''}`}
            onClick={() => setViewMode('e500')}
          >
            500
          </button>
          <button
            type="button"
            className={`prev-b ${viewMode === 'off' ? 'on' : ''}`}
            onClick={() => setViewMode('off')}
          >
            Offline
          </button>
          <span style={{ marginLeft: 'auto', fontSize: '10.5px', color: '#9A8AC0', fontStyle: 'italic' }}>
            Glossary definitions rank above articles
          </span>
        </div>
      )}

      {/* SYSTEM PAGE: 404 PAGE NOT FOUND */}
      {viewMode === 'e404' && (
        <section className="sys e404">
          <div className="sys-in">
            <div>
              <div className="sys-badge">
                <span className="sys-num">404</span>
                <span className="sys-lab">ERROR<b>Page not found</b></span>
              </div>
              <h1 className="sys-h">Hanuman searched all of Lanka.<br /><em>You have searched one page.</em></h1>
              <p className="sys-p">Whatever was here has moved, or was never here. Neither is a problem — the guide you want is almost certainly a search away.</p>
              <p className="sys-src">&ldquo;He did not find her in the first garden either. The Sundarkand is five hundred verses of looking, and it ends well.&rdquo;</p>
              <div className="sys-b">
                <button type="button" className="sb-p" onClick={() => setViewMode('results')}>Search the site</button>
                <button type="button" className="sb-g" onClick={() => (window.location.href = '/')}>Go to the homepage</button>
              </div>
            </div>
            <div className="sys-card">
              <div className="sc-h">MOST LIKELY WHAT YOU WANTED</div>
              <a href="/panchang" className="sc-i"><span>Today&apos;s Panchang</span><span>›</span></a>
              <a href="/ritual-guides" className="sc-i"><span>All Ritual Guides</span><span>›</span></a>
              <a href="/panchang/vrat-calendar" className="sc-i"><span>2026 Vrat Calendar</span><span>›</span></a>
              <a href="/beginner-guides" className="sc-i"><span>Beginner&apos;s Guides</span><span>›</span></a>
              <a href="/glossary" className="sc-i"><span>The Glossary</span><span>›</span></a>
            </div>
          </div>
        </section>
      )}

      {/* SYSTEM PAGE: 500 SERVER ERROR */}
      {viewMode === 'e500' && (
        <section className="sys e500">
          <div className="sys-in">
            <div>
              <div className="sys-badge">
                <span className="sys-num">500</span>
                <span className="sys-lab">ERROR<b>Internal server error</b></span>
              </div>
              <h1 className="sys-h">Our lamp went out.<br /><em>We are relighting it.</em></h1>
              <p className="sys-p">This one is ours, not yours. Nothing you did caused it and nothing you were doing has been lost. Give it a moment and try again.</p>
              <p className="sys-src">&ldquo;If the akhand jyoti goes out, the whole thing is wasted.&rdquo; We correct that on every Navratri guide. It applies here too — relight it and continue.</p>
              <div className="sys-b">
                <button type="button" className="sb-p" onClick={() => setViewMode('results')}>Try again</button>
                <button type="button" className="sb-g" onClick={() => (window.location.href = '/')}>Go to the homepage</button>
              </div>
            </div>
            <div className="sys-card">
              <div className="sc-h">IF YOU WERE MID-SOMETHING</div>
              <div className="sc-i"><span>Your cart is intact</span><span>✓</span></div>
              <div className="sc-i"><span>Saved rituals are safe</span><span>✓</span></div>
              <div className="sc-i"><span>Reminders still scheduled</span><span>✓</span></div>
              <div className="sc-i"><span>No payment was taken</span><span>✓</span></div>
            </div>
          </div>
        </section>
      )}

      {/* SYSTEM PAGE: OFFLINE */}
      {viewMode === 'off' && (
        <section className="sys off">
          <div className="sys-in">
            <div>
              <div className="sys-badge">
                <span className="sys-num word">OFFLINE</span>
                <span className="sys-lab">STATUS<b>No connection</b></span>
              </div>
              <h1 className="sys-h">No signal.<br /><em>The tradition managed for millennia.</em></h1>
              <p className="sys-p">You are offline, so we cannot fetch anything new. What you have already opened is still here, and the ritual card you downloaded does not need us at all.</p>
              <p className="sys-src">Every guide on this platform describes something people did for centuries without a network. Yours will hold until the signal comes back.</p>
              <div className="sys-b">
                <button type="button" className="sb-p" onClick={() => setViewMode('results')}>Try again</button>
                <button type="button" className="sb-g" onClick={() => (window.location.href = '/ritual-guides')}>Open a saved guide</button>
              </div>
            </div>
            <div className="sys-card">
              <div className="sc-h">AVAILABLE WITHOUT A CONNECTION</div>
              <a href="/ritual-guides/sharad-navratri" className="sc-i"><span>Sharad Navratri — read earlier</span><span>›</span></a>
              <a href="/ritual-guides/aja-ekadashi" className="sc-i"><span>Aja Ekadashi ritual card</span><span>↓</span></a>
              <a href="/cart" className="sc-i"><span>Your samagri checklist</span><span>›</span></a>
            </div>
          </div>
        </section>
      )}

      {/* SEARCH RESULTS SYSTEM (VIEW MODE === RESULTS OR EMPTY) */}
      {(viewMode === 'results' || viewMode === 'empty') && (
        <>
          {/* SEARCH BAR */}
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSearchSubmit={handleSearchSubmit}
            onClear={handleClear}
            totalResults={totalResults}
            activeQuery={activeQuery}
            counts={counts}
          />

          {/* FILTERS BAR */}
          <SearchFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={{
              all: totalResults,
              glossary: counts.glossary,
              guides: counts.guides,
              panchang: counts.panchang,
              concepts: counts.concepts,
              kits: counts.kits,
            }}
          />

          {/* MAIN 2-COLUMN LAYOUT */}
          <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
            <div className="tapa-search-layout">
              {/* MAIN CONTENT COLUMN */}
              <div className="tapa-search-main">
                {loading ? (
                  <SearchLoadingState />
                ) : error ? (
                  <SearchErrorState onRetry={() => executeSearch(activeQuery)} />
                ) : viewMode === 'empty' || (activeQuery.trim() !== '' && totalResults === 0) ? (
                  <SearchEmptyState
                    query={activeQuery}
                    didYouMean="ekadashi vrat katha"
                    onSelectChip={handleSelectQuery}
                  />
                ) : (
                  <>
                    {/* 1. GLOSSARY DEFINITION CARD (RANKS FIRST ABOVE ARTICLES) */}
                    {showGlossary && matchedDefinition && (
                      <GlossaryResult data={matchedDefinition} />
                    )}

                    {/* 2. RITUAL GUIDES GROUP */}
                    {showGuides && guidesResults.length > 0 && (
                      <SearchResultsGroup
                        title="RITUAL GUIDES"
                        count={guidesResults.length}
                        items={guidesResults}
                        searchQuery={activeQuery}
                      />
                    )}

                    {/* 3. PANCHANG & DATES GROUP */}
                    {showPanchang && panchangResults.length > 0 && (
                      <SearchResultsGroup
                        title="PANCHANG &amp; DATES"
                        count={panchangResults.length}
                        items={panchangResults}
                        searchQuery={activeQuery}
                      />
                    )}

                    {/* 4. DHARMIC CONCEPTS GROUP */}
                    {showConcepts && conceptsResults.length > 0 && (
                      <SearchResultsGroup
                        title="DHARMIC CONCEPTS"
                        count={conceptsResults.length}
                        items={conceptsResults}
                        searchQuery={activeQuery}
                      />
                    )}

                    {/* 5. RITUAL KITS GROUP */}
                    {showKits && kitsResults.length > 0 && (
                      <SearchResultsGroup
                        title="RITUAL KITS"
                        count={kitsResults.length}
                        items={kitsResults}
                        searchQuery={activeQuery}
                      />
                    )}
                  </>
                )}
              </div>

              {/* SIDEBAR COLUMN */}
              <SearchSidebar onSelectQuery={handleSelectQuery} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
