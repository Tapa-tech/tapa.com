// Central mock data repository for The Tapa Co. platform (Phase 1/2 Foundation)

export interface CategoryDropdownItem {
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
}

export interface KitItem {
  id: string;
  name: string;
  occasion: string;
  includes: string;
  price: number;
  priceNote?: string;
  cutoffDate: string;
  themeClass: 'k-ganesh' | 'k-teej' | 'k-navratri' | 'k-shiva';
  isLead?: boolean;
  isPrebook?: boolean;
  guideTitle: string;
}

export interface CalendarCard {
  id: string;
  name: string;
  tithi: string;
  description: string;
  dateStr: string;
  themeClass: 'sc-hart' | 'sc-gan' | 'sc-radha' | 'sc-anant';
  guideLink: string;
}

export interface MythCard {
  id: string;
  mythText: string;
  factText: string;
}

export const HEADER_DROPDOWNS = {
  rg: {
    startHere: [
      { title: "Beginner's Guides", subtitle: "No tags, no citations, no Sanskrit to look up", isLead: true },
      { title: "What Is a Vrat" },
      { title: "Your First Puja at Home" },
      { title: "The Seven Kandas" }
    ],
    byOccasion: [
      { title: "Festive Pujans", subtitle: "Fixed to a tithi — 18 guides" },
      { title: "All-Year Pujans", subtitle: "Recurring observances — 9 guides" }
    ],
    comingUp: [
      { title: "Hartalika Teej", subtitle: "13 September", when: "IN 6 DAYS", dotColor: "#3E8B4A" },
      { title: "Ganesh Chaturthi", subtitle: "14 September", when: "IN 7 DAYS", dotColor: "#B5651D" },
      { title: "Sharad Navratri", subtitle: "11 October", dotColor: "#A83358" }
    ],
    featured: {
      label: "HOW WE DECIDE WHAT IS TRUE",
      title: "Every claim tagged and scored",
      description: "Dharma, Pratha or Bhranti — with a confidence score you can check against a named text.",
      cta: "Our editorial method ›",
      theme: "dark"
    },
    footerStats: "34 guides live · 21 more by December"
  },
  pa: {
    rightNow: {
      location: "TODAY · DELHI-NCR",
      tithi: "Bhadrapada Krishna Ekadashi"
    },
    calendars: [
      { title: "Vrat Calendar", subtitle: "142 dates this year" },
      { title: "Festival Calendar", subtitle: "Month by month" },
      { title: "Eclipses", subtitle: "Visibility decides everything" }
    ],
    understand: [
      { title: "How to Read a Panchang", subtitle: "Five limbs, explained once" },
      { title: "Why dates differ by city" },
      { title: "Purnimanta vs Amanta" }
    ],
    featured: {
      label: "FREE DOWNLOAD",
      title: "The full 2026 calendar",
      description: "Every tithi, vrat and festival date, computed for your city. One PDF.",
      cta: "Download ›",
      theme: "data"
    },
    footerStats: "Computed for New Delhi · Purnimanta · verified manually"
  },
  dc: {
    startHere: [
      { title: "Why is bilva dear to Mahadev?", subtitle: "The leaf, the story, the offering rules", isLead: true },
      { title: "Three Stories, One Thread", subtitle: "Wife, friend, devotee — not siblings" }
    ],
    byType: [
      { title: "Materials", subtitle: "Objects and what they mean" },
      { title: "Meanings & Practices", subtitle: "Acts and ideas behind the ritual" }
    ],
    series: [
      { title: "Bilva", pill: { text: "LIVE", type: "live" as const } },
      { title: "Tulsi", pill: { text: "SOON", type: "soon" as const } },
      { title: "Durva", pill: { text: "SOON", type: "soon" as const } }
    ],
    featured: {
      label: "LOOK UP ANY TERM",
      title: "The Glossary",
      description: "142 words defined once, in plain language, with the Devanagari and how to say it.",
      cta: "Open the glossary ›",
      theme: "amber"
    },
    footerStats: "Paragraph only. No tables. Every concept sourced to a named text."
  },
  rk: {
    shopBy: [
      { title: "By festival", subtitle: "Dated kits, with a cut-off" },
      { title: "By deity", subtitle: "All-year kits" },
      { title: "Gyan Patrikas", subtitle: "Knowledge booklets" }
    ],
    openPrebook: [
      { title: "Ganesh Sthapana Kit", subtitle: "₹1,650", when: "ORDER BY 10 SEP" },
      { title: "Hartalika Teej Kit", subtitle: "₹950", when: "ORDER BY 9 SEP" },
      { title: "Shakti Kit", subtitle: "₹1,751 · Navratri" }
    ],
    beforeYouBuy: [
      { title: "What is in a kit" },
      { title: "Delivery and cut-offs" },
      { title: "Cancellations and refunds" }
    ],
    featured: {
      label: "WORTH SAYING PLAINLY",
      title: "You do not need a kit",
      description: "Every samagri list is free and complete. A kit saves you a morning in the market. It does not make the puja more valid.",
      cta: "Read a guide instead ›",
      theme: "amber"
    },
    footerStats: "Dated kits are prepaid, no COD · free cancellation until dispatch"
  }
};

