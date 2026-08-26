'use client';

import React, { useState } from 'react';

export interface RitualCardData {
  categoryLabel: string;
  title: string;
  subtitle: string;
  dateText: string;
  tithiText: string;
  locationText: string;
  timingsLabel?: string;
  timings: Array<{
    key: string;
    value: string;
    note: string;
  }>;
  timingWarning: string;
  samagriLabel?: string;
  samagri: Array<{
    item: string;
    sub?: string;
  }>;
  samagriNote: string;
  vidhiLabel?: string;
  vidhi: Array<{
    num: number;
    text: string;
    note?: string;
  }>;
  mantraLabel?: string;
  mantraDevanagari: string;
  mantraTransliteration: string;
  mantraContext: string;
  fastingLabel?: string;
  fastingOptions: Array<{
    title: string;
    desc: string;
  }>;
  fastingNote: string;
  sourceText: string;
  panchangSourceText: string;
  tagline: string;
  guideUrl: string;
}

// Preset datasets for major ritual guides with fallback generator for dynamic guides
export function getRitualCardData(slug: string, fallbackTitle: string): RitualCardData {
  const cleanSlug = (slug || '').toLowerCase().trim();

  if (cleanSlug.includes('navratri') || cleanSlug.includes('sharad')) {
    return {
      categoryLabel: 'RITUAL CARD · FESTIVE PUJANS',
      title: 'Sharad Navratri Ghatasthapana',
      subtitle: 'Day 1 of nine · installation of the kalash and the akhand jyoti',
      dateText: 'Sun 11 Oct 2026',
      tithiText: 'Ashwin Shukla Pratipada',
      locationText: 'New Delhi',
      timingsLabel: '1 · WHEN',
      timings: [
        { key: 'MORNING — PREFERRED', value: '6:19 – 10:12 AM', note: 'While Pratipada prevails' },
        { key: 'ABHIJIT — FALLBACK', value: '11:44 – 12:31 PM', note: 'If the morning is missed' },
      ],
      timingWarning: 'Not performed after Hindu midday. If both windows pass, begin the vrat the next morning — nothing is void.',
      samagriLabel: '2 · WHAT YOU NEED',
      samagri: [
        { item: 'Kalash — brass or copper', sub: 'with mango leaves, coconut, coin, supari' },
        { item: 'Clay pot, soil, barley seeds' },
        { item: 'Red cloth and chunri' },
        { item: 'Durga idol or framed image' },
        { item: 'Akhand jyoti vessel', sub: 'large enough for nine days of ghee' },
        { item: 'Durga Saptashati' },
        { item: 'Fresh flowers — daily' },
        { item: 'Sindoor, kumkum, chandan, akshat, haldi' },
        { item: 'Ghee, incense, camphor' },
        { item: 'Havan samagri', sub: 'optional — Ashtami or Navami' },
      ],
      samagriNote: 'Substitutions are fine. Where an item is unavailable where you live, the tradition allows for it. Nothing on this list is a condition of the vrat.',
      vidhiLabel: '3 · WHAT TO DO',
      vidhi: [
        { num: 1, text: 'Clean the space. Place a chowki and cover it with red cloth.' },
        { num: 2, text: 'Kalash sthapana. Fill with water, add akshat, a coin and a supari. Five or seven mango leaves at the rim, sealed with a coconut.' },
        { num: 3, text: 'Sow barley in a clay pot of soil. Water lightly.', note: 'Widely kept in North India — custom, not scripture' },
        { num: 4, text: 'Place the Durga image behind the kalash and install it with prayer.' },
        { num: 5, text: 'Light the akhand jyoti. Intended to burn through the nine days. If it goes out, relight it.' },
        { num: 6, text: 'Offer flowers, incense and fruit. Chant Ya Devi Sarvabhuteshu, or Saptashati Chapter 1.' },
        { num: 7, text: 'Take the sankalpa. Say it in whatever language you think in.' },
      ],
      mantraLabel: '4 · WHAT TO SAY',
      mantraDevanagari: 'ओं ह्रीं शैलपुत्र्यै नमः',
      mantraTransliteration: 'Om Hreem Shailputryai Namah',
      mantraContext: 'Day one — Shailputri, daughter of the mountain. The mantra changes with the form each day; the nine are listed on the guide.',
      fastingLabel: '5 · FASTING — ALL THREE ARE ACCEPTED',
      fastingOptions: [
        { title: 'All nine days', desc: 'No grains, sendha namak only, no onion or garlic. Phalahar through the day.' },
        { title: 'Partial', desc: 'Pratipada, Ashtami and Navami. Sattvic on the other days.' },
        { title: 'First and last', desc: 'Day one and day nine only.' },
      ],
      fastingNote: 'The tradition prescribes devotion, not starvation. A shorter form kept sincerely fulfils the vrat.',
      sourceText: 'Devi Mahatmya, Markandeya Purana · Dharma 4/5, Puranic. Barley sowing, daily colours and day-specific offerings are Pratha — regional custom, not scriptural requirement.',
      panchangSourceText: 'Drik Panchang, computed for New Delhi, Purnimanta convention.',
      tagline: 'Not fear. Only devotion.',
      guideUrl: 'thetapaco.com/ritual-guides/sharad-navratri',
    };
  }

  if (cleanSlug.includes('ekadashi') || cleanSlug.includes('aja')) {
    return {
      categoryLabel: 'RITUAL CARD · ALL-YEAR PUJANS',
      title: 'Aja Ekadashi',
      subtitle: 'A one-day vrat · grain avoidance from sunrise to parana',
      dateText: 'Tue 8 Sep 2026',
      tithiText: 'Bhadrapada Krishna Ekadashi',
      locationText: 'New Delhi',
      timingsLabel: '1 · WHEN',
      timings: [
        { key: 'FAST BEGINS', value: 'Sunrise, 8 Sep', note: 'After the sankalpa' },
        { key: 'PARANA — 9 SEPTEMBER', value: '6:02 – 8:17 AM', note: 'Approximately 2h 15m' },
      ],
      timingWarning: 'The window is the thing to set an alarm for. Parana must fall after sunrise and before Dwadashi ends. Miss it and break the fast anyway — a late parana is imperfect, not void, and no penance is attached.',
      samagriLabel: '2 · WHAT YOU NEED',
      samagri: [
        { item: 'Vishnu or Krishna image' },
        { item: 'Tulsi leaves', sub: 'not plucked on Ekadashi itself' },
        { item: 'Ghee diya and wicks' },
        { item: 'Chandan, akshat, kumkum' },
        { item: 'Fruit and milk for phalahar' },
        { item: 'Sendha namak', sub: 'if cooking during the fast' },
      ],
      samagriNote: 'A short list, deliberately. Ekadashi asks for restraint rather than arrangement.',
      vidhiLabel: '3 · WHAT TO DO',
      vidhi: [
        { num: 1, text: 'Bathe before sunrise. Take the sankalpa naming the vrat.' },
        { num: 2, text: 'Avoid grains and pulses for the whole day. Fruit, milk and water are permitted.', note: 'Nirjala is one form some choose — it is not what the vrat asks for' },
        { num: 3, text: 'Light a diya before Vishnu. Offer tulsi kept from the previous day.' },
        { num: 4, text: 'Chant, read, or simply keep the day quieter than usual.' },
        { num: 5, text: 'Stay awake into the evening if you keep that form. Many do not.' },
        { num: 6, text: 'Break the fast inside the parana window the next morning. Water first, then fruit, then a full meal.' },
      ],
      mantraLabel: '4 · WHAT TO SAY',
      mantraDevanagari: 'ओं नमो भगवते वासुदेवाय',
      mantraTransliteration: 'Om Namo Bhagavate Vasudevaya',
      mantraContext: 'The twelve-syllable mantra. Said through the day as often as you wish — there is no required count for this vrat.',
      fastingLabel: '5 · WHAT COUNTS AS A GRAIN',
      fastingOptions: [
        { title: 'Avoided', desc: 'Rice, wheat, all pulses and lentils, semolina, besan.' },
        { title: 'Permitted', desc: 'Kuttu, singhara, sabudana, samak. Botanically not grains.' },
        { title: 'Also permitted', desc: 'Fruit, milk, curd, potato, sendha namak.' },
      ],
      fastingNote: 'The rule applies to all twenty-four Ekadashis. Learn it once and it holds for the year.',
      sourceText: 'Padma Purana, Uttara Khanda · Dharma 4/5, Puranic. Regional variations in the permitted list are Pratha and differ between households.',
      panchangSourceText: 'Drik Panchang, computed for New Delhi, Purnimanta convention.',
      tagline: 'Not fear. Only devotion.',
      guideUrl: 'thetapaco.com/ritual-guides/aja-ekadashi',
    };
  }

  if (cleanSlug.includes('teej') || cleanSlug.includes('hartalika')) {
    return {
      categoryLabel: 'RITUAL CARD · FESTIVE PUJANS',
      title: 'Hartalika Teej Puja',
      subtitle: 'Nirjala vrat · clay Shiva-Parvati sthapana and night vigil',
      dateText: 'Mon 14 Sep 2026',
      tithiText: 'Bhadrapada Shukla Tritiya',
      locationText: 'New Delhi',
      timingsLabel: '1 · WHEN',
      timings: [
        { key: 'MORNING PUJA', value: '6:06 – 8:34 AM', note: 'Pratahkal Hartalika Puja' },
        { key: 'PARANA — 15 SEPTEMBER', value: 'After Sunrise (6:07 AM)', note: 'Following morning water' },
      ],
      timingWarning: 'Hartalika is observed with a complete waterless fast. Parana is performed the following morning after morning bathing and offering water to Surya.',
      samagriLabel: '2 · WHAT YOU NEED',
      samagri: [
        { item: 'Clay for Shiva-Parvati idol' },
        { item: 'Suhaag samagri', sub: 'bangles, bindi, sindoor, chunri' },
        { item: 'Belpatra, datura, shami leaves' },
        { item: 'Flowers, fruits and prasad' },
        { item: 'Ghee diya and incense' },
        { item: 'Hartalika Vrat Katha text' },
      ],
      samagriNote: 'If handmade clay idols are unavailable, a framed image of Shiva-Parvati is accepted with equal devotion.',
      vidhiLabel: '3 · WHAT TO DO',
      vidhi: [
        { num: 1, text: 'Take early morning bath and resolve the Nirjala sankalpa.' },
        { num: 2, text: 'Prepare clay idols of Lord Shiva, Goddess Parvati and Lord Ganesha.' },
        { num: 3, text: 'Perform Shodashopachara puja with Belpatra, flowers and bhog.' },
        { num: 4, text: 'Recite or listen to the Hartalika Vrat Katha in the evening.' },
        { num: 5, text: 'Keep night vigil (jagran) with devotional singing.' },
        { num: 6, text: 'Perform visarjan and break the fast the next morning after sunrise.' },
      ],
      mantraLabel: '4 · WHAT TO SAY',
      mantraDevanagari: 'ओं उमामहेश्वराभ्यां नमः',
      mantraTransliteration: 'Om Uma-Maheshwarabhyam Namah',
      mantraContext: 'Chant while offering belpatra and flowers to Shiva and Parvati during the puja.',
      fastingLabel: '5 · FASTING RULES',
      fastingOptions: [
        { title: 'Nirjala Form', desc: 'No water or food taken from sunrise to next morning parana.' },
        { title: 'Phalahar Option', desc: 'Permitted for pregnant women or health conditions with fruit & milk.' },
        { title: 'Parana', desc: 'Break fast after sunrise with sacred water and fruit prasad.' },
      ],
      fastingNote: 'Sincerity of devotion holds supreme over physical strain.',
      sourceText: 'Bhavishyottara Purana · Dharma 4/5, Puranic.',
      panchangSourceText: 'Drik Panchang, computed for New Delhi, Purnimanta convention.',
      tagline: 'Not fear. Only devotion.',
      guideUrl: `thetapaco.com/ritual-guides/${cleanSlug}`,
    };
  }

  // Dynamic fallback for any other Ritual Guide
  const titleFormatted = fallbackTitle || cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    categoryLabel: 'RITUAL CARD · RITUAL GUIDE',
    title: titleFormatted,
    subtitle: 'Step-by-step home vidhi, samagri, timings and mantras',
    dateText: '2026 Observance Date',
    tithiText: 'Purnimanta Tithi Calculation',
    locationText: 'New Delhi',
    timingsLabel: '1 · WHEN',
    timings: [
      { key: 'PREFERRED WINDOW', value: 'Morning Sunrise', note: 'During auspicious muhurat' },
      { key: 'FALLBACK WINDOW', value: 'Abhijit Muhurat', note: 'Midday alternate window' },
    ],
    timingWarning: 'Perform during the recommended muhurat for optimal quietness and focus.',
    samagriLabel: '2 · WHAT YOU NEED',
    samagri: [
      { item: 'Idol or framed image' },
      { item: 'Puja thali, ghee diya, wicks' },
      { item: 'Flowers, akshat, kumkum, chandan' },
      { item: 'Incense and camphor' },
      { item: 'Fresh fruit and water offering' },
    ],
    samagriNote: 'Substitutions are permitted. Devotion and cleanliness are the primary conditions.',
    vidhiLabel: '3 · WHAT TO DO',
    vidhi: [
      { num: 1, text: 'Clean the puja space and bathe before commencing.' },
      { num: 2, text: 'Light the ghee diya and take the sankalpa in your mother tongue.' },
      { num: 3, text: 'Offer flowers, akshat, and tilak to the deity.' },
      { num: 4, text: 'Recite the sacred mantra and story with focused attention.' },
      { num: 5, text: 'Perform aarti and share prasad with family members.' },
    ],
    mantraLabel: '4 · WHAT TO SAY',
    mantraDevanagari: 'ओं श्री गणेशाय नमः',
    mantraTransliteration: 'Om Shri Ganeshaya Namah',
    mantraContext: 'Chant 108 times or 12 times before commencing any ritual.',
    fastingLabel: '5 · OBSERVANCE RULES',
    fastingOptions: [
      { title: 'Sattvic Food', desc: 'Avoid onion, garlic, and heavy processed items.' },
      { title: 'Phalahar Vrat', desc: 'Fruit, milk, and nuts permitted during daytime.' },
      { title: 'Parana', desc: 'Conclude the fast after sacred water offering.' },
    ],
    fastingNote: 'Keep the practice calm, sincere, and free of fear.',
    sourceText: 'Scriptural source verified from Puranic traditions · Dharma 4/5.',
    panchangSourceText: 'Drik Panchang, computed for New Delhi, Purnimanta convention.',
    tagline: 'Not fear. Only devotion.',
    guideUrl: `thetapaco.com/ritual-guides/${cleanSlug || 'guide'}`,
  };
}

