'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import "./glossary.css"

interface Term {
  t: string;
  lang: string;
  d: string;
  s: string;
  ty: 'mat' | 'pra' | 'tim' | 'txt';
  def: string;
  in: string[];
  c?: string | null;
}

const TERMS: Term[] = [
  { t: 'Aarti', lang: 'HINDI', d: 'आरती', s: 'aar-tee', ty: 'pra', def: 'The closing act of a puja. A lit lamp is circled in front of the deity while a song is sung, and the flame is then offered to everyone present.', in: ['Sharad Navratri', 'Diwali for Beginners'], c: null },
  { t: 'Abhishek', lang: 'SANSKRIT', d: 'अभिषेक', s: 'a-bhi-shek', ty: 'pra', def: 'Bathing the deity — water, milk, honey or panchamrit poured over an idol or Shivalinga while mantras are recited.', in: ['Sawan Somwar Vrat'], c: 'Abhishek — why the pouring' },
  { t: 'Akhand Jyoti', lang: 'SANSKRIT', d: 'अखण्ड ज्योति', s: 'a-khand jyo-ti', ty: 'pra', def: 'A lamp kept continuously lit through an observance, most often across the nine nights of Navratri. Relight it if it goes out; nothing is void.', in: ['Sharad Navratri'], c: null },
  { t: 'Akshat', lang: 'SANSKRIT', d: 'अक्षत', s: 'ak-shat', ty: 'mat', def: 'Unbroken rice grains, usually mixed with a little turmeric or kumkum. Offered in almost every puja. The point is that the grains are whole.', in: ['Sharad Navratri', 'Diwali for Beginners', 'Ganesh Chaturthi'], c: null },
  { t: 'Bilva', lang: 'SANSKRIT', d: 'बिल्व', s: 'bil-va', ty: 'mat', def: 'The leaf offered to Shiva, in threes on one stem. Also called bel patra. Offered smooth side down by widespread practice.', in: ['Sawan Somwar Vrat'], c: 'Why is bilva dear to Mahadev?' },
  { t: 'Chaturmas', lang: 'SANSKRIT', d: 'चातुर्मास', s: 'cha-tur-maas', ty: 'tim', def: 'The four monsoon months from Devshayani to Devutthana Ekadashi. Weddings and some new undertakings are traditionally deferred through this period.', in: ['Parsva Ekadashi'], c: 'Chaturmas — the four months' },
  { t: 'Dakshina', lang: 'SANSKRIT', d: 'दक्षिणा', s: 'dak-shi-na', ty: 'pra', def: 'What is offered to a purohit after a ritual. Traditionally given according to means and not fixed as a fee.', in: ['Purohit & Puja'], c: null },
  { t: 'Ghatasthapana', lang: 'SANSKRIT', d: 'घटस्थापना', s: 'ghat-sthaa-pa-na', ty: 'pra', def: 'The installation of the kalash on the first day of Navratri, performed in the morning while Pratipada prevails and before Hindu midday.', in: ['Sharad Navratri', 'Navratri Panchang'], c: null },
  { t: 'Kalash', lang: 'SANSKRIT', d: 'कलश', s: 'ka-lash', ty: 'mat', def: 'A brass or copper pot filled with water, topped with mango leaves and a coconut. It stands for the presence invited into the space.', in: ['Sharad Navratri', 'Diwali for Beginners'], c: null },
  { t: 'Muhurat', lang: 'SANSKRIT', d: 'मुहूर्त', s: 'mu-hoor-t', ty: 'tim', def: 'A window of time considered suitable for a ritual, calculated from the panchang. A recommendation, not a deadline — a puja done later is still complete.', in: ['Navratri Panchang', 'Ganesh Chaturthi'], c: 'How to read a Panchang' },
  { t: 'Nakshatra', lang: 'SANSKRIT', d: 'नक्षत्र', s: 'nak-shat-ra', ty: 'tim', def: 'One of twenty-seven segments of the sky through which the Moon moves. One of the five limbs the panchang tracks each day.', in: ["Today's Panchang"], c: 'How to read a Panchang' },
  { t: 'Paksha', lang: 'SANSKRIT', d: 'पक्ष', s: 'pak-sha', ty: 'tim', def: 'Half a lunar month. Shukla is the waxing half, Krishna the waning half. Every festival date names one.', in: ["Today's Panchang", 'Vrat Calendar'], c: 'How to read a Panchang' },
  { t: 'Panchamrit', lang: 'SANSKRIT', d: 'पञ्चामृत', s: 'pan-chaam-rit', ty: 'mat', def: 'Five ingredients mixed for abhishek and prasad — milk, curd, ghee, honey and sugar. Made fresh, distributed after.', in: ['Sawan Somwar Vrat'], c: null },
  { t: 'Parana', lang: 'SANSKRIT', d: 'पारण', s: 'paa-ran', ty: 'pra', def: 'Breaking a fast, within a stated window on the morning after. For Ekadashi it must fall after sunrise and before Dwadashi ends.', in: ['Aja Ekadashi', 'Vrat Calendar'], c: null },
  { t: 'Sankalp', lang: 'SANSKRIT', d: 'सङ्कल्प', s: 'san-kalp', ty: 'pra', def: 'The resolve stated at the start of a vrat or puja — what you are doing, and for whom. Said aloud or silently, in any language.', in: ['Sharad Navratri', 'Sawan Somwar Vrat'], c: 'Sankalp — saying it out loud' },
  { t: 'Sutak', lang: 'SANSKRIT', d: 'सूतक', s: 'soo-tak', ty: 'tim', def: 'A period before and during an eclipse in which some activities are set aside. It applies only where the eclipse is actually visible.', in: ['August 2026 Eclipses'], c: null },
  { t: 'Tithi', lang: 'SANSKRIT', d: 'तिथि', s: 'ti-thi', ty: 'tim', def: 'The lunar day, and the thing that fixes almost every festival date. A tithi can start and end at any hour, which is why dates shift each year.', in: ["Today's Panchang", 'Vrat Calendar', 'Navratri Panchang'], c: 'How to read a Panchang' },
  { t: 'Vrat', lang: 'SANSKRIT', d: 'व्रत', s: 'vrat', ty: 'pra', def: 'A vow kept for a day. Fasting is often part of it and is rarely the whole of it — the vow is the observance, the food rule is one expression.', in: ['What is a vrat?', 'Vrat Calendar'], c: 'Vrat — what a vow is' },
];

