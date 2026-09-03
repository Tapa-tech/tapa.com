import { prisma } from '@/lib/db';
import { BeginnerGuide, KandaItem, WorryItem } from '@/types/beginner-guide';

const DEFAULT_REASSURANCE = [
  { icon: '📖', text: 'No prior reading needed' },
  { icon: '🕉', text: 'No Sanskrit required' },
  { icon: '⏱', text: '6 minutes to read' },
  { icon: '✓', text: 'Start anywhere you like' },
];

const DEFAULT_CHIPS = [
  { label: '📚 The seven kandas', href: '#seven' },
  { label: 'Why Sundarkand', href: '#why' },
  { label: 'Where to start', href: '#start' },
  { label: '💭 Common worries', href: '#worries' },
];

export async function fetchBeginnerGuideBySlug(slug: string): Promise<BeginnerGuide | null> {
  if (!slug) return null;
  const cleanSlug = slug.trim().toLowerCase();

  try {
    let dbGuide = null;

    if (process.env.DATABASE_URL) {
      dbGuide = await prisma.beginnerGuide.findFirst({
        where: {
          OR: [{ slug: cleanSlug }, { slug }],
        },
      });

      if (!dbGuide) {
        dbGuide = await prisma.beginnerGuide.findFirst({
          where: {
            OR: [
              { slug: { contains: cleanSlug } },
              { title: { contains: cleanSlug } },
            ],
          },
        });
      }
    }

    if (!dbGuide) {
      return null;
    }

    // Parse JSON arrays safely
    let kandas: KandaItem[] = [];
    if (dbGuide.kandasJson) {
      try {
        const parsed = typeof dbGuide.kandasJson === 'string' ? JSON.parse(dbGuide.kandasJson) : dbGuide.kandasJson;
        if (Array.isArray(parsed)) {
          kandas = parsed.map((item: any, idx: number) => ({
            id: item.id || `kanda-${idx}`,
            number: item.number || idx + 1,
            title: item.title || item.kandaTitle || '',
            devanagari: item.devanagari || item.sanskrit || '',
            summary: item.summary || item.description || '',
            badge: item.badge || undefined,
            isNow: item.isNow || false,
          }));
        }
      } catch (e) {}
    }

    let worries: WorryItem[] = [];
    if (dbGuide.commonWorriesJson) {
      try {
        const parsed = typeof dbGuide.commonWorriesJson === 'string' ? JSON.parse(dbGuide.commonWorriesJson) : dbGuide.commonWorriesJson;
        if (Array.isArray(parsed)) {
          worries = parsed.map((item: any, idx: number) => ({
            id: item.id || `worry-${idx}`,
            question: item.question || item.title || '',
            answer: item.answer || item.description || '',
          }));
        }
      } catch (e) {}
    }

    const title = dbGuide.bannerTitle || dbGuide.title;
    const subtitle = dbGuide.bannerDescription || dbGuide.introDescription || `Introductory guide to ${title}`;

    return {
      slug: dbGuide.slug,
      breadcrumbCategory: "Beginner's Guides",
      title,
      subtitle,
      eyebrow: dbGuide.bannerEyebrow || "BEGINNER'S GUIDES · START HERE",
      heroTag: dbGuide.bannerBadgeText ? `◔ ${dbGuide.bannerBadgeText}` : '◔ A MAP BEFORE THE JOURNEY',
      heroPrimaryCta: {
        label: dbGuide.bannerPrimaryCtaText || 'See the seven kandas',
        targetId: dbGuide.bannerPrimaryCtaTarget || 'seven',
      },
      heroSecondaryCta: {
        label: dbGuide.bannerSecondaryCtaText || 'Save this',
      },
      reassuranceItems: DEFAULT_REASSURANCE,
      chips: DEFAULT_CHIPS,
      openingText: dbGuide.introHeading || 'The map before the journey.',
      introParagraphs: dbGuide.introDescription ? [dbGuide.introDescription] : [],
      heroArtImage: dbGuide.introImage
        ? {
            src: dbGuide.introImage,
            alt: dbGuide.introImageAltText || title,
          }
        : undefined,
      section1Title: {
        num: '1',
        title: dbGuide.whySectionHeading || 'The seven kandas in sequence',
        subtitle: dbGuide.whySectionSubtitle || 'From Ram’s birth in Ayodhya to his coronation and the establishment of Ramrajya.',
        anchorId: 'seven',
      },
      kandas,
      section2Title: {
        num: '2',
        title: dbGuide.whereToStartHeading || 'Why Sundarkand is the default starting point',
        anchorId: 'why',
      },
      section2Paragraphs: dbGuide.whereToStartIntro
        ? [dbGuide.whereToStartIntro]
        : ['Sundarkand is unique among the seven sections.'],
      quoteTurn: dbGuide.whereToStartHighlight || undefined,
      section3Title: {
        num: '3',
        title: dbGuide.whereToStartSubHeading || 'Where to start: three paths depending on your goal',
        anchorId: 'start',
      },
      ladderPaths: [
        {
          id: 'path-sundar',
          badgeText: 'RG',
          badgeClass: 'rg',
          title: 'Start with Sundarkand',
          subtitle: 'FOR DAILY OR WEEKLY PATH · 45–60 MINS PER RECITATION',
          href: '#seven',
        },
        {
          id: 'path-balkand',
          badgeText: 'DC',
          badgeClass: 'dc',
          title: 'Start with Balkand',
          subtitle: 'FOR THE FULL STORY IN ORDER · COMPLETE READING FROM PAGE 1',
          href: '#seven',
        },
        {
          id: 'path-uttarkand',
          badgeText: 'PA',
          badgeClass: 'pa',
          title: 'Start with Uttarkand',
          subtitle: 'FOR PHILOSOPHICAL DEPTH · BHAKTI YOGA & DIALOGUES',
          href: '#seven',
        },
      ],
      section4Title: {
        num: '4',
        title: dbGuide.commonWorriesHeading || 'Common worries before you begin',
        anchorId: 'worries',
      },
      worries,
      closingParagraphs: dbGuide.commonWorriesClosing ? [dbGuide.commonWorriesClosing] : [],
      revenueCards: [
        {
          id: 'rev-guide',
          type: 'live',
          icon: '📖',
          label: 'RITUAL GUIDE · FREE',
          title: 'Sundarkand Path Guide',
          subtitle: 'Step-by-step vidhi for reciting Sundarkand at home — timings, samagri and rules.',
          buttonText: 'Read free guide ›',
          buttonClass: 'rg-btn',
          href: '/ritual-guides/sundarkand-path',
        },
        {
          id: 'rev-kit',
          type: 'feat',
          icon: '📦',
          label: 'PRE-ORDER · DATED KIT',
          title: 'Sundarkand Pre-Book Kit',
          subtitle: 'Complete puja samagri box for Sundarkand path — pure ghee diya, dhoop, booklet.',
          buttonText: 'Pre-book for ₹2,151 ›',
          href: '/ritual-kits',
        },
        {
          id: 'rev-pandit',
          type: 'soon',
          icon: '💬',
          label: 'WHATSAPP ASSIST',
          title: 'Ask a Pandit',
          subtitle: 'Have a question about your path vidhi? Message our verified pandits directly.',
          buttonText: 'Coming soon',
        },
      ],
      revenueNote: 'Every guide on The Tapa Co. is free. Kits and services are optional.',
      sidebar: {
        kandasSequenceTitle: 'THE SEVEN KANDAS IN ORDER',
        kandasSequence: kandas.map((k) => ({
          number: k.number,
          title: k.title,
          isNow: k.isNow,
        })),
        primaryCta: {
          icon: '💬',
          title: 'WhatsApp Support',
          subtext: 'Get quick guidance on your path setup',
          type: 'wa',
        },
        companionGuide: {
          header: 'READY FOR THE DETAIL?',
          badge: 'GUIDE',
          description: 'The full vidhi for reciting Sundarkand at home — steps, timings and sourcing.',
          buttonText: 'Sundarkand Path Guide',
          href: '/ritual-guides/sundarkand-path',
        },
        whyNoSources: {
          header: 'WHY THERE ARE NO SOURCES ON THIS PAGE',
          paragraphs: [
            "Beginner's Guides are written in plain language, with no scriptural citations and no classification tags.",
          ],
        },
      },
      stickyBar: {
        subscribeText: 'Subscribe',
        subscribePrice: '₹499/yr',
        prebookText: 'Pre-book Sundarkand Kit',
        prebookPrice: '₹2,151',
      },
    };
  } catch (err: any) {
    console.error('Error fetching beginner guide by slug:', err);
    return null;
  }
}
