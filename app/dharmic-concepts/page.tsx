'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Concept {
  title?: string;
  slug?: string;
  category?: string;
  body?: any;
  status?: string;
}

export default function DharmicConceptsPage() {
  const router = useRouter();
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadConcepts() {
      try {
        const res = await fetch('/api/public/dharmic-concepts');
        if (res.ok) {
          const data = await res.json();
          setConcepts(Array.isArray(data) ? data : []);
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

  const slugify = (value?: string) => {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const getSlug = (item: Concept) => item.slug || slugify(item.title);

  const getTextFromTiptap = (value: any) => {
    if (!value) return '';
    if (typeof value === 'string') {
      return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }
    const output: string[] = [];
    function walk(node: any) {
      if (!node) return;
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (typeof node === 'object') {
        if (typeof node.text === 'string') output.push(node.text);
        if (node.content) walk(node.content);
      }
    }
    walk(value);
    return output.join(' ').replace(/\s+/g, ' ').trim();
  };

  const featured = concepts.length ? concepts[0] : null;
  const categories = ['Materials', 'Meanings & Practices', 'Daily Puja'];

  return (
    <div className="concepts-page min-h-screen w-full max-w-full overflow-x-hidden">
      {/* NAV */}
      <header className="site-nav">
        <div className="site-nav-brand">THE TAPA CO.</div>
        <nav className="site-nav-links">

          <Link href="/">Home</Link>
          <Link href="/dharmic-concepts">Dharmic Concepts</Link>
        </nav>
      </header>

      {/* BREADCRUMB */}
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <b>Dharmic Concepts</b>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-ov"></div>
        <div className="hero-c">
          <div className="hero-in">
            <p className="hero-ey">THE TAPA CO. · DIRECTORY</p>
            <div className="hero-tag">◆ DHARMIC CONCEPTS · MEANINGS &amp; MATERIALS</div>
            <h1 className="hero-h1">The object in your hand has a story</h1>
            <p className="hero-sub">
              Why bilva and not tulsi. Why three stories and not one. These sit behind every pujan guide —
              when a samagri list says "bilva leaves", this is where the reason lives.
            </p>
            <div className="hero-btns">
              {featured && (
                <button
                  className="hb-p featured-btn"
                  onClick={() => router.push(`/dharmic-concepts/${getSlug(featured)}`)}
                >
                  Featured Concept: {featured.title || ''} ›
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="wrap" style={{ paddingBottom: '60px' }}>
        <div className="layout">
          <div className="main">
            {loading ? (
              <div className="loader"></div>
            ) : concepts.length === 0 ? (
              <div className="empty-state">No concepts published yet.</div>
            ) : (
              categories.map((cat) => {
                const catConcepts = concepts.filter(
                  (c) => String(c.category || '').toLowerCase() === cat.toLowerCase()
                );
                if (!catConcepts.length) return null;
                const isDaily = cat === 'Daily Puja';
                const description =
                  cat === 'Materials'
                    ? 'The things you hold, offer and light. Each one has a story, a source and a set of offering rules.'
                    : cat === 'Meanings & Practices'
                      ? 'What you do, and what it means. Sankalpa, abhishek, avahana — the acts every pujan assumes you already understand.'
                      : 'The practice that is not attached to a festival. Room setup, the diya, the aarti, and what a daily puja actually asks of you.';

                return (
                  <div key={cat} style={{ marginTop: '30px' }}>
                    <div className="sec-head">
                      <span className="sec-plus">+</span>
                      <div>
                        <span className="sec-title">{cat}</span>
                        <span className="sec-guide">{description}</span>
                      </div>
                    </div>

                    {isDaily ? (
                      <div className="daily-list">
                        {catConcepts.map((c) => {
                          const slug = getSlug(c);
                          const text = getTextFromTiptap(c.body).substring(0, 120);
                          return (
                            <div key={slug} className="daily-row">
                              <div>
                                <b className="daily-row-title">{c.title || ''}</b>
                                <span className="daily-row-desc">{text}{text ? '...' : ''}</span>
                              </div>
                              <span
                                className="daily-read"
                                onClick={() => router.push(`/dharmic-concepts/${slug}`)}
                              >
                                READ ›
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="section-grid">
                        {catConcepts.map((c) => {
                          const slug = getSlug(c);
                          const isLive = c.status === 'PUBLISHED';
                          const summary = getTextFromTiptap(c.body).substring(0, 160) + '...';
                          return (
                            <div
                              key={slug}
                              className={`c ${isLive ? 'cursor-pointer' : 'soon'}`}
                              onClick={() => {
                                if (isLive) {
                                  router.push(`/dharmic-concepts/${slug}`);
                                } else {
                                  showToast(`"${c.title || 'This concept'}" is launching soon!`);
                                }
                              }}
                              style={{
                                background: 'var(--card)',
                                border: '1px solid var(--border)',
                                borderRadius: '14px',
                                padding: '16px 18px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                                textAlign: 'left',
                              }}
                            >
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--gold)', letterSpacing: '.6px' }}>
                                    {String(c.category || '').toUpperCase()}
                                  </span>
                                  <span
                                    className={`pill ${isLive ? 'd' : 'p'}`}
                                    style={{
                                      fontSize: '9px',
                                      fontWeight: 700,
                                      padding: '3px 8px',
                                      borderRadius: '5px',
                                      background: isLive ? 'var(--d-bg)' : 'var(--p-bg)',
                                      color: isLive ? 'var(--d-tx)' : 'var(--p-tx)',
                                    }}
                                  >
                                    {isLive ? 'LIVE' : 'SOON'}
                                  </span>
                                </div>
                                <h3 style={{ fontSize: '16.5px', fontWeight: 700, color: 'var(--dark)', margin: '8px 0 6px' }}>
                                  {c.title}
                                </h3>
                                <p style={{ fontSize: '12.5px', color: 'var(--sub-text)', lineHeight: 1.6, marginBottom: '15px' }}>
                                  {summary}
                                </p>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid var(--border-light)', paddingTop: '8px' }}>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <span
                                    className="pill d"
                                    style={{
                                      fontSize: '9px',
                                      padding: '3px 8px',
                                      borderRadius: '5px',
                                      background: 'var(--d-bg)',
                                      color: 'var(--d-tx)',
                                    }}
                                  >
                                    DHARMA · 4/5
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="hr"></div>
                  </div>
                );
              })
            )}
          </div>

          {/* SIDEBAR */}
          <div className="side">
            <div className="sbcomp">
              <div className="sbcomp-h">
                <span className="sbcomp-l">OUR METHOD</span>
              </div>
              <p className="sbcomp-t" style={{ fontSize: '12px' }}>
                We resolve the line between <b>Dharma</b> (what the scriptures ask) and <b>Pratha</b> (what family custom dictates), giving you the freedom to choose your devotion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && <div className="toast">{toastMessage}</div>}

      <footer
        style={{
          background: 'var(--darkbar)',
          color: '#fff',
          padding: '28px 40px',
          textAlign: 'center',
          fontSize: '12px',
        }}
      >
        © THE TAPA CO. · Dharmic Concepts
      </footer>
    </div>
  );
}
