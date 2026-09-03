import { prisma } from '@/lib/db';

export interface FestivalEvent {
  id: string;
  name: string;
  date: string;
  tithi: string;
  muhurat: string;
  description: string;
  guideUrl?: string;
  kitUrl?: string;
  year: number;
}

export interface FestivalDefinition {
  id: string;
  name: string;
  paksha: string;
  tithiName: string;
  targetMonthIndex: number; // 0-indexed month (0 = Jan, 1 = Feb, etc.)
  fallbackDateStr: string;
  muhurat: string;
  description: string;
  guideUrl?: string;
  kitUrl?: string;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatUtcDateString(dObj: Date): string {
  const day = dObj.getUTCDate();
  const monthStr = MONTH_NAMES[dObj.getUTCMonth()];
  const year = dObj.getUTCFullYear();
  return `${day} ${monthStr} ${year}`;
}

export const KNOWN_FESTIVAL_DEFINITIONS: FestivalDefinition[] = [
  {
    id: 'maha-shivaratri',
    name: 'Maha Shivaratri',
    paksha: 'Krishna',
    tithiName: 'Chaturdashi',
    targetMonthIndex: 1, // Feb
    fallbackDateStr: '15 February 2026',
    muhurat: 'Nishita Kaal: 12:09 AM – 01:00 AM (16 Feb)',
    description: 'All-night vigil, Shiva abhishekam with bilva leaves and sacred offerings.',
    guideUrl: '/ritual-guides/maha-shivaratri',
  },
  {
    id: 'holi-holika-dahan',
    name: 'Holi & Holika Dahan',
    paksha: 'Shukla',
    tithiName: 'Purnima',
    targetMonthIndex: 2, // Mar
    fallbackDateStr: '3 March 2026',
    muhurat: 'Holika Dahan: 06:24 PM – 08:51 PM',
    description: 'Celebration of the victory of Prahlada and Narasimha over Holika.',
  },
  {
    id: 'chaitra-navratri',
    name: 'Chaitra Navratri & Ram Navami',
    paksha: 'Shukla',
    tithiName: 'Prathama',
    targetMonthIndex: 2, // Mar
    fallbackDateStr: '19 March – 27 March 2026',
    muhurat: 'Ghatasthapana: 06:23 AM – 10:14 AM',
    description: 'Nine days of Durga pujan concluding with Shri Ram Navami birth celebration.',
    guideUrl: '/ritual-guides/chaitra-navratri',
  },
  {
    id: 'hanuman-jayanti',
    name: 'Hanuman Jayanti',
    paksha: 'Shukla',
    tithiName: 'Purnima',
    targetMonthIndex: 3, // Apr
    fallbackDateStr: '2 April 2026',
    muhurat: 'Sunrise Puja: 06:09 AM',
    description: 'Recitation of Sundarkand, Hanuman Chalisa, and vermilion offering.',
    guideUrl: '/ritual-guides/seven-kandas',
  },
  {
    id: 'hartalika-teej',
    name: 'Hartalika Teej',
    paksha: 'Shukla',
    tithiName: 'Tritiya',
    targetMonthIndex: 8, // Sep
    fallbackDateStr: '14 September 2026',
    muhurat: 'Pratahkal Puja: 06:06 AM – 08:34 AM',
    description: 'Nirjala vrat observed for martial harmony and devotion to Shiva-Parvati.',
    guideUrl: '/ritual-guides/hartalika-teej',
  },
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    paksha: 'Shukla',
    tithiName: 'Chaturthi',
    targetMonthIndex: 8, // Sep
    fallbackDateStr: '15 September 2026',
    muhurat: 'Madhyahna Ganesha Puja: 11:03 AM – 01:32 PM',
    description: 'Installation of Ganesha idol, Modak offering, and 10-day Utsav.',
    guideUrl: '/ritual-guides/ganesh-chaturthi',
  },
  {
    id: 'sharad-navratri',
    name: 'Sharad Navratri (Ghatasthapana)',
    paksha: 'Shukla',
    tithiName: 'Prathama',
    targetMonthIndex: 9, // Oct
    fallbackDateStr: '11 October 2026',
    muhurat: 'Ghatasthapana: 06:19 AM – 10:12 AM',
    description: 'Nine divine nights of Maa Durga, Akhand Jyoti, and Chandi path.',
    guideUrl: '/ritual-guides/sharad-navratri',
  },
  {
    id: 'deepawali-lakshmi-puja',
    name: 'Deepawali & Lakshmi Pujan',
    paksha: 'Krishna',
    tithiName: 'Amavasya',
    targetMonthIndex: 10, // Nov
    fallbackDateStr: '8 November 2026',
    muhurat: 'Pradosh Kaal Lakshmi Puja: 05:31 PM – 07:27 PM',
    description: 'Welcoming Goddess Lakshmi & Lord Kuber with ghee diyas and shubh labh sthapana.',
    guideUrl: '/ritual-guides/diwali-lakshmi-puja',
  },
];

