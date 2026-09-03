import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { MOCK_CALENDAR_SHELF } from '@/lib/mock-data';

export interface CalendarShelfItem {
  id: string;
  name: string;
  tithi: string;
  description: string;
  dateStr: string;
  daysAwayText: string;
  themeClass: string; // "sc-hart" | "sc-gan" | "sc-radha" | "sc-anant"
  guideLink: string;
  kitText?: string;
}

const DEFAULT_CALENDAR_ITEMS: CalendarShelfItem[] = [
  {
    id: 'cal-hartalika',
    name: 'Hartalika Teej',
    tithi: '13 September · Bhadrapada Shukla Tritiya',
    description: 'The sand Shivalinga, the nirjala question, and why this is not the same vrat as Hariyali Teej.',
    dateStr: '13 SEP',
    daysAwayText: 'IN 6 DAYS',
    themeClass: 'sc-hart',
    guideLink: '/ritual-guides/hartalika-teej',
    kitText: '· Kit ₹950',
  },
  {
    id: 'cal-ganesh',
    name: 'Ganesh Chaturthi',
    tithi: '14 September · Bhadrapada Shukla Chaturthi',
    description: 'Prana pratishtha at midday. The moon-sighting story is a narrative, not a warning.',
    dateStr: '14 SEP',
    daysAwayText: 'IN 7 DAYS',
    themeClass: 'sc-gan',
    guideLink: '/ritual-guides/ganesh-chaturthi',
    kitText: '· Kit ₹1,650',
  },
  {
    id: 'cal-radha',
    name: 'Radha Ashtami',
    tithi: '19 September · Bhadrapada Shukla Ashtami',
    description: "Radha's appearance day. Observed most strongly in Barsana and the Braj region.",
    dateStr: '19 SEP',
    daysAwayText: 'IN 12 DAYS',
    themeClass: 'sc-radha',
    guideLink: '/ritual-guides',
  },
  {
    id: 'cal-anant',
    name: 'Anant Chaturdashi',
    tithi: '23 September · Ganesh Visarjan',
    description: 'The closing of the ten-day observance. Immersion, and what to do if a water body is not available.',
    dateStr: '23 SEP',
    daysAwayText: 'IN 16 DAYS',
    themeClass: 'sc-anant',
    guideLink: '/ritual-guides',
  },
];

export async function GET() {
  try {
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        const upcomingEntries = await prisma.panchangEntry.findMany({
          where: { isAuspicious: true },
          select: {
            id: true,
            tithiName: true,
            date: true,
            paksha: true,
            tithiDetail: true,
            dateObj: true,
          },
          take: 4,
          orderBy: { dateObj: 'asc' },
        });

        if (upcomingEntries && upcomingEntries.length >= 4) {
          const mappedItems: CalendarShelfItem[] = upcomingEntries.map((entry, idx) => {
            const themes = ['sc-hart', 'sc-gan', 'sc-radha', 'sc-anant'];
            const defaultMatch = DEFAULT_CALENDAR_ITEMS[idx] || DEFAULT_CALENDAR_ITEMS[0];
            return {
              id: entry.id,
              name: entry.tithiName || defaultMatch.name,
              tithi: `${entry.date} · ${entry.paksha} ${entry.tithiDetail}`,
              description: defaultMatch.description,
              dateStr: entry.date,
              daysAwayText: defaultMatch.daysAwayText,
              themeClass: themes[idx % themes.length],
              guideLink: defaultMatch.guideLink,
              kitText: defaultMatch.kitText,
            };
          });

          return NextResponse.json({ success: true, data: mappedItems });
        }
      } catch (dbErr) {
        console.warn('[Calendar Shelf API] DB query warning:', dbErr);
      }
    }

    return NextResponse.json({ success: true, data: DEFAULT_CALENDAR_ITEMS });
  } catch (err: any) {
    console.error('[Calendar Shelf API] Error:', err);
    return NextResponse.json({ success: true, data: DEFAULT_CALENDAR_ITEMS });
  }
}
