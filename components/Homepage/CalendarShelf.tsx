'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DynamicCalendarItem {
  id: string;
  name: string;
  tithi: string;
  description: string;
  dateStr: string;
  daysAwayText: string;
  themeClass: string;
  guideLink: string;
  kitText?: string;
}

const DEFAULT_CALENDAR_ITEMS: DynamicCalendarItem[] = [
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

export interface CalendarShelfProps {
  initialItems?: DynamicCalendarItem[];
}

export const CalendarShelf: React.FC<CalendarShelfProps> = ({ initialItems }) => {
  const [items, setItems] = useState<DynamicCalendarItem[]>(initialItems || DEFAULT_CALENDAR_ITEMS);

  useEffect(() => {
    if (initialItems && initialItems.length > 0) return;

    let isMounted = true;
    async function loadCalendarShelf() {
      try {
        const res = await fetch('/api/public/calendar-shelf');
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data) && data.data.length > 0 && isMounted) {
          setItems(data.data);
        }
      } catch (err) {
        console.warn('[CalendarShelf] Failed to fetch calendar shelf items:', err);
      }
    }
    loadCalendarShelf();
    return () => {
      isMounted = false;
    };
  }, [initialItems]);

  return (
    <section className="sec py-8 md:py-12">
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="sec-head flex flex-col md:flex-row md:items-end justify-between gap-2 md:gap-4 mb-4 md:mb-8">
          <div>
            <div className="sec-ey">THE NEXT FOUR WEEKS</div>
            <div className="sec-t text-xl md:text-3xl font-bold">What's coming, and when</div>
            <p className="sec-s text-xs md:text-sm">Every guide is complete before the date arrives. Kit optional, always.</p>
          </div>
          <Link className="sec-all text-xs md:text-sm font-semibold whitespace-nowrap self-start md:self-auto" href="/panchang/festival-calendar">
            Full 2026 calendar ›
          </Link>
        </div>
        <div className="shelf grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {items.map((item, idx) => (
            <Link key={item.id || idx} className="scard" href={item.guideLink || '/ritual-guides'}>
              <div className={`sc-top ${item.themeClass || 'sc-hart'}`}>
                <span className="sc-when">{item.daysAwayText}</span>
              </div>
              <div className="sc-b">
                <div className="sc-n">{item.name}</div>
                <div className="sc-d">{item.tithi}</div>
                <p className="sc-s">{item.description}</p>
                <div className="sc-links">
                  <span className="sc-l1">Read guide ›</span>
                  {item.kitText && <span className="sc-l2">{item.kitText}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
