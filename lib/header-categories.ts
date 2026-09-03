export interface HeaderItem {
  title: string;
  subtitle?: string;
  href?: string;
  isLead?: boolean;
  dotColor?: string;
  when?: string;
  pill?: {
    text: string;
    type: 'live' | 'soon';
  };
  styleColor?: string;
  liveLocation?: string;
  liveTithi?: string;
}

export interface HeaderColumn {
  header: string;
  items: HeaderItem[];
}

export interface HeaderFeatured {
  label: string;
  title: string;
  description: string;
  cta: string;
  href?: string;
  theme?: 'dark' | 'data' | 'amber';
  isButton?: boolean;
}

export interface HeaderFooter {
  statsText: string;
  linkText: string;
  linkHref: string;
}

export interface HeaderCategoryStructure {
  id?: string;
  key: string; // "rg", "pa", "dc", "rk"
  title: string;
  displayOrder: number;
  status: 'PUBLISHED' | 'DRAFT' | 'HIDDEN' | string;
  columns: HeaderColumn[];
  featured: HeaderFeatured;
  footer: HeaderFooter;
}

export const INITIAL_HEADER_CATEGORIES: HeaderCategoryStructure[] = [
  {
    key: 'rg',
    title: 'Ritual Guides',
    displayOrder: 1,
    status: 'PUBLISHED',
    columns: [
      {
        header: 'START HERE',
        items: [
          { title: "Beginner's Guides", subtitle: 'No tags, no citations, no Sanskrit to look up', href: '/ritual-guides', isLead: true },
          { title: 'What Is a Vrat', href: '/ritual-guides/what-is-a-vrat' },
          { title: 'Your First Puja at Home', href: '/ritual-guides/first-puja' },
          { title: 'The Seven Kandas', href: '/ritual-guides/seven-kandas' },
        ],
      },
      {
        header: 'BY OCCASION',
        items: [
          { title: 'Festive Pujans', subtitle: 'Fixed to a tithi — 18 guides', href: '/ritual-guides' },
          { title: 'All-Year Pujans', subtitle: 'Recurring observances — 9 guides', href: '/ritual-guides' },
          { title: 'All Ritual Guides ›', href: '/ritual-guides', styleColor: 'var(--pink)' },
        ],
      },
      {
        header: 'COMING UP',
        items: [
          { title: 'Hartalika Teej', subtitle: '13 September', when: 'IN 6 DAYS', dotColor: '#3E8B4A', href: '/ritual-guides/hartalika-teej' },
          { title: 'Ganesh Chaturthi', subtitle: '14 September', when: 'IN 7 DAYS', dotColor: '#B5651D', href: '/ritual-guides/ganesh-chaturthi' },
          { title: 'Sharad Navratri', subtitle: '11 October', dotColor: '#A83358', href: '/ritual-guides/sharad-navratri' },
        ],
      },
    ],
    featured: {
      label: 'HOW WE DECIDE WHAT IS TRUE',
      title: 'Every claim tagged and scored',
      description: 'Dharma, Pratha or Bhranti — with a confidence score you can check against a named text.',
      cta: 'Our editorial method ›',
      href: '/editorial-method',
      theme: 'dark',
    },
    footer: {
      statsText: '34 guides live · 21 more by December',
      linkText: 'Browse all ›',
      linkHref: '/ritual-guides',
    },
  },
  {
    key: 'pa',
    title: 'Panchang',
    displayOrder: 2,
    status: 'PUBLISHED',
    columns: [
      {
        header: 'RIGHT NOW',
        items: [
          {
            title: "Today's Panchang",
            subtitle: 'Tithi, nakshatra, sunrise, Rahu Kaal',
            href: '/panchang',
            liveLocation: 'TODAY · DELHI-NCR',
            liveTithi: 'Bhadrapada Krishna Ekadashi',
          },
          { title: 'Change city ›', href: '/panchang', styleColor: 'var(--pink)' },
        ],
      },
      {
        header: 'CALENDARS',
        items: [
          { title: 'Vrat Calendar', subtitle: '142 dates this year', href: '/panchang/vrat-calendar' },
          { title: 'Festival Calendar', subtitle: 'Month by month', href: '/panchang/festival-calendar' },
          { title: 'Eclipses', subtitle: 'Visibility decides everything', href: '/panchang/eclipses' },
        ],
      },
      {
        header: 'UNDERSTAND IT',
        items: [
          { title: 'How to Read a Panchang', subtitle: 'Five limbs, explained once', href: '/panchang' },
          { title: 'Why dates differ by city', href: '/panchang' },
          { title: 'Purnimanta vs Amanta', href: '/panchang' },
        ],
      },
    ],
    featured: {
      label: 'FREE DOWNLOAD',
      title: 'The full 2026 calendar',
      description: 'Every tithi, vrat and festival date, computed for your city. One PDF.',
      cta: 'Download ›',
      isButton: true,
      theme: 'data',
    },
    footer: {
      statsText: 'Computed for New Delhi · Purnimanta · verified manually',
      linkText: 'All Panchang ›',
      linkHref: '/panchang',
    },
  },
  {
    key: 'dc',
    title: 'Dharmic Concepts',
    displayOrder: 3,
    status: 'PUBLISHED',
    columns: [
      {
        header: 'START HERE',
        items: [
          { title: 'Why is bilva dear to Mahadev?', subtitle: 'The leaf, the story, the offering rules', href: '/dharmic-concepts/', isLead: true },
          { title: 'Three Stories, One Thread', subtitle: 'Wife, friend, devotee — not siblings', href: '/dharmic-concepts/bilva' },
        ],
      },
      {
        header: 'BY TYPE',
        items: [
          { title: 'Materials', subtitle: 'Objects and what they mean', href: '/dharmic-concepts' },
          { title: 'Meanings & Practices', subtitle: 'Acts and ideas behind the ritual', href: '/dharmic-concepts' },
          { title: 'All Concepts ›', href: '/dharmic-concepts', styleColor: 'var(--pink)' },
        ],
      },
      {
        header: 'IN THE SERIES',
        items: [
          { title: 'Bilva', href: '/dharmic-concepts/bilva', pill: { text: 'LIVE', type: 'live' } },
          { title: 'Tulsi', href: '/dharmic-concepts/tulsi', pill: { text: 'SOON', type: 'soon' } },
          { title: 'Durva', href: '/dharmic-concepts/durva', pill: { text: 'SOON', type: 'soon' } },
        ],
      },
    ],
    featured: {
      label: 'LOOK UP ANY TERM',
      title: 'The Glossary',
      description: '142 words defined once, in plain language, with the Devanagari and how to say it.',
      cta: 'Open the glossary ›',
      href: '/glossary',
      theme: 'amber',
    },
    footer: {
      statsText: 'Paragraph only. No tables. Every concept sourced to a named text.',
      linkText: 'Our editorial method ›',
      linkHref: '/editorial-method',
    },
  },
  {
    key: 'rk',
    title: 'Ritual Kits',
    displayOrder: 4,
    status: 'PUBLISHED',
    columns: [
      {
        header: 'SHOP BY',
        items: [
          { title: 'By festival', subtitle: 'Dated kits, with a cut-off', href: '/ritual-kits' },
          { title: 'By deity', subtitle: 'All-year kits', href: '/ritual-kits' },
          { title: 'Gyan Patrikas', subtitle: 'Knowledge booklets', href: '/ritual-kits' },
        ],
      },
      {
        header: 'OPEN FOR PRE-BOOKING',
        items: [
          { title: 'Ganesh Sthapana Kit', subtitle: '₹1,650', when: 'ORDER BY 10 SEP', href: '/ritual-kits' },
          { title: 'Hartalika Teej Kit', subtitle: '₹950', when: 'ORDER BY 9 SEP', href: '/ritual-kits' },
          { title: 'Shakti Kit', subtitle: '₹1,751 · Navratri', href: '/ritual-kits' },
        ],
      },
      {
        header: 'BEFORE YOU BUY',
        items: [
          { title: 'What is in a kit', href: '/ritual-kits' },
          { title: 'Delivery and cut-offs', href: '/ritual-kits' },
          { title: 'Cancellations and refunds', href: '/ritual-kits' },
        ],
      },
    ],
    featured: {
      label: 'WORTH SAYING PLAINLY',
      title: 'You do not need a kit',
      description: 'Every samagri list is free and complete. A kit saves you a morning in the market. It does not make the puja more valid.',
      cta: 'Read a guide instead ›',
      href: '/ritual-guides',
      theme: 'amber',
    },
    footer: {
      statsText: 'Dated kits are prepaid, no COD · free cancellation until dispatch',
      linkText: 'All kits ›',
      linkHref: '/ritual-kits',
    },
  },
];
