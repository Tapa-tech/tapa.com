'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export interface StoryItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  image?: string;
  imageAltText?: string;
  imageCaption?: string;
  displayOrder?: number;
}

export interface GalleryItem {
  id: string;
  image: string;
  altText?: string;
  caption?: string;
  displayOrder?: number;
}

export interface MythItem {
  id?: string;
  mythStatement?: string;
  myth?: string;
  correctionLabel?: string;
  correctionContent?: string;
  correction?: string;
  displayOrder?: number;
}

export interface RelatedItem {
  id: string;
  title: string;
  description?: string;
  link?: string;
  target?: string;
  displayOrder?: number;
}

export interface DynamicConceptData {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary?: string | null;
  body: string;
  status: string;

  bannerEyebrow?: string | null;
  bannerRating?: string | null;
  bannerClassification?: string | null;
  bannerTitle?: string | null;
  bannerDescription?: string | null;
  bannerPrimaryCtaText?: string | null;
  bannerPrimaryCtaLink?: string | null;
  bannerSecondaryCtaText?: string | null;
  bannerSecondaryCtaLink?: string | null;
  bannerShareButtonText?: string | null;

  threeStoriesTitle?: string | null;
  threeStoriesIntro?: string | null;
  threeStoriesSupportingText?: string | null;
  stories: StoryItem[];
  gallery: GalleryItem[];
  threeStoriesCaption?: string | null;

  shareSectionHeading?: string | null;
  shareSharedContent?: string | null;
  shareNotSharedContent?: string | null;
  shareHighlightStatement?: string | null;
  shareSupportingDescription?: string | null;
  shareTraditionTag?: string | null;

  mythsSectionHeading?: string | null;
  myths: MythItem[];
  reframeLabel?: string | null;
  reframeContent?: string | null;

  relatedRituals: RelatedItem[];
  relatedPujans: RelatedItem[];
  relatedConcepts: RelatedItem[];
  relatedDates: RelatedItem[];
}

