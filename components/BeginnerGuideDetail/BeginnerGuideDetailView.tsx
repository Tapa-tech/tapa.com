'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BeginnerGuide } from '@/lib/beginner-guides-data';

interface BeginnerGuideDetailViewProps {
  guide: BeginnerGuide;
}

export default function BeginnerGuideDetailView({ guide: initialGuide }: BeginnerGuideDetailViewProps) {
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [isSaved, setIsSaved] = useState(false);
  const [guide, setGuide] = useState<BeginnerGuide>(initialGuide);

  useEffect(() => {
    setGuide(initialGuide);
  }, [initialGuide]);

  useEffect(() => {
    async function fetchCmsData() {
      if (!initialGuide?.slug) return;
      try {
        const res = await fetch(`/api/public/beginner-guides/${initialGuide.slug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const cms = json.data;
            let parsedKandas = initialGuide.kandas;
            if (cms.kandasJson) {
              try {
                const k = typeof cms.kandasJson === 'string' ? JSON.parse(cms.kandasJson) : cms.kandasJson;
                if (Array.isArray(k) && k.length > 0) {
                  parsedKandas = k.map((item: any, idx: number) => ({
                    id: item.id || `kanda-${idx}`,
                    number: item.number || idx + 1,
                    title: item.title || item.kandaTitle || '',
                    devanagari: item.devanagari || item.sanskrit || '',
                    summary: item.summary || item.description || '',
                    badge: item.badge || undefined,
                    isNow: item.isNow || false,
                  }));
                }
              } catch (e) { }
            }
            let parsedWorries = initialGuide.worries;
            if (cms.commonWorriesJson) {
              try {
                const w = typeof cms.commonWorriesJson === 'string' ? JSON.parse(cms.commonWorriesJson) : cms.commonWorriesJson;
                if (Array.isArray(w) && w.length > 0) {
                  parsedWorries = w.map((item: any, idx: number) => ({
                    id: item.id || `worry-${idx}`,
                    question: item.question || item.title || '',
                    answer: item.answer || item.description || '',
                  }));
                }
              } catch (e) { }
            }

            setGuide((prev) => ({
              ...prev,
              title: cms.bannerTitle || cms.title || prev.title,
              subtitle: cms.bannerDescription || cms.introDescription || prev.subtitle,
              eyebrow: cms.bannerEyebrow || prev.eyebrow,
              openingText: cms.introHeading || prev.openingText,
              introParagraphs: cms.introDescription ? [cms.introDescription] : prev.introParagraphs,
              ...(parsedKandas ? { kandas: parsedKandas } : {}),
              ...(parsedWorries ? { worries: parsedWorries } : {}),
            }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch CMS beginner guide detail:', err);
      }
    }
    fetchCmsData();
  }, [initialGuide]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: guide.title,
          url: window.location.href,
        }).catch(() => { });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    }
  };

  const handleScrollTo = (id?: string) => {
    if (!id || typeof window === 'undefined') return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen" style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--body-text)' }}>

      {/* Breadcrumbs */}
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <Link href="/ritual-guides">Ritual Guides</Link> ›{' '}
            {guide.breadcrumbCategory} › <b>{guide.title}</b>
          </div>
          <div className="bc-r">
            <div className="lang">
              <button
                className={lang === 'EN' ? 'on' : ''}
                onClick={() => setLang('EN')}
              >
                EN
              </button>
              <button
                className={lang === 'HI' ? 'on' : ''}
                onClick={() => setLang('HI')}
              >
                हिं
              </button>
            </div>
            <button className="bcb" onClick={() => setIsSaved(!isSaved)}>
              {isSaved ? '🔖 Saved' : '🔖 Save'}
            </button>
            <button className="bcb" onClick={handleShare}>
              ↗ Share
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-ov"></div>
        <button className="hero-share" onClick={handleShare}>
          ↗ Share
        </button>
        <div className="hero-c">
          <div className="hero-in">
            <p className="hero-ey">{guide.eyebrow}</p>
            <div className="hero-tag">{guide.heroTag}</div>
            <h1 className="hero-h1">{guide.title}</h1>
            <p className="hero-sub">{guide.subtitle}</p>
            <div className="hero-btns">
              <button
                className="hb-p"
                onClick={() => handleScrollTo(guide.heroPrimaryCta.targetId)}
              >
                {guide.heroPrimaryCta.label}
              </button>
              <button className="hb-g" onClick={() => setIsSaved(!isSaved)}>
                {isSaved ? 'Saved' : guide.heroSecondaryCta.label}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance Bar */}
      <div className="reassure">
        <div className="re-in">
          {guide.reassuranceItems.map((item, idx) => (
            <span className="re" key={idx}>
              <span className="re-i">{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* Sticky Chips Bar */}
      <div className="chips">
        <div className="chips-in">
          <span className="chip-l">JUMP TO</span>
          {guide.chips.map((chip, idx) => (
            <a key={idx} className="chip" href={chip.href}>
              {chip.label}
            </a>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="wrap">
        <div className="layout">
          {/* Main Reading Column */}
          <div className="main">
            {/* Opening Headline & Paragraphs */}
            <p className="open">{guide.openingText}</p>
            {guide.introParagraphs.map((para, idx) => (
              <p className="p" key={idx}>
                {para}
              </p>
            ))}

            {/* Optional Art / Hero Image */}
            {guide.heroArtImage && (
              <figure className="art">
                <img src={guide.heroArtImage.src} alt={guide.heroArtImage.alt} />
              </figure>
            )}

            {/* Section 1: The Seven Kandas Sequence */}
            {guide.section1Title && (
              <>
                <div className="sh" id={guide.section1Title.anchorId}>
                  <span className="sh-p">{guide.section1Title.num}</span>
                  <h2 className="sh-t">{guide.section1Title.title}</h2>
                </div>
                {guide.section1Title.subtitle && (
                  <p className="sh-s">{guide.section1Title.subtitle}</p>
                )}

                <div className="kandas">
                  {guide.kandas.map((kanda, idx) => {
                    const isLast = idx === guide.kandas.length - 1;
                    return (
                      <div className={`kd ${kanda.isNow ? 'now' : ''}`} key={kanda.id}>
                        <div className="kd-c">
                          <div className="kd-n">{kanda.number}</div>
                          {!isLast && <div className="kd-l"></div>}
                        </div>
                        <div className="kd-b">
                          <div className="kd-t">
                            {kanda.title}{' '}
                            <span className="kd-dev">{kanda.devanagari}</span>
                            {kanda.badge && (
                              <span className="kd-badge">{kanda.badge}</span>
                            )}
                          </div>
                          <p className="kd-s">{kanda.summary}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div className="hr"></div>

            {/* Section 2: Why Sundarkand */}
            {guide.section2Title && (
              <>
                <div className="sh" id={guide.section2Title.anchorId}>
                  <span className="sh-p">{guide.section2Title.num}</span>
                  <h2 className="sh-t">{guide.section2Title.title}</h2>
                </div>
                {guide.section2Paragraphs.map((para, idx) => (
                  <p className="p" key={idx}>
                    {para}
                  </p>
                ))}
                {guide.quoteTurn && <div className="turn">{guide.quoteTurn}</div>}
              </>
            )}

            <div className="hr"></div>

            {/* Section 3: Where to Start / Ladder Paths */}
            {guide.section3Title && (
              <>
                <div className="sh" id={guide.section3Title.anchorId}>
                  <span className="sh-p">{guide.section3Title.num}</span>
                  <h2 className="sh-t">{guide.section3Title.title}</h2>
                </div>
                <div className="ladder">
                  {guide.ladderPaths.map((path) => (
                    <a
                      href={path.href || '#'}
                      className="lad"
                      key={path.id}
                    >
                      <span className={`lad-k ${path.badgeClass}`}>
                        {path.badgeText}
                      </span>
                      <span>
                        <span className="lad-t">{path.title}</span>
                        <span className="lad-s">{path.subtitle}</span>
                      </span>
                      <span className="lad-a">›</span>
                    </a>
                  ))}
                </div>
              </>
            )}

            <div className="hr"></div>

            {/* Section 4: Common Worries */}
            {guide.section4Title && (
              <>
                <div className="sh" id={guide.section4Title.anchorId}>
                  <span className="sh-p">{guide.section4Title.num}</span>
                  <h2 className="sh-t">{guide.section4Title.title}</h2>
                </div>
                {guide.worries.map((worry) => (
                  <div className="worry" key={worry.id}>
                    <div className="w-q">
                      <span>?</span>
                      {worry.question}
                    </div>
                    <div className="w-a">
                      <span>✓</span>
                      {worry.answer}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Closing Card */}
            {guide.closingParagraphs && guide.closingParagraphs.length > 0 && (
              <div className="closing">
                {guide.closingParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            )}

            <div className="hr"></div>

            {/* Revenue Row Cards */}
            {guide.revenueCards && guide.revenueCards.length > 0 && (
              <>
                <div className="rev">
                  {guide.revenueCards.map((card) => (
                    <div className={`rev-c ${card.type}`} key={card.id}>
                      <div className="rev-i">{card.icon}</div>
                      <div className="rev-l">{card.label}</div>
                      <div className="rev-t">{card.title}</div>
                      <div className="rev-s">{card.subtitle}</div>
                      {card.href ? (
                        <Link href={card.href} className="rev-b text-center block">
                          {card.buttonText}
                        </Link>
                      ) : (
                        <button className="rev-b">{card.buttonText}</button>
                      )}
                    </div>
                  ))}
                </div>
                {guide.revenueNote && (
                  <p className="rev-note">{guide.revenueNote}</p>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="side">
            {/* Kandas Sequence Card */}
            {guide.sidebar?.kandasSequence && (
              <div className="ladder-sb">
                <div className="lsb-h">{guide.sidebar.kandasSequenceTitle}</div>
                {guide.sidebar.kandasSequence.map((item, idx) => (
                  <div
                    className={`lsb-r ${item.isNow ? 'now' : ''}`}
                    key={idx}
                  >
                    <span className="lsb-n">{item.number}</span>
                    <b>{item.title}</b>
                  </div>
                ))}
              </div>
            )}

            {/* Primary CTA (e.g. WhatsApp / Prebook) */}
            {guide.sidebar?.primaryCta && (
              <button
                className={`sbcta ${guide.sidebar.primaryCta.type}`}
                onClick={() =>
                  alert('WhatsApp Support: Connecting to verified Pandits...')
                }
              >
                <span className="sb-ci">{guide.sidebar.primaryCta.icon}</span>
                <span className="sb-ct">{guide.sidebar.primaryCta.title}</span>
                <span className="sb-cs">{guide.sidebar.primaryCta.subtext}</span>
              </button>
            )}

            {/* Companion Guide Card */}
            {guide.sidebar?.companionGuide && (
              <div className="sbcomp">
                <div className="sbcomp-h">
                  <div className="sbcomp-i">
                    <span style={{ fontSize: '14px' }}>🕉</span>
                  </div>
                  <span className="sbcomp-l">
                    {guide.sidebar.companionGuide.header}
                  </span>
                  <span className="sbcomp-d">
                    {guide.sidebar.companionGuide.badge}
                  </span>
                </div>
                <p className="sbcomp-t">
                  {guide.sidebar.companionGuide.description}
                </p>
                {guide.sidebar.companionGuide.href ? (
                  <Link
                    href={guide.sidebar.companionGuide.href}
                    className="sbcomp-b text-center block"
                  >
                    {guide.sidebar.companionGuide.buttonText}
                  </Link>
                ) : (
                  <button className="sbcomp-b">
                    {guide.sidebar.companionGuide.buttonText}
                  </button>
                )}
              </div>
            )}

            {/* "Why No Sources" Card */}
            {guide.sidebar?.whyNoSources && (
              <div className="whyno">
                <div className="wn-h">
                  {guide.sidebar.whyNoSources.header}
                </div>
                {guide.sidebar.whyNoSources.paragraphs.map((p, idx) => (
                  <p
                    className="wn-t"
                    style={idx > 0 ? { marginTop: '9px' } : {}}
                    key={idx}
                  >
                    {p}
                  </p>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      {guide.stickyBar && (
        <div className="sticky">
          <button className="a">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="#fff"
              style={{ verticalAlign: '-2px', marginRight: '4px' }}
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23z" />
            </svg>
            {guide.stickyBar.subscribeText}
            <small>{guide.stickyBar.subscribePrice}</small>
          </button>
          <button className="b">
            {guide.stickyBar.prebookText}
            <small>{guide.stickyBar.prebookPrice}</small>
          </button>
        </div>
      )}
    </div>
  );
}
