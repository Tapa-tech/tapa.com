'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { getBeginnerGuideBySlug } from '@/lib/beginner-guides-data';
import BeginnerGuideDetailView from '@/components/BeginnerGuideDetail/BeginnerGuideDetailView';
import RitualCardModal from '@/components/RitualCard/RitualCardModal';
import './ritual-guide.css';

interface PageProps {
  params: {
    slug: string;
  };
}

const BEGINNER_SLUGS = new Set([
  'seven-kandas',
  'first-puja',
  'diwali-beginners',
  'what-is-vrat',
  'what-is-a-vrat',
  'beginner-guide',
  'beginner-s-guide',
  'beginners-guides',
  'ramcharitmanas-seven-kandas-explained',
]);

export default function RitualGuideDetailPage({ params }: PageProps) {
  const { slug } = params;

  const [isBeginnerGuide, setIsBeginnerGuide] = useState<boolean>(() => {
    return (
      BEGINNER_SLUGS.has(slug) ||
      slug.includes('beginner') ||
      slug.includes('kanda') ||
      slug.includes('ramcharitmanas')
    );
  });

  useEffect(() => {
    async function checkBeginnerGuide() {
      if (isBeginnerGuide) return;
      try {
        const res = await fetch(`/api/public/beginner-guides/${slug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setIsBeginnerGuide(true);
          }
        }
      } catch (err) { }
    }
    if (slug) {
      checkBeginnerGuide();
    }
  }, [slug, isBeginnerGuide]);

  if (isBeginnerGuide) {
    const guide = getBeginnerGuideBySlug(slug);
    return <BeginnerGuideDetailView guide={guide} />;
  }

  // Dynamic title formatting from slug
  const formattedTitle = slug
    ? slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    : 'Sharad Navratri';

  // Interactive States
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [japaCount, setJapaCount] = useState(0);
  const [activeMantraAudio, setActiveMantraAudio] = useState<number | null>(null);
  const [checkedSamagri, setCheckedSamagri] = useState<{ [key: number]: boolean }>({});
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Dynamic Ritual Guide Data for Banner and future sections
  const [guideData, setGuideData] = useState<any>(null);

  useEffect(() => {
    async function fetchGuideData() {
      try {
        const res = await fetch(`/api/public/ritual-guides/${slug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setGuideData(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch ritual guide data:', err);
      }
    }
    if (slug) {
      fetchGuideData();
    }
  }, [slug]);

  // Scroll listener for sticky bottom bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSamagri = (index: number) => {
    setCheckedSamagri((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({ title: formattedTitle, url: window.location.href }).catch(() => { });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    }
  };

  // Count checked samagri items for sidebar counter
  const checkedCount = Object.values(checkedSamagri).filter(Boolean).length;

  return (
    <div className="rg-detail-root w-full max-w-full overflow-x-hidden min-h-screen">
      {/* Breadcrumb */}
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <Link href="/ritual-guides">Ritual Guides</Link> › Festive Pujans ›{' '}
            <b>{formattedTitle}</b>
          </div>
          <div className="bc-r">
            <div className="lang">
              <button className={lang === 'EN' ? 'on' : ''} onClick={() => setLang('EN')}>
                EN
              </button>
              <button className={lang === 'HI' ? 'on' : ''} onClick={() => setLang('HI')}>
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
            <p className="hero-ey">
              {guideData?.sectionLabel || 'RITUAL GUIDES · FESTIVE PUJANS'}
            </p>
            <div className="hero-tag">
              ◆ {(guideData?.category || 'DHARMA').toUpperCase()} · {guideData?.rating || '4/5'} · {(guideData?.classification || 'PURANIC').toUpperCase()}
            </div>
            <h1 className="hero-h1">
              {guideData?.guideTitle || guideData?.title || `${formattedTitle}: The Complete 9-Day Guide`}
            </h1>
            <p className="hero-sub">
              {guideData?.guideSubtitle || 'Ghatasthapana to Maha Navami — nine forms, nine nights, one Mother.'}
            </p>
            <p className="hero-date">
              {guideData?.festivalName ? `${guideData.festivalName} · ${guideData.panchangLocation || 'Delhi-NCR'}` : '11–19 October 2026 · Ashwin Shukla Paksha · Delhi-NCR'}
            </p>
            <div className="hero-btns">
              <a href={guideData?.primaryButtonTarget || '#vidhi'} className="hb-p">
                {guideData?.primaryButtonText || 'Start with Ghatasthapana'}
              </a>
              <button
                className="hb-g"
                onClick={() => {
                  if (guideData?.secondaryButtonTarget && guideData.secondaryButtonTarget.startsWith('http')) {
                    window.open(guideData.secondaryButtonTarget, '_blank');
                  } else {
                    setIsCardModalOpen(true);
                  }
                }}
              >
                {guideData?.secondaryButtonText || 'Download Ritual Card'}
              </button>
              <button
                className="hb-g"
                onClick={() => {
                  if (guideData?.thirdButtonTarget) {
                    if (guideData.thirdButtonTarget.startsWith('http')) {
                      window.open(guideData.thirdButtonTarget, '_blank');
                    } else if (guideData.thirdButtonTarget.startsWith('#')) {
                      const el = document.querySelector(guideData.thirdButtonTarget);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = guideData.thirdButtonTarget;
                    }
                  }
                }}
              >
                {guideData?.thirdButtonText || 'Pre-book the kit'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Audio Strip */}
      <div className="strip">
        <div className="strip-in">
          <div className="tp">
            <span className="tpi">
              <span className="tpd" style={{ background: '#27500A' }}></span>Scripturally sourced
            </span>
            <span className="tpi">
              <span className="tpd" style={{ background: '#E8A020' }}></span>Region aware
            </span>
            <span className="tpi">
              <span className="tpd" style={{ background: '#EF0F54' }}></span>Fear-free
            </span>
          </div>
        </div>
      </div>

      {/* Jump-to Chips Bar */}
      <div className="chips">
        <div className="chips-in">
          <span className="chip-l">JUMP TO</span>
          <a className="chip" href="#story">
            📖 The story
          </a>
          <a className="chip" href="#sankalp">
            ✋ Sankalpa
          </a>
          <a className="chip" href="#vidhi">
            🪔 Ghatasthapana
          </a>
          <a className="chip" href="#katha">
            📿 Vrat Katha
          </a>
          <a className="chip" href="#samagri">
            🧺 Samagri
          </a>
          <a className="chip" href="#fast">
            🍎 Fasting
          </a>
          <a className="chip" href="#myths">
            ✕ Myths
          </a>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="wrap">
        <div className="layout">
          {/* Main Column */}
          <div className="main">
            {/* Credibility Card */}
            <div className="cc">
              <div className="cc-h">
                <span className="cc-hl">{guideData?.sotSectionHeading || 'SOURCE OF TRUTH'}</span>
                <Link href={guideData?.sotButtonTarget || '/editorial-method'} className="cc-hr">
                  {guideData?.sotButtonText ? (guideData.sotButtonText.includes('›') ? guideData.sotButtonText : `${guideData.sotButtonText} ›`) : 'Read source ›'}
                </Link>
              </div>
              <div className="cc-b">
                <div className="cc-core">{guideData?.sotPracticeLabel || 'CORE PRACTICE'}</div>
                <div className="cc-claim">{guideData?.sotPracticeTitle || 'Worship of Durga across the nine nights of Ashwin Shukla Paksha'}</div>
                <div className="cc-row">
                  <span className="pill d">
                    {(guideData?.sotPracticeCategory || guideData?.category || 'DHARMA').toUpperCase()} · {guideData?.sotPracticeRating || guideData?.rating || '4/5'}
                  </span>
                  <span className="badge puranic">
                    {(guideData?.sotPracticeClassification || guideData?.classification || 'PURANIC').toUpperCase()}
                  </span>
                  <span className="pill src">
                    {guideData?.sotScripturalSource
                      ? guideData?.sotParentScripture
                        ? `${guideData.sotScripturalSource} · ${guideData.sotParentScripture}`
                        : guideData.sotScripturalSource
                      : 'Devi Mahatmya · Markandeya Purana'}
                  </span>
                </div>
              </div>
              <p className="cc-comp">
                This guide: <b>{guideData?.sotCorePracticesCount ?? 1} core practice</b> · <b>{guideData?.sotScripturalElementsCount ?? 4} scriptural elements</b> · <b>{guideData?.sotRegionalCustomsCount ?? 4} regional customs</b> ·{' '}
                <b>{guideData?.sotCorrectionsCount ?? 3} corrections</b>
              </p>
            </div>

            {/* Panchang Card */}
            <div className="pan">
              <div className="pan-h">
                <span className="pan-hl">
                  📅 {guideData?.festivalName ? (guideData.festivalName.includes('2026') ? guideData.festivalName.toUpperCase() : `${guideData.festivalName.toUpperCase()} 2026`) : 'NAVRATRI 2026'}
                </span>
                <span className="pan-hr">
                  {guideData?.panchangLocation || 'Delhi-NCR'} · {guideData?.panchangSource || 'Drik Panchang'}
                </span>
              </div>
              <div className="pan-g">
                {(() => {
                  let cards = [
                    { k: 'THE NINE NIGHTS', v: '11–19 Oct', s: 'Ashwin Shukla Paksha' },
                    { k: 'GHATASTHAPANA', v: 'Sun 11 Oct', s: '6:19–10:12 AM · Abhijit 11:44–12:31 PM' },
                    { k: 'ASHTAMI / NAVAMI', v: '19 Oct', s: 'Tithis merge this year' },
                    { k: 'VIJAYADASHAMI', v: 'Tue 20 Oct', s: 'The tenth day' },
                  ];
                  if (guideData?.panchangCardsJson) {
                    try {
                      const parsed = typeof guideData.panchangCardsJson === 'string' ? JSON.parse(guideData.panchangCardsJson) : guideData.panchangCardsJson;
                      if (Array.isArray(parsed) && parsed.length > 0) {
                        cards = parsed.map((c: any) => ({
                          k: c.k || c.key || c.title || '',
                          v: c.v || c.value || c.date || '',
                          s: c.s || c.sub || c.subtitle || '',
                        }));
                      }
                    } catch (e) { }
                  }
                  return cards.map((card, idx) => (
                    <div className="pc" key={idx}>
                      <div className="pc-k">{card.k}</div>
                      <div className="pc-v">{card.v}</div>
                      <div className="pc-s">{card.s}</div>
                    </div>
                  ));
                })()}
              </div>
              <p className="pan-n">
                {guideData?.panchangNote ? (
                  <span dangerouslySetInnerHTML={{ __html: guideData.panchangNote }} />
                ) : (
                  <>
                    <b>Two things to check against your own panchang.</b> Saptami covers both 17 and 18 October this year,
                    so the observance stretches across ten civil days. And panchangs differ on whether Durga Ashtami falls
                    on the 18th or the 19th — follow your family or community panchang.
                  </>
                )}
              </p>
            </div>

            {/* Story / Opening Prose */}
            <p className="open">{guideData?.storyTitle || 'Nine nights, one Mother.'}</p>
            <p className="p">
              {guideData?.storyIntroduction ||
                'Navratri means nine nights. It is not nine separate festivals — it is one continuous arc of worship, moving from darkness through fire to light.'}
            </p>

            <div className="sh" id="story">
              <span className="sh-p">+</span>
              <span className="sh-t">{guideData?.storySubsectionTitle || 'The story the nine nights re-enact'}</span>
            </div>
            <p className="p">
              {guideData?.storyContent ||
                'The Devi Mahatmya tells it plainly. The gods were losing. Mahishasura had taken heaven and no god could defeat him. The collective energy of all the gods converged into one form: Durga. She fought for nine nights, and on the tenth day she won.'}
            </p>
            <div className="tagrow">
              <span className="pill d">
                {(guideData?.storyPracticeCategory || guideData?.category || 'DHARMA').toUpperCase()} · {guideData?.storyPracticeRating || guideData?.rating || '4/5'}
              </span>
              <span className="badge puranic">
                {(guideData?.storyPracticeClassification || guideData?.classification || 'PURANIC').toUpperCase()}
              </span>
              <span className="pill src">
                {guideData?.storyScripturalSource || 'Devi Mahatmya, Markandeya Purana'}
              </span>
            </div>
            <p className="p">
              {guideData?.storyContinuation ||
                'Every year the tradition re-enacts that arc, not as mythology but as practice. You set up a kalash. You light a flame and keep it lit. You worship a different form of the Mother each day. And on the tenth day you mark the outcome.'}
            </p>

            {/* Image Banner */}
            <figure className="art">
              <img
                src={guideData?.storyImage || 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80'}
                alt={guideData?.storyImageAltText || `${formattedTitle} Durga Pujan`}
                style={{ maxHeight: '380px', objectFit: 'cover' }}
              />
            </figure>

            {/* Vidhi Days & Steps — Purely Dynamic from Admin Panel */}
            {(() => {
              if (!guideData?.vidhiDaysJson) return null;
              let vidhiDays: any[] = [];
              try {
                vidhiDays = typeof guideData.vidhiDaysJson === 'string'
                  ? JSON.parse(guideData.vidhiDaysJson)
                  : guideData.vidhiDaysJson;
              } catch (e) {
                console.error('Error parsing vidhiDaysJson:', e);
              }

              if (!Array.isArray(vidhiDays) || vidhiDays.length === 0) return null;

              return vidhiDays.map((day: any, dIdx: number) => {
                const dayNum = day.dayNumber || dIdx + 1;
                const steps = Array.isArray(day.steps) ? day.steps : [];
                return (
                  <div key={day.id || dIdx}>
                    <div className="sh" id={dIdx === 0 ? "vidhi" : `vidhi-day-${dayNum}`}>
                      <span className="sh-p">+</span>
                      <span className="sh-t">Day {dayNum} — {day.dayTitle}</span>
                    </div>
                    {day.dayDescription && <p className="sh-s">{day.dayDescription}</p>}

                    {day.muhuratInformation && (
                      <div className="muh">
                        <b>{day.muhuratLabel ? (day.muhuratLabel.endsWith('.') ? day.muhuratLabel : `${day.muhuratLabel}.`) : 'Muhurat.'}</b>{' '}
                        {day.muhuratInformation}
                      </div>
                    )}

                    {steps.map((st: any, sIdx: number) => {
                      const isLast = sIdx === steps.length - 1;
                      const stepNum = st.stepNumber || sIdx + 1;
                      const labels = Array.isArray(st.stepLabels) ? st.stepLabels : [];
                      return (
                        <div className="step" key={st.id || sIdx}>
                          <div className="st-c">
                            <div className={`st-n ${isLast ? 'end' : ''}`}>{stepNum}</div>
                            {!isLast && <div className="st-l"></div>}
                          </div>
                          <div className="st-b">
                            <p>{st.stepDescription}</p>
                            {labels.length > 0 && (
                              <div className="tagrow" style={{ margin: '8px 0 0' }}>
                                {labels.map((lbl: string, lIdx: number) => (
                                  <span
                                    key={lIdx}
                                    className={
                                      lbl.includes('SHASTRA') || lbl.includes('PURANIC')
                                        ? 'badge shastra'
                                        : lbl.includes('DHARMA')
                                          ? 'pill d'
                                          : 'pill p'
                                    }
                                  >
                                    {lbl}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              });
            })()}

            {/* Mantra Box — Purely Dynamic from Admin Panel */}
            {(() => {
              let parsedDay: any = null;
              if (guideData?.vidhiDaysJson) {
                try {
                  const parsed = typeof guideData.vidhiDaysJson === 'string' ? JSON.parse(guideData.vidhiDaysJson) : guideData.vidhiDaysJson;
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    parsedDay = parsed[0];
                  }
                } catch (e) { }
              }

              const mantraLabel = guideData?.mantraLabel || parsedDay?.mantraLabel || 'DAY ONE MANTRA';
              const mantraText = guideData?.mantraText || parsedDay?.mantraText || 'ओं ह्रीं शैलपुत्र्यै नमः';
              const mantraTransliteration = guideData?.mantraTransliteration || parsedDay?.mantraTransliteration || 'Om Hreem Shailputryai Namah';

              return (
                <div className="mantra">
                  <div className="mn-top" style={{ display: 'block' }}>
                    <div className="mn-l">{mantraLabel}</div>
                  </div>
                  <div className="mn-d">{mantraText}</div>
                  <div className="mn-r">{mantraTransliteration}</div>
                  <div className="japa">
                    <div>
                      <div className="jp-l">JAPA COUNT</div>
                      <div className="jp-t" style={{ textAlign: 'left', marginTop: '4px' }}>Tap as you complete each round</div>
                    </div>
                    <div className="jp-ctr">
                      <button className="jp-b" onClick={() => setJapaCount(Math.max(0, (japaCount || 27) - 1))}>−</button>
                      <div>
                        <div className="jp-n">{japaCount || 27}</div>
                        <div className="jp-t">of 108</div>
                      </div>
                      <button className="jp-b" onClick={() => setJapaCount((japaCount || 27) + 1)}>+</button>
                    </div>
                    <div className="jp-presets">
                      <button className={`jp-p ${(japaCount || 27) === 11 ? 'on' : ''}`} onClick={() => setJapaCount(11)}>11</button>
                      <button className={`jp-p ${(japaCount || 27) === 21 ? 'on' : ''}`} onClick={() => setJapaCount(21)}>21</button>
                      <button className={`jp-p ${(japaCount || 27) === 51 ? 'on' : ''}`} onClick={() => setJapaCount(51)}>51</button>
                      <button className={`jp-p ${(japaCount || 27) === 108 ? 'on' : ''}`} onClick={() => setJapaCount(108)}>108</button>
                    </div>
                  </div>
                </div>
              );
            })()}

            <p className="p">Sowing barley on the first day is a widespread North Indian practice rather than a scriptural requirement. Where it is kept, the sprouts are watched through the nine days and distributed as prasad at the end.</p>
            <div className="tagrow"><span className="pill p">PRATHA</span></div>

            {/* Sankalpa Section — Dynamic from Admin Panel */}
            <div className="sh" id="sankalp">
              <span className="sh-p">+</span>
              <span className="sh-t">{guideData?.sankalpaTitle || 'The sankalpa'}</span>
            </div>
            <p className="sh-s">{guideData?.sankalpaSubtitle || 'Said once, at the start, before anything else is done.'}</p>

            <div className="sank">
              <div className="sank-h">
                {guideData?.sankalpaInstruction || 'SPOKEN WITH WATER IN THE RIGHT HAND, THEN POURED OUT'}
              </div>
              <div className="sank-b">
                <p className="sank-dev">
                  {guideData?.sankalpaText || 'ओं विष्णुर्विष्णुर्विष्णुः … मम आत्मनः श्रुतिस्मृतिपुराणोक्तफलप्राप्त्यर्थं श्री दुर्गा प्रीत्यर्थं नवरात्र व्रतम् अहं करिष्ये॥'}
                </p>
                <p className="sank-r">
                  {guideData?.sankalpaMeaning || '"I take up the Navratri vrat, for the pleasure of Sri Durga."'}
                </p>
                {guideData?.sankalpaExplanation ? (
                  <p className="sank-m" dangerouslySetInnerHTML={{ __html: guideData.sankalpaExplanation }} />
                ) : (
                  <p className="sank-m">
                    A sankalpa is a stated intention, not a formula that must be pronounced correctly. It names <b>who is doing it, when, where and for what</b>. That is the whole of its structure.
                  </p>
                )}
                <div className="sank-g">
                  {(() => {
                    let cards = [
                      { k: 'WHO', v: 'Your name, and your gotra if your family uses one. If you do not know it, leave it out.' },
                      { k: 'WHEN AND WHERE', v: 'The tithi and the place. "Today, at home" is sufficient.' },
                      { k: 'FOR WHAT', v: 'The observance you are taking up, and for whom. Here: the nine-night vrat, for Durga.' },
                    ];
                    if (guideData?.sankalpaDetailsJson) {
                      try {
                        const parsed = typeof guideData.sankalpaDetailsJson === 'string'
                          ? JSON.parse(guideData.sankalpaDetailsJson)
                          : guideData.sankalpaDetailsJson;
                        if (Array.isArray(parsed) && parsed.length > 0) {
                          cards = parsed.map((c: any) => ({
                            k: c.k || c.key || c.title || '',
                            v: c.v || c.val || c.value || c.description || '',
                          }));
                        }
                      } catch (e) { }
                    }
                    return cards.map((card, idx) => (
                      <div className="sg" key={idx}>
                        <div className="sg-k">{card.k}</div>
                        <div className="sg-v">{card.v}</div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
              <p className="sank-note">
                {guideData?.sankalpaNoteHeading ? <b>{guideData.sankalpaNoteHeading} </b> : <b>Say it in whatever language you think in. </b>}
                {guideData?.sankalpaNoteContent || 'The Sanskrit is given because people ask for it. A sankalpa said in Hindi or English, meant sincerely, is a sankalpa.'}
              </p>
            </div>

            {/* Vrat Katha Card — Dynamic from Admin Panel */}
            <div className="sh" id="katha">
              <span className="sh-p">+</span>
              <span className="sh-t">{guideData?.kathaTitle || 'The Vrat Katha'}</span>
            </div>
            <p className="sh-s">{guideData?.kathaSubtitle || 'Read on any of the nine nights, most often on Ashtami.'}</p>

            <div className="katha">
              <div className="k-top">
                <div className="k-l">
                  {(guideData?.kathaScripturalReference || 'DEVI MAHATMYA · MARKANDEYA PURANA').toUpperCase()}
                </div>
                <div className="k-t">{guideData?.kathaHeadline || 'The gods were losing, and no god could win'}</div>
                <p className="k-s">
                  {guideData?.kathaIntroduction ||
                    'Mahishasura had taken heaven. What defeated him was not a stronger god — it was every god surrendering their power into one form.'}
                </p>
              </div>
              <div className="k-b">
                <div className="k-beats">
                  {(() => {
                    let cards = [
                      { cardNumber: 1, cardTitle: 'The boon', cardDescription: 'Mahishasura cannot be killed by any man or god. He asks for the exemption he thinks is safest.' },
                      { cardNumber: 2, cardTitle: 'Heaven falls', cardDescription: 'The devas are driven out. Each one alone is not enough, and they know it.' },
                      { cardNumber: 3, cardTitle: 'The convergence', cardDescription: 'Their combined energy takes one form — Durga, holding a weapon from each of them.' },
                      { cardNumber: 4, cardTitle: 'Nine nights', cardDescription: 'She fights for nine nights. On the tenth day, she wins.' },
                    ];
                    if (guideData?.kathaCardsJson) {
                      try {
                        const parsed = typeof guideData.kathaCardsJson === 'string' ? JSON.parse(guideData.kathaCardsJson) : guideData.kathaCardsJson;
                        if (Array.isArray(parsed) && parsed.length > 0) {
                          cards = parsed.map((c: any, idx: number) => ({
                            cardNumber: c.cardNumber || c.number || idx + 1,
                            cardTitle: c.cardTitle || c.title || '',
                            cardDescription: c.cardDescription || c.description || '',
                          }));
                        }
                      } catch (e) { }
                    }
                    return cards.map((card, idx) => (
                      <div className="kb" key={idx}>
                        <div className="kb-n">{card.cardNumber}</div>
                        <div className="kb-t">{card.cardTitle}</div>
                        <p className="kb-s">{card.cardDescription}</p>
                      </div>
                    ));
                  })()}
                </div>
                <div className="k-f">
                  <p className="k-moral">
                    {guideData?.kathaSupportingExplanation ? (
                      <span dangerouslySetInnerHTML={{ __html: guideData.kathaSupportingExplanation }} />
                    ) : (
                      <>
                        <b>Why it is read across nine nights, not one:</b> the battle took nine. The reading follows the
                        fight rather than summarising it.
                      </>
                    )}
                  </p>
                  <button
                    className="k-audio"
                    onClick={() => {
                      if (guideData?.kathaAudio) {
                        window.open(guideData.kathaAudio, '_blank');
                      }
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                    </svg>
                    <span>
                      {guideData?.kathaAudioButtonText || 'Listen'} · {guideData?.kathaAudioDuration || '14 min'}
                    </span>
                  </button>
                  <button
                    className="k-c"
                    onClick={() => {
                      if (guideData?.kathaFullKathaLink) {
                        window.open(guideData.kathaFullKathaLink, '_blank');
                      }
                    }}
                  >
                    {guideData?.kathaFullKathaButtonText ? (guideData.kathaFullKathaButtonText.includes('›') ? guideData.kathaFullKathaButtonText : `${guideData.kathaFullKathaButtonText} ›`) : 'Read the full katha ›'}
                  </button>
                </div>
              </div>
            </div>

            {/* Ashtami and Navami Section — Dynamic from Admin Panel */}
            <div className="sh">
              <span className="sh-p">+</span>
              <span className="sh-t">{guideData?.festivalContextTitle || 'Durga Ashtami and Maha Navami'}</span>
            </div>
            <p className="p">
              {guideData?.festivalContextIntroduction ||
                'These are the most intensive days of the nine. In 2026 the two tithis merge on 19 October, so confirm your panchang before fixing the day.'}
            </p>
            {guideData?.festivalContextDetails ? (
              <p className="p" dangerouslySetInnerHTML={{ __html: guideData.festivalContextDetails }} />
            ) : (
              <p className="p">
                Havan is traditionally performed on Ashtami. <strong>Kanya Pujan</strong> — inviting young girls and honouring
                them as living forms of the Devi — is kept on Ashtami or Navami according to family tradition. Their feet
                are washed, food is offered, and blessings are taken from them.
              </p>
            )}
            <div className="tagrow">
              <span className="pill d">
                {(guideData?.festivalPracticeCategory || guideData?.category || 'DHARMA').toUpperCase()} · {guideData?.festivalPracticeRating || guideData?.rating || '4/5'}
              </span>
              <span className="badge shastra">
                {(guideData?.festivalClassification || guideData?.classification || 'SHASTRA').toUpperCase()}
              </span>
            </div>
            <p className="p">
              {guideData?.sandhiPujaInformation ||
                'Where Ashtami and Navami cross, Sandhi Puja is performed in the window spanning the join.'}
            </p>

            <div className="hr"></div>

            {/* Nine Days Table — Purely Dynamic from Admin Panel */}
            {(() => {
              const rawJson = guideData?.nineDaysTableJson || guideData?.nineDaysJson || guideData?.vidhiDaysJson;
              if (!rawJson) return null;
              let daysList: any[] = [];
              try {
                const parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
                if (Array.isArray(parsed) && parsed.length > 0) {
                  daysList = parsed;
                }
              } catch (e) { }

              if (daysList.length === 0) return null;

              return (
                <>
                  <div className="sh">
                    <span className="sh-p">+</span>
                    <span className="sh-t">{guideData?.nineDaysTitle || 'The Nine Forms & Nine Days'}</span>
                  </div>

                  <div className="days" style={{ marginTop: '16px' }}>
                    <div className="dh">
                      <span>DAY</span>
                      <span>DATE</span>
                      <span>DEVI FORM &amp; SIGNIFICANCE</span>
                      <span>COLOUR</span>
                      <span>OFFERING</span>
                    </div>

                    {daysList.map((item: any, idx: number) => {
                      const num = item.n || item.dayNumber || item.day || idx + 1;
                      const dateStr = item.dt || item.date || item.dayDate || '';
                      const deviForm = item.dv || item.deviForm || item.form || item.dayTitle || '';
                      const deviSig = item.ds || item.deviSignificance || item.significance || item.dayDescription || '';
                      const colorName = item.col || item.colour || item.color || '';
                      const swatch = item.sw || item.colourSwatch || item.swatch || item.colorHex || '';
                      const offering = item.of || item.offering || item.prasadam || '';

                      return (
                        <div className="dr" key={item.id || idx}>
                          <span className="d-n">{num}</span>
                          <span className="d-dt">{dateStr}</span>
                          <span>
                            <span className="d-dv">{deviForm}</span>
                            {deviSig && <span className="d-ds">{deviSig}</span>}
                          </span>
                          <span className="d-col">
                            {swatch && <span className="d-sw" style={{ background: swatch }}></span>}
                            {colorName}
                          </span>
                          <span className="d-of">{offering}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="hr"></div>
                </>
              );
            })()}

            {/* Samagri Checklist Section — Purely Dynamic from Admin Panel */}
            {(() => {
              if (!guideData?.samagriItemsJson) return null;
              let samagriList: any[] = [];
              try {
                const parsed = typeof guideData.samagriItemsJson === 'string'
                  ? JSON.parse(guideData.samagriItemsJson)
                  : guideData.samagriItemsJson;
                if (Array.isArray(parsed) && parsed.length > 0) {
                  samagriList = parsed;
                }
              } catch (e) { }

              if (samagriList.length === 0) return null;

              return (
                <>
                  <div className="sh" id="samagri">
                    <span className="sh-p">+</span>
                    <span className="sh-t">{guideData?.samagriTitle || 'Samagri'}</span>
                  </div>
                  <p className="sh-s">
                    {guideData?.samagriSubtitle || 'Everything is available in any local puja market. Substitutions are noted where they matter.'}
                  </p>

                  <div className="sam">
                    {samagriList.map((s: any, idx: number) => {
                      const itemName = s.item || s.itemName || s.name || '';
                      const itemNote = s.note || s.itemDetails || s.details || '';
                      return (
                        <div className="sam-r" key={s.id || idx}>
                          <input
                            type="checkbox"
                            className="cb"
                            checked={!!checkedSamagri[idx]}
                            onChange={() => toggleSamagri(idx)}
                          />
                          <span className="sam-i" style={{ textDecoration: checkedSamagri[idx] ? 'line-through' : 'none' }}>
                            {itemName}
                          </span>
                          <span className="sam-n">{itemNote}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="hr"></div>
                </>
              );
            })()}

            {/* Fasting Section — Purely Dynamic from Admin Panel */}
            {(() => {
              if (!guideData?.fastingOptionsJson) return null;
              let options: any[] = [];
              try {
                const parsed = typeof guideData.fastingOptionsJson === 'string'
                  ? JSON.parse(guideData.fastingOptionsJson)
                  : guideData.fastingOptionsJson;
                if (Array.isArray(parsed) && parsed.length > 0) {
                  options = parsed.map((opt: any) => ({
                    title: opt.title || opt.heading || opt.name || '',
                    description: opt.description || opt.details || opt.content || '',
                  }));
                }
              } catch (e) { }

              if (options.length === 0) return null;

              return (
                <>
                  <div className="sh" id="fast">
                    <span className="sh-p">+</span>
                    <span className="sh-t">{guideData?.fastingTitle || 'Fasting'}</span>
                  </div>
                  <p className="sh-s">
                    {guideData?.fastingSubtitle || 'Three forms are commonly kept, and all three are accepted.'}
                  </p>

                  <div className="fast">
                    {options.map((opt, idx) => (
                      <div className="fb" key={idx}>
                        <div className="fb-t">{opt.title}</div>
                        <p className="fb-s">{opt.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="fnote">
                    {guideData?.fastingGuidanceHeading ? <b>{guideData.fastingGuidanceHeading} </b> : <b>The tradition prescribes devotion, not starvation. </b>}
                    {guideData?.fastingGuidanceContent || 'If a nine-day fast is not physically possible for you, a shorter form kept with sincerity fulfils the vrat.'}
                  </div>

                  <div className="hr"></div>
                </>
              );
            })()}

            {/* Myths & Facts — Purely Dynamic from Admin Panel */}
            {(() => {
              if (!guideData?.mythsItemsJson) return null;
              let mythsList: any[] = [];
              try {
                const parsed = typeof guideData.mythsItemsJson === 'string'
                  ? JSON.parse(guideData.mythsItemsJson)
                  : guideData.mythsItemsJson;
                if (Array.isArray(parsed) && parsed.length > 0) {
                  mythsList = parsed;
                }
              } catch (e) { }

              if (mythsList.length === 0) return null;

              return (
                <>
                  <div className="sh" id="myths">
                    <span className="sh-p">+</span>
                    <span className="sh-t">{guideData?.mythsTitle || 'Myths & Facts'}</span>
                  </div>

                  {mythsList.map((m: any, idx: number) => {
                    const statement = m.mythStatement || m.statement || m.myth || m.question || '';
                    const label = m.correctionLabel || m.label || m.badge || 'CORRECTION';
                    const content = m.correctionContent || m.content || m.answer || m.correction || '';

                    return (
                      <div className="myth" key={m.id || idx}>
                        <div className="my-q">
                          <span className="my-qt">{statement}</span>
                          <span className="my-bd">{label}</span>
                        </div>
                        <p className="my-a">{content}</p>
                      </div>
                    );
                  })}
                </>
              );
            })()}

            {/* Intelligence Layer — Dynamic from Admin Panel */}
            <div className="intel">
              <div className="in-l">{guideData?.intelTagline || '◗ WHY NINE NIGHTS?'}</div>
              <div className="in-t">{guideData?.intelHeading || 'The number is not decorative'}</div>
              <p className="in-s">
                {guideData?.intelBody ||
                  guideData?.intelSummary ||
                  'Nine nights appear across the tradition — four Navratris in a year, not one. The count, the arc from tamas through rajas to sattva, and why the tenth day sits outside the nine are explained once and apply to all of them.'}
              </p>
              <Link
                href={guideData?.intelCtaLink || '/dharmic-concepts/navratri-nine-nights'}
                className="in-c"
              >
                {guideData?.intelCtaText || 'Read: What Navratri is — the nine nights ›'}
              </Link>
            </div>

            {/* Poetic Closing — Dynamic from Admin Panel */}
            <div className="closing">
              {guideData?.closingContent ? (
                <div dangerouslySetInnerHTML={{ __html: guideData.closingContent }} />
              ) : (
                <>
                  <p>
                    Navratri is the tradition&apos;s most sustained worship — nine nights without a break. The kalash stays
                    filled. The flame stays lit. The flowers are replaced each morning. The mantra changes daily.
                  </p>
                  <p>
                    And on the ninth night you look at the barley you sowed on the first day, now tall and green and
                    reaching upward, and you understand what the nine nights were doing: growing something that was barely
                    a seed when you began.
                  </p>
                </>
              )}
            </div>

            {/* Related Grid — Purely Dynamic from Admin Panel */}
            {(() => {
              let relatedRitualGuides: any[] = [];
              let relatedPujans: any[] = [];
              let relatedConcepts: any[] = [];
              let relatedDates: any[] = [];

              if (guideData?.relatedRitualGuidesJson) {
                try {
                  const parsed = typeof guideData.relatedRitualGuidesJson === 'string' ? JSON.parse(guideData.relatedRitualGuidesJson) : guideData.relatedRitualGuidesJson;
                  if (Array.isArray(parsed)) relatedRitualGuides = parsed;
                } catch (e) { }
              }
              if (guideData?.relatedPujansJson) {
                try {
                  const parsed = typeof guideData.relatedPujansJson === 'string' ? JSON.parse(guideData.relatedPujansJson) : guideData.relatedPujansJson;
                  if (Array.isArray(parsed)) relatedPujans = parsed;
                } catch (e) { }
              }
              if (guideData?.relatedConceptsJson) {
                try {
                  const parsed = typeof guideData.relatedConceptsJson === 'string' ? JSON.parse(guideData.relatedConceptsJson) : guideData.relatedConceptsJson;
                  if (Array.isArray(parsed)) relatedConcepts = parsed;
                } catch (e) { }
              }
              if (guideData?.relatedDatesJson) {
                try {
                  const parsed = typeof guideData.relatedDatesJson === 'string' ? JSON.parse(guideData.relatedDatesJson) : guideData.relatedDatesJson;
                  if (Array.isArray(parsed)) relatedDates = parsed;
                } catch (e) { }
              }

              const hasItems = relatedRitualGuides.length > 0 || relatedPujans.length > 0 || relatedConcepts.length > 0 || relatedDates.length > 0;

              if (!hasItems) {
                // Return default structured categories if guideData has no JSON
                return (
                  <>
                    <div className="sh">
                      <span className="sh-p">+</span>
                      <span className="sh-t">{guideData?.relatedSectionTitle || guideData?.relatedTitle || 'Related'}</span>
                    </div>

                    <div className="relgrid">
                      <div className="rel">
                        <div className="rel-h">RELATED RITUAL GUIDES</div>
                        <Link href="/ritual-guides/dussehra" className="rel-i">
                          <span>
                            <span className="rel-n">Dussehra / Vijayadashami</span>
                            <span className="rel-s">The tenth day · 20 October</span>
                          </span>
                          <span className="rel-cl">CALENDAR</span>
                        </Link>
                        <Link href="/ritual-guides/durga-ashtami" className="rel-i">
                          <span>
                            <span className="rel-n">Durga Ashtami</span>
                            <span className="rel-s">The most intensive of the nine</span>
                          </span>
                          <span className="rel-cl">DEITY</span>
                        </Link>
                      </div>

                      <div className="rel">
                        <div className="rel-h">RELATED PUJANS</div>
                        <Link href="/ritual-kits/shakti-kit" className="rel-i">
                          <span>
                            <span className="rel-n">Navratri Ghatasthapana</span>
                            <span className="rel-s">Bookable · purohit performs the sthapana</span>
                          </span>
                          <span className="rel-a">›</span>
                        </Link>
                        <Link href="/ritual-guides/durga-puja" className="rel-i">
                          <span>
                            <span className="rel-n">Durga Puja</span>
                            <span className="rel-s">The Bengali observance form</span>
                          </span>
                          <span className="rel-a">›</span>
                        </Link>
                      </div>

                      <div className="rel">
                        <div className="rel-h">RELATED CONCEPTS</div>
                        <Link href="/dharmic-concepts/what-is-navratri" className="rel-i">
                          <span>
                            <span className="rel-n">What Is Navratri?</span>
                            <span className="rel-s">The three gunas across nine nights</span>
                          </span>
                          <span className="rel-a">›</span>
                        </Link>
                      </div>

                      <div className="rel">
                        <div className="rel-h">RELATED DATES</div>
                        <Link href="/panchang" className="rel-i">
                          <span>
                            <span className="rel-n">Sharad Navratri 2026 Panchang</span>
                            <span className="rel-s">Every tithi boundary, day by day</span>
                          </span>
                          <span className="rel-a">›</span>
                        </Link>
                        <Link href="/panchang/ashwin" className="rel-i">
                          <span>
                            <span className="rel-n">Ashwin month panchang</span>
                            <span className="rel-s">The full month</span>
                          </span>
                          <span className="rel-a">›</span>
                        </Link>
                      </div>
                    </div>
                  </>
                );
              }

              return (
                <>
                  <div className="sh">
                    <span className="sh-p">+</span>
                    <span className="sh-t">{guideData?.relatedSectionTitle || guideData?.relatedTitle || 'Related'}</span>
                  </div>

                  <div className="relgrid">
                    {relatedRitualGuides.length > 0 && (
                      <div className="rel">
                        <div className="rel-h">{guideData?.relatedGuidesHeading || 'RELATED RITUAL GUIDES'}</div>
                        {relatedRitualGuides.map((item: any, idx: number) => (
                          <Link href={item.link || item.url || '#'} className="rel-i" key={idx}>
                            <span>
                              <span className="rel-n">{item.title || item.name}</span>
                              <span className="rel-s">{item.subtitle || item.sub}</span>
                            </span>
                            {item.tag ? <span className="rel-cl">{item.tag}</span> : <span className="rel-a">›</span>}
                          </Link>
                        ))}
                      </div>
                    )}

                    {relatedPujans.length > 0 && (
                      <div className="rel">
                        <div className="rel-h">{guideData?.relatedPujansHeading || 'RELATED PUJANS'}</div>
                        {relatedPujans.map((item: any, idx: number) => (
                          <Link href={item.link || item.url || '#'} className="rel-i" key={idx}>
                            <span>
                              <span className="rel-n">{item.title || item.name}</span>
                              <span className="rel-s">{item.subtitle || item.sub}</span>
                            </span>
                            <span className="rel-a">›</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {relatedConcepts.length > 0 && (
                      <div className="rel">
                        <div className="rel-h">{guideData?.relatedConceptsHeading || 'RELATED CONCEPTS'}</div>
                        {relatedConcepts.map((item: any, idx: number) => (
                          <Link href={item.link || item.url || '#'} className="rel-i" key={idx}>
                            <span>
                              <span className="rel-n">{item.title || item.name}</span>
                              <span className="rel-s">{item.subtitle || item.sub}</span>
                            </span>
                            <span className="rel-a">›</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {relatedDates.length > 0 && (
                      <div className="rel">
                        <div className="rel-h">{guideData?.relatedDatesHeading || 'RELATED DATES'}</div>
                        {relatedDates.map((item: any, idx: number) => (
                          <Link href={item.link || item.url || '#'} className="rel-i" key={idx}>
                            <span>
                              <span className="rel-n">{item.title || item.name}</span>
                              <span className="rel-s">{item.subtitle || item.sub}</span>
                            </span>
                            <span className="rel-a">›</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}

            {/* Revenue Row */}
            <div className="sh">
              <span className="sh-p">+</span>
              <span className="sh-t">Prefer to have it all taken care of?</span>
            </div>
            <div className="rev">
              <div className="rev-c feat">
                <div className="rev-i">🪔</div>
                <div className="rev-l">RITUAL KIT</div>
                <div className="rev-t">Shakti Kit</div>
                <p className="rev-s">
                  Nine days of samagri in one box — kalash set, barley and pot, chunri, akhand jyoti vessel, Saptashati,
                  puja powders and the Kanya Pujan items.
                </p>
                <button className="rev-b">Pre-book — ₹1,751</button>
              </div>
              <div className="rev-c live">
                <div className="rev-i">🙏</div>
                <div className="rev-l">PUROHIT &amp; PUJA</div>
                <div className="rev-t">Book a purohit for Ghatasthapana</div>
                <p className="rev-s">
                  Any devotee can perform the sthapana. A purohit adds muhurat precision and takes the procedure off
                  your hands on a working Sunday morning.
                </p>
                <button className="rev-b pur">Check availability ›</button>
              </div>
              <div className="rev-c live">
                <div className="rev-i" style={{ background: '#E9F7EE', borderColor: '#C6E6D2' }}>
                  💬
                </div>
                <div className="rev-l">THE TAPA CIRCLE</div>
                <div className="rev-t">Never miss a date again</div>
                <p className="rev-s">
                  Festival and vrat reminders on WhatsApp, with the guide attached and the kit cut-off if there is one.
                  ₹499 a year.
                </p>
                <button className="rev-b wa">Join the Tapa Circle ›</button>
              </div>
            </div>
            <p className="rev-note">
              You do not need any of these to observe Navratri. The samagri list above is complete and free, and no text
              ranks a bought kit above an assembled one.
            </p>
          </div>

          {/* Sticky Sidebar */}
          <aside className="side">
            <button className="sbcta pink">
              <span className="sb-ci">🧺</span>
              <span className="sb-ct">Pre-book the Shakti kit</span>
              <span className="sb-cs">₹1,751 · delivered before 11 October</span>
            </button>

            <button className="sbcta wa">
              <span className="sb-ci">💬</span>
              <span className="sb-ct">Join the Tapa Circle</span>
              <span className="sb-cs">WhatsApp reminders · ₹499 a year</span>
            </button>

            <button className="sbcta dk" onClick={() => setIsCardModalOpen(true)}>
              <span className="sb-ci">↓</span>
              <span className="sb-ct">Download the ritual card</span>
              <span className="sb-cs">One page — samagri, steps, mantras, timings</span>
            </button>

            {/* Also Available Companion Box */}
            <div className="sbcomp">
              <div className="sbcomp-h">
                <span className="sbcomp-i">📖</span>
                <span className="sbcomp-l">ALSO AVAILABLE</span>
                <span className="sbcomp-d">DUMMY</span>
              </div>
              <p className="sbcomp-t">A plain-language version of this ritual — no citations, no Sanskrit to look up.</p>
              <button className="sbcomp-b">Navratri Beginner&apos;s Guide</button>
            </div>

            {/* Samagri Checklist Sidebar Box */}
            <div className="sb">
              <div className="sb-h">
                <span>Samagri checklist</span>
                <span className="sb-c">{checkedCount} / 11</span>
              </div>
              {[
                'Kalash — brass or copper',
                'Clay pot, soil, barley',
                'Red cloth and chunri',
                'Durga idol or image',
                'Akhand jyoti vessel',
                'Durga Saptashati',
                'Flowers, daily',
                'Puja powders',
                'Ghee, incense, camphor',
                'Kanya Pujan items',
                'Havan samagri — optional',
              ].map((item, idx) => (
                <div className="sb-i" key={idx}>
                  <input
                    type="checkbox"
                    className="cb"
                    checked={!!checkedSamagri[idx]}
                    onChange={() => toggleSamagri(idx)}
                  />
                  <span style={{ textDecoration: checkedSamagri[idx] ? 'line-through' : 'none' }}>{item}</span>
                </div>
              ))}
              <div className="sb-act">
                <button className="sb-wa">Send to WhatsApp</button>
                <button className="sb-dl" onClick={() => setIsCardModalOpen(true)}>Download</button>
              </div>
            </div>

            <div className="sbn">
              <div className="sbn-h">WHAT THE BADGE MEANS</div>
              <p className="sbn-t">
                <b>Puranic · 4/5</b> — clearly stated in a Mahapurana, Dharmashastra, Kalpa Sutra or Agama. Here, the Devi
                Mahatmya within the Markandeya Purana.
              </p>
              <Link href="/editorial-method" className="sbn-c">
                How we decide what is true ›
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky Bottom Bar (Desktop & Mobile) */}
      <div className={`dsticky ${showStickyBar ? 'on' : ''}`}>
        <div className="ds-in">
          <div>
            <div className="ds-t">{formattedTitle}: The Complete 9-Day Guide</div>
            <div className="ds-s">Scripturally sourced · Region aware · Fear-free</div>
          </div>
          <div className="ds-b">
            <button className="ds-btn card" onClick={() => setIsCardModalOpen(true)}>Download Ritual Card</button>
            <button className="ds-btn wa">WhatsApp Reminders</button>
            <button className="ds-btn kit">Pre-book Shakti Kit</button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="sticky">
        <button className="a">
          Subscribe
          <small>₹499/yr</small>
        </button>
        <button className="b">
          Pre-book the Shakti kit
          <small>₹1,751 · before 11 October</small>
        </button>
      </div>


      {/* Ritual Card Modal */}
      <RitualCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        slug={slug}
        title={formattedTitle}
      />
    </div>
  );
}
