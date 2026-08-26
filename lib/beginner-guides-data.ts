// Data types and mock data repository for Beginner's Guides

export interface ReassuranceItem {
  icon: string;
  text: string;
}

export interface ChipItem {
  label: string;
  href: string;
}

export interface KandaItem {
  id: string;
  number: number;
  title: string;
  devanagari: string;
  summary: string;
  badge?: string;
  isNow?: boolean; // Highlight active kanda e.g., Sundarkand
}

export interface LadderPathItem {
  id: string;
  badgeText: string;
  badgeClass: 'rg' | 'dc' | 'pa';
  title: string;
  subtitle: string;
  href?: string;
}

export interface WorryItem {
  id: string;
  question: string;
  answer: string;
}

export interface RevenueCardItem {
  id: string;
  type: 'live' | 'feat' | 'soon';
  icon: string;
  label: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonClass?: string;
  href?: string;
}

export interface SidebarConfig {
  kandasSequenceTitle: string;
  kandasSequence: Array<{
    number: number;
    title: string;
    isNow?: boolean;
  }>;
  primaryCta?: {
    icon?: string;
    title: string;
    subtext: string;
    type: 'wa' | 'dk';
  };
  companionGuide?: {
    header: string;
    badge: string;
    description: string;
    buttonText: string;
    href?: string;
  };
  whyNoSources?: {
    header: string;
    paragraphs: string[];
  };
}

export interface StickyBarConfig {
  subscribeText: string;
  subscribePrice: string;
  prebookText: string;
  prebookPrice: string;
}

export interface BeginnerGuide {
  slug: string;
  breadcrumbCategory: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  heroTag: string;
  heroPrimaryCta: {
    label: string;
    targetId?: string;
  };
  heroSecondaryCta: {
    label: string;
  };
  reassuranceItems: ReassuranceItem[];
  chips: ChipItem[];
  openingText: string;
  introParagraphs: string[];
  heroArtImage?: {
    src: string;
    alt: string;
  };
  section1Title: {
    num: string;
    title: string;
    subtitle: string;
    anchorId: string;
  };
  kandas: KandaItem[];
  section2Title: {
    num: string;
    title: string;
    anchorId: string;
  };
  section2Paragraphs: string[];
  quoteTurn?: string;
  section3Title: {
    num: string;
    title: string;
    anchorId: string;
  };
  ladderPaths: LadderPathItem[];
  section4Title: {
    num: string;
    title: string;
    anchorId: string;
  };
  worries: WorryItem[];
  closingParagraphs: string[];
  revenueCards: RevenueCardItem[];
  revenueNote: string;
  sidebar: SidebarConfig;
  stickyBar: StickyBarConfig;
}

