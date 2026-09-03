import * as Astronomy from 'astronomy-engine';
import { prisma } from '@/lib/db';

export interface PanchangCalcResult {
  dateStr: string; // e.g. "1/1/2026"
  dateObj: Date;
  year: number;
  tithiName: string;
  tithiDetail: string;
  paksha: string;
  pakshaDetail: string;
  nakshatra: string;
  isAuspicious: boolean;
  sunrise: string;
  sunset: string;
  location: string;
  source: string;
  lastSynced: string;
}

function getAyanamsa(date: Date): number {
  const year = date.getUTCFullYear();
  const startOfYear = new Date(Date.UTC(year, 0, 0));
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000);
  const fracYear = year + dayOfYear / 365.25;
  return 23.85 + (fracYear - 1950) * 0.01396;
}

export function calculatePanchangForDate(
  year: number,
  month: number, // 1-indexed (1 to 12)
  day: number,
  lat = 28.6139,
  lon = 77.2090,
  locationName = 'New Delhi, India'
): PanchangCalcResult {
  const observer = new Astronomy.Observer(lat, lon, 216);

  // UTC noon for the given date in New Delhi (5:30 IST offset -> 06:30 UTC is 12:00 IST)
  const dateUtc = new Date(Date.UTC(year, month - 1, day, 6, 30, 0));
  const dateObj = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

  // 1. Sunrise & Sunset
  const searchDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const sunriseTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, searchDate, 1);
  const sunsetTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, searchDate, 1);

  const formatTime = (timeObj: any): string => {
    if (!timeObj || !timeObj.date) return '--:--';
    const date = new Date(timeObj.date.getTime() + 5.5 * 3600 * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const sunrise = formatTime(sunriseTime);
  const sunset = formatTime(sunsetTime);

  // 2. Moon & Sun ecliptic positions
  const sunPos = Astronomy.SunPosition(dateUtc);
  const moonVec = Astronomy.GeoVector(Astronomy.Body.Moon, dateUtc, true);
  const moonPos = Astronomy.Ecliptic(moonVec);

  const sunLon = sunPos.elon;
  const moonLon = moonPos.elon;

  // Tithi calculation
  const tithiAngle = (moonLon - sunLon + 360) % 360;
  const tithiIndex = Math.floor(tithiAngle / 12) % 30;

  const tithiNames = [
    'Prathama', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
    'Prathama', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
  ];

  const tithiDetails = [
    '1st day', '2nd day', '3rd day', '4th day', '5th day',
    '6th day', '7th day', '8th day', '9th day', '10th day',
    '11th day', '12th day', '13th day', '14th day', 'Full Moon',
    '1st day', '2nd day', '3rd day', '4th day', '5th day',
    '6th day', '7th day', '8th day', '9th day', '10th day',
    '11th day', '12th day', '13th day', '14th day', 'New Moon'
  ];

  const tithiName = tithiNames[tithiIndex];
  const tithiDetail = tithiDetails[tithiIndex];
  const paksha = tithiIndex < 15 ? 'Shukla' : 'Krishna';
  const pakshaDetail = tithiIndex < 15 ? 'Waxing moon' : 'Waning moon';

  // Nakshatra calculation
  const ayanamsa = getAyanamsa(dateUtc);
  const siderealMoonLon = (moonLon - ayanamsa + 360) % 360;
  const nakshatraIndex = Math.floor(siderealMoonLon / 13.333333333333334) % 27;

  const nakshatraNames = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
    'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
    'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
    'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati'
  ];

  const auspiciousNakshatras = [
    'Rohini', 'Pushya', 'Swati', 'Shravana', 'Anuradha', 'Hasta',
    'Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Ashwini'
  ];

  const nakshatra = nakshatraNames[nakshatraIndex];
  const isAuspicious = auspiciousNakshatras.includes(nakshatra);

  const todayStr = new Date().toLocaleDateString('en-GB');

  return {
    dateStr: `${day}/${month}/${year}`,
    dateObj,
    year,
    tithiName,
    tithiDetail,
    paksha,
    pakshaDetail,
    nakshatra,
    isAuspicious,
    sunrise,
    sunset,
    location: locationName,
    source: 'AUTO SYNCED',
    lastSynced: todayStr,
  };
}

