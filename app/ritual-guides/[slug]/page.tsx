'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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

import { safeParseJson, joinTruthy } from '@/lib/utils';

function decodeHtmlEntities(str: string): string {
  if (!str || (!str.includes('&lt;') && !str.includes('&gt;') && !str.includes('&amp;'))) return str;
  return str
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&');
}

function cleanHtmlString(input: string | null | undefined): string {
  if (!input) return '';
  let cleaned = decodeHtmlEntities(input);
  cleaned = cleaned.replace(/style="[^"]*--tw-[^"]*"/gi, (match) => {
    const content = match.slice(7, -1);
    const nonTwParts = content
      .split(';')
      .map((p) => p.trim())
      .filter((p) => p && !p.startsWith('--tw-'));
    return nonTwParts.length > 0 ? `style="${nonTwParts.join('; ')}"` : '';
  });
  cleaned = cleaned.replace(/style='[^']*--tw-[^']*'/gi, (match) => {
    const content = match.slice(7, -1);
    const nonTwParts = content
      .split(';')
      .map((p) => p.trim())
      .filter((p) => p && !p.startsWith('--tw-'));
    return nonTwParts.length > 0 ? `style='${nonTwParts.join('; ')}'` : '';
  });
  return cleaned;
}

export default function RitualGuideDetailPage({ params }: PageProps) {
  const { slug } = params;

  const [isBeginnerGuide, setIsBeginnerGuide] = useState<boolean>(() =>
    BEGINNER_SLUGS.has(slug) ||
    slug.includes('beginner') ||
    slug.includes('kanda') ||
    slug.includes('ramcharitmanas')
  );

  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [isSaved, setIsSaved] = useState(false);
  const [japaCount, setJapaCount] = useState(0);
  const [isMantraPlaying, setIsMantraPlaying] = useState(false);
  const [checkedSamagri, setCheckedSamagri] = useState<{ [key: number]: boolean }>({});
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [guideData, setGuideData] = useState<any>(null);

  const mantraAudioRef = useRef<HTMLAudioElement>(null);
  const mantraPlayRunRef = useRef(0);


  useEffect(() => {
    if (isBeginnerGuide || !slug) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/public/beginner-guides/${slug}`);
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled && json.success && json.data) setIsBeginnerGuide(true);
      } catch {

      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, isBeginnerGuide]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/public/ritual-guides/${slug}`);
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled && json.success && json.data) setGuideData(json.data);
      } catch (err) {
        console.error('Failed to fetch ritual guide data:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);


  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const formattedTitle = useMemo(() => {
    if (!slug) return '';
    return slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }, [slug]);

  const vidhiDays = useMemo<any[]>(
    () => safeParseJson<any[]>(guideData?.vidhiDaysJson) || [],
    [guideData?.vidhiDaysJson]
  );
  const firstVidhiDay = vidhiDays[0] || null;

  const mantraData = useMemo(() => {
    const label = guideData?.mantraLabel || firstVidhiDay?.mantraLabel || '';
    const text = guideData?.mantraText || firstVidhiDay?.mantraText || '';
    const transliteration = guideData?.mantraTransliteration || firstVidhiDay?.mantraTransliteration || '';
    const audioUrl = guideData?.mantraAudio || firstVidhiDay?.mantraAudio || '';
    return { label, text, transliteration, audioUrl, hasMantra: !!text };
  }, [guideData, firstVidhiDay]);

  const panchangCards = useMemo(() => {
    const parsed = safeParseJson<any[]>(guideData?.panchangCardsJson);
    if (!parsed || parsed.length === 0) return [];
    return parsed.map((c: any) => ({
      k: c.k || c.key || c.title || '',
      v: c.v || c.value || c.date || '',
      s: c.s || c.sub || c.subtitle || '',
    }));
  }, [guideData?.panchangCardsJson]);

  const sankalpaCards = useMemo(() => {
    const parsed = safeParseJson<any[]>(guideData?.sankalpaDetailsJson);
    if (!parsed || parsed.length === 0) return [];
    return parsed.map((c: any) => ({
      k: c.k || c.key || c.title || '',
      v: c.v || c.val || c.value || c.description || '',
    }));
  }, [guideData?.sankalpaDetailsJson]);

  const kathaCards = useMemo(() => {
    const parsed = safeParseJson<any[]>(guideData?.kathaCardsJson);
    if (!parsed || parsed.length === 0) return [];
    return parsed.map((c: any, idx: number) => ({
      cardNumber: c.cardNumber || c.number || idx + 1,
      cardTitle: c.cardTitle || c.title || '',
      cardDescription: c.cardDescription || c.description || '',
    }));
  }, [guideData?.kathaCardsJson]);

  const nineDays = useMemo<any[]>(() => {
    const raw = guideData?.nineDaysTableJson || guideData?.nineDaysJson || guideData?.vidhiDaysJson;
    return safeParseJson<any[]>(raw) || [];
  }, [guideData?.nineDaysTableJson, guideData?.nineDaysJson, guideData?.vidhiDaysJson]);

  const samagriList = useMemo<any[]>(
    () => safeParseJson<any[]>(guideData?.samagriItemsJson) || [],
    [guideData?.samagriItemsJson]
  );

  const fastingOptions = useMemo(() => {
    const parsed = safeParseJson<any[]>(guideData?.fastingOptionsJson);
    if (!parsed) return [];
    return parsed.map((opt: any) => ({
      title: opt.title || opt.heading || opt.name || '',
      description: opt.description || opt.details || opt.content || '',
    }));
  }, [guideData?.fastingOptionsJson]);

  const mythsList = useMemo<any[]>(
    () => safeParseJson<any[]>(guideData?.mythsItemsJson) || [],
    [guideData?.mythsItemsJson]
  );

  const relatedData = useMemo(
    () => ({
      guides: safeParseJson<any[]>(guideData?.relatedRitualGuidesJson) || [],
      pujans: safeParseJson<any[]>(guideData?.relatedPujansJson) || [],
      concepts: safeParseJson<any[]>(guideData?.relatedConceptsJson) || [],
      dates: safeParseJson<any[]>(guideData?.relatedDatesJson) || [],
    }),
    [
      guideData?.relatedRitualGuidesJson,
      guideData?.relatedPujansJson,
      guideData?.relatedConceptsJson,
      guideData?.relatedDatesJson,
    ]
  );

  const hasRelatedItems =
    relatedData.guides.length > 0 ||
    relatedData.pujans.length > 0 ||
    relatedData.concepts.length > 0 ||
    relatedData.dates.length > 0;


  const hasStory = !!(guideData?.storyTitle || guideData?.storyIntroduction || guideData?.storyContent || guideData?.storyContinuation);
  const hasSankalpa = !!(guideData?.sankalpaText || sankalpaCards.length > 0);
  const hasVidhi = vidhiDays.length > 0;
  const hasKatha = !!(guideData?.kathaHeadline || kathaCards.length > 0);
  const hasSamagri = samagriList.length > 0;
  const hasFasting = fastingOptions.length > 0;
  const hasMyths = mythsList.length > 0;
  const hasFestivalContext = !!guideData?.festivalContextTitle;
  const hasSotCard = !!(guideData?.sotPracticeTitle || guideData?.sotScripturalSource);
  const hasPanchang = panchangCards.length > 0;
  const hasIntel = !!(guideData?.intelHeading || guideData?.intelBody || guideData?.intelSummary);
  const heroTagLine = joinTruthy([
    guideData?.category?.toUpperCase(),
    guideData?.rating,
    guideData?.classification?.toUpperCase(),
  ]);

  const toggleSamagri = (index: number) => {
    setCheckedSamagri((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleDownloadSamagriPdf = () => {
    if (!samagriList || samagriList.length === 0) return;

    const guideTitle = guideData?.title || guideData?.guideTitle || formattedTitle || 'Ritual Guide';
    const rawDesc = guideData?.guideSubtitle || guideData?.samagriSubtitle || guideData?.storyIntroduction || '';
    const guideDesc = rawDesc.replace(/<[^>]*>/g, '').trim();

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const logoSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACMCAYAAAC9FwHKAAAxlUlEQVR4nO29eZxlV1nu/33X2vsMVdVzd9KZQyYgaaYkguJP01HCEL0IF6rBCFdFb7iCgnpxQNBKg6LXAbmiMsgVBAGtDj8CXEBE6G5IDARCIKRDhs7Y81Bz1Rn23ms99491TncHEtJJutND6smnU1X7nL33Wmu/e613eN53wXEKCQO454PPOPPODz/rHICREdyRbdXRj+N3gK66xAMs2730VSt2Dr0O4CouOX77O48fjhFw5DD3iufdNPOyn94uXZmLNGvM46FxXL4xGh32V4GK/zt8kbvfP715h50094E7L+t/doSbd1TjuBQI1oGB+Fzn9Y1duYt7DX1d/8MMse5IN24ejys0ghPY3JaXntp+3uWzk8tfEKdPfGFor76smLnux1YJTMPzs8RD4bitITZsuMQZiL8rf6OxLRukkQdr5LGxtZG7Ty7+LQMd6TYezTiuBEIjuNuB3A13S3/51tWp5S6m7m1lTlXzJwyb/rF2urq2x1+Lw3f1h3Jt3Z91bO1nLg+mX23q1i1y13XvtJ6z5vf+Uv9833V1qyLWte133f9+t//u9+433rM164K4h7l05l0a2tL/3Fz6+98v7v3tL8z7p3ePbd+3N/7+3z0v7zN0b6+0V1y/1yvNnZ517mvhfO0y19r3p/d9d/mP1S5/7v719/5e0/2+e9e1+v/d9z0z07/d5s77p/8+/272x88v5z/3b733ve/c513/f510v0/bX7v9l/m//9n/3d3d+3v9f0d7e6u+q9f3d9l8855v7N69e3e3b3c3c7v/c1u2fXFw13/f7Tz/fN897n+5d+6Z//n+bNn6d/+j/2ffXv9d6/5X5u9100v0/z01b5v7c/+y85m31u2dvefV38/9rN+a2vW3d/f+629/5/1+0397p//oXw0+t5v7Lz02r5t3/Z+172zXf2vvd5l9t8zNzV3d7/v5192+9+8s3p5r/s7/nly//0d1v617v12a4P1a3Xm2x1Xl6z31s17p/3u8fLzN0v7+6/v1+h7b+0/2vf++x/2b834X9P5Z/2L9v/W29v6h394q9/mrf97705s5P/bvv3L1c518//w+l2x//q13X/fJ010p7tN1y//tve518/39uX90u7686bZ16d+/z01vLw7s0zM19j12j/25fX/tXN3f02p76w0zbf7+5X2r113z+/1n7d6d+s///J3b6m7e7z2m/903e1/4nN+uN9f9b5X8v/+696/zO4Z1P+m5d/5t1u6/zN3t/b//d/99e2//vbfv7e4f16vT1y35n3+/c/j/9q09v02z26v25b59h/X529s7u5s3t3N3t7e5gAAAAABJRU5ErkJggg==';

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />  
  <title>${guideTitle} - Samagri PDF</title>
  <style>
    @media print {
      @page { margin: 15mm; size: A4; }
      body { margin: 0; -webkit-print-color-adjust: exact; }
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #111827;
      background: #FFFFFF;
      padding: 32px;
      max-width: 750px;
      margin: 0 auto;
    }
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #DE1B59;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .logo { height: 48px; width: auto; }
    .brand-name { font-size: 14px; font-weight: 700; color: #DE1B59; text-transform: lowercase; }
    .meta-block { margin-bottom: 24px; }
    .guide-title { font-family: Georgia, serif; font-size: 26px; font-weight: 700; color: #111827; margin: 0 0 6px 0; }
    .guide-subtitle { font-size: 14px; color: #4B5563; line-height: 1.5; margin: 0; }
    .sec-title { font-size: 16px; font-weight: 700; color: #111827; margin: 24px 0 12px 0; padding-bottom: 6px; border-bottom: 1px solid #E5E7EB; text-transform: uppercase; letter-spacing: 0.5px; }
    .samagri-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    .samagri-table th, .samagri-table td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #E5E7EB; }
    .samagri-table th { background: #FAFAFA; font-size: 11px; text-transform: uppercase; color: #6B7280; letter-spacing: 0.5px; }
    .samagri-table td { font-size: 13px; color: #1F2937; }
    .box { display: inline-block; width: 14px; height: 14px; border: 1.5px solid #9CA3AF; border-radius: 3px; margin-right: 8px; vertical-align: middle; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E5E7EB; text-align: center; font-size: 12px; color: #9CA3AF; }
  </style>
</head>
<body>
  <div class="top-bar">
    <img src="${logoSrc}" class="logo" alt="tapa" />
    <span class="brand-name">the tapa company</span>
  </div>
  <div class="meta-block">
    <h1 class="guide-title">${guideTitle}</h1>
    ${guideDesc ? `<p class="guide-subtitle">${guideDesc}</p>` : ''}
  </div>
  <div class="sec-title">🧺 Samagri (Materials) Checklist</div>
  <table class="samagri-table">
    <thead>
      <tr>
        <th style="width: 30px;"></th>
        <th>Item Name</th>
        <th>Details / Note</th>
      </tr>
    </thead>
    <tbody>
      ${samagriList
        .map(
          (s: any) => `
        <tr>
          <td><span class="box"></span></td>
          <td style="font-weight: 600;">${(s.item || s.itemName || s.name || '').replace(/<[^>]*>/g, '')}</td>
          <td style="color: #6B7280;">${(s.note || s.itemDetails || s.details || '').replace(/<[^>]*>/g, '')}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>
  <div class="footer">
    The Tapa Company • Ritual Guide Samagri Checklist
  </div>
  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const toggleMantraAudio = async () => {
    const audio = mantraAudioRef.current;
    if (!mantraData.audioUrl || !audio) return;

    if (isMantraPlaying) {
      mantraPlayRunRef.current += 1;
      audio.pause();
      audio.currentTime = 0;
      setIsMantraPlaying(false);
      return;
    }

    if (japaCount <= 0) return;

    const runId = ++mantraPlayRunRef.current;
    setIsMantraPlaying(true);

    try {
      for (let i = 0; i < japaCount; i += 1) {
        if (runId !== mantraPlayRunRef.current) break;

        audio.currentTime = 0;
        await new Promise<void>((resolve, reject) => {
          const handleEnded = () => {
            cleanup();
            resolve();
          };

          const handleError = () => {
            cleanup();
            reject(new Error('Mantra audio playback failed'));
          };

          const cleanup = () => {
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
          };

          audio.addEventListener('ended', handleEnded, { once: true });
          audio.addEventListener('error', handleError, { once: true });

          audio.play().catch((error) => {
            cleanup();
            reject(error);
          });
        });
      }
    } catch (error) {
      if (runId === mantraPlayRunRef.current) {
        console.error('Mantra audio playback failed:', error);
      }
    } finally {
      if (runId === mantraPlayRunRef.current) {
        setIsMantraPlaying(false);
        audio.pause();
        audio.currentTime = 0;
      }
    }
  };

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    if (navigator.share) {
      navigator.share({ title: formattedTitle, url: window.location.href }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isBeginnerGuide) {
    const guide = getBeginnerGuideBySlug(slug);
    return <BeginnerGuideDetailView guide={guide} />;
  }

  const heroTitle = guideData?.guideTitle || guideData?.title || formattedTitle;

  return (
    <div className="rg-detail-root w-full max-w-full overflow-x-hidden min-h-screen">
      {/* Breadcrumb */}
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <Link href="/ritual-guides">Ritual Guides</Link>
            {guideData?.category ? ` › ${guideData.category}` : ''} › <b>{heroTitle}</b>
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
            {guideData?.sectionLabel && <p className="hero-ey">{guideData.sectionLabel}</p>}
            {heroTagLine && <div className="hero-tag">◆ {heroTagLine}</div>}
            <h1 className="hero-h1">{heroTitle}</h1>
            {guideData?.guideSubtitle && <p className="hero-sub">{guideData.guideSubtitle}</p>}
            {guideData?.festivalName && (
              <p className="hero-date">
                {joinTruthy([guideData.festivalName, guideData.panchangLocation])}
              </p>
            )}
            {(guideData?.primaryButtonText || guideData?.secondaryButtonText || guideData?.thirdButtonText) && (
              <div className="hero-btns">
                {guideData?.primaryButtonText && (
                  <a href={guideData?.primaryButtonTarget || '#'} className="hb-p">
                    {guideData.primaryButtonText}
                  </a>
                )}
                {guideData?.secondaryButtonText && (
                  <button
                    className="hb-g"
                    onClick={() => {
                      if (guideData?.secondaryButtonTarget?.startsWith('http')) {
                        window.open(guideData.secondaryButtonTarget, '_blank');
                      } else {
                        setIsCardModalOpen(true);
                      }
                    }}
                  >
                    {guideData.secondaryButtonText}
                  </button>
                )}
                {guideData?.thirdButtonText && (
                  <button
                    className="hb-g"
                    onClick={() => {
                      const target = guideData?.thirdButtonTarget;
                      if (!target) return;
                      if (target.startsWith('http')) {
                        window.open(target, '_blank');
                      } else if (target.startsWith('#')) {
                        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.href = target;
                      }
                    }}
                  >
                    {guideData.thirdButtonText}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Jump-to Chips Bar — only for sections that actually have content */}
      {(hasStory || hasSankalpa || hasVidhi || hasKatha || hasSamagri || hasFasting || hasMyths) && (
        <div className="chips">
          <div className="chips-in">
            <span className="chip-l">JUMP TO</span>
            {hasStory && <a className="chip" href="#story">📖 The story</a>}
            {hasSankalpa && <a className="chip" href="#sankalp">✋ Sankalpa</a>}
            {hasVidhi && <a className="chip" href="#vidhi">🪔 Vidhi</a>}
            {hasKatha && <a className="chip" href="#katha">📿 Vrat Katha</a>}
            {hasSamagri && <a className="chip" href="#samagri">🧺 Samagri</a>}
            {hasFasting && <a className="chip" href="#fast">🍎 Fasting</a>}
            {hasMyths && <a className="chip" href="#myths">✕ Myths</a>}
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="wrap">
        <div className="layout">
          {/* Main Column */}
          <div className="main">
            {/* Credibility Card */}
            {hasSotCard && (
              <div className="cc">
                <div className="cc-h">
                  {guideData?.sotSectionHeading && <span className="cc-hl">{guideData.sotSectionHeading}</span>}
                  {guideData?.sotButtonTarget && (
                    <Link href={guideData.sotButtonTarget} className="cc-hr">
                      {guideData?.sotButtonText
                        ? guideData.sotButtonText.includes('›')
                          ? guideData.sotButtonText
                          : `${guideData.sotButtonText} ›`
                        : 'Read source ›'}
                    </Link>
                  )}
                </div>
                <div className="cc-b">
                  {guideData?.sotPracticeLabel && <div className="cc-core">{guideData.sotPracticeLabel}</div>}
                  {guideData?.sotPracticeTitle && <div className="cc-claim">{guideData.sotPracticeTitle}</div>}
                  <div className="cc-row">
                    {(guideData?.sotPracticeCategory || guideData?.category) && (
                      <span className="pill d">
                        {joinTruthy([
                          (guideData?.sotPracticeCategory || guideData?.category)?.toUpperCase(),
                          guideData?.sotPracticeRating || guideData?.rating,
                        ])}
                      </span>
                    )}
                    {(guideData?.sotPracticeClassification || guideData?.classification) && (
                      <span className="badge puranic">
                        {(guideData?.sotPracticeClassification || guideData?.classification)?.toUpperCase()}
                      </span>
                    )}
                    {guideData?.sotScripturalSource && (
                      <span className="pill src">
                        {joinTruthy([guideData.sotScripturalSource, guideData?.sotParentScripture])}
                      </span>
                    )}
                  </div>
                </div>
                {(guideData?.sotCorePracticesCount != null ||
                  guideData?.sotScripturalElementsCount != null ||
                  guideData?.sotRegionalCustomsCount != null ||
                  guideData?.sotCorrectionsCount != null) && (
                    <p className="cc-comp">
                      This guide:{' '}
                      {joinTruthy(
                        [
                          guideData?.sotCorePracticesCount != null ? `${guideData.sotCorePracticesCount} core practice` : null,
                          guideData?.sotScripturalElementsCount != null
                            ? `${guideData.sotScripturalElementsCount} scriptural elements`
                            : null,
                          guideData?.sotRegionalCustomsCount != null
                            ? `${guideData.sotRegionalCustomsCount} regional customs`
                            : null,
                          guideData?.sotCorrectionsCount != null ? `${guideData.sotCorrectionsCount} corrections` : null,
                        ],
                        ' · '
                      )}
                    </p>
                  )}
              </div>
            )}

            {/* Panchang Card */}
            {hasPanchang && (
              <div className="pan">
                <div className="pan-h">
                  {guideData?.festivalName && <span className="pan-hl">📅 {guideData.festivalName.toUpperCase()}</span>}
                  {(guideData?.panchangLocation || guideData?.panchangSource) && (
                    <span className="pan-hr">{joinTruthy([guideData?.panchangLocation, guideData?.panchangSource])}</span>
                  )}
                </div>
                <div className="pan-g">
                  {panchangCards.map((card, idx) => (
                    <div className="pc" key={idx}>
                      <div className="pc-k">{card.k}</div>
                      <div className="pc-v">{card.v}</div>
                      <div className="pc-s">{card.s}</div>
                    </div>
                  ))}
                </div>
                {guideData?.panchangNote && (
                  <p className="pan-n">
                    <span dangerouslySetInnerHTML={{ __html: guideData.panchangNote }} />
                  </p>
                )}
              </div>
            )}

            {/* Story / Opening Prose */}
            {hasStory && (
              <>
                {guideData?.storyTitle && <p className="open">{guideData.storyTitle}</p>}
                {guideData?.storyIntroduction && (
                  <p
                    className="p"
                    dangerouslySetInnerHTML={{ __html: cleanHtmlString(guideData.storyIntroduction) }}
                  />
                )}

                {(guideData?.storySubsectionTitle || guideData?.storyContent) && (
                  <div className="sh" id="story">
                    <span className="sh-p">+</span>
                    {guideData?.storySubsectionTitle && <span className="sh-t">{guideData.storySubsectionTitle}</span>}
                  </div>
                )}
                {guideData?.storyContent && (
                  <p
                    className="p"
                    dangerouslySetInnerHTML={{ __html: cleanHtmlString(guideData.storyContent) }}
                  />
                )}

                {(guideData?.storyPracticeCategory ||
                  guideData?.category ||
                  guideData?.storyPracticeClassification ||
                  guideData?.classification ||
                  guideData?.storyScripturalSource) && (
                    <div className="tagrow">
                      {(guideData?.storyPracticeCategory || guideData?.category) && (
                        <span className="pill d">
                          {joinTruthy([
                            (guideData?.storyPracticeCategory || guideData?.category)?.toUpperCase(),
                            guideData?.storyPracticeRating || guideData?.rating,
                          ])}
                        </span>
                      )}
                      {(guideData?.storyPracticeClassification || guideData?.classification) && (
                        <span className="badge puranic">
                          {(guideData?.storyPracticeClassification || guideData?.classification)?.toUpperCase()}
                        </span>
                      )}
                      {guideData?.storyScripturalSource && (
                        <span className="pill src">{guideData.storyScripturalSource}</span>
                      )}
                    </div>
                  )}
                {guideData?.storyContinuation && (
                  <p
                    className="p"
                    dangerouslySetInnerHTML={{ __html: cleanHtmlString(guideData.storyContinuation) }}
                  />
                )}
              </>
            )}

            {/* Image Banner — only if an image actually came from the guide record */}
            {guideData?.storyImage && (
              <figure className="art">
                <img
                  src={guideData.storyImage}
                  alt={guideData?.storyImageAltText || heroTitle}
                  style={{ maxHeight: '380px', objectFit: 'cover' }}
                />
              </figure>
            )}

            {/* Vidhi Days & Steps — Purely Dynamic from Admin Panel */}
            {vidhiDays.map((day: any, dIdx: number) => {
              const dayNum = day.dayNumber || dIdx + 1;
              const steps = Array.isArray(day.steps) ? day.steps : [];
              return (
                <div key={day.id || dIdx}>
                  <div className="sh" id={dIdx === 0 ? 'vidhi' : `vidhi-day-${dayNum}`}>
                    <span className="sh-p">+</span>
                    <span className="sh-t">
                      Day {dayNum}
                      {day.dayTitle ? ` — ${day.dayTitle}` : ''}
                    </span>
                  </div>
                  {day.dayDescription && <p className="sh-s">{day.dayDescription}</p>}

                  {day.muhuratInformation && (
                    <div className="muh">
                      {day.muhuratLabel && (
                        <b>{day.muhuratLabel.endsWith('.') ? day.muhuratLabel : `${day.muhuratLabel}.`}</b>
                      )}{' '}
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
            })}

            {/* Mantra Box — only if the guide (or its first vidhi day) actually supplies a mantra */}
            {mantraData.hasMantra && (
              <div className="mantra">
                <div className="mn-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {mantraData.label && <div className="mn-l">{mantraData.label}</div>}

                  {mantraData.audioUrl && (
                    <>
                      <button
                        type="button"
                        className="mn-play-btn"
                        onClick={toggleMantraAudio}
                        aria-label={isMantraPlaying ? 'Pause mantra audio' : 'Play mantra audio'}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          border: 'none',
                          background: '#DE1B59',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          flexShrink: 0,
                          fontSize: '14px',
                          lineHeight: 1,
                        }}
                      >
                        {isMantraPlaying ? '❚❚' : '▶'}
                      </button>
                      <audio
                        ref={mantraAudioRef}
                        src={mantraData.audioUrl}
                        preload="auto"
                        style={{ display: 'none' }}
                      />
                    </>
                  )}
                </div>

                <div className="mn-d">{mantraData.text}</div>
                {mantraData.transliteration && <div className="mn-r">{mantraData.transliteration}</div>}

                <div className="japa">
                  <div>
                    <div className="jp-l">JAPA COUNT</div>
                    <div className="jp-t" style={{ textAlign: 'left', marginTop: '4px' }}>Tap as you complete each round</div>
                  </div>
                  <div className="jp-ctr">
                    <button className="jp-b" onClick={() => setJapaCount((c) => Math.max(0, c - 1))}>
                      −
                    </button>
                    <div>
                      <div
                        className="jp-n"
                        onClick={() => {
                          const value = window.prompt('Enter japa count', String(japaCount));
                          if (value === null) return;
                          const count = Number(value);
                          if (Number.isFinite(count) && count >= 0) {
                            setJapaCount(Math.floor(count));
                          }
                        }}
                        title="Click to set count"
                        style={{ cursor: 'pointer' }}
                      >
                        {japaCount}
                      </div>
                      <div className="jp-t">of 108</div>
                    </div>
                    <button className="jp-b" onClick={() => setJapaCount((c) => c + 1)}>
                      +
                    </button>
                  </div>
                  <div className="jp-presets">
                    {[11, 21, 51, 108].map((n) => (
                      <button
                        key={n}
                        className={`jp-p ${japaCount === n ? 'on' : ''}`}
                        onClick={() => setJapaCount(n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sankalpa Section — Dynamic from Admin Panel */}
            {hasSankalpa && (
              <>
                {(guideData?.sankalpaTitle || guideData?.sankalpaSubtitle) && (
                  <>
                    <div className="sh" id="sankalp">
                      <span className="sh-p">+</span>
                      {guideData?.sankalpaTitle && <span className="sh-t">{guideData.sankalpaTitle}</span>}
                    </div>
                    {guideData?.sankalpaSubtitle && (
                      <p
                        className="sh-s"
                        dangerouslySetInnerHTML={{ __html: cleanHtmlString(guideData.sankalpaSubtitle) }}
                      />
                    )}
                  </>
                )}

                <div className="sank" id={!guideData?.sankalpaTitle ? 'sankalp' : undefined}>
                  {guideData?.sankalpaInstruction && (
                    <div
                      className="sank-h"
                      dangerouslySetInnerHTML={{ __html: cleanHtmlString(guideData.sankalpaInstruction) }}
                    />
                  )}
                  <div className="sank-b">
                    {guideData?.sankalpaText && (
                      <p
                        className="sank-dev"
                        dangerouslySetInnerHTML={{ __html: cleanHtmlString(guideData.sankalpaText) }}
                      />
                    )}
                    {guideData?.sankalpaMeaning && (
                      <p
                        className="sank-r"
                        dangerouslySetInnerHTML={{ __html: cleanHtmlString(guideData.sankalpaMeaning) }}
                      />
                    )}
                    {guideData?.sankalpaExplanation && (
                      <p
                        className="sank-m"
                        dangerouslySetInnerHTML={{ __html: cleanHtmlString(guideData.sankalpaExplanation) }}
                      />
                    )}
                    {sankalpaCards.length > 0 && (
                      <div className="sank-g">
                        {sankalpaCards.map((card, idx) => (
                          <div className="sg" key={idx}>
                            <div className="sg-k">{card.k}</div>
                            <div className="sg-v" dangerouslySetInnerHTML={{ __html: cleanHtmlString(card.v) }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {(guideData?.sankalpaNoteHeading || guideData?.sankalpaNoteContent) && (
                    <p className="sank-note">
                      {guideData?.sankalpaNoteHeading && (
                        <b
                          dangerouslySetInnerHTML={{ __html: cleanHtmlString(guideData.sankalpaNoteHeading) }}
                        />
                      )}
                      {guideData?.sankalpaNoteContent && (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: cleanHtmlString(guideData.sankalpaNoteContent),
                          }}
                        />
                      )}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Vrat Katha Card — Dynamic from Admin Panel */}
            {hasKatha && (
              <>
                {(guideData?.kathaTitle || guideData?.kathaSubtitle) && (
                  <>
                    <div className="sh" id="katha">
                      <span className="sh-p">+</span>
                      {guideData?.kathaTitle && <span className="sh-t">{guideData.kathaTitle}</span>}
                    </div>
                    {guideData?.kathaSubtitle && <p className="sh-s">{guideData.kathaSubtitle}</p>}
                  </>
                )}

                <div className="katha" id={!guideData?.kathaTitle ? 'katha' : undefined}>
                  {(guideData?.kathaScripturalReference || guideData?.kathaHeadline || guideData?.kathaIntroduction) && (
                    <div className="k-top">
                      {guideData?.kathaScripturalReference && (
                        <div className="k-l">{guideData.kathaScripturalReference.toUpperCase()}</div>
                      )}
                      {guideData?.kathaHeadline && <div className="k-t">{guideData.kathaHeadline}</div>}
                      {guideData?.kathaIntroduction && <p className="k-s">{guideData.kathaIntroduction}</p>}
                    </div>
                  )}
                  <div className="k-b">
                    {kathaCards.length > 0 && (
                      <div className="k-beats">
                        {kathaCards.map((card, idx) => (
                          <div className="kb" key={idx}>
                            <div className="kb-n">{card.cardNumber}</div>
                            <div className="kb-t">{card.cardTitle}</div>
                            <p className="kb-s">{card.cardDescription}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="k-f">
                      {guideData?.kathaSupportingExplanation && (
                        <p
                          className="k-moral"
                          dangerouslySetInnerHTML={{ __html: guideData.kathaSupportingExplanation }}
                        />
                      )}
                      {guideData?.kathaAudio && (
                        <button
                          className="k-audio"
                          onClick={() => window.open(guideData.kathaAudio, '_blank')}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ flexShrink: 0 }}
                          >
                            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                          </svg>
                          <span>{joinTruthy([guideData?.kathaAudioButtonText || 'Listen', guideData?.kathaAudioDuration])}</span>
                        </button>
                      )}
                      {guideData?.kathaFullKathaLink && (
                        <button className="k-c" onClick={() => window.open(guideData.kathaFullKathaLink, '_blank')}>
                          {guideData?.kathaFullKathaButtonText
                            ? guideData.kathaFullKathaButtonText.includes('›')
                              ? guideData.kathaFullKathaButtonText
                              : `${guideData.kathaFullKathaButtonText} ›`
                            : 'Read the full katha ›'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Festival Context Section — Dynamic from Admin Panel */}
            {hasFestivalContext && (
              <>
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">{guideData.festivalContextTitle}</span>
                </div>
                {guideData?.festivalContextIntroduction && <p className="p">{guideData.festivalContextIntroduction}</p>}
                {guideData?.festivalContextDetails && (
                  <p className="p" dangerouslySetInnerHTML={{ __html: guideData.festivalContextDetails }} />
                )}
                {(guideData?.festivalPracticeCategory ||
                  guideData?.category ||
                  guideData?.festivalClassification ||
                  guideData?.classification) && (
                    <div className="tagrow">
                      {(guideData?.festivalPracticeCategory || guideData?.category) && (
                        <span className="pill d">
                          {joinTruthy([
                            (guideData?.festivalPracticeCategory || guideData?.category)?.toUpperCase(),
                            guideData?.festivalPracticeRating || guideData?.rating,
                          ])}
                        </span>
                      )}
                      {(guideData?.festivalClassification || guideData?.classification) && (
                        <span className="badge shastra">
                          {(guideData?.festivalClassification || guideData?.classification)?.toUpperCase()}
                        </span>
                      )}
                    </div>
                  )}
                {guideData?.sandhiPujaInformation && <p className="p">{guideData.sandhiPujaInformation}</p>}
                <div className="hr"></div>
              </>
            )}

            {/* Nine Days Table — Purely Dynamic from Admin Panel */}
            {nineDays.length > 0 && (
              <>
                {guideData?.nineDaysTitle && (
                  <div className="sh">
                    <span className="sh-p">+</span>
                    <span className="sh-t">{guideData.nineDaysTitle}</span>
                  </div>
                )}

                <div className="days" style={{ marginTop: '16px' }}>
                  <div className="dh">
                    <span>DAY</span>
                    <span>DATE</span>
                    <span>DEVI FORM &amp; SIGNIFICANCE</span>
                    <span>COLOUR</span>
                    <span>OFFERING</span>
                  </div>

                  {nineDays.map((item: any, idx: number) => {
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
            )}

            {/* Samagri Checklist Section — Purely Dynamic from Admin Panel */}
            {hasSamagri && (
              <>
                <div className="sh" id="samagri">
                  <span className="sh-p">+</span>
                  {guideData?.samagriTitle && <span className="sh-t">{guideData.samagriTitle}</span>}
                </div>
                {guideData?.samagriSubtitle && <p className="sh-s">{guideData.samagriSubtitle}</p>}

                <div className="sam">
                  {samagriList.map((s: any, idx: number) => {
                    const itemName = s.item || s.itemName || s.name || '';
                    const itemNote = s.note || s.itemDetails || s.details || '';
                    return (
                      <div className="sam-r" key={s.id || idx}>
                        <span className="sam-i">
                          ▫ {itemName}
                        </span>

                        <span className="sam-n">
                          {itemNote}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="hr"></div>
              </>
            )}

            {/* Fasting Section — Purely Dynamic from Admin Panel */}
            {hasFasting && (
              <>
                <div className="sh" id="fast">
                  <span className="sh-p">+</span>
                  {guideData?.fastingTitle && <span className="sh-t">{guideData.fastingTitle}</span>}
                </div>
                {guideData?.fastingSubtitle && <p className="sh-s">{guideData.fastingSubtitle}</p>}

                <div className="fast">
                  {fastingOptions.map((opt, idx) => (
                    <div className="fb" key={idx}>
                      <div className="fb-t">{opt.title}</div>
                      <p className="fb-s" dangerouslySetInnerHTML={{ __html: cleanHtmlString(opt.description) }} />
                    </div>
                  ))}
                </div>
                {(guideData?.fastingGuidanceHeading || guideData?.fastingGuidanceContent) && (
                  <div className="fnote">
                    {guideData?.fastingGuidanceHeading && <b>{guideData.fastingGuidanceHeading} </b>}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: cleanHtmlString(guideData.fastingGuidanceContent),
                      }}
                    />
                  </div>
                )}

                <div className="hr"></div>
              </>
            )}

            {/* Myths & Facts — Purely Dynamic from Admin Panel */}
            {hasMyths && (
              <>
                <div className="sh" id="myths">
                  <span className="sh-p">+</span>
                  {guideData?.mythsTitle && <span className="sh-t">{guideData.mythsTitle}</span>}
                </div>

                {mythsList.map((m: any, idx: number) => {
                  const statement = m.mythStatement || m.statement || m.myth || m.question || '';
                  const label = m.correctionLabel || m.label || m.badge || '';
                  const content = m.correctionContent || m.content || m.answer || m.correction || '';

                  return (
                    <div className="myth" key={m.id || idx}>
                      <div className="my-q">
                        <span className="my-qt">{statement}</span>
                        {label && <span className="my-bd">{label}</span>}
                      </div>
                      <p className="my-a" dangerouslySetInnerHTML={{ __html: cleanHtmlString(content) }} />
                    </div>
                  );
                })}
              </>
            )}

            {/* Intelligence Layer — Dynamic from Admin Panel */}
            {hasIntel && (
              <div className="intel">
                {guideData?.intelTagline && <div className="in-l">{guideData.intelTagline}</div>}
                {guideData?.intelHeading && <div className="in-t">{guideData.intelHeading}</div>}
                {(guideData?.intelBody || guideData?.intelSummary) && (
                  <p className="in-s">{guideData?.intelBody || guideData?.intelSummary}</p>
                )}
                {guideData?.intelCtaLink && guideData?.intelCtaText && (
                  <Link href={guideData.intelCtaLink} className="in-c">
                    {guideData.intelCtaText}
                  </Link>
                )}
              </div>
            )}

            {/* Poetic Closing — Dynamic from Admin Panel */}
            {guideData?.closingContent && (
              <div className="closing" dangerouslySetInnerHTML={{ __html: guideData.closingContent }} />
            )}

            {/* Related Grid — Purely Dynamic from Admin Panel */}
            {hasRelatedItems && (
              <>
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">{guideData?.relatedSectionTitle || guideData?.relatedTitle || 'Related'}</span>
                </div>

                <div className="relgrid">
                  {relatedData.guides.length > 0 && (
                    <div className="rel">
                      <div className="rel-h">{guideData?.relatedGuidesHeading || 'RELATED RITUAL GUIDES'}</div>
                      {relatedData.guides.map((item: any, idx: number) => (
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

                  {relatedData.pujans.length > 0 && (
                    <div className="rel">
                      <div className="rel-h">{guideData?.relatedPujansHeading || 'RELATED PUJANS'}</div>
                      {relatedData.pujans.map((item: any, idx: number) => (
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

                  {relatedData.concepts.length > 0 && (
                    <div className="rel">
                      <div className="rel-h">{guideData?.relatedConceptsHeading || 'RELATED CONCEPTS'}</div>
                      {relatedData.concepts.map((item: any, idx: number) => (
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

                  {relatedData.dates.length > 0 && (
                    <div className="rel">
                      <div className="rel-h">{guideData?.relatedDatesHeading || 'RELATED DATES'}</div>
                      {relatedData.dates.map((item: any, idx: number) => (
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
            )}
          </div>

          {/* Sticky Sidebar */}
          <aside className="side">
            {guideData?.secondaryButtonText && (
              <button className="sbcta dk" onClick={() => setIsCardModalOpen(true)}>
                <span className="sb-ci">↓</span>
                <span className="sb-ct">{guideData.secondaryButtonText}</span>
              </button>
            )}

            {/* Samagri Checklist Sidebar Box — mirrors the API-sourced samagri list, not a static one */}
            {hasSamagri && (
              <div className="sb">
                <div className="sb-h">
                  <span>{guideData?.samagriTitle || 'Samagri checklist'}</span>
                  <span className="sb-c">
                    {Object.values(checkedSamagri).filter(Boolean).length} / {samagriList.length}
                  </span>
                </div>
                {samagriList.map((s: any, idx: number) => {
                  const itemName = s.item || s.itemName || s.name || '';
                  return (
                    <div className="sb-i" key={s.id || idx}>
                      <input
                        type="checkbox"
                        className="cb"
                        checked={!!checkedSamagri[idx]}
                        onChange={() => toggleSamagri(idx)}
                      />
                      <span style={{ textDecoration: checkedSamagri[idx] ? 'line-through' : 'none' }}>{itemName}</span>
                    </div>
                  );
                })}
                <div className="sb-act">
                  <button className="sb-dl" onClick={handleDownloadSamagriPdf}>
                    Download
                  </button>
                </div>
              </div>
            )}

            {(guideData?.classification || guideData?.rating) && (
              <div className="sbn">
                <div className="sbn-h">WHAT THE BADGE MEANS</div>
                <p className="sbn-t">
                  {joinTruthy([guideData?.classification, guideData?.rating ? `${guideData.rating}` : null])}
                  {guideData?.sotScripturalSource ? ` — ${guideData.sotScripturalSource}` : ''}
                </p>
                <Link href="/editorial-method" className="sbn-c">
                  How we decide what is true ›
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Sticky Bottom Bar — only once we actually have a title and a download action */}
      {guideData?.secondaryButtonText && (
        <div className={`dsticky ${showStickyBar ? 'on' : ''}`}>
          <div className="ds-in">
            <div>
              <div className="ds-t">{heroTitle}</div>
              {guideData?.guideSubtitle && <div className="ds-s">{guideData.guideSubtitle}</div>}
            </div>
            <div className="ds-b">
              <button className="ds-btn card" onClick={() => setIsCardModalOpen(true)}>
                {guideData.secondaryButtonText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ritual Card Modal */}
      <RitualCardModal isOpen={isCardModalOpen} onClose={() => setIsCardModalOpen(false)} slug={slug} title={heroTitle} />
    </div>
  );
}