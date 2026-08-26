import * as Astronomy from 'astronomy-engine';

export interface LivePanchangData {
  tithiHeader: string;       // e.g. "Bhadrapada Krishna Panchami"
  formattedFullDate: string; // e.g. "Monday, 7 September 2026 · Purnimanta"
  pakshaDesc: string;        // e.g. "Krishna — waning"
  nakshatra: string;         // e.g. "Rohini"
  sunriseSunset: string;     // e.g. "6:19 / 18:32"
  rahuKaal: string;          // e.g. "12:15 – 13:48"
  yogaKarana: string;        // e.g. "Vyaghata · Bava"
}

function getAyanamsa(date: Date): number {
  const year = date.getUTCFullYear();
  const startOfYear = new Date(Date.UTC(year, 0, 0));
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000);
  const fracYear = year + dayOfYear / 365.25;
  return 23.85 + (fracYear - 1950) * 0.01396;
}

export function calculateLivePanchangData(targetDate = new Date(), lat = 28.6139, lon = 77.2090): LivePanchangData {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();

  const observer = new Astronomy.Observer(lat, lon, 216);

  // UTC noon for given date in New Delhi (5:30 IST offset => 06:30 UTC is 12:00 IST)
  const dateUtc = new Date(Date.UTC(year, month - 1, day, 6, 30, 0));
  const searchDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

  // 1. Sunrise & Sunset
  const sunriseTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, searchDate, 1);
  const sunsetTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, searchDate, 1);

  const getMinutes = (timeObj: any): number => {
    if (!timeObj || !timeObj.date) return 6 * 60;
    const d = new Date(timeObj.date.getTime() + 5.5 * 3600 * 1000);
    return d.getUTCHours() * 60 + d.getUTCMinutes();
  };

  const formatMin = (m: number): string => {
    const hrs = Math.floor(m / 60);
    const mins = Math.floor(m % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}`;
  };

  const srMin = getMinutes(sunriseTime);
  const ssMin = getMinutes(sunsetTime);
  const sunrise = formatMin(srMin);
  const sunset = formatMin(ssMin);

  // 2. Rahu Kaal
  const daylight = ssMin - srMin;
  const period = daylight / 8;
  const dayOfWeek = targetDate.getDay(); // 0 = Sun, 1 = Mon, ...

  // Sun: 8, Mon: 2, Tue: 7, Wed: 5, Thu: 6, Fri: 4, Sat: 3
  const rahuPeriodMap = [8, 2, 7, 5, 6, 4, 3];
  const pIdx = rahuPeriodMap[dayOfWeek];
  const rahuStartMin = srMin + (pIdx - 1) * period;
  const rahuEndMin = srMin + pIdx * period;
  const rahuKaal = `${formatMin(rahuStartMin)} – ${formatMin(rahuEndMin)}`;

  // 3. Moon & Sun positions
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

  const tithiName = tithiNames[tithiIndex];
  const paksha = tithiIndex < 15 ? 'Shukla' : 'Krishna';
  const pakshaDesc = tithiIndex < 15 ? 'Shukla — waxing' : 'Krishna — waning';

  // Nakshatra
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
  const nakshatra = nakshatraNames[nakshatraIndex];

  // Yoga
  const yogaAngle = (sunLon + moonLon - 2 * ayanamsa + 720) % 360;
  const yogaIndex = Math.floor(yogaAngle / 13.333333333333334) % 27;
  const yogaNames = [
    'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
    'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata',
    'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
  ];
  const yoga = yogaNames[yogaIndex];

  // Karana
  const karanaIndex = Math.floor(tithiAngle / 6);
  let karana = '';
  if (karanaIndex === 0) {
    karana = 'Kintughna';
  } else if (karanaIndex >= 57) {
    const fixedKaranas = ['Shakuni', 'Chatushpada', 'Naga'];
    karana = fixedKaranas[karanaIndex - 57];
  } else {
    const movableKaranas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti'];
    karana = movableKaranas[(karanaIndex - 1) % 7];
  }

  // Vedic Lunar Month approximation
  const monthNames = [
    'Chaitra', 'Vaisakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada',
    'Ashwin', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
  ];
  const sunMonthIdx = Math.floor(((sunLon - ayanamsa + 360) % 360) / 30);
  const vedicMonth = monthNames[(sunMonthIdx + 5) % 12];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekName = dayNames[dayOfWeek];

  const monthShorts = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedFullDate = `${dayOfWeekName}, ${day} ${monthShorts[month - 1]} ${year}`;

  return {
    tithiHeader: `${vedicMonth} ${paksha} ${tithiName}`,
    formattedFullDate: `${formattedFullDate} · Purnimanta`,
    pakshaDesc,
    nakshatra,
    sunriseSunset: `${sunrise} / ${sunset}`,
    rahuKaal,
    yogaKarana: `${yoga} · ${karana}`,
  };
}