export function generateYearPanchang(year: number): PanchangCalcResult[] {
  const results: PanchangCalcResult[] = [];
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonths = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  for (let m = 1; m <= 12; m++) {
    const totalDays = daysInMonths[m - 1];
    for (let d = 1; d <= totalDays; d++) {
      results.push(calculatePanchangForDate(year, m, d));
    }
  }

  return results;
}

export async function syncPanchangEntriesForYear(year: number): Promise<number> {
  const entries = generateYearPanchang(year);
  let syncedCount = 0;

  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    const existingEntries = await prisma.panchangEntry.findMany({
      where: { year },
      select: { dateObj: true, source: true },
    });
    const manualDateSet = new Set(
      existingEntries.filter((e) => e.source === 'MANUAL').map((e) => e.dateObj.toISOString())
    );

    for (const entry of entries) {
      if (manualDateSet.has(entry.dateObj.toISOString())) {
        // Skip manual override entry to protect user edits
        continue;
      }

      await prisma.panchangEntry.upsert({
        where: { dateObj: entry.dateObj },
        update: {
          date: entry.dateStr,
          year: entry.year,
          tithiName: entry.tithiName,
          tithiDetail: entry.tithiDetail,
          paksha: entry.paksha,
          pakshaDetail: entry.pakshaDetail,
          nakshatra: entry.nakshatra,
          isAuspicious: entry.isAuspicious,
          sunrise: entry.sunrise,
          sunset: entry.sunset,
          location: entry.location,
          source: entry.source,
          lastSynced: entry.lastSynced,
        },
        create: {
          date: entry.dateStr,
          dateObj: entry.dateObj,
          year: entry.year,
          tithiName: entry.tithiName,
          tithiDetail: entry.tithiDetail,
          paksha: entry.paksha,
          pakshaDetail: entry.pakshaDetail,
          nakshatra: entry.nakshatra,
          isAuspicious: entry.isAuspicious,
          sunrise: entry.sunrise,
          sunset: entry.sunset,
          location: entry.location,
          source: entry.source,
          lastSynced: entry.lastSynced,
          status: 'PUBLISHED',
        },
      });
      syncedCount++;
    }
  }

  return syncedCount;
}

export async function syncNextNDays(days = 45): Promise<number> {
  const now = new Date();
  const results: PanchangCalcResult[] = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth() + 1;
    const dayNum = d.getUTCDate();
    results.push(calculatePanchangForDate(y, m, dayNum));
  }

  let syncedCount = 0;

  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    const existingEntries = await prisma.panchangEntry.findMany({
      where: {
        dateObj: {
          in: results.map((r) => r.dateObj),
        },
      },
      select: { dateObj: true, source: true },
    });
    const manualDateSet = new Set(
      existingEntries.filter((e) => e.source === 'MANUAL').map((e) => e.dateObj.toISOString())
    );

    for (const entry of results) {
      if (manualDateSet.has(entry.dateObj.toISOString())) {
        // Skip manual override entry to protect user edits
        continue;
      }

      await prisma.panchangEntry.upsert({
        where: { dateObj: entry.dateObj },
        update: {
          date: entry.dateStr,
          year: entry.year,
          tithiName: entry.tithiName,
          tithiDetail: entry.tithiDetail,
          paksha: entry.paksha,
          pakshaDetail: entry.pakshaDetail,
          nakshatra: entry.nakshatra,
          isAuspicious: entry.isAuspicious,
          sunrise: entry.sunrise,
          sunset: entry.sunset,
          location: entry.location,
          source: entry.source,
          lastSynced: entry.lastSynced,
        },
        create: {
          date: entry.dateStr,
          dateObj: entry.dateObj,
          year: entry.year,
          tithiName: entry.tithiName,
          tithiDetail: entry.tithiDetail,
          paksha: entry.paksha,
          pakshaDetail: entry.pakshaDetail,
          nakshatra: entry.nakshatra,
          isAuspicious: entry.isAuspicious,
          sunrise: entry.sunrise,
          sunset: entry.sunset,
          location: entry.location,
          source: entry.source,
          lastSynced: entry.lastSynced,
          status: 'PUBLISHED',
        },
      });
      syncedCount++;
    }
  }

  return syncedCount;
}