const TYPE = {
  mat: 'MATERIAL',
  pra: 'PRACTICE',
  tim: 'TIME',
  txt: 'TEXT',
};

export default function GlossaryPage() {
  const [filter, setFilter] = useState<string>('all');
  const [lang, setLang] = useState<string>('all');
  const [query, setQuery] = useState<string>('');

  const filteredTerms = useMemo(() => {
    return TERMS.filter((x) => {
      const matchFilter = filter === 'all' || x.ty === filter;
      const matchLang = lang === 'all' || x.lang === lang;
      const q = query.toLowerCase().trim();
      const matchQuery =
        q === '' ||
        x.t.toLowerCase().includes(q) ||
        x.def.toLowerCase().includes(q) ||
        x.d.includes(q);
      return matchFilter && matchLang && matchQuery;
    });
  }, [filter, lang, query]);

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

  return (
    <div className="glossary-page min-h-screen w-full max-w-full overflow-x-hidden">




      {/* BREADCRUMB */}
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <b>Glossary</b>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="ghero">
        <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden">
          <div className="gh-in">
            <p className="gh-ey">GLOSSARY</p>
            <h1 className="gh-h1">Every word we use, explained once</h1>
            <p className="gh-p">
              Forty words or fewer per term, in plain language. If a word in any guide sends you here, this is where it is defined — and where to read more about it.
            </p>
            <div className="gh-search">
              <span style={{ color: '#8A7A68', fontSize: '17px' }}>⌕</span>
              <input
                type="text"
                placeholder="Type a word — tithi, sankalp, akshat…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="gh-go">Search</button>
            </div>
            <div className="gh-meta">
              <span className="gh-m">
                <b>142</b> terms
              </span>
              <span className="gh-m">
                <b>EN + हिं</b> both
              </span>
              <span className="gh-m">
                <b>Free</b>, like everything else
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="fbar">
        <div className="fbar-in">
          <span className="f-l">FILTER</span>
          <button
            className={`fc ${filter === 'all' ? 'on' : ''}`}
            onClick={() => setFilter('all')}
          >
            All terms
          </button>
          <button
            className={`fc ${filter === 'mat' ? 'on' : ''}`}
            onClick={() => setFilter('mat')}
          >
            Materials
          </button>
          <button
            className={`fc ${filter === 'pra' ? 'on' : ''}`}
            onClick={() => setFilter('pra')}
          >
            Practices
          </button>
          <button
            className={`fc ${filter === 'tim' ? 'on' : ''}`}
            onClick={() => setFilter('tim')}
          >
            Time &amp; calendar
          </button>
          <button
            className={`fc ${filter === 'txt' ? 'on' : ''}`}
            onClick={() => setFilter('txt')}
          >
            Texts &amp; terms
          </button>

          <span style={{ width: '1px', height: '22px', background: 'var(--border)', margin: '0 4px' }}></span>

          <button
            className={`fc ${lang === 'all' ? 'on' : ''}`}
            onClick={() => setLang('all')}
          >
            All languages
          </button>
          <button
            className={`fc ${lang === 'SANSKRIT' ? 'on' : ''}`}
            onClick={() => setLang('SANSKRIT')}
          >
            Sanskrit
          </button>
          <button
            className={`fc ${lang === 'HINDI' ? 'on' : ''}`}
            onClick={() => setLang('HINDI')}
          >
            Hindi
          </button>

          <span className="f-count">
            Showing {filteredTerms.length} of 142
          </span>
        </div>
      </div>

      {/* A-Z STRIP */}
      <div className="az">
        <div className="az-in">
          {alphabet.map((L) => {
            const hasTerms = letters.includes(L);
            return (
              <button
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
          <div className="main">
            {filteredTerms.length === 0 ? (
              <div className="en">
                <p className="en-d">
                  No term matches that. Try a shorter spelling — or tell us the word and we will write the entry.
                </p>
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
                      <div key={x.t} className="en">
                        <div className="en-top">
                          <span className="en-t">{x.t}</span>
                          <span className={`en-type ${x.ty}`}>{TYPE[x.ty]}</span>
                        </div>
                        <span className="en-dev">{x.d}</span>
                        <div className="en-meta">
                          <span className="en-say">{x.s}</span>
                          <span className="en-dot">·</span>
                          <span className="en-lang">{x.lang}</span>
                        </div>
                        <p className="en-d">{x.def}</p>
                        <div className="en-links">
                          <span className="en-lk">APPEARS IN</span>
                          {x.in.map((i) => (
                            <a key={i} className="en-a">
                              {i}
                            </a>
                          ))}
                          {x.c && (
                            <a className="en-a concept">
                              Read the concept: {x.c} ›
                            </a>
                          )}
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
              <a className="sbx-i">
                <b>Tithi</b>
                <span className="sbx-n">Time</span>
              </a>
              <a className="sbx-i">
                <b>Muhurat</b>
                <span className="sbx-n">Time</span>
              </a>
              <a className="sbx-i">
                <b>Sankalp</b>
                <span className="sbx-n">Practice</span>
              </a>
              <a className="sbx-i">
                <b>Sutak</b>
                <span className="sbx-n">Time</span>
              </a>
              <a className="sbx-i">
                <b>Parana</b>
                <span className="sbx-n">Practice</span>
              </a>
              <a className="sbx-i">
                <b>Akshat</b>
                <span className="sbx-n">Material</span>
              </a>
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

            <button className="sbcta wa">
              <span className="sb-ci">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29z" />
                </svg>
              </span>
              <span className="sb-ct">Join the Tapa Circle</span>
              <span className="sb-cs">WhatsApp reminders · ₹499 a year</span>
            </button>

            <button className="sbcta dk">
              <span className="sb-ci">↓</span>
              <span className="sb-ct">Download the glossary</span>
              <span className="sb-cs">All 142 terms, one PDF</span>
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
            <button className="miss-b">Suggest a word ›</button>
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
            <button className="rev-b">🔔 Notify me</button>
          </div>
          <div className="rev-c soon">
            <div className="rev-i">🙏</div>
            <div className="rev-l">PUROHIT &amp; PUJA</div>
            <div className="rev-t">Booking not open yet</div>
            <p className="rev-s">Purohit booking opens November 2026. We will tell you when it does.</p>
            <button className="rev-b">🔔 Notify me</button>
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
            <button className="rev-b wa">Join the Tapa Circle ›</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="tf">
        <div className="tf-brand">
          <div className="tf-lot">
            <span className="tf-line"></span>
            <span style={{ color: '#FD066D', fontSize: '18px' }}>✽</span>
            <span className="tf-line"></span>
          </div>
          <div className="tf-tag">
            Not fear. <em>Only devotion.</em>
          </div>
          <p className="tf-tagsub">
            Every ritual explained from a named source — so you know what comes from scripture, what comes from your family, and what is simply a rumour.
          </p>
          <button className="tf-cta">Read our editorial method ›</button>
        </div>
        <div className="tf-w">
          <div className="tf-map">
            <div className="tf-map-h">BROWSE BY CATEGORY</div>
            <div className="tf-grid">
              <div>
                <div className="tf-cat-t">Ritual Guides</div>
                <a className="tf-sub lead">Beginner's Guides</a>
                <a className="tf-sub">Festive Pujans</a>
                <a className="tf-sub">All-Year Pujans</a>
                <a className="tf-all">All Ritual Guides ›</a>
              </div>
              <div>
                <div className="tf-cat-t">Panchang</div>
                <a className="tf-sub">Today's Panchang</a>
                <a className="tf-sub">Vrat Calendar</a>
                <a className="tf-sub">Festival Calendar</a>
                <a className="tf-sub">Eclipses</a>
                <a className="tf-all">All Panchang ›</a>
              </div>
              <div>
                <div className="tf-cat-t">Dharmic Concepts</div>
                <a className="tf-sub">Materials</a>
                <a className="tf-sub">Meanings &amp; Practices</a>
                <a className="tf-all">All Concepts ›</a>
              </div>
              <div>
                <div className="tf-cat-t">Company</div>
                <a className="tf-sub">Why तप्</a>
                <a className="tf-sub">Our Editorial Method</a>
                <a className="tf-sub">Scripture References</a>
                <a className="tf-sub">Glossary</a>
                <a className="tf-sub">Contact</a>
              </div>
            </div>
          </div>
        </div>
        <div className="tf-w">
          <div className="tf-legal">
            <div className="tf-pol">
              <span>Terms of Use</span>
              <span>Privacy Policy</span>
              <span>Grievance Redressal</span>
              <span>Sitemap</span>
            </div>
            <div className="tf-copy">
              <div className="tf-cl-l">
                © 2026 <b>Tale Scale Networks Private Limited</b>. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