/**
 * Server-side service function that queries PanchangEntry records in PostgreSQL
 * and maps them into structured FestivalEvent objects for the Festival Calendar UI.
 */
export async function getFestivalsForYear(year = 2026): Promise<FestivalEvent[]> {
  try {
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      const panchangEntries = await prisma.panchangEntry.findMany({
        where: { year },
        select: {
          id: true,
          date: true,
          dateObj: true,
          tithiName: true,
          paksha: true,
        },
        orderBy: { dateObj: 'asc' },
      });

      if (panchangEntries && panchangEntries.length > 0) {
        // Build O(1) lookup Map keyed by "monthIndex:paksha:tithi"
        const entryMap = new Map<string, typeof panchangEntries[0]>();
        for (const pe of panchangEntries) {
          const m = pe.dateObj.getUTCMonth();
          const key = `${m}:${pe.paksha.toLowerCase()}:${pe.tithiName.toLowerCase()}`;
          entryMap.set(key, pe);
        }

        return KNOWN_FESTIVAL_DEFINITIONS.map((def) => {
          let matchedEntry = entryMap.get(`${def.targetMonthIndex}:${def.paksha.toLowerCase()}:${def.tithiName.toLowerCase()}`);
          if (!matchedEntry) {
            matchedEntry = panchangEntries.find((pe) => {
              const m = pe.dateObj.getUTCMonth();
              return (
                m === def.targetMonthIndex &&
                pe.paksha.toLowerCase() === def.paksha.toLowerCase() &&
                pe.tithiName.toLowerCase().includes(def.tithiName.toLowerCase())
              );
            });
          }

          let computedDateStr = def.fallbackDateStr;
          if (matchedEntry) {
            computedDateStr = formatUtcDateString(new Date(matchedEntry.dateObj));
          } else if (year !== 2026) {
            // Adjust fallback string year if requesting non-2026 year without DB match
            computedDateStr = def.fallbackDateStr.replace('2026', String(year));
          }

          return {
            id: def.id,
            name: def.name,
            date: computedDateStr,
            tithi: matchedEntry
              ? `${matchedEntry.paksha} ${matchedEntry.tithiName}`
              : `${def.paksha} ${def.tithiName}`,
            muhurat: def.muhurat,
            description: def.description,
            guideUrl: def.guideUrl,
            kitUrl: def.kitUrl,
            year,
          };
        });
      }
    }
  } catch (err: any) {
    console.warn('[Festivals Service] DB query fallback:', err?.message || err);
  }

  // Fallback if DB is disconnected or empty
  return KNOWN_FESTIVAL_DEFINITIONS.map((def) => ({
    id: def.id,
    name: def.name,
    date: year === 2026 ? def.fallbackDateStr : def.fallbackDateStr.replace('2026', String(year)),
    tithi: `${def.paksha} ${def.tithiName}`,
    muhurat: def.muhurat,
    description: def.description,
    guideUrl: def.guideUrl,
    kitUrl: def.kitUrl,
    year,
  }));
}