export const MOCK_KITS: KitItem[] = [
  {
    id: "kit-ganesh",
    name: "Ganesh Sthapana Kit",
    occasion: "For Ganesh Chaturthi · 14 September",
    includes: "28 items · Clay idol, durva, modak mold, Gyan Patrika booklet included",
    price: 1650,
    priceNote: "Free shipping",
    cutoffDate: "ORDER BY 10 SEP",
    themeClass: "k-ganesh",
    isLead: true,
    isPrebook: true,
    guideTitle: "Read the Sthapana Guide ›"
  },
  {
    id: "kit-teej",
    name: "Hartalika Teej Kit",
    occasion: "For Hartalika Teej · 13 September",
    includes: "19 items · Full suhag samagri, natural dhoop, clay Mahadev & Parvati",
    price: 950,
    priceNote: "Prepaid only",
    cutoffDate: "ORDER BY 9 SEP",
    themeClass: "k-teej",
    isPrebook: true,
    guideTitle: "Read the Teej Guide ›"
  },
  {
    id: "kit-navratri",
    name: "Shakti Kit",
    occasion: "For Sharad Navratri · Starts 11 October",
    includes: "34 items · Ghatasthapana vessels, akhand jyot, 9-day chuni set, dhoop",
    price: 1751,
    priceNote: "Pre-order open",
    cutoffDate: "PRE-ORDER",
    themeClass: "k-navratri",
    isPrebook: true,
    guideTitle: "Read the Ghatasthapana Guide ›"
  },
  {
    id: "kit-shiva",
    name: "Shiva Puja Kit",
    occasion: "All-Year Observances · Pradosh, Mondays",
    includes: "14 items · Brass lota, bilva, bhasma, janeyu, gangajal, pure ghee diya",
    price: 1180,
    priceNote: "All-year availability",
    cutoffDate: "ALL-YEAR",
    themeClass: "k-shiva",
    guideTitle: "Read the Shiva Puja Guide ›"
  }
];

export const MOCK_CALENDAR_SHELF: CalendarCard[] = [
  {
    id: "cal-hartalika",
    name: "Hartalika Teej",
    tithi: "Bhadrapada Shukla Tritiya",
    description: "The nirjala vrat for Mahadev and Parvati. Samagri list, katha, and vidhi.",
    dateStr: "13 SEP",
    themeClass: "sc-hart",
    guideLink: "Ritual Guide"
  },
  {
    id: "cal-ganesh",
    name: "Ganesh Chaturthi",
    tithi: "Bhadrapada Shukla Chaturthi",
    description: "Sthapana muhurat, 21 durva rule, and what the Mudgala Purana says.",
    dateStr: "14 SEP",
    themeClass: "sc-gan",
    guideLink: "Ritual Guide"
  },
  {
    id: "cal-radha",
    name: "Radha Ashtami",
    tithi: "Bhadrapada Shukla Ashtami",
    description: "The 15-day fast following Janmashtami. Puja vidhi and bhog rules.",
    dateStr: "18 SEP",
    themeClass: "sc-radha",
    guideLink: "Ritual Guide"
  },
  {
    id: "cal-anant",
    name: "Anant Chaturdashi",
    tithi: "Bhadrapada Shukla Chaturdashi",
    description: "14 knots, 14 years. The Ananta-vrat vidhi and Visarjan rules.",
    dateStr: "24 SEP",
    themeClass: "sc-anant",
    guideLink: "Ritual Guide"
  }
];

export const MOCK_MYTHS: MythCard[] = [
  {
    id: "m1",
    mythText: "MYTH: A puja is invalid if any single samagri item is missing from the dish.",
    factText: "FACT: The Skanda Purana permits bhavana (devotional intent) and akshata as substitute for missing physical items."
  },
  {
    id: "m2",
    mythText: "MYTH: Women cannot perform Shivling abhishekam directly with water and bilva.",
    factText: "FACT: Shiva Purana explicitly sanctions worship by all devotees irrespective of gender or varna."
  },
  {
    id: "m3",
    mythText: "MYTH: Tulsi leaves can be plucked at any time of the day for puja use.",
    factText: "FACT: Garuda Purana specifies plucking rules: avoid Sundays, Sankranti, and post-sunset times."
  }
];

export const MOCK_DPB_ITEMS = [
  {
    key: "Dharma (Scriptural Mandate)",
    type: "d",
    value: "Explicitly prescribed in named Puranas, Samhitas, or Sutras with chapter and verse citations."
  },
  {
    key: "Pratha (Regional / Family Custom)",
    type: "p",
    value: "Traditional practice handed down through generations; valid and meaningful, though unwritten."
  },
  {
    key: "Bhranti (Misconception)",
    type: "b",
    value: "Latter-day addition or fear-based superstition contradicted by classical dharmic texts."
  }
];

export const MOCK_CART_ITEMS = [
  {
    id: "cart-1",
    name: "Ganesh Sthapana Kit",
    cutoff: "ORDER BY 10 SEP",
    price: 1650,
    gradient: "linear-gradient(150deg,#6B3410,#B5651D)"
  },
  {
    id: "cart-2",
    name: "Shiva Puja Kit",
    cutoff: "All-year",
    price: 1180,
    gradient: "linear-gradient(150deg,#1A1440,#3A2E70)"
  }
];