interface RitualCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  title: string;
}

export default function RitualCardModal({ isOpen, onClose, slug, title }: RitualCardModalProps) {
  const [isGreyscale, setIsGreyscale] = useState(false);

  if (!isOpen) return null;

  const data = getRitualCardData(slug, title);

  const handlePrint = () => {
    window.print();
  };

  const LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100"><text x="50%" y="65%" font-size="55" font-weight="bold" fill="%23FD066D" text-anchor="middle" font-family="Georgia,serif">तप</text></svg>`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28, 23, 18, 0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        padding: '16px',
        color: '#2C2010',
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      }}
    >
      {/* PRINT-ONLY SPECIFIC CSS INJECTION */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          .ritual-card-print-container, .ritual-card-print-container * {
            visibility: visible !important;
          }
          .ritual-card-print-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .ritual-card-modal-topbar {
            display: none !important;
          }
        }
      ` }} />

      {/* TOPBAR MODAL CONTROLS */}
      <div
        className="ritual-card-modal-topbar"
        style={{
          width: '100%',
          maxWidth: '820px',
          background: '#2E2260',
          color: '#FFFDF5',
          borderRadius: '16px 16px 0 0',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#B9A9DC', letterSpacing: '1px' }}>
            RITUAL CARD TEMPLATE
          </span>
          <span style={{ fontSize: '11px', color: '#9A8AC0', fontStyle: 'italic' }}>
            A4 portrait · Print-ready
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsGreyscale(false)}
            style={{
              background: !isGreyscale ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
              color: !isGreyscale ? '#2E2260' : '#D8CEF0',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🎨 Normal Color
          </button>

          <button
            type="button"
            onClick={() => setIsGreyscale(true)}
            style={{
              background: isGreyscale ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
              color: isGreyscale ? '#2E2260' : '#D8CEF0',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🏁 Greyscale Proof
          </button>

          <button
            type="button"
            onClick={handlePrint}
            style={{
              background: '#FD066D',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🖨️ Print / Save PDF
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginLeft: '6px',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* RITUAL CARD SHEET CONTAINER */}
      <div
        className="ritual-card-print-container"
        style={{
          width: '100%',
          maxWidth: '820px',
          background: '#FFFFFF',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          filter: isGreyscale ? 'grayscale(1) contrast(1.06)' : 'none',
          color: '#1A1208',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ padding: '0', color: '#1A1208' }}>
          {/* BLOCK 1: MASTHEAD */}
          <div style={{ background: '#1A1208', padding: '22px 30px 20px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <img src={LOGO_SVG} alt="तप" style={{ height: '34px', width: 'auto' }} />
                <span style={{ fontSize: '9px', color: '#FF9EBE', fontWeight: 700, letterSpacing: '0.5px', lineHeight: 1.25, maxWidth: '60px', textTransform: 'uppercase' }}>
                  the tapa company
                </span>
              </div>
              <div style={{ fontSize: '8.5px', fontWeight: 700, color: '#E3B567', letterSpacing: '0.8px', textAlign: 'right', lineHeight: 1.6, textTransform: 'uppercase' }}>
                {data.categoryLabel}
              </div>
            </div>

            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 700, color: '#FFFDF5', lineHeight: 1.12, letterSpacing: '-0.6px', margin: '0 0 8px' }}>
              {data.title}
            </h1>
            <p style={{ fontSize: '13px', color: '#C4A882', lineHeight: 1.6, margin: 0 }}>
              {data.subtitle}
            </p>

            <div style={{ display: 'flex', gap: '20px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.14)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#A99070' }}>
                DATE<b style={{ display: 'block', fontSize: '14px', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{data.dateText}</b>
              </span>
              <span style={{ fontSize: '11px', color: '#A99070' }}>
                TITHI<b style={{ display: 'block', fontSize: '14px', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{data.tithiText}</b>
              </span>
              <span style={{ fontSize: '11px', color: '#A99070' }}>
                COMPUTED FOR<b style={{ display: 'block', fontSize: '14px', color: '#FFFFFF', fontWeight: 700, marginTop: '2px' }}>{data.locationText}</b>
              </span>
            </div>
          </div>

          {/* TWO COLUMN GRID FOR BLOCKS 2, 3, 4, 6 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1.5px solid #1A1208' }}>
            {/* LEFT COLUMN */}
            <div style={{ borderRight: '1.5px solid #1A1208' }}>
              {/* BLOCK 2: TIMINGS */}
              <div style={{ background: '#F7F2E8', padding: '18px 24px', borderBottom: '1.5px solid #1A1208' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#A07800', letterSpacing: '0.9px', marginBottom: '11px', textTransform: 'uppercase' }}>
                  {data.timingsLabel || '1 · WHEN'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  {data.timings.map((t, idx) => (
                    <div key={idx} style={{ borderLeft: '3px solid #1A1208', paddingLeft: '12px' }}>
                      <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#5C4B12', letterSpacing: '0.5px', marginBottom: '3px', textTransform: 'uppercase' }}>
                        {t.key}
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#1A1208', lineHeight: 1.15, letterSpacing: '-0.3px' }}>
                        {t.value}
                      </div>
                      <div style={{ fontSize: '11px', color: '#8A7A68', marginTop: '3px', lineHeight: 1.5 }}>
                        {t.note}
                      </div>
                    </div>
                  ))}
                </div>
                {data.timingWarning && (
                  <p style={{ marginTop: '13px', paddingTop: '12px', borderTop: '1px dashed #C9BFAC', fontSize: '11.5px', lineHeight: 1.65, color: '#5C4B12', margin: '13px 0 0' }}>
                    <b style={{ color: '#1A1208' }}>Note: </b>{data.timingWarning}
                  </p>
                )}
              </div>

              {/* BLOCK 3: SAMAGRI */}
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#A07800', letterSpacing: '0.9px', marginBottom: '11px', textTransform: 'uppercase' }}>
                  {data.samagriLabel || '2 · WHAT YOU NEED'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2px' }}>
                  {data.samagri.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', padding: '4px 0', fontSize: '12.5px', lineHeight: 1.5 }}>
                      <i style={{ width: '13px', height: '13px', border: '1.5px solid #1A1208', borderRadius: '2px', flexShrink: 0, marginTop: '3px', display: 'block' }} />
                      <div>
                        <span>{s.item}</span>
                        {s.sub && <span style={{ fontSize: '10.5px', color: '#8A7A68', display: 'block', marginTop: '1px' }}>{s.sub}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                {data.samagriNote && (
                  <p style={{ marginTop: '13px', fontSize: '11.5px', color: '#5C4B12', lineHeight: 1.65, paddingTop: '11px', borderTop: '1px dashed #C9BFAC', margin: '13px 0 0' }}>
                    <b style={{ color: '#1A1208' }}>Substitutions are fine: </b>{data.samagriNote}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              {/* BLOCK 4: VIDHI */}
              <div style={{ padding: '20px 24px', borderBottom: '1.5px solid #1A1208' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#A07800', letterSpacing: '0.9px', marginBottom: '11px', textTransform: 'uppercase' }}>
                  {data.vidhiLabel || '3 · WHAT TO DO'}
                </div>
                {data.vidhi.map((v, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', padding: '7px 0', borderBottom: idx < data.vidhi.length - 1 ? '0.5px solid #EDE6D8' : 'none' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#1A1208', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      {v.num}
                    </span>
                    <div style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#1A1208' }}>
                      <span>{v.text}</span>
                      {v.note && <i style={{ fontStyle: 'normal', color: '#8A7A68', fontSize: '11px', display: 'block', marginTop: '2px' }}>— {v.note}</i>}
                    </div>
                  </div>
                ))}
              </div>

              {/* BLOCK 6: FASTING / RULES */}
              <div style={{ padding: '18px 24px' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#A07800', letterSpacing: '0.9px', marginBottom: '11px', textTransform: 'uppercase' }}>
                  {data.fastingLabel || '5 · FASTING & RULES'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                  {data.fastingOptions.map((f, idx) => (
                    <div key={idx} style={{ border: '1px solid #D8CFBC', borderRadius: '8px', padding: '9px 12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A1208', marginBottom: '3px' }}>{f.title}</div>
                      <div style={{ fontSize: '11px', color: '#5C4B12', lineHeight: 1.55 }}>{f.desc}</div>
                    </div>
                  ))}
                </div>
                {data.fastingNote && (
                  <p style={{ marginTop: '12px', fontSize: '11.5px', lineHeight: 1.65, color: '#27500A', background: '#E6F1E6', borderLeft: '3px solid #27500A', padding: '9px 12px', borderRadius: '4px', margin: '12px 0 0' }}>
                    <b>Note: </b>{data.fastingNote}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* BLOCK 5: MANTRA (INVERTED DARK BLOCK) */}
          <div style={{ background: '#1A1208', padding: '20px 30px', color: '#FFFFFF' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#E3B567', letterSpacing: '0.9px', marginBottom: '9px', textTransform: 'uppercase' }}>
              {data.mantraLabel || '4 · WHAT TO SAY'}
            </div>
            <div style={{ fontFamily: "'Tiro Devanagari Hindi', Georgia, serif", fontSize: '22px', color: '#F5C86A', lineHeight: 1.55, marginBottom: '6px' }}>
              {data.mantraDevanagari}
            </div>
            <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 600, marginBottom: '4px' }}>
              {data.mantraTransliteration}
            </div>
            <p style={{ fontSize: '11.5px', color: '#A99070', lineHeight: 1.6, margin: 0 }}>
              {data.mantraContext}
            </p>
            <div style={{ marginTop: '14px', paddingTop: '13px', borderTop: '1px solid rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10.5px', color: '#A99070' }}>Mark a box for each round of 12</span>
              <div style={{ display: 'flex', gap: '5px', marginLeft: 'auto' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <i key={i} style={{ width: '15px', height: '15px', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '2px', display: 'block' }} />
                ))}
              </div>
            </div>
          </div>

          {/* BLOCK 7: SOURCE & FOOTER */}
          <div style={{ background: '#F7F2E8', padding: '16px 30px 20px' }}>
            <div style={{ fontSize: '11px', color: '#5C4B12', lineHeight: 1.7, marginBottom: '11px' }}>
              <b style={{ color: '#1A1208', fontWeight: 700 }}>Source — </b>{data.sourceText}
              <br />
              <b style={{ color: '#1A1208', fontWeight: 700 }}>Timings — </b>{data.panchangSourceText}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', paddingTop: '12px', borderTop: '1px solid #DDD4C0' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A1208', lineHeight: 1.4 }}>
                  Not fear. <span style={{ color: '#FD066D', fontStyle: 'normal' }}>Only devotion.</span>
                </div>
                <div style={{ fontSize: '10.5px', color: '#8A7A68', marginTop: '4px', lineHeight: 1.6 }}>
                  Full guide, myths and corrections at<br />
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{data.guideUrl}</span>
                </div>
              </div>
              <div style={{ width: '60px', height: '60px', border: '1.5px solid #1A1208', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#8A7A68', textAlign: 'center', lineHeight: 1.3, flexShrink: 0, padding: '4px' }}>
                QR<br />to guide
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
