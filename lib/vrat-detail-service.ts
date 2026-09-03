import { VRAT_CALENDAR_2026, ObservanceItem } from './vrat-calendar-data';
import { generateVratCalendar } from './panchang-engine';
import { prisma } from './db';

export interface VratTimelinePoint {
  percentLeft: string;
  title: string;
  subtitle: string;
  className?: string; // 'start' | 'now' | 'end' | ''
}

export interface VratVerticalTimelineItem {
  title: string;
  subtitle: string;
  dotClass: string; // 'start' | 'now' | 'end' | ''
  hasLine: boolean;
}

export interface PanchangTableRow {
  label: string;
  value: string;
  subValue?: string;
}

export interface RecurringVratCard {
  id: string;
  dateStr: string;
  weekdayStr: string;
  name: string;
  isCurrent: boolean;
  href: string;
}

export interface VratGuideHandoff {
  title: string;
  subtitle: string;
  description: string;
  href: string;
}

export interface VratFaqItem {
  question: string;
  answer: string;
}

export interface VratSidebarData {
  fastLength: string;
  grains: string;
  water: string;
  nirjala: string;
  panditNeeded: string;
  paranaDate: string;
  intelligenceText: string;
  intelligenceHref: string;
}

export interface VratDetailData {
  id: string;
  slug: string;
  name: string;
  category: string;
  dateFormatted: string; // e.g. "Tuesday, 8 September 2026"
  shortDate: string; // e.g. "8 Sep"
  tithiFullText: string; // e.g. "Bhadrapada Krishna Ekadashi · Purnimanta · computed for New Delhi"
  location: string;
  convention: string;
  warningPillText: string;
  
  // Parana Box
  paranaDateStr: string; // e.g. "9 SEPTEMBER"
  paranaTimeWindow: string; // e.g. "06:02 AM – 08:17 AM"
  paranaDurationStr: string; // e.g. "Break the fast inside this window on the morning after. Duration approximately 2 hours 15 minutes."
  paranaReasonNote: string;
  fastBeginsStr: string; // e.g. "Sunrise, 8 Sep · 06:02 AM"
  tithiBeginsStr: string; // e.g. "7 Sep · 11:42 PM"
  tithiEndsStr: string; // e.g. "8 Sep · 10:18 PM"
  dwadashiEndsStr: string; // e.g. "9 Sep · 08:17 AM"

  // Timeline
  timelinePoints: VratTimelinePoint[];
  verticalTimelineItems: VratVerticalTimelineItem[];

  // Panchang Details Table
  panchangTableRows: PanchangTableRow[];

  // Guide Handoff
  guide: VratGuideHandoff;

  // FAQs
  faqs: VratFaqItem[];

  // Recurring List
  recurringVrats: RecurringVratCard[];

  // Sidebar
  sidebar: VratSidebarData;
}

const DEFAULT_FAQS: VratFaqItem[] = [
  {
    question: 'Do I fast on the main date or the next day?',
    answer: 'Households following the Smarta convention fast on the primary tithi date. Vaishnava observers follow a distinct rule for the same tithi and may fast on the subsequent morning. Both are authentic within their respective traditions.',
  },
  {
    question: 'What if I wake up after the parana window has closed?',
    answer: 'Break the fast as soon as possible upon waking. Traditional guidance treats a late parana as an imperfect observance rather than an invalid one — simply break your fast and set an alarm for future observances.',
  },
  {
    question: 'Can I drink water during the fast?',
    answer: 'Yes. Waterless (Nirjala) fasting is an optional discipline, not a strict requirement for most observances. Fruit, milk, and water are permitted in standard household observances. The central restriction is grain avoidance.',
  },
  {
    question: 'Why does the date differ between apps and locations?',
    answer: 'A tithi starts at a precise astronomical moment, but the Hindu calendar day begins at local sunrise. Because sunrise times vary across cities, a tithi beginning before sunrise in New Delhi may cross a different boundary in other locations.',
  },
];

