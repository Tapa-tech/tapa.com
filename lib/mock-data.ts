// Central mock data repository for The Tapa Co. platform (Phase 1/2 Foundation)

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
