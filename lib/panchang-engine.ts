// lib/panchang-engine.ts
import 'server-only';
import { getPanchangam, Observer } from '@ishubhamx/panchangam-js';
import type { ObservanceItem } from './vrat-calendar-data';

const DEFAULT_OBSERVER = new Observer(28.6139, 77.2090, 216);

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function categorize(name: string): ObservanceItem['category'] {
    const n = name.toLowerCase();
    if (n.includes('ekadashi')) return 'Ekadashi';
    if (n.includes('pradosh')) return 'Pradosh';
    if (n.includes('chaturthi') || n.includes('sankashti')) return 'Chaturthi';
    if (n.includes('purnima')) return 'Purnima';
    if (n.includes('amavasya')) return 'Amavasya';
    return 'Festival';
}

export function generateVratCalendar(
    year: number,
    observer: Observer = DEFAULT_OBSERVER
): ObservanceItem[] {
    const results: ObservanceItem[] = [];
    const seen = new Set<string>();

    for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(Date.UTC(year, month, day, 6, 0, 0));
            const data = getPanchangam(date, observer);

            const festivalList = (data as any).festivals ?? [];

            for (const fest of festivalList) {
                const key = `${fest.name}-${fest.date}`;
                if (seen.has(key)) continue;
                seen.add(key);

                results.push({
                    id: `${year}-${month}-${day}-${fest.name}`.replace(/\s+/g, '-').toLowerCase(),
                    day,
                    month: MONTH_SHORT[month],
                    monthIndex: month,
                    year,
                    weekday: WEEKDAYS[date.getUTCDay()],
                    name: fest.name,
                    note: fest.description,
                    category: categorize(fest.name),
                    tithi: `${fest.masa ?? ''} ${fest.paksha ?? ''} ${fest.name}`.trim(),
                });
            }
        }
    }

    return results.sort((a, b) => a.monthIndex - b.monthIndex || a.day - b.day);
}