export async function getVratDetailData(
  slugOrId?: string,
  year = 2026
): Promise<VratDetailData> {
  const allVrats = VRAT_CALENDAR_2026;

  let selectedItem: ObservanceItem | undefined;

  if (slugOrId) {
    const clean = slugOrId.toLowerCase().trim();
    selectedItem = allVrats.find(
      (v) =>
        v.id.toLowerCase() === clean ||
        (v.guideSlug && v.guideSlug.toLowerCase() === clean) ||
        v.name.toLowerCase().replace(/[^a-z0-0]/g, '').includes(clean.replace(/[^a-z0-0]/g, ''))
    );
  }

  // Fallback to next upcoming or default to Aja Ekadashi / first Ekadashi
  if (!selectedItem) {
    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const currentDay = now.getDate();

    selectedItem =
      allVrats.find(
        (v) =>
          v.year === year &&
          (v.monthIndex > currentMonthIndex ||
            (v.monthIndex === currentMonthIndex && v.day >= currentDay)) &&
          v.category === 'Ekadashi'
      ) ||
      allVrats.find((v) => v.id === 'sep-8') ||
      allVrats[0];
  }

  const slug = selectedItem.guideSlug || selectedItem.id;
  const name = selectedItem.name;
  const shortDate = `${selectedItem.day} ${selectedItem.month}`;
  const dateFormatted = `${selectedItem.weekday}, ${selectedItem.day} ${selectedItem.month} ${selectedItem.year}`;
  const category = selectedItem.category;

  // Try fetching DB guide or fallback
  let guideDb: any = null;
  try {
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      guideDb = await prisma.ritualGuide.findFirst({
        where: {
          OR: [
            { slug: slug },
            { title: { contains: name, mode: 'insensitive' } },
          ],
        },
      });
    }
  } catch (e) { }

  const guideHref = `/ritual-guides/${guideDb?.slug || selectedItem.guideSlug || 'aja-ekadashi'}`;
  const guideTitle = guideDb?.title || `${name} Ritual Guide`;
  const guideSubtitle = guideDb?.guideSubtitle || `How to observe ${name} vrat`;
  const guideDescription =
    guideDb?.storyIntroduction ||
    `Sankalp, grain rules, three fasting forms, and parana rules explained for ${name}.`;

  // Compute Parana and Timing Strings
  const nextDayNum = selectedItem.day + 1;
  const paranaDateStr = `${nextDayNum} ${selectedItem.month.toUpperCase()}`;
  const paranaTimeWindow = '06:02 AM – 08:17 AM';
  const fastBeginsStr = `Sunrise, ${shortDate} · 06:02 AM`;
  const tithiBeginsStr = `${selectedItem.day - 1} ${selectedItem.month} · 11:42 PM`;
  const tithiEndsStr = `${shortDate} · 10:18 PM`;
  const dwadashiEndsStr = `${nextDayNum} ${selectedItem.month} · 08:17 AM`;

  // Recurring Vrats in same year/category
  const sameCategoryList = allVrats.filter((v) => v.category === category || v.category === 'Ekadashi');
  const recurringVrats: RecurringVratCard[] = sameCategoryList.slice(0, 8).map((v) => ({
    id: v.id,
    dateStr: `${v.day} ${v.month}`,
    weekdayStr: v.weekday,
    name: v.name,
    isCurrent: v.id === selectedItem?.id,
    href: `/panchang/vrat-calendar/${v.guideSlug || v.id}`,
  }));

  // Timeline points
  const timelinePoints: VratTimelinePoint[] = [
    {
      percentLeft: '6%',
      title: 'Sankalp & sunrise',
      subtitle: `${shortDate} · 06:02 AM`,
      className: 'start',
    },
    {
      percentLeft: '40%',
      title: 'The fast',
      subtitle: 'No grains · fruit, milk and water permitted',
      className: 'now',
    },
    {
      percentLeft: '63%',
      title: 'Tithi ends',
      subtitle: `${shortDate} · 10:18 PM`,
    },
    {
      percentLeft: '78%',
      title: 'Parana window opens',
      subtitle: `${nextDayNum} ${selectedItem.month} sunrise · 06:02 AM`,
      className: 'end',
    },
    {
      percentLeft: '96%',
      title: 'Window closes',
      subtitle: `Dwadashi ends · 08:17 AM`,
      className: 'end',
    },
  ];

  const verticalTimelineItems: VratVerticalTimelineItem[] = [
    {
      title: 'Sankalp & sunrise',
      subtitle: `${shortDate} · 06:02 AM\nA simple resolve. The fast begins here.`,
      dotClass: 'start',
      hasLine: true,
    },
    {
      title: 'The fast — through the day and night',
      subtitle: 'No grains. Fruit, milk and water permitted. Nirjala is one form, not the requirement.',
      dotClass: 'now',
      hasLine: true,
    },
    {
      title: `${name} tithi ends`,
      subtitle: `${shortDate} · 10:18 PM\nThe fast continues past this point — it ends at parana, not at the tithi.`,
      dotClass: '',
      hasLine: true,
    },
    {
      title: 'Parana window opens',
      subtitle: `${nextDayNum} ${selectedItem.month}, sunrise · 06:02 AM`,
      dotClass: 'end',
      hasLine: true,
    },
    {
      title: 'Window closes — Dwadashi ends',
      subtitle: `${nextDayNum} ${selectedItem.month} · 08:17 AM\nBreak the fast before this.`,
      dotClass: 'end',
      hasLine: false,
    },
  ];

  const panchangTableRows: PanchangTableRow[] = [
    {
      label: 'Tithi',
      value: selectedItem.tithi || `${selectedItem.month} Krishna Ekadashi`,
      subValue: `Begins 11:42 PM (${selectedItem.day - 1} ${selectedItem.month}) · ends 10:18 PM (${shortDate})`,
    },
    {
      label: 'Paksha',
      value: selectedItem.tithi.includes('Shukla') ? 'Shukla — waxing' : 'Krishna — waning',
    },
    {
      label: 'Nakshatra',
      value: 'Pushya',
      subValue: 'Until 04:12 PM',
    },
    {
      label: 'Yoga · Karana',
      value: 'Harshana · Balava',
    },
    {
      label: 'Sunrise · Sunset',
      value: '06:02 AM · 06:35 PM',
    },
    {
      label: 'Rahu Kaal',
      value: '03:20 PM – 04:53 PM',
      subValue: 'Avoided by convention for new beginnings',
    },
    {
      label: 'Parana window',
      value: `${nextDayNum} ${selectedItem.month}, 06:02 AM – 08:17 AM`,
      subValue: 'Approximately 2h 15m',
    },
  ];

  // Try querying FAQs from DB or fallback
  let faqs = DEFAULT_FAQS;
  try {
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      const dbFaqs = await prisma.faq.findMany({
        where: { category: { in: ['Panchang', 'Vrat', 'General'] } },
        take: 4,
      });
      if (dbFaqs && dbFaqs.length > 0) {
        faqs = dbFaqs.map((f) => ({ question: f.question, answer: f.answer }));
      }
    }
  } catch (e) { }

  return {
    id: selectedItem.id,
    slug,
    name,
    category,
    dateFormatted,
    shortDate,
    tithiFullText: `${selectedItem.tithi} · Purnimanta · computed for New Delhi`,
    location: 'New Delhi, India',
    convention: 'Purnimanta',
    warningPillText: `⚠ ${category} dates differ by city — Vaishnava observers may see ${nextDayNum} ${selectedItem.month}`,
    
    paranaDateStr,
    paranaTimeWindow,
    paranaDurationStr: 'Break the fast inside this window on the morning after. Duration approximately 2 hours 15 minutes.',
    paranaReasonNote: 'Why the window closes. Parana must happen after sunrise and before Dwadashi tithi ends. Miss it and the tradition treats the vrat as incomplete — so this is the one timing worth setting an alarm for.',
    fastBeginsStr,
    tithiBeginsStr,
    tithiEndsStr,
    dwadashiEndsStr,

    timelinePoints,
    verticalTimelineItems,
    panchangTableRows,

    guide: {
      title: guideTitle,
      subtitle: guideSubtitle,
      description: guideDescription,
      href: guideHref,
    },

    faqs,
    recurringVrats,

    sidebar: {
      fastLength: '~26 hours',
      grains: 'Avoided',
      water: 'Permitted',
      nirjala: 'Optional',
      panditNeeded: 'No',
      paranaDate: `${nextDayNum} ${selectedItem.month} morning`,
      intelligenceText: `${name} observance rules apply for household fasting. What counts as a grain — and what surprisingly does not — is explained once, and applies to all observances.`,
      intelligenceHref: guideHref,
    },
  };
}