interface PageProps {
  params: {
    slug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

function parseConceptData(raw: Record<string, unknown>): DynamicConceptData {
  const parseJson = (val: unknown) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  return {
    id: (raw.id as string) || '',
    title: (raw.title as string) || '',
    slug: (raw.slug as string) || '',
    category: (raw.category as string) || 'General',
    summary: (raw.summary as string) || null,
    body: typeof raw.body === 'string' ? raw.body : '',
    status: (raw.status as string) || 'PUBLISHED',
    bannerEyebrow: (raw.bannerEyebrow as string) || null,
    bannerRating: (raw.bannerRating as string) || null,
    bannerClassification: (raw.bannerClassification as string) || null,
    bannerTitle: (raw.bannerTitle as string) || null,
    bannerDescription: (raw.bannerDescription as string) || null,
    bannerPrimaryCtaText: (raw.bannerPrimaryCtaText as string) || null,
    bannerPrimaryCtaLink: (raw.bannerPrimaryCtaLink as string) || null,
    bannerSecondaryCtaText: (raw.bannerSecondaryCtaText as string) || null,
    bannerSecondaryCtaLink: (raw.bannerSecondaryCtaLink as string) || null,
    bannerShareButtonText: (raw.bannerShareButtonText as string) || null,
    threeStoriesTitle: (raw.threeStoriesTitle as string) || null,
    threeStoriesIntro: (raw.threeStoriesIntro as string) || null,
    threeStoriesSupportingText: (raw.threeStoriesSupportingText as string) || null,
    stories: parseJson(raw.stories || raw.storiesItemsJson),
    gallery: parseJson(raw.gallery || raw.threeStoriesGalleryJson),
    threeStoriesCaption: (raw.threeStoriesCaption as string) || null,
    shareSectionHeading: (raw.shareSectionHeading as string) || null,
    shareSharedContent: (raw.shareSharedContent as string) || null,
    shareNotSharedContent: (raw.shareNotSharedContent as string) || null,
    shareHighlightStatement: (raw.shareHighlightStatement as string) || null,
    shareSupportingDescription: (raw.shareSupportingDescription as string) || null,
    shareTraditionTag: (raw.shareTraditionTag as string) || null,
    mythsSectionHeading: (raw.mythsSectionHeading as string) || null,
    myths: parseJson(raw.myths || raw.mythsItemsJson),
    reframeLabel: (raw.reframeLabel as string) || null,
    reframeContent: (raw.reframeContent as string) || null,
    relatedRituals: parseJson(raw.relatedRituals || raw.relatedRitualGuidesJson),
    relatedPujans: parseJson(raw.relatedPujans || raw.relatedPujansJson),
    relatedConcepts: parseJson(raw.relatedConcepts || raw.relatedConceptsJson),
    relatedDates: parseJson(raw.relatedDates || raw.relatedDatesJson),
  };
}

function formatTitleFromSlug(slug: string): string {
  if (!slug) return 'Dharmic Concept';
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function createFallbackConcept(slug: string): DynamicConceptData {
  const formattedTitle = formatTitleFromSlug(slug);
  const isBilva = slug?.toLowerCase().includes('bilva') || slug?.toLowerCase().includes('bael');

  if (isBilva) {
    return {
      id: 'bilva-leaf',
      title: 'Bilva (Bael) Leaf in Shiva Worship',
      slug: slug || 'bilva',
      category: 'Materials',
      summary: 'The sacred Trifoliate leaf representing the Trinity (Brahma, Vishnu, Shiva) and the three Gunas (Sattva, Rajas, Tamas) offered to Lord Shiva.',
      body: 'The Bilva leaf holds paramount importance in Shiv Pujan...',
      status: 'PUBLISHED',
      bannerEyebrow: 'DHARMIC CONCEPTS · MATERIALS',
      bannerRating: '5/5',
      bannerClassification: 'PURANIC & VEDIC',
      bannerTitle: 'Bilva (Bael) Leaf in Shiva Worship',
      bannerDescription: 'Understanding the scriptural significance, spiritual symbolism, and correct ritual guidelines for offering Bilva leaves to Lord Shiva.',
      bannerPrimaryCtaText: 'Read scriptural guide',
      bannerSecondaryCtaText: 'Save this concept',
      bannerShareButtonText: 'Share',

      threeStoriesTitle: 'Significance & Spiritual Symbolism',
      threeStoriesIntro: 'The Bilva leaf (Aegle marmelos) is considered deeply sacred in Shaivism. Scriptural texts such as the Shiva Purana and Bilvashtakam describe its unique spiritual qualities.',
      threeStoriesSupportingText: 'Offering even a single trifoliate Bilva leaf with devotion to a Shiva Linga is said to bestow immense spiritual merit and inner purity.',
      stories: [
        {
          id: '1',
          title: 'The Symbolism of the Three Leaflets',
          description: 'Why Bilva leaves are always offered in triplets.',
          content: 'The three leaflets of a Bilva leaf represent the three eyes of Lord Shiva (Trinetra), the three spear points of His Trishula, and the cosmic Trinity—Brahma, Vishnu, and Shiva. Spiritually, they symbolize the destruction of three types of karma: past, present, and future.',
        },
        {
          id: '2',
          title: 'The Origin in Shiva Purana',
          description: 'The divine origin of the Bilva tree.',
          content: 'According to the Vidyeshvara Samhita of the Shiva Purana, Goddess Parvati\'s sweat droplets fell upon Mount Mandara, giving rise to the Bilva tree. Thus, all manifestations of the Divine Mother are said to reside in different parts of the Bilva tree.',
        }
      ],
      gallery: [],
      threeStoriesCaption: 'Sacred Bilva trifoliate leaves prepared for Pujan.',

      shareSectionHeading: 'Rules & Guidelines for Offering',
      shareSharedContent: 'Bilva leaves should always be offered smooth side down touching the Shiva Linga. Ensure the leaves are intact and untorn.',
      shareNotSharedContent: 'Avoid offering dry, torn, or insect-eaten Bilva leaves. Bilva leaves never become stale (Basi) and can be washed and reused if fresh leaves are unavailable.',
      shareHighlightStatement: 'Devotion and purity of intent (Bhava) transcend external ritual perfection.',
      shareSupportingDescription: 'Scriptures emphasize that Lord Shiva is easily pleased (Ashutosh) when Bilva is offered with sincere devotion.',
      shareTraditionTag: 'SHIVA PURANA SCRIPTURE',

      mythsSectionHeading: 'Common Myths & Misconceptions',
      myths: [
        {
          id: '1',
          mythStatement: 'Plucking Bilva leaves on Mondays or Shivratri brings negative karma.',
          correctionLabel: 'SCRIPTURAL TRUTH',
          correctionContent: 'Plucking Bilva leaves should ideally be done before sunset and not on Chaturthi, Ashtami, Navami, Chaturdashi, or Mondays if avoidable. However, if plucked beforehand with respect and mantra chanting, they remain completely pure.',
        },
        {
          id: '2',
          mythStatement: 'Used Bilva leaves cannot be washed and re-offered under any circumstances.',
          correctionLabel: 'SCRIPTURAL TRUTH',
          correctionContent: 'According to ritual manuals, if fresh Bilva leaves are unavailable, previously offered leaves can be washed with clean water or Ganga Jal and re-offered with devotion.',
        }
      ],
      reframeLabel: 'THE REFRAME',
      reframeContent: 'Ritual rules around Bilva leaves are designed to cultivate reverence for nature and conscious awareness during worship, not fear.',

      relatedRituals: [
        { id: '1', title: 'Maha Shivratri Vidhi Guide', description: 'Step-by-step authentic puja procedure for Shivratri', link: '/ritual-guides/maha-shivratri' }
      ],
      relatedPujans: [],
      relatedConcepts: [
        { id: '1', title: 'Shiva Linga Abhishekam', description: 'Understanding the sacred bathing of Shiva Linga', link: '/dharmic-concepts/abhishekam' }
      ],
      relatedDates: []
    };
  }

  return {
    id: slug || 'concept',
    title: formattedTitle,
    slug: slug || '',
    category: 'General',
    summary: `Authentic scriptural perspective and guidelines on ${formattedTitle}.`,
    body: `Understanding the spiritual significance and ritual context of ${formattedTitle}.`,
    status: 'PUBLISHED',
    bannerEyebrow: 'DHARMIC CONCEPTS',
    bannerRating: '5/5',
    bannerClassification: 'SCRIPTURAL',
    bannerTitle: formattedTitle,
    bannerDescription: `Authentic scriptural guidance, spiritual meaning, and practical context for ${formattedTitle}.`,
    bannerPrimaryCtaText: 'Read guide',
    bannerSecondaryCtaText: 'Save this',
    bannerShareButtonText: 'Share',

    threeStoriesTitle: 'Key Spiritual Perspectives',
    threeStoriesIntro: `${formattedTitle} plays an important role in authentic dharmic practice and scriptural tradition.`,
    threeStoriesSupportingText: 'Rooted in classical Vedic and Puranic literature.',
    stories: [],
    gallery: [],
    threeStoriesCaption: null,

    shareSectionHeading: 'Scriptural Foundations',
    shareSharedContent: `Exploring the foundational tenets of ${formattedTitle}.`,
    shareNotSharedContent: null,
    shareHighlightStatement: 'Dharma emphasizes understanding and devotion over rigid fear.',
    shareSupportingDescription: 'Every sacred practice has a clear spiritual purpose described in scripture.',
    shareTraditionTag: 'CLASSICAL SCRIPTURE',

    mythsSectionHeading: 'Myths vs Scripture',
    myths: [],
    reframeLabel: 'THE REFRAME',
    reframeContent: 'Understanding the underlying spiritual wisdom removes anxiety from daily worship.',

    relatedRituals: [],
    relatedPujans: [],
    relatedConcepts: [],
    relatedDates: []
  };
}

function RenderHtml({ content, className }: { content: string; className?: string }) {
  if (!content) return null;
  const isHtml = /<[a-z][\s\S]*>/i.test(content);
  if (isHtml) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <p className={className}>{content}</p>;
}

export default function DharmicConceptDetailClient({ params }: PageProps) {
  const slug = params?.slug || '';
  const [concept, setConcept] = useState<DynamicConceptData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadConcept() {
      try {
        setLoading(true);
        const res = await fetch('/api/public/dharmic-concepts');
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
          const slugify = (t: string) =>
            String(t || '')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');

          const found = list.find(
            (c: Record<string, unknown>) =>
              (c.slug && (c.slug as string).toLowerCase() === slug.toLowerCase()) ||
              slugify(c.title as string) === slug.toLowerCase()
          );

          if (found && isMounted) {
            setConcept(parseConceptData(found));
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Error loading dharmic concept:', err);
      }

      if (isMounted) {
        setConcept(createFallbackConcept(slug));
        setLoading(false);
      }
    }

    if (slug) {
      loadConcept();
    } else {
      setConcept(createFallbackConcept('general'));
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && concept) {
      if (navigator.share) {
        navigator.share({ title: concept.title, url: window.location.href }).catch(() => { });
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
      }
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    showToast(!isSaved ? 'Concept saved to your bookmarks!' : 'Removed from bookmarks');
  };

  const scrollTo = (id: string) => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (loading || !concept) {
    return (
      <div className="dc-detail-root w-full min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-600">Loading concept details...</p>
        </div>
      </div>
    );
  }

  const stories = concept.stories || [];
  const gallery = concept.gallery || [];
  const myths = concept.myths || [];
  const relatedRituals = concept.relatedRituals || [];
  const relatedPujans = concept.relatedPujans || [];
  const relatedConcepts = concept.relatedConcepts || [];
  const relatedDates = concept.relatedDates || [];

  const jumpChips: { id: string; label: string }[] = [];
  if (concept.threeStoriesTitle || stories.length > 0 || concept.threeStoriesIntro) {
    jumpChips.push({ id: 'stories-section', label: concept.threeStoriesTitle || 'Stories' });
  }
  stories.forEach((story, idx) => {
    jumpChips.push({ id: `story-${story.id || idx}`, label: story.title });
  });
  if (concept.shareSectionHeading || concept.shareSharedContent || concept.shareHighlightStatement) {
    jumpChips.push({ id: 'share-section', label: concept.shareSectionHeading || 'What they share' });
  }
  if (myths.length > 0 || concept.reframeContent) {
    jumpChips.push({ id: 'myths-section', label: '✕ Myths & Facts' });
  }
  if (
    relatedRituals.length > 0 ||
    relatedConcepts.length > 0 ||
    relatedPujans.length > 0 ||
    relatedDates.length > 0
  ) {
    jumpChips.push({ id: 'related-section', label: 'Related' });
  }

  const primaryRating = concept.bannerRating ? `DHARMA · ${concept.bannerRating}` : 'DHARMA · 4/5';
  const classification = concept.bannerClassification || 'PURANIC';
  const eyebrow = concept.bannerEyebrow || `DHARMIC CONCEPTS · ${(concept.category || 'Dharma').toUpperCase()}`;
  const bannerHeading = concept.bannerTitle || concept.title;
  const bannerSub = concept.bannerDescription || concept.summary || concept.body;

  return (
    <div className="dc-detail-root w-full max-w-full overflow-x-hidden min-h-screen">
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <Link href="/dharmic-concepts">Dharmic Concepts</Link> ›{' '}
            <span>{concept.category}</span> › <b>{concept.title}</b>
          </div>
          <div className="bc-r">
            <button className="bcb" onClick={toggleSave}>
              {isSaved ? '🔖 Saved' : '🔖 Save'}
            </button>
            <button className="bcb" onClick={handleShare}>
              ↗️ {concept.bannerShareButtonText || 'Share'}
            </button>
          </div>
        </div>
      </div>

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-ov"></div>
        <button className="hero-share" onClick={handleShare}>
          ↗️ {concept.bannerShareButtonText || 'Share'}
        </button>
        <div className="hero-c">
          <div className="hero-in">
            <p className="hero-ey">{eyebrow}</p>
            <div className="hero-tag">
              ◆ {primaryRating} · {classification}
            </div>
            <h1 className="hero-h1">{bannerHeading}</h1>
            {bannerSub && <p className="hero-sub">{bannerSub}</p>}
            <div className="hero-btns">
              <button
                className="hb-p"
                onClick={() => {
                  if (concept.bannerPrimaryCtaLink) {
                    if (concept.bannerPrimaryCtaLink.startsWith('#')) {
                      scrollTo(concept.bannerPrimaryCtaLink.replace('#', ''));
                    } else {
                      window.location.href = concept.bannerPrimaryCtaLink;
                    }
                  } else {
                    scrollTo(jumpChips[0]?.id || 'stories-section');
                  }
                }}
              >
                {concept.bannerPrimaryCtaText || 'Read the guide'}
              </button>
              <button className="hb-g" onClick={toggleSave}>
                {isSaved ? '✓ Saved' : concept.bannerSecondaryCtaText || 'Save this'}
              </button>
            </div>
          </div>
        </div>
      </section>

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
              <span className="tpd" style={{ background: '#FD066D' }}></span>Fear-free
            </span>
          </div>
        </div>
      </div>

      {jumpChips.length > 0 && (
        <div className="chips">
          <div className="chips-in">
            <span className="chip-l">JUMP TO</span>
            {jumpChips.map((chip) => (
              <a
                key={chip.id}
                className="chip"
                href={`#${chip.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(chip.id);
                }}
              >
                {chip.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden">
        <div className="layout flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="main">
            {(concept.summary || concept.body) && (
              <div className="cc">
                <div className="cc-h">
                  <span className="cc-hl">SOURCE OF TRUTH</span>
                  <span
                    className="cc-hr"
                    style={{ cursor: 'pointer' }}
                    onClick={() => showToast('Scriptural sources verified by Tapa editorial team.')}
                  >
                    Verified Reference ›
                  </span>
                </div>
                <div className="cc-b">
                  <div className="cc-core">CORE SUMMARY</div>
                  <div className="cc-claim">{concept.summary || concept.body}</div>
                  <div className="cc-row">
                    <span className="pill d">{primaryRating}</span>
                    <span className="badge">{classification}</span>
                    {concept.shareTraditionTag && (
                      <span className="pill src">{concept.shareTraditionTag}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div id="stories-section" style={{ scrollMarginTop: '140px' }}>
              {concept.threeStoriesTitle && (
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">{concept.threeStoriesTitle}</span>
                </div>
              )}

              {concept.threeStoriesIntro && (
                <RenderHtml content={concept.threeStoriesIntro} className="p" />
              )}

              {concept.threeStoriesSupportingText && (
                <RenderHtml content={concept.threeStoriesSupportingText} className="p" />
              )}
            </div>

            {stories.map((story, idx) => (
              <div
                key={story.id || idx}
                id={`story-${story.id || idx}`}
                style={{ scrollMarginTop: '140px', marginTop: '30px' }}
              >
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">
                    {idx + 1}. {story.title}
                  </span>
                </div>

                {story.description && (
                  <p className="p" style={{ fontWeight: 600, color: 'var(--dark)' }}>
                    {story.description}
                  </p>
                )}

                {story.content && <RenderHtml content={story.content} className="p" />}

                {story.image && (
                  <figure className="art" style={{ marginTop: '16px', marginBottom: '16px' }}>
                    <img
                      src={story.image}
                      alt={story.imageAltText || story.title}
                      style={{ borderRadius: '12px', width: '100%', maxHeight: '420px', objectFit: 'cover' }}
                    />
                    {story.imageCaption && (
                      <figcaption
                        style={{
                          fontSize: '12px',
                          color: 'var(--sub-text)',
                          marginTop: '6px',
                          textAlign: 'center',
                        }}
                      >
                        {story.imageCaption}
                      </figcaption>
                    )}
                  </figure>
                )}
              </div>
            ))}

            {gallery.length > 0 && (
              <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {gallery.map((gal, gIdx) => (
                    <div key={gal.id || gIdx} style={{ borderRadius: '10px', overflow: 'hidden' }}>
                      <img
                        src={gal.image}
                        alt={gal.altText || `Gallery image ${gIdx + 1}`}
                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                      />
                      {gal.caption && (
                        <p style={{ fontSize: '11px', color: 'var(--sub-text)', marginTop: '4px' }}>
                          {gal.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {concept.threeStoriesCaption && (
                  <p style={{ fontSize: '12px', color: 'var(--sub-text)', textAlign: 'center', marginTop: '8px' }}>
                    {concept.threeStoriesCaption}
                  </p>
                )}
              </div>
            )}

            {(concept.shareSectionHeading ||
              concept.shareSharedContent ||
              concept.shareNotSharedContent ||
              concept.shareHighlightStatement) && (
                <div id="share-section" style={{ scrollMarginTop: '140px', marginTop: '36px' }}>
                  {concept.shareSectionHeading && (
                    <div className="sh">
                      <span className="sh-p">+</span>
                      <span className="sh-t">{concept.shareSectionHeading}</span>
                    </div>
                  )}

                  {concept.shareSharedContent && (
                    <div style={{ marginBottom: '14px' }}>
                      <RenderHtml content={concept.shareSharedContent} className="p" />
                    </div>
                  )}

                  {concept.shareNotSharedContent && (
                    <div style={{ marginBottom: '14px' }}>
                      <RenderHtml content={concept.shareNotSharedContent} className="p" />
                    </div>
                  )}

                  {concept.shareHighlightStatement && (
                    <div className="pull">
                      <div className="pull-l">{concept.shareTraditionTag || 'KEY DHARMIC PRINCIPLE'}</div>
                      <p>
                        <b>{concept.shareHighlightStatement}</b>
                      </p>
                      {concept.shareSupportingDescription && (
                        <p style={{ marginTop: '8px' }}>{concept.shareSupportingDescription}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

            {(myths.length > 0 || concept.reframeContent) && (
              <div id="myths-section" style={{ scrollMarginTop: '140px', marginTop: '36px' }}>
                <div className="sh">
                  <span className="sh-p">✕</span>
                  <span className="sh-t">{concept.mythsSectionHeading || 'Myths & Facts'}</span>
                </div>
                <p className="p" style={{ marginBottom: '20px' }}>
                  Distinguishing scriptural principles from regional customs and common misunderstandings.
                </p>

                {myths.map((m, mIdx) => {
                  const mythText = m.mythStatement || m.myth || '';
                  const corrLabel = m.correctionLabel || 'CORRECTION';
                  const corrText = m.correctionContent || m.correction || '';
                  return (
                    <div key={m.id || mIdx} className="myth">
                      <div className="my-q">
                        <div className="my-qt">{mythText}</div>
                        <div className="my-bd">{corrLabel}</div>
                      </div>
                      <div className="my-a">{corrText}</div>
                    </div>
                  );
                })}

                {concept.reframeContent && (
                  <div className="pull" style={{ marginTop: '24px' }}>
                    <div className="pull-l">{concept.reframeLabel || 'THE REFRAME'}</div>
                    <RenderHtml content={concept.reframeContent} />
                  </div>
                )}
              </div>
            )}

            {(relatedRituals.length > 0 ||
              relatedConcepts.length > 0 ||
              relatedPujans.length > 0 ||
              relatedDates.length > 0) && (
                <div id="related-section" style={{ scrollMarginTop: '140px', marginTop: '40px' }}>
                  <div className="sh">
                    <span className="sh-p">🔗</span>
                    <span className="sh-t">Related Guides &amp; Concepts</span>
                  </div>

                  <div className="relgrid">
                    {relatedRituals.map((r, rIdx) => (
                      <Link
                        key={r.id || rIdx}
                        href={r.link || '#'}
                        className="rel"
                        style={{ textDecoration: 'none' }}
                      >
                        <div className="rel-h">RITUAL GUIDE</div>
                        <div className="rel-i">
                          <span>
                            <span className="rel-n">{r.title}</span>
                            {r.description && <span className="rel-s">{r.description}</span>}
                          </span>
                          <span className="rel-a">›</span>
                        </div>
                      </Link>
                    ))}

                    {relatedConcepts.map((c, cIdx) => (
                      <Link
                        key={c.id || cIdx}
                        href={c.link || '#'}
                        className="rel"
                        style={{ textDecoration: 'none' }}
                      >
                        <div className="rel-h">DHARMIC CONCEPT</div>
                        <div className="rel-i">
                          <span>
                            <span className="rel-n">{c.title}</span>
                            {c.description && <span className="rel-s">{c.description}</span>}
                          </span>
                          <span className="rel-a">›</span>
                        </div>
                      </Link>
                    ))}

                    {relatedPujans.map((p, pIdx) => (
                      <Link
                        key={p.id || pIdx}
                        href={p.link || '#'}
                        className="rel"
                        style={{ textDecoration: 'none' }}
                      >
                        <div className="rel-h">PUJAN</div>
                        <div className="rel-i">
                          <span>
                            <span className="rel-n">{p.title}</span>
                            {p.description && <span className="rel-s">{p.description}</span>}
                          </span>
                          <span className="rel-a">›</span>
                        </div>
                      </Link>
                    ))}

                    {relatedDates.map((d, dIdx) => (
                      <Link
                        key={d.id || dIdx}
                        href={d.link || '#'}
                        className="rel"
                        style={{ textDecoration: 'none' }}
                      >
                        <div className="rel-h">PANCHANG DATE</div>
                        <div className="rel-i">
                          <span>
                            <span className="rel-n">{d.title}</span>
                            {d.description && <span className="rel-s">{d.description}</span>}
                          </span>
                          <span className="rel-a">›</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <aside className="side">
            <a
              href="https://wa.me/919876543210?text=Hi%20Tapa%20Co.,%20I%20have%20a%20question%20about%20dharmic%20concepts"
              target="_blank"
              rel="noopener noreferrer"
              className="sbcta wa"
            >
              <span className="sb-ci">💬</span>
              <span className="sb-ct">Ask an Editorial Expert</span>
              <span className="sb-cs">Direct WhatsApp assistance for ritual questions</span>
            </a>

            <Link href="/ritual-guides" className="sbcta dk">
              <span className="sb-ci">🪔</span>
              <span className="sb-ct">Explore Ritual Guides</span>
              <span className="sb-cs">Step-by-step authentic vidhi</span>
            </Link>

            <div className="sbn">
              <div className="sbn-h">SCRIPTURE VERIFIED</div>
              <div className="sbn-t">
                Sourced from classical scripture and cross-checked for regional variations across North &amp; South traditions.
              </div>
              <Link href="/editorial-method" className="sbn-c">
                Our Editorial Method →
              </Link>
            </div>

            <div className="sbcomp">
              <div className="sbcomp-h">
                <span className="sbcomp-l">FEATURED RITUAL KITS</span>
              </div>
              <div className="sbcomp-t">
                Authentic samagri kit for Vedic pujans with pure cow ghee, organic kumkum &amp; sacred items.
              </div>
              <Link href="/ritual-kits" className="sbcomp-b">
                Explore Ritual Kits →
              </Link>
            </div>

            <div className="sbq">
              <div className="sbq-t">"Dharma does not demand fear. It demands devotion."</div>
              <div className="sbq-s">
                Every rule in scripture has a spiritual purpose — understanding the purpose removes anxiety.
              </div>
            </div>
          </aside>
        </div>
      </div>

      {toastMessage && (
        <div className="toast">
          <span>✓</span> {toastMessage}
        </div>
      )}
    </div>
  );
}


