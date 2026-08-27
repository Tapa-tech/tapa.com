import { NextResponse } from 'next/server';
import { calculateLivePanchangData } from '@/lib/live-panchang-calc';
import { generateVratCalendar } from '@/lib/panchang-engine';

function formatTime(date: Date | null | undefined): string | null {
    if (!date) return null;
    return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(date);
}

function getNextMajorDate() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentYear = now.getFullYear();

    let calendar = generateVratCalendar(currentYear).filter(
        (item) => item.category === 'Festival'
    );

    let upcoming = calendar
        .filter((item) => new Date(item.year, item.monthIndex, item.day) >= todayStart)
        .sort((a, b) => {
            const da = new Date(a.year, a.monthIndex, a.day).getTime();
            const db = new Date(b.year, b.monthIndex, b.day).getTime();
            return da - db;
        });

    if (upcoming.length === 0) {
        const nextYearCalendar = generateVratCalendar(currentYear + 1).filter(
            (item) => item.category === 'Festival'
        );
        upcoming = nextYearCalendar.sort((a, b) => {
            const da = new Date(a.year, a.monthIndex, a.day).getTime();
            const db = new Date(b.year, b.monthIndex, b.day).getTime();
            return da - db;
        });
    }

    const next = upcoming[0];
    if (!next) return null;

    return {
        name: next.name,
        day: next.day,
        month: next.month,
        note: next.note ?? '',
        label: `${next.name}, ${next.day} ${next.month}${next.note ? '. ' + next.note : ''}`,
    };
}

export async function GET() {
    const data = calculateLivePanchangData();
    const raw = data.raw as any;

    const dateLabel = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date());

    const nextMajorDate = getNextMajorDate();

    return NextResponse.json({
        tithiHeader: data.tithiHeader,
        formattedFullDate: data.formattedFullDate,
        pakshaDesc: data.pakshaDesc,
        sunriseSunset: data.sunriseSunset,
        rahuKaal: data.rahuKaal,
        yogaKarana: data.yogaKarana,

        dateLabel,
        tithiFull: `${data.pakshaDesc} ${data.tithiHeader}`,
        tithiName: data.tithiHeader,
        tithiEndTime: formatTime(raw?.tithiEndTime),
        nakshatra: data.nakshatra,
        nakshatraEndTime: formatTime(raw?.nakshatraEndTime),
        rashi: raw?.moonRashi?.name ?? raw?.rashis?.[0]?.name ?? '—',
        sunrise: formatTime(data.sunrise),
        sunset: formatTime(data.sunset),

        nextMajorDate,
    });
}