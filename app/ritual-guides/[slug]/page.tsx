'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateArticleJsonLd, generateFaqJsonLd } from '@/lib/seo';
import { generateGuidePdfHtml } from '@/lib/pdf-generator';
import BeginnerGuideDetailView from '@/components/BeginnerGuideDetail/BeginnerGuideDetailView';
import { useCart } from '@/context/CartContext';
import { resolveKitForGuide } from '@/lib/products';
import './ritual-guide.css';

const RitualCardModal = dynamic(() => import('@/components/RitualCard/RitualCardModal'), { ssr: false });

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

  const { addItem, openCart } = useCart();

  const handleBuyKit = () => {
    const kit = resolveKitForGuide(slug);
    addItem({
      id: kit.id,
      slug: kit.slug,
      name: kit.name,
      price: kit.price,
      quantity: 1,
    });
    openCart();
  };

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
    if (parsed && parsed.length > 0) {
      return parsed.map((c: any) => ({
        k: c.k || c.key || c.title || '',
        v: c.v || c.value || c.date || '',
        s: c.s || c.sub || c.subtitle || '',
      }));
    }
    return [
      { k: 'GHATASTHAPANA MUHURAT', v: '06:15 AM – 07:22 AM', s: 'OCT 3, 2024 (PRATIPADA)' },
      { k: 'ABHIJIT MUHURAT', v: '11:46 AM – 12:33 PM', s: 'OCT 3, 2024' },
      { k: 'KALASH STHAPANA TITHI', v: 'PRATIPADA TITHI STARTS', s: 'OCT 3, 12:18 AM' },
      { k: 'KANYA PUJA TITHI', v: 'NAVAMI TITHI', s: 'OCT 11, 2024' },
    ];
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

  const relatedData = useMemo(() => {
    const parsedGuides = safeParseJson<any[]>(guideData?.relatedRitualGuidesJson);
    const parsedPujans = safeParseJson<any[]>(guideData?.relatedPujansJson);
    const parsedConcepts = safeParseJson<any[]>(guideData?.relatedConceptsJson);
    const parsedDates = safeParseJson<any[]>(guideData?.relatedDatesJson);

    return {
      guides:
        parsedGuides && parsedGuides.length > 0
          ? parsedGuides
          : [
              { title: 'Dussehra / Vijayadashami', subtitle: 'The tenth day · 20 October', tag: 'CALENDAR', link: '/ritual-guides/dussehra' },
              { title: 'Durga Ashtami', subtitle: 'The most intensive of the nine', tag: 'DEITY', link: '/ritual-guides/durga-ashtami' },
            ],
      pujans:
        parsedPujans && parsedPujans.length > 0
          ? parsedPujans
          : [
              { title: 'Navratri Ghatasthapana', subtitle: 'Bookable · purohit performs the sthapana', link: '/pujans/navratri-ghatasthapana' },
              { title: 'Durga Puja', subtitle: 'The Bengali observance form', link: '/pujans/durga-puja' },
            ],
      concepts:
        parsedConcepts && parsedConcepts.length > 0
          ? parsedConcepts
          : [
              { title: 'What Is Navratri?', subtitle: 'The three gunas across nine nights', link: '/dharmic-concepts/what-is-navratri' },
            ],
      dates:
        parsedDates && parsedDates.length > 0
          ? parsedDates
          : [
              { title: 'Sharad Navratri 2026 Panchang', subtitle: 'Every tithi boundary, day by day', link: '/panchang/vrat-calendar/sharad-navratri' },
              { title: 'Ashwin month panchang', subtitle: 'The full month', link: '/panchang/ashwin' },
            ],
    };
  }, [
    guideData?.relatedRitualGuidesJson,
    guideData?.relatedPujansJson,
    guideData?.relatedConceptsJson,
    guideData?.relatedDatesJson,
  ]);

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

  const { data: session } = useSession();

  const handleDownloadPdf = (pdfMode: 'full' | 'samagri' = 'full') => {
    const activeUserName = session?.user?.name || session?.user?.email || 'Valued Practitioner';
    const guideTitle = guideData?.title || guideData?.guideTitle || formattedTitle || 'Ritual Guide';
    const rawDesc = guideData?.guideSubtitle || guideData?.storyIntroduction || '';
    const guideDesc = rawDesc.replace(/<[^>]*>/g, '').trim();

    const formattedSamagri = samagriList.map((s: any) => ({
      itemName: (s.item || s.itemName || s.name || '').replace(/<[^>]*>/g, ''),
      itemDetails: (s.note || s.itemDetails || s.details || '').replace(/<[^>]*>/g, ''),
    }));

    const formattedMyths = mythsList.map((m: any) => ({
      myth: (m.myth || m.mythStatement || m.statement || '').replace(/<[^>]*>/g, ''),
      correction: (m.correction || m.correctionContent || m.content || '').replace(/<[^>]*>/g, ''),
    }));

    const htmlContent = generateGuidePdfHtml({
      title: guideTitle,
      subtitle: guideDesc,
      category: guideData?.category || 'RITUAL GUIDE',
      userName: activeUserName,
      mode: pdfMode,
      sotCard: {
        heading: guideData?.sotSectionHeading,
        claim: guideData?.sotPracticeTitle,
        source: guideData?.sotScripturalSource,
      },
      storyText: guideData?.storyContent || guideData?.storyIntroduction,
      sankalpaText: guideData?.sankalpaText,
      sankalpaMeaning: guideData?.sankalpaMeaning,
      sankalpaCards: sankalpaCards,
      vidhiDays: vidhiDays.map((d: any) => ({
        dayTitle: d.dayTitle || d.title || `Day ${d.dayNumber || 1}`,
        steps: (d.steps || []).map((step: any) => (typeof step === 'string' ? step : step.text || '')),
      })),
      samagriItems: formattedSamagri,
      fastingOptions: fastingOptions,
      mythsList: formattedMyths,
    });

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleDownloadSamagriPdf = () => handleDownloadPdf('samagri');


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

  const heroTitle = guideData?.guideTitle || guideData?.title || formattedTitle;

  const faqSchemaData = useMemo(() => {
    const items = mythsList.map((m: any) => ({
      question: m.myth || m.mythStatement || '',
      answer: m.correction || m.correctionContent || '',
    })).filter((item: any) => item.question && item.answer);
    return generateFaqJsonLd(items);
  }, [mythsList]);

  const articleSchemaData = useMemo(() => {
    return generateArticleJsonLd({
      title: heroTitle,
      slug: slug,
      sectionPath: 'ritual-guides',
      description: guideData?.guideSubtitle || guideData?.storyIntroduction || heroTitle,
      image: guideData?.storyImage || undefined,
      updatedAt: guideData?.updatedAt,
      createdAt: guideData?.createdAt,
    });
  }, [heroTitle, slug, guideData]);

  if (isBeginnerGuide) {
    if (typeof window !== 'undefined') {
      window.location.href = `/beginner-guides/${slug}`;
    }
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F5EE' }}>
        <div style={{ color: '#DE1B59', fontWeight: 700, fontSize: '15px' }}>Loading Beginner Guide...</div>
      </div>
    );
  }

  return (
    <div className="rg-detail-root w-full max-w-full overflow-x-hidden min-h-screen">
      <JsonLd data={articleSchemaData} />
      <JsonLd data={faqSchemaData} />
      {/* Breadcrumb */}

      <Breadcrumb
        items={[
          { label: 'Ritual Guides', href: '/ritual-guides' },
          ...(guideData?.category ? [{ label: guideData.category, href: '/ritual-guides' }] : []),
          { label: heroTitle },
        ]}
      />


      {/* Hero Section main banner of Ritua detail page */}
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
                  <button
                    type="button"
                    className="hb-p"
                    onClick={() => {
                      const text = (guideData.primaryButtonText || '').toLowerCase();
                      const target = guideData.primaryButtonTarget || '';
                      if (target.startsWith('#')) {
                        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        handleBuyKit();
                      }
                    }}
                  >
                    {guideData.primaryButtonText}
                  </button>
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
                <button className="hb-g" onClick={() => handleDownloadPdf('full')}>
                  📥 Download PDF Guide
                </button>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Jump-to Chips Bar — only for sections that actually have content */}
      {/* Jump-to Chips Bar — only for sections that actually have content */}
      {(hasPanchang || hasStory || hasSankalpa || hasVidhi || hasKatha || hasSamagri || hasFasting || hasMyths) && (
        <div className="chips">
          <div className="chips-in">
            <span className="chip-l">JUMP TO</span>
            {hasPanchang && <a className="chip" href="#panchang">📅 Panchang</a>}
            {hasStory && <a className="chip" href="#story">📖 The story</a>}
            {hasVidhi && <a className="chip" href="#vidhi">🪔 Vidhi</a>}
            {mantraData.hasMantra && <a className="chip" href="#mantra">☸ Mantra</a>}
            {hasSankalpa && <a className="chip" href="#sankalp">✋ Sankalpa</a>}
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
              <div className="cc w-full max-w-full overflow-hidden">
                <div className="cc-h flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-[var(--border-light)]">
                  {guideData?.sotSectionHeading && (
                    <span className="cc-hl text-[11px] font-bold tracking-wider text-[var(--sub-text)] uppercase break-words min-w-0">
                      {guideData.sotSectionHeading}
                    </span>
                  )}
                  {guideData?.sotButtonTarget && (
                    <Link href={guideData.sotButtonTarget} className="cc-hr text-xs font-bold text-[var(--pink)] hover:underline ml-auto shrink-0">
                      {guideData?.sotButtonText
                        ? guideData.sotButtonText.includes('›')
                          ? guideData.sotButtonText
                          : `${guideData.sotButtonText} ›`
                        : 'Read source ›'}
                    </Link>
                  )}
                </div>
                <div className="cc-b p-4 sm:p-5 w-full max-w-full">
                  {guideData?.sotPracticeLabel && (
                    <div className="cc-core text-[11px] font-bold tracking-wider text-[var(--gold)] uppercase mb-1.5 break-words">
                      {guideData.sotPracticeLabel}
                    </div>
                  )}
                  {guideData?.sotPracticeTitle && (
                    <h3 className="cc-claim text-base sm:text-lg font-bold text-[var(--dark)] leading-snug mb-3 break-words">
                      {guideData.sotPracticeTitle}
                    </h3>
                  )}
                  <div className="cc-row flex flex-wrap items-center gap-2 w-full max-w-full">
                    {(guideData?.sotPracticeCategory || guideData?.category) && (
                      <span className="pill d text-[11px] font-bold px-2.5 py-1 rounded-md max-w-full break-words">
                        {joinTruthy([
                          (guideData?.sotPracticeCategory || guideData?.category)?.toUpperCase(),
                          guideData?.sotPracticeRating || guideData?.rating,
                        ])}
                      </span>
                    )}
                    {(guideData?.sotPracticeClassification || guideData?.classification) && (
                      <span className="badge puranic text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-md max-w-full break-words">
                        {(guideData?.sotPracticeClassification || guideData?.classification)?.toUpperCase()}
                      </span>
                    )}
                    {guideData?.sotScripturalSource && (
                      <span className="pill src text-[11px] font-semibold px-2.5 py-1 rounded-md max-w-full break-words">
                        {joinTruthy([guideData.sotScripturalSource, guideData?.sotParentScripture])}
                      </span>
                    )}
                  </div>
                </div>
                {(guideData?.sotCorePracticesCount != null ||
                  guideData?.sotScripturalElementsCount != null ||
                  guideData?.sotRegionalCustomsCount != null ||
                  guideData?.sotCorrectionsCount != null) && (
                    <p className="cc-comp text-xs text-[var(--sub-text)] leading-relaxed p-3 sm:p-4 border-t border-[var(--border-light)] bg-[#FCFAF6] m-0 break-words">
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
              <div className="pan" id="panchang">
                <div className="pan-h">
                  <span className="pan-hl">
                    📅 {guideData?.festivalName ? guideData.festivalName.toUpperCase() : 'PANCHANG FOR NAVRATRI 2024 (MUMBAI)'}
                  </span>
                  <span className="pan-hr">
                    {guideData?.panchangLocation || guideData?.panchangSource || 'MUMBAI, INDIA · DRIK PANCHANG'}
                  </span>
                </div>
                <div className="pan-g">
                  {panchangCards.map((card, idx) => (
                    <div className="pc" key={`pan-${slug}-${card.k || idx}-${idx}`}>
                      <div className="pc-k">{card.k}</div>
                      <div className="pc-v">{card.v}</div>
                      <div className="pc-s">{card.s}</div>
                    </div>
                  ))}
                </div>
                <p className="pan-n">
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        guideData?.panchangNote ||
                        '<b>Muhurat timings are calculated for Mumbai, India (18.9220° N, 72.8347° E).</b> Adjust by +12 mins for Delhi, -8 mins for Kolkata.',
                    }}
                  />
                </p>
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

            {/* Image Banner */}
            <figure className="art">
              <img
                src={
                  guideData?.storyImage ||
                  'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1200&auto=format&fit=crop'
                }
                alt={guideData?.storyImageAltText || heroTitle}
                style={{ maxHeight: '420px', width: '100%', objectFit: 'cover' }}
              />
              <figcaption>
                {guideData?.storyImageCaption ||
                  'Ghatasthapana signifies the invocation of Goddess Durga into the sacred Kalash.'}
              </figcaption>
            </figure>

            {/* Vidhi Days & Steps — Purely Dynamic from Admin Panel */}
            {vidhiDays.map((day: any, dIdx: number) => {
              const dayNum = day.dayNumber || dIdx + 1;
              const steps = Array.isArray(day.steps) ? day.steps : [];
              return (
                <div key={`vday-${slug}-${day.id || day.dayNumber || dIdx}-${dIdx}`}>
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
                      <div className="step" key={`step-${slug}-d${dayNum}-${st.id || sIdx}-${sIdx}`}>
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
                                  key={`lbl-${slug}-d${dayNum}-s${sIdx}-${lbl}-${lIdx}`}
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
                        key={`japa-${slug}-${n}`}
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
                          <div className="sg" key={`sank-${slug}-${card.k || idx}-${idx}`}>
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

                <div className="katha w-full max-w-full overflow-hidden" id={!guideData?.kathaTitle ? 'katha' : undefined}>
                  {(guideData?.kathaScripturalReference || guideData?.kathaHeadline || guideData?.kathaIntroduction) && (
                    <div className="k-top p-4 sm:p-7 w-full max-w-full">
                      {guideData?.kathaScripturalReference && (
                        <div className="k-l break-words">{guideData.kathaScripturalReference.toUpperCase()}</div>
                      )}
                      {guideData?.kathaHeadline && <div className="k-t break-words">{guideData.kathaHeadline}</div>}
                      {guideData?.kathaIntroduction && <p className="k-s break-words">{guideData.kathaIntroduction}</p>}
                    </div>
                  )}
                  <div className="k-b p-4 sm:p-6 w-full max-w-full">
                    {kathaCards.length > 0 && (
                      <div className="k-beats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4.5 w-full max-w-full">
                        {kathaCards.map((card, idx) => (
                          <div className="kb min-w-0 w-full break-words" key={`katha-${slug}-${card.cardNumber || idx}-${idx}`}>
                            <div className="kb-n shrink-0">{card.cardNumber}</div>
                            <div className="kb-t break-words">{card.cardTitle}</div>
                            <p className="kb-s break-words">{card.cardDescription}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="k-f flex flex-wrap items-center gap-3 sm:gap-4 pt-4 border-t border-[var(--border-light)] w-full max-w-full">
                      {guideData?.kathaSupportingExplanation && (
                        <p
                          className="k-moral flex-1 min-w-[200px] break-words"
                          dangerouslySetInnerHTML={{ __html: guideData.kathaSupportingExplanation }}
                        />
                      )}
                      {guideData?.kathaAudio && (
                        <button
                          className="k-audio shrink-0 max-w-full whitespace-normal"
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
                        <button className="k-c shrink-0 max-w-full whitespace-normal" onClick={() => window.open(guideData.kathaFullKathaLink, '_blank')}>
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
                      <div className="dr" key={`nine-${slug}-${item.id || item.n || item.day || idx}-${idx}`}>
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
                      <div className="sam-r" key={`sam-${slug}-${s.id || s.item || idx}-${idx}`}>
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
                    <div className="fb" key={`fast-${slug}-${opt.title || idx}-${idx}`}>
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
                    <div className="myth" key={`myth-${slug}-${m.id || m.mythStatement || idx}-${idx}`}>
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
                        <Link href={item.link || item.url || '#'} className="rel-i" key={`relg-${slug}-${item.id || item.title || idx}-${idx}`}>
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
                        <Link href={item.link || item.url || '#'} className="rel-i" key={`relp-${slug}-${item.id || item.title || idx}-${idx}`}>
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
                        <Link href={item.link || item.url || '#'} className="rel-i" key={`relc-${slug}-${item.id || item.title || idx}-${idx}`}>
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
                        <Link href={item.link || item.url || '#'} className="rel-i" key={`reld-${slug}-${item.id || item.title || idx}-${idx}`}>
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

            {/* Prefer to have it all taken care of? Section */}
            <div className="sh" style={{ marginTop: '36px' }}>
              <span className="sh-p">+</span>
              <span className="sh-t">Prefer to have it all taken care of?</span>
            </div>

            <div className="rev">
              <div className="rev-c feat">
                <div className="rev-i">🪔</div>
                <div className="rev-l">RITUAL KIT</div>
                <div className="rev-t">Shakti Kit</div>
                <div className="rev-s">
                  Nine days of samagri in one box — kalash set, barley and pot, chunri, akhand jyoti vessel, Saptashati, puja powders and the Kanya Pujan items.
                </div>
                <button className="rev-b" onClick={handleBuyKit}>
                  Pre-book — ₹1,751
                </button>
              </div>

              <div className="rev-c live">
                <div className="rev-i">🙏</div>
                <div className="rev-l">PUROHIT &amp; PUJA</div>
                <div className="rev-t">Book a purohit for Ghatasthapana</div>
                <div className="rev-s">
                  Any devotee can perform the sthapana. A purohit adds muhurat precision and takes the procedure off your hands on a working Sunday morning.
                </div>
                <button className="rev-b pur" onClick={() => window.open('/pujans/navratri-ghatasthapana', '_self')}>
                  Check availability ›
                </button>
              </div>

              <div className="rev-c live">
                <div className="rev-i">💬</div>
                <div className="rev-l" style={{ color: '#16A34A' }}>THE TAPA CIRCLE</div>
                <div className="rev-t">Never miss a date again</div>
                <div className="rev-s">
                  Festival and vrat reminders on WhatsApp, with the guide attached and the kit cut-off if there is one. ₹499 a year.
                </div>
                <button className="rev-b wa" onClick={() => window.open('/tapa-circle', '_self')}>
                  Join the Tapa Circle ›
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <aside className="side">
            {/* ALSO AVAILABLE Sidebar Box */}
            <div className="sba">
              <div className="sba-h">
                <span className="sba-hl">🔥 ALSO AVAILABLE</span>
                <span className="sba-bd">DUMMY</span>
              </div>
              <p className="sba-t">
                A plain-language version of this ritual — no citations, no Sanskrit to look up.
              </p>
              <Link href={`/beginner-guides/${slug}`} className="sba-btn block text-center">
                Navratri Beginner&apos;s Guide
              </Link>
            </div>

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
                    <div className="sb-i" key={`side-sam-${slug}-${s.id || s.item || idx}-${idx}`}>
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