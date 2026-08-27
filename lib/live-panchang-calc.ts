import {
  Observer,
  getPanchangamDetails,
  calculateRahuKalam,
  tithiNames,
  nakshatraNames,
  yogaNames,
} from '@ishubhamx/panchangam-js';

const DELHI_LATITUDE = 28.6139;
const DELHI_LONGITUDE = 77.209;

const IST_OFFSET_MINUTES = 330;

function formatTime(date: Date | null): string {
  if (!date) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatTimeRange(
  start: Date | null | undefined,
  end: Date | null | undefined,
): string {
  if (!start || !end) {
    return '—';
  }

  return `${formatTime(start)} – ${formatTime(end)}`;
}

export function calculateLivePanchangData(date = new Date()) {
  const observer = new Observer(
    DELHI_LATITUDE,
    DELHI_LONGITUDE,
    0,
  );

  const options = {
    timezoneOffset: IST_OFFSET_MINUTES,
  };

  const panchang = getPanchangamDetails(
    date,
    observer,
    options,
  );

  // Tithi
  const tithiValue = panchang.tithi;

  const tithiName =
    typeof tithiValue === 'number'
      ? tithiNames[tithiValue]
      : String(tithiValue);

  // Nakshatra
  const nakshatraValue = panchang.nakshatra;

  const nakshatraName =
    typeof nakshatraValue === 'number'
      ? nakshatraNames[nakshatraValue]
      : String(nakshatraValue);

  // Yoga
  const yogaValue = panchang.yoga;

  const yogaName =
    typeof yogaValue === 'number'
      ? yogaNames[yogaValue]
      : String(yogaValue);

  // Karana
  const karanaName = String(panchang.karana);

  // Paksha
  const pakshaName = String(panchang.paksha);

  // Rahu Kalam
  let rahuKaal = '—';

  if (panchang.sunrise && panchang.sunset) {
    const vara =
      typeof panchang.vara === 'number'
        ? panchang.vara
        : date.getDay();

    const rahu = calculateRahuKalam(
      panchang.sunrise,
      panchang.sunset,
      vara,
    );

    if (rahu) {
      rahuKaal = formatTimeRange(
        rahu.start,
        rahu.end,
      );
    }
  }

  return {
    tithiHeader: tithiName,

    formattedFullDate: formatDate(date),

    pakshaDesc: pakshaName,

    nakshatra: nakshatraName,

    sunriseSunset: formatTimeRange(
      panchang.sunrise,
      panchang.sunset,
    ),

    rahuKaal,

    yogaKarana: `${yogaName} · ${karanaName}`,

    sunrise: panchang.sunrise,
    sunset: panchang.sunset,

    raw: panchang,
  };
}