export const MOCK_BEGINNER_GUIDES: Record<string, BeginnerGuide> = {
  'seven-kandas': {
    slug: 'seven-kandas',
    breadcrumbCategory: "Beginner's Guides",
    title: 'Ramcharitmanas: The Seven Kandas Explained',
    subtitle: 'What each section contains, why each matters, and where Sundarkand fits.',
    eyebrow: "BEGINNER'S GUIDES · START HERE",
    heroTag: '◔ A MAP BEFORE THE JOURNEY',
    heroPrimaryCta: {
      label: 'See the seven kandas',
      targetId: 'seven',
    },
    heroSecondaryCta: {
      label: 'Save this',
    },
    reassuranceItems: [
      { icon: '📖', text: 'No prior reading needed' },
      { icon: '🕉', text: 'No Sanskrit required' },
      { icon: '⏱', text: '6 minutes to read' },
      { icon: '✓', text: 'Start anywhere you like' },
    ],
    chips: [
      { label: '📚 The seven kandas', href: '#seven' },
      { label: 'Why Sundarkand', href: '#why' },
      { label: 'Where to start', href: '#start' },
      { label: '💭 Common worries', href: '#worries' },
    ],
    openingText: 'The map before the journey.',
    introParagraphs: [
      "The Ramcharitmanas is Tulsidas's retelling of the Ramayana in Awadhi, and it is divided into seven sections called kandas. Each covers a phase of Ram's story.",
      'If you are starting with Sundarkand — as most people do — this shows you where it sits and what surrounds it.',
    ],
    heroArtImage: {
      src: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop',
      alt: 'Ramcharitmanas Manuscripts',
    },
    section1Title: {
      num: '1',
      title: 'The seven kandas in sequence',
      subtitle: 'From Ram’s birth in Ayodhya to his coronation and the establishment of Ramrajya.',
      anchorId: 'seven',
    },
    kandas: [
      {
        id: 'k1',
        number: 1,
        title: 'Balkand',
        devanagari: 'बालकाण्ड',
        summary: "Childhood, education, Shiv-Parvati vivah, and Ram's marriage to Sita.",
        badge: 'START HERE FOR CHRONOLOGY',
      },
      {
        id: 'k2',
        number: 2,
        title: 'Ayodhyakand',
        devanagari: 'अयोध्याकाण्ड',
        summary: 'Preparation for coronation, Kaikeyi’s boons, Ram’s exile, and Dasharath’s death.',
      },
      {
        id: 'k3',
        number: 3,
        title: 'Aranyakand',
        devanagari: 'अरण्यकाण्ड',
        summary: 'Life in the forest, Surpanakha, golden deer, and Sita’s abduction by Ravan.',
      },
      {
        id: 'k4',
        number: 4,
        title: 'Kishkindhakand',
        devanagari: 'किष्किन्धाकाण्ड',
        summary: 'Alliance with Sugriva, slaying of Bali, and the search party sent south.',
      },
      {
        id: 'k5',
        number: 5,
        title: 'Sundarkand',
        devanagari: 'सुन्दरकाण्ड',
        summary: 'Hanuman’s leap across the ocean, meeting Sita in Ashoka Vatika, burning of Lanka, and return with news.',
        badge: 'MOST RECITED',
        isNow: true,
      },
      {
        id: 'k6',
        number: 6,
        title: 'Lankakand',
        devanagari: 'लंकाकाण्ड',
        summary: 'Building of Ram Setu, the Great War, Ravan’s defeat, and Sita’s fire test (Agni Pariksha).',
      },
      {
        id: 'k7',
        number: 7,
        title: 'Uttarkand',
        devanagari: 'उत्तरकाण्ड',
        summary: 'Return to Ayodhya, coronation, Ramrajya, Kakbhusundi-Garuda dialogue, and the glory of Bhakti.',
      },
    ],
    section2Title: {
      num: '2',
      title: 'Why Sundarkand is the default starting point',
      anchorId: 'why',
    },
    section2Paragraphs: [
      'Sundarkand is unique among the seven sections. It is the only kanda named not after a place (like Ayodhya or Kishkindha) or a phase of life (like Bal or Aranya), but after a quality: beauty.',
      'It is also the only section where Hanuman is the primary mover of action from start to finish.',
    ],
    quoteTurn: 'Sundarkand is the only section where the protagonist is not Ram in difficulty, but Hanuman in triumph.',
    section3Title: {
      num: '3',
      title: 'Where to start: three paths depending on your goal',
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
      title: 'Common worries before you begin',
      anchorId: 'worries',
    },
    worries: [
      {
        id: 'w1',
        question: '“What if I pronounce the Awadhi words wrong?”',
        answer: 'Devotion precedes grammar. Tulsidas wrote in Awadhi specifically so that formal Sanskrit rules would not stand between a devotee and the text.',
      },
      {
        id: 'w2',
        question: '“Do I need a consecrated idol or a full puja setup?”',
        answer: 'No. A clean seat, a focused mind, and respect for the text are sufficient. You can add a lamp or offering if you wish, but lack of samagri should never delay your reading.',
      },
      {
        id: 'w3',
        question: '“Should I finish it in one sitting?”',
        answer: 'Sundarkand is often read in one sitting (about 45–60 minutes), but it is completely valid to read a few verses each day.',
      },
    ],
    closingParagraphs: [
      'The Ramcharitmanas was written to be sung, recited, and understood by everyone, regardless of academic background.',
      'Start where your devotion directs you. The text meets you where you are.',
    ],
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
      kandasSequence: [
        { number: 1, title: 'Balkand' },
        { number: 2, title: 'Ayodhyakand' },
        { number: 3, title: 'Aranyakand' },
        { number: 4, title: 'Kishkindhakand' },
        { number: 5, title: 'Sundarkand', isNow: true },
        { number: 6, title: 'Lankakand' },
        { number: 7, title: 'Uttarkand' },
      ],
      primaryCta: {
        icon: '💬',
        title: 'WhatsApp Support',
        subtext: 'Get quick guidance on your path setup',
        type: 'wa',
      },
      companionGuide: {
        header: 'READY FOR THE DETAIL?',
        badge: 'DUMMY',
        description: 'The full vidhi for reciting Sundarkand at home — steps, timings and the sourcing behind each one.',
        buttonText: 'Sundarkand Path Guide',
        href: '/ritual-guides/sundarkand-path',
      },
      whyNoSources: {
        header: 'WHY THERE ARE NO SOURCES ON THIS PAGE',
        paragraphs: [
          "Beginner's Guides are written in plain language, with no scriptural citations and no classification tags. The first time you approach something, you need to know what it is — not where it is written.",
          'The Sundarkand Path ritual guide carries all of the sourcing.',
        ],
      },
    },
    stickyBar: {
      subscribeText: 'Subscribe',
      subscribePrice: '₹499/yr',
      prebookText: 'Pre-book Sundarkand Kit',
      prebookPrice: '₹2,151',
    },
  },
};

export function getBeginnerGuideBySlug(slug: string): BeginnerGuide {
  if (MOCK_BEGINNER_GUIDES[slug]) {
    return MOCK_BEGINNER_GUIDES[slug];
  }

  // Fallback for any other slug to render gracefully using the common structure
  const formattedTitle = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    ...MOCK_BEGINNER_GUIDES['seven-kandas'],
    slug,
    title: formattedTitle,
    subtitle: `A beginner-friendly introductory guide to ${formattedTitle.toLowerCase()}.`,
  };
}
