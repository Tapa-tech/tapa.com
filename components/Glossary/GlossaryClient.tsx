'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import "../../app/glossary/glossary.css";

export interface Term {
  id?: string;
  t: string;
  lang: string;
  d: string;
  s: string;
  ty: 'mat' | 'pra' | 'tim' | 'txt';
  def: string;
  in: string[];
  c?: string | null;
  cSlug?: string | null;
}

const TYPE: Record<string, string> = {
  mat: 'MATERIAL',
  pra: 'PRACTICE',
  tim: 'TIME',
  txt: 'TEXT',
};

export interface GlossaryClientProps {
  initialTerms: any[];
}

export default function GlossaryClient({ initialTerms }: GlossaryClientProps) {
  const [filter, setFilter] = useState<string>('all');
  const [lang, setLang] = useState<string>('all');
  const [query, setQuery] = useState<string>('');

  const terms: Term[] = useMemo(() => {
    return (initialTerms || []).map((c: any) => {
      let categoryType: 'mat' | 'pra' | 'tim' | 'txt' = 'pra';
      const catLower = (c.category || '').toLowerCase();
      if (catLower.includes('material') || catLower === 'mat') categoryType = 'mat';
      else if (catLower.includes('time') || catLower.includes('calendar') || catLower === 'tim') categoryType = 'tim';
      else if (catLower.includes('text') || catLower.includes('scripture') || catLower === 'txt') categoryType = 'txt';
      else categoryType = 'pra';

      let appearsInList: string[] = [];
      if (c.appearsInJson) {
        try {
          const parsed = JSON.parse(c.appearsInJson);
          if (Array.isArray(parsed)) appearsInList = parsed;
        } catch (e) {
          appearsInList = [c.appearsInJson];
        }
      }

      return {
        id: c.id || c.slug,
        t: c.term || c.title || 'Untitled',
        lang: (c.language || 'SANSKRIT').toUpperCase(),
        d: c.devanagari || '',
        s: c.pronunciation || c.slug || '',
        ty: categoryType,
        def: c.definition || c.summary || '',
        in: appearsInList,
        c: c.relatedConceptTitle || null,
        cSlug: c.relatedConceptSlug || null,
      };
    });
  }, [initialTerms]);

  const filteredTerms = useMemo(() => {
    const q = query.toLowerCase().trim();

    return terms.filter((x) => {
      const matchFilter = filter === 'all' || x.ty === filter;
      const matchLang = lang === 'all' || x.lang.toUpperCase() === lang.toUpperCase();
      if (!matchFilter || !matchLang) return false;

      if (!q) return true;

      const termLower = x.t.toLowerCase();
      const devLower = x.d.toLowerCase();
      const pronLower = x.s.toLowerCase();
      const defLower = x.def.toLowerCase();
      const inLower = (x.in || []).join(' ').toLowerCase();

      return (
        termLower.includes(q) ||
        devLower.includes(q) ||
        pronLower.includes(q) ||
        defLower.includes(q) ||
        inLower.includes(q)
      );
    });
  }, [terms, filter, lang, query]);

  const letters = useMemo(() => {
    return Array.from(new Set(filteredTerms.map((x) => x.t[0].toUpperCase()))).sort();
  }, [filteredTerms]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const jumpToLetter = (L: string) => {
    const el = document.getElementById(`L${L}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const languagesList = useMemo(() => {
    const set = new Set(terms.map((t) => t.lang));
    return Array.from(set).join(' + ');
  }, [terms]);

  const mostLookedUp = useMemo(() => {
    return terms.slice(0, 6).map((t) => ({
      name: t.t,
      category: TYPE[t.ty] ? TYPE[t.ty].charAt(0) + TYPE[t.ty].slice(1).toLowerCase() : 'Concept',
    }));
  }, [terms]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.querySelector('.fbar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="glossary-page min-h-screen w-full max-w-full overflow-x-hidden">
      {/* BREADCRUMB */}
      <Breadcrumb items={[{ label: 'Glossary' }]} />

      {/* HERO */}
      <section className="ghero">
        <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden">
          <div className="gh-in">
            <p className="gh-ey">GLOSSARY</p>
            <h1 className="gh-h1">Every word we use, explained once</h1>
            <p className="gh-p">
              Forty words or fewer per term, in plain language. If a word in any guide sends you here, this is where it is defined — and where to read more about it.
            </p>
            <form onSubmit={handleSearchSubmit} className="gh-search">
              <span style={{ color: '#8A7A68', fontSize: '17px' }}>⌕</span>
              <input
                type="text"
                placeholder="Type a word — tithi, sankalp, akshat…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query ? (
                <button
                  className="gh-go"
                  type="button"
                  onClick={() => setQuery('')}
                  style={{ background: '#7A6A55' }}
                >
                  Clear
                </button>
              ) : (
                <button className="gh-go" type="submit">
                  Search
                </button>
              )}
            </form>
            <div className="gh-meta">
              <span className="gh-m">
                <b>{terms.length}</b> terms
              </span>
              <span className="gh-m">
                <b>{languagesList || 'EN + हिं'}</b>
              </span>
              <span className="gh-m">
                <b>Free</b>, like everything else
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="fbar overflow-x-auto no-scrollbar w-full max-w-full">
        <div className="fbar-in flex flex-wrap items-center gap-2">
          <span className="f-l">FILTER</span>
          <button
            type="button"
            className={`fc ${filter === 'all' ? 'on' : ''}`}
            onClick={() => setFilter('all')}
          >
            All terms
          </button>
          <button
            type="button"
            className={`fc ${filter === 'mat' ? 'on' : ''}`}
            onClick={() => setFilter('mat')}
          >
            Materials
          </button>
          <button
            type="button"
            className={`fc ${filter === 'pra' ? 'on' : ''}`}
            onClick={() => setFilter('pra')}
          >
            Practices
          </button>
          <button
            type="button"
            className={`fc ${filter === 'tim' ? 'on' : ''}`}
            onClick={() => setFilter('tim')}
          >
            Time &amp; calendar
          </button>
          <button
            type="button"
            className={`fc ${filter === 'txt' ? 'on' : ''}`}
            onClick={() => setFilter('txt')}
          >
            Texts &amp; terms
          </button>

          <span style={{ width: '1px', height: '22px', background: 'var(--border)', margin: '0 4px' }}></span>

          <button
            type="button"
            className={`fc ${lang === 'all' ? 'on' : ''}`}
            onClick={() => setLang('all')}
          >
            All languages
          </button>
          <button
            type="button"
            className={`fc ${lang === 'SANSKRIT' ? 'on' : ''}`}
            onClick={() => setLang('SANSKRIT')}
          >
            Sanskrit
          </button>
          <button
            type="button"
            className={`fc ${lang === 'HINDI' ? 'on' : ''}`}
            onClick={() => setLang('HINDI')}
          >
            Hindi
          </button>

          <span className="f-count">
            Showing {filteredTerms.length} of {terms.length}
          </span>
        </div>
      </div>

      {/* A-Z STRIP */}
      <div className="az overflow-x-auto no-scrollbar w-full max-w-full">
        <div className="az-in flex flex-nowrap md:flex-wrap gap-1 min-w-max md:min-w-0">
          {alphabet.map((L) => {
            const hasTerms = letters.includes(L);
            return (
              <button
                type="button"
                key={L}
                className={`azl ${hasTerms ? '' : 'off'}`}
                onClick={() => hasTerms && jumpToLetter(L)}
                disabled={!hasTerms}
              >
                {L}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden">
        <div className="layout flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="main flex-1">
            {filteredTerms.length === 0 ? (
              <div className="en" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <p className="en-d" style={{ marginBottom: '16px' }}>
                  No term matches {query ? `"${query}"` : 'your filters'}. Try searching for a different word or clear your filters.
                </p>
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              letters.map((L) => {
                const groupTerms = filteredTerms.filter(
                  (x) => x.t[0].toUpperCase() === L
                );
                return (
                  <div key={L} className="lg" id={`L${L}`}>
                    <div className="lg-h">
                      <span className="lg-l">{L}</span>
                      <span className="lg-r"></span>
                    </div>
                    {groupTerms.map((x) => (
                      <div key={x.id || x.t} className="en">
                        <div className="en-top">
                          <span className="en-t">{x.t}</span>
                          <span className={`en-type ${x.ty}`}>{TYPE[x.ty] || 'PRACTICE'}</span>
                        </div>
                        {x.d && <span className="en-dev">{x.d}</span>}
                        <div className="en-meta">
                          <span className="en-say">{x.s}</span>
                          <span className="en-dot">·</span>
                          <span className="en-lang">{x.lang}</span>
                        </div>
                        <p className="en-d">{x.def}</p>
                        <div className="en-links">
                          {x.in && x.in.length > 0 && <span className="en-lk">APPEARS IN</span>}
                          {x.in && x.in.map((i) => (
                            <a key={i} className="en-a">
                              {i}
                            </a>
                          ))}
                          {x.cSlug ? (
                            <Link href={`/dharmic-concepts/${x.cSlug}`} className="en-a concept">
                              Read the concept: {x.c} ›
                            </Link>
                          ) : x.c ? (
                            <span className="en-a concept">
                              Read the concept: {x.c} ›
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="side">
            <div className="sbx">
              <div className="sbx-h">Most looked up</div>
              {mostLookedUp.map((item) => (
                <a
                  key={item.name}
                  className="sbx-i"
                  onClick={() => {
                    setQuery(item.name);
                    const el = document.querySelector('.fbar');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <b>{item.name}</b>
                  <span className="sbx-n">{item.category}</span>
                </a>
              ))}
            </div>

            <div className="sbrule">
              <div className="sbr-h">HOW THIS DIFFERS FROM CONCEPTS</div>
              <p className="sbr-t">
                The glossary <b>defines and points</b> — one paragraph, then a link. <b>Dharmic Concepts explain</b> — the story, the source and the practice behind a word.
              </p>
              <p className="sbr-t" style={{ marginTop: '8px' }}>
                Where a concept article exists, the entry links to it.
              </p>
            </div>

            <button type="button" className="sbcta wa">
              <span className="sb-ci">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29z" />
                </svg>
              </span>
              <span className="sb-ct">Join the Tapa Circle</span>
              <span className="sb-cs">WhatsApp reminders · ₹499 a year</span>
            </button>

            <button type="button" className="sbcta dk">
              <span className="sb-ci">↓</span>
              <span className="sb-ct">Download the glossary</span>
              <span className="sb-cs">All {terms.length} terms, one PDF</span>
            </button>
          </aside>
        </div>

        {/* MISSING TERM */}
        <div className="miss">
          <div>
            <div className="miss-t">Looked for a word and did not find it?</div>
            <p className="miss-p">
              Tell us the word and where you saw it. Terms people actually search for get written first — that is how this list grows.
            </p>
            <button type="button" className="miss-b">Suggest a word ›</button>
          </div>
          <div className="miss-box">
            <div className="miss-r">
              <span>1</span>
              <span>Tell us the word, spelled however you heard it.</span>
            </div>
            <div className="miss-r">
              <span>2</span>
              <span>Tell us where you came across it, if you remember.</span>
            </div>
            <div className="miss-r">
              <span>3</span>
              <span>We write the entry and link it from every guide that uses it.</span>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="how">
          <div className="how-l">HOW THE GLOSSARY WORKS</div>
          <div className="how-t">One entry per word, referenced everywhere it appears.</div>
          <p>
            A term is defined here once. Every guide that uses it links to this entry rather than repeating a definition — so when a definition improves, it improves <b>everywhere at once</b>.
          </p>
          <p>
            Entries carry <b>no classification tag and no confidence score</b>. A definition is not a ritual-authority claim. Where a word carries real weight — bilva, sankalp, tapasya — the entry points at the Dharmic Concept that does the sourcing.
          </p>
        </div>

        {/* REVENUE */}
        <div className="rev">
          <div className="rev-c soon">
            <div className="rev-i">🪔</div>
            <div className="rev-l">RITUAL KIT</div>
            <div className="rev-t">Nothing to buy here</div>
            <p className="rev-s">This is a reference page. Kits sit with the ritual guides, and open in October 2026.</p>
            <button type="button" className="rev-b">🔔 Notify me</button>
          </div>
          <div className="rev-c soon">
            <div className="rev-i">🙏</div>
            <div className="rev-l">PUROHIT &amp; PUJA</div>
            <div className="rev-t">Booking not open yet</div>
            <p className="rev-s">Purohit booking opens November 2026. We will tell you when it does.</p>
            <button type="button" className="rev-b">🔔 Notify me</button>
          </div>
          <div className="rev-c live">
            <div className="rev-i" style={{ background: '#E9F7EE', borderColor: '#C6E6D2' }}>
              🪔
            </div>
            <div className="rev-l">THE TAPA CIRCLE</div>
            <div className="rev-t">A word a week, if you like</div>
            <p className="rev-s">
              Festival reminders on WhatsApp, with the guide attached — and one glossary term each week. ₹499 a year.
            </p>
            <button type="button" className="rev-b wa">Join the Tapa Circle ›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
