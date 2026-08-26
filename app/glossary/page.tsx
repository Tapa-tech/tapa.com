'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface Term {
  t: string;
  lang: string;
  d: string;
  s: string;
  ty: 'mat' | 'pra' | 'tim' | 'txt';
  def: string;
  in: string[];
  c?: string | null;
}

const TERMS: Term[] = [
  { t: 'Aarti', lang: 'HINDI', d: 'आरती', s: 'aar-tee', ty: 'pra', def: 'The closing act of a puja. A lit lamp is circled in front of the deity while a song is sung, and the flame is then offered to everyone present.', in: ['Sharad Navratri', 'Diwali for Beginners'], c: null },
  { t: 'Abhishek', lang: 'SANSKRIT', d: 'अभिषेक', s: 'a-bhi-shek', ty: 'pra', def: 'Bathing the deity — water, milk, honey or panchamrit poured over an idol or Shivalinga while mantras are recited.', in: ['Sawan Somwar Vrat'], c: 'Abhishek — why the pouring' },
  { t: 'Akhand Jyoti', lang: 'SANSKRIT', d: 'अखण्ड ज्योति', s: 'a-khand jyo-ti', ty: 'pra', def: 'A lamp kept continuously lit through an observance, most often across the nine nights of Navratri. Relight it if it goes out; nothing is void.', in: ['Sharad Navratri'], c: null },
  { t: 'Akshat', lang: 'SANSKRIT', d: 'अक्षत', s: 'ak-shat', ty: 'mat', def: 'Unbroken rice grains, usually mixed with a little turmeric or kumkum. Offered in almost every puja. The point is that the grains are whole.', in: ['Sharad Navratri', 'Diwali for Beginners', 'Ganesh Chaturthi'], c: null },
  { t: 'Bilva', lang: 'SANSKRIT', d: 'बिल्व', s: 'bil-va', ty: 'mat', def: 'The leaf offered to Shiva, in threes on one stem. Also called bel patra. Offered smooth side down by widespread practice.', in: ['Sawan Somwar Vrat'], c: 'Why is bilva dear to Mahadev?' },
  { t: 'Chaturmas', lang: 'SANSKRIT', d: 'चातुर्मास', s: 'cha-tur-maas', ty: 'tim', def: 'The four monsoon months from Devshayani to Devutthana Ekadashi. Weddings and some new undertakings are traditionally deferred through this period.', in: ['Parsva Ekadashi'], c: 'Chaturmas — the four months' },
  { t: 'Dakshina', lang: 'SANSKRIT', d: 'दक्षिणा', s: 'dak-shi-na', ty: 'pra', def: 'What is offered to a purohit after a ritual. Traditionally given according to means and not fixed as a fee.', in: ['Purohit & Puja'], c: null },
  { t: 'Ghatasthapana', lang: 'SANSKRIT', d: 'घटस्थापना', s: 'ghat-sthaa-pa-na', ty: 'pra', def: 'The installation of the kalash on the first day of Navratri, performed in the morning while Pratipada prevails and before Hindu midday.', in: ['Sharad Navratri', 'Navratri Panchang'], c: null },
  { t: 'Kalash', lang: 'SANSKRIT', d: 'कलश', s: 'ka-lash', ty: 'mat', def: 'A brass or copper pot filled with water, topped with mango leaves and a coconut. It stands for the presence invited into the space.', in: ['Sharad Navratri', 'Diwali for Beginners'], c: null },
  { t: 'Muhurat', lang: 'SANSKRIT', d: 'मुहूर्त', s: 'mu-hoor-t', ty: 'tim', def: 'A window of time considered suitable for a ritual, calculated from the panchang. A recommendation, not a deadline — a puja done later is still complete.', in: ['Navratri Panchang', 'Ganesh Chaturthi'], c: 'How to read a Panchang' },
  { t: 'Nakshatra', lang: 'SANSKRIT', d: 'नक्षत्र', s: 'nak-shat-ra', ty: 'tim', def: 'One of twenty-seven segments of the sky through which the Moon moves. One of the five limbs the panchang tracks each day.', in: ["Today's Panchang"], c: 'How to read a Panchang' },
  { t: 'Paksha', lang: 'SANSKRIT', d: 'पक्ष', s: 'pak-sha', ty: 'tim', def: 'Half a lunar month. Shukla is the waxing half, Krishna the waning half. Every festival date names one.', in: ["Today's Panchang", 'Vrat Calendar'], c: 'How to read a Panchang' },
  { t: 'Panchamrit', lang: 'SANSKRIT', d: 'पञ्चामृत', s: 'pan-chaam-rit', ty: 'mat', def: 'Five ingredients mixed for abhishek and prasad — milk, curd, ghee, honey and sugar. Made fresh, distributed after.', in: ['Sawan Somwar Vrat'], c: null },
  { t: 'Parana', lang: 'SANSKRIT', d: 'पारण', s: 'paa-ran', ty: 'pra', def: 'Breaking a fast, within a stated window on the morning after. For Ekadashi it must fall after sunrise and before Dwadashi ends.', in: ['Aja Ekadashi', 'Vrat Calendar'], c: null },
  { t: 'Sankalp', lang: 'SANSKRIT', d: 'सङ्कल्प', s: 'san-kalp', ty: 'pra', def: 'The resolve stated at the start of a vrat or puja — what you are doing, and for whom. Said aloud or silently, in any language.', in: ['Sharad Navratri', 'Sawan Somwar Vrat'], c: 'Sankalp — saying it out loud' },
  { t: 'Sutak', lang: 'SANSKRIT', d: 'सूतक', s: 'soo-tak', ty: 'tim', def: 'A period before and during an eclipse in which some activities are set aside. It applies only where the eclipse is actually visible.', in: ['August 2026 Eclipses'], c: null },
  { t: 'Tithi', lang: 'SANSKRIT', d: 'तिथि', s: 'ti-thi', ty: 'tim', def: 'The lunar day, and the thing that fixes almost every festival date. A tithi can start and end at any hour, which is why dates shift each year.', in: ["Today's Panchang", 'Vrat Calendar', 'Navratri Panchang'], c: 'How to read a Panchang' },
  { t: 'Vrat', lang: 'SANSKRIT', d: 'व्रत', s: 'vrat', ty: 'pra', def: 'A vow kept for a day. Fasting is often part of it and is rarely the whole of it — the vow is the observance, the food rule is one expression.', in: ['What is a vrat?', 'Vrat Calendar'], c: 'Vrat — what a vow is' },
];

const TYPE = {
  mat: 'MATERIAL',
  pra: 'PRACTICE',
  tim: 'TIME',
  txt: 'TEXT',
};

export default function GlossaryPage() {
  const [filter, setFilter] = useState<string>('all');
  const [lang, setLang] = useState<string>('all');
  const [query, setQuery] = useState<string>('');

  const filteredTerms = useMemo(() => {
    return TERMS.filter((x) => {
      const matchFilter = filter === 'all' || x.ty === filter;
      const matchLang = lang === 'all' || x.lang === lang;
      const q = query.toLowerCase().trim();
      const matchQuery =
        q === '' ||
        x.t.toLowerCase().includes(q) ||
        x.def.toLowerCase().includes(q) ||
        x.d.includes(q);
      return matchFilter && matchLang && matchQuery;
    });
  }, [filter, lang, query]);

  const letters = useMemo(() => {
    return Array.from(new Set(filteredTerms.map((x) => x.t[0].toUpperCase()))).sort();
  }, [filteredTerms]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const jumpToLetter = (L: string) => {
    const el = document.getElementById(`L${L}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="glossary-page min-h-screen w-full max-w-full overflow-x-hidden">
      <style jsx global>{`
        .glossary-page {
          --bg: #F2EDE4;
          --card: #FFFFFF;
          --dark: #1C1712;
          --darkbar: #1A1208;
          --pink: #FD066D;
          --rose: #EF0F54;
          --amber: #E8A020;
          --gold: #A07800;
          --yellow: #EDAB3A;
          --body-text: #2C2010;
          --mid-text: #5C4B12;
          --sub-text: #8A7A68;
          --border: #E8E0D0;
          --border-light: #F0E8D8;
          --hero-text: #FFFDF5;
          --dim: #7A6A55;
          --dimmer: #5C4E36;
          --d-bg: #E6F1E6;
          --d-tx: #27500A;
          --d-bd: #C9DFC9;
          --p-bg: #FFF8E6;
          --p-tx: #A07800;
          --p-bd: #EFE0B8;
          --b-bg: #F0E9E1;
          --b-tx: #4A3525;
          --b-bd: #D9CBB8;
          --data-bg: #EEF3F7;
          --data-tx: #1F4460;
          --data-bd: #C3D6E4;
          --data-mid: #3E6D8C;
          background: var(--bg);
          color: var(--body-text);
          font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        .glossary-page a {
          text-decoration: none;
          color: inherit;
        }
        .glossary-page button {
          font-family: inherit;
          cursor: pointer;
        }
        .glossary-page input {
          font-family: inherit;
        }

        .glossary-page .wrap {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* ANNOUNCE */
        .glossary-page .announce {
          background: var(--dark);
          padding: 7px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .glossary-page .ann-text {
          font-size: 10px;
          color: #E3B567;
        }
        .glossary-page .ann-text strong {
          color: var(--pink);
          font-weight: 600;
        }
        .glossary-page .ann-links {
          display: flex;
          gap: 22px;
        }
        .glossary-page .ann-link {
          font-size: 10px;
          color: var(--sub-text);
        }

        /* NAV */
        .glossary-page .topnav {
          background: var(--card);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 60;
          box-shadow: 0 1px 12px rgba(28, 23, 18, 0.06);
        }
        .glossary-page .topnav-in {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: center;
          height: 72px;
        }
        .glossary-page .burger {
          display: none;
          width: 36px;
          border: none;
          background: none;
          flex-direction: column;
          gap: 4.5px;
          padding: 0 7px;
        }
        .glossary-page .burger span {
          height: 2px;
          background: var(--dark);
          border-radius: 2px;
        }
        .glossary-page .burger span:nth-child(2) {
          width: 68%;
        }
        .glossary-page .logo {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-right: 34px;
          flex-shrink: 0;
        }
        .glossary-page .logo-wm {
          font-size: 10px;
          color: var(--pink);
          font-weight: 600;
          letter-spacing: 0.3px;
          line-height: 1.25;
          max-width: 76px;
        }
        .glossary-page .navcats {
          display: flex;
          flex: 1;
        }
        .glossary-page .navcat {
          font-size: 15px;
          font-weight: 500;
          color: var(--sub-text);
          padding: 0 15px;
          height: 72px;
          display: flex;
          align-items: center;
          border: none;
          border-bottom: 3px solid transparent;
          background: none;
          white-space: nowrap;
        }
        .glossary-page .navright {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: auto;
        }
        .glossary-page .searchbar {
          display: flex;
          align-items: center;
          gap: 9px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 10px 17px;
          font-size: 14px;
          color: var(--sub-text);
          width: 200px;
        }
        .glossary-page .nav-act {
          width: 40px;
          height: 40px;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          flex-shrink: 0;
        }
        .glossary-page .nav-login {
          white-space: nowrap;
          background: var(--pink);
          border: none;
          border-radius: 10px;
          padding: 11px 20px;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }

        .glossary-page .bcrumb {
          background: var(--card);
          border-bottom: 1px solid var(--border);
          padding: 0 40px;
        }
        .glossary-page .bc-in {
          max-width: 1280px;
          margin: 0 auto;
          padding: 10px 0;
          font-size: 13px;
          color: var(--sub-text);
        }
        .glossary-page .bc-in b {
          color: var(--body-text);
          font-weight: 500;
        }

        /* HERO */
        .glossary-page .ghero {
          background: var(--darkbar);
          padding: 38px 0 34px;
          position: relative;
          overflow: hidden;
        }
        .glossary-page .ghero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 55% 80% at 82% 40%, rgba(232, 160, 32, 0.09) 0%, transparent 62%);
        }
        .glossary-page .gh-in {
          position: relative;
          max-width: 760px;
        }
        .glossary-page .gh-ey {
          font-size: 10px;
          color: #E3B567;
          letter-spacing: 1px;
          margin-bottom: 11px;
        }
        .glossary-page .gh-h1 {
          font-size: 38px;
          font-weight: 700;
          color: var(--hero-text);
          line-height: 1.12;
          letter-spacing: -0.8px;
          margin-bottom: 12px;
        }
        .glossary-page .gh-p {
          font-size: 16px;
          color: #C4A882;
          line-height: 1.75;
          margin-bottom: 22px;
        }
        .glossary-page .gh-search {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.09);
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          border-radius: 14px;
          padding: 14px 18px;
          max-width: 560px;
        }
        .glossary-page .gh-search input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 16px;
          color: #fff;
        }
        .glossary-page .gh-search input::placeholder {
          color: #8A7A68;
        }
        .glossary-page .gh-go {
          background: var(--pink);
          border: none;
          border-radius: 9px;
          padding: 9px 18px;
          font-size: 13.5px;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
        }
        .glossary-page .gh-meta {
          display: flex;
          gap: 22px;
          margin-top: 18px;
          flex-wrap: wrap;
        }
        .glossary-page .gh-m {
          font-size: 12.5px;
          color: var(--dim);
        }
        .glossary-page .gh-m b {
          color: var(--amber);
          font-weight: 700;
          font-size: 14px;
        }

        /* FILTER BAR */
        .glossary-page .fbar {
          background: var(--card);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 72px;
          z-index: 50;
        }
        .glossary-page .fbar-in {
          max-width: 1280px;
          margin: 0 auto;
          padding: 12px 40px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .glossary-page .f-l {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--gold);
          letter-spacing: 0.5px;
          margin-right: 4px;
        }
        .glossary-page .fc {
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 9px;
          padding: 7px 14px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--body-text);
          white-space: nowrap;
        }
        .glossary-page .fc.on {
          border-color: var(--pink);
          background: #FFF0F5;
          color: var(--pink);
        }
        .glossary-page .f-count {
          margin-left: auto;
          font-size: 12.5px;
          color: var(--sub-text);
        }

        /* A–Z STRIP */
        .glossary-page .az {
          background: var(--p-bg);
          border-bottom: 1px solid var(--p-bd);
          padding: 10px 40px;
        }
        .glossary-page .az-in {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 4px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .glossary-page .az-in::-webkit-scrollbar {
          display: none;
        }
        .glossary-page .azl {
          min-width: 28px;
          height: 28px;
          border-radius: 7px;
          border: none;
          background: none;
          font-size: 12.5px;
          font-weight: 700;
          color: var(--p-tx);
          flex-shrink: 0;
        }
        .glossary-page .azl:hover {
          background: var(--card);
        }
        .glossary-page .azl.off {
          color: #C9BFAC;
        }

        /* LAYOUT */
        .glossary-page .layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 44px;
          align-items: start;
          padding-top: 30px;
        }
        .glossary-page .main {
          max-width: 760px;
        }

        /* LETTER GROUP */
        .glossary-page .lg {
          margin-bottom: 8px;
          scroll-margin-top: 170px;
        }
        .glossary-page .lg-h {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 26px 0 12px;
        }
        .glossary-page .lg-l {
          font-size: 26px;
          font-weight: 700;
          color: var(--pink);
          line-height: 1;
          min-width: 26px;
        }
        .glossary-page .lg-r {
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* ENTRY */
        .glossary-page .en {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px 20px;
          margin-bottom: 10px;
          text-align: left;
        }
        .glossary-page .en:hover {
          border-color: var(--p-bd);
        }
        .glossary-page .en-top {
          display: flex;
          align-items: baseline;
          gap: 11px;
          flex-wrap: wrap;
          margin-bottom: 2px;
        }
        .glossary-page .en-t {
          font-size: 20px;
          font-weight: 700;
          color: var(--dark);
          line-height: 1.25;
        }
        .glossary-page .en-dev {
          display: block;
          font-family: 'Tiro Devanagari Hindi', 'Noto Sans Devanagari', serif;
          font-size: 23px;
          color: var(--gold);
          line-height: 1.5;
          margin: 1px 0 7px;
        }
        .glossary-page .en-meta {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
          margin-bottom: 11px;
        }
        .glossary-page .en-say {
          font-size: 13px;
          color: var(--sub-text);
          font-style: italic;
        }
        .glossary-page .en-dot {
          color: #CFC3AE;
          font-size: 11px;
        }
        .glossary-page .en-lang {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 3px 9px;
          border-radius: 5px;
          white-space: nowrap;
          background: var(--bg);
          color: var(--mid-text);
          border: 1px solid var(--border);
        }
        .glossary-page .en-type {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 3px 9px;
          border-radius: 5px;
          margin-left: auto;
          white-space: nowrap;
        }
        .glossary-page .en-type.mat {
          background: var(--d-bg);
          color: var(--d-tx);
          border: 1px solid var(--d-bd);
        }
        .glossary-page .en-type.pra {
          background: var(--p-bg);
          color: var(--p-tx);
          border: 1px solid var(--p-bd);
        }
        .glossary-page .en-type.tim {
          background: var(--data-bg);
          color: var(--data-tx);
          border: 1px solid var(--data-bd);
        }
        .glossary-page .en-type.txt {
          background: var(--b-bg);
          color: var(--b-tx);
          border: 1px solid var(--b-bd);
        }
        .glossary-page .en-d {
          font-size: 14.5px;
          line-height: 1.8;
          color: var(--body-text);
          margin-bottom: 11px;
        }
        .glossary-page .en-links {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 11px;
          border-top: 1px solid var(--border-light);
        }
        .glossary-page .en-lk {
          font-size: 9.5px;
          font-weight: 700;
          color: var(--sub-text);
          letter-spacing: 0.5px;
          margin-right: 2px;
        }
        .glossary-page .en-a {
          font-size: 12px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 7px;
          padding: 5px 11px;
          color: var(--mid-text);
          font-weight: 500;
        }
        .glossary-page .en-a:hover {
          border-color: var(--pink);
          color: var(--pink);
        }
        .glossary-page .en-a.concept {
          background: #FFF0F5;
          border-color: #F7C0D6;
          color: var(--pink);
          font-weight: 700;
        }

        /* SIDEBAR */
        .glossary-page .side {
          position: sticky;
          top: 170px;
          display: flex;
          flex-direction: column;
          gap: 13px;
          text-align: left;
        }
        .glossary-page .sbx {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
        }
        .glossary-page .sbx-h {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-light);
          font-size: 12.5px;
          font-weight: 700;
          color: var(--dark);
        }
        .glossary-page .sbx-i {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 16px;
          border-bottom: 0.5px solid var(--border-light);
          font-size: 13.5px;
        }
        .glossary-page .sbx-i:last-child {
          border-bottom: none;
        }
        .glossary-page .sbx-i b {
          font-weight: 600;
          color: var(--dark);
        }
        .glossary-page .sbx-n {
          font-size: 11.5px;
          color: var(--sub-text);
        }
        .glossary-page .sbrule {
          background: var(--p-bg);
          border: 1px solid var(--p-bd);
          border-radius: 14px;
          padding: 15px 17px;
        }
        .glossary-page .sbr-h {
          font-size: 10px;
          font-weight: 700;
          color: var(--gold);
          letter-spacing: 0.6px;
          margin-bottom: 9px;
        }
        .glossary-page .sbr-t {
          font-size: 13px;
          line-height: 1.75;
          color: var(--body-text);
        }
        .glossary-page .sbr-t b {
          color: var(--p-tx);
        }
        .glossary-page .sbcta {
          width: 100%;
          border: none;
          border-radius: 12px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }
        .glossary-page .sbcta.wa {
          background: #1F9D52;
        }
        .glossary-page .sbcta.dk {
          background: var(--darkbar);
        }
        .glossary-page .sb-ci {
          font-size: 19px;
        }
        .glossary-page .sb-ct {
          font-size: 13px;
          font-weight: 700;
          color: #fff;
        }
        .glossary-page .sb-cs {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
          line-height: 1.5;
        }

        /* MISSING TERM */
        .glossary-page .miss {
          background: var(--data-bg);
          border: 1px solid var(--data-bd);
          border-radius: 16px;
          padding: 26px 30px;
          margin: 34px 0 0;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 30px;
          align-items: center;
          text-align: left;
        }
        .glossary-page .miss-t {
          font-size: 21px;
          font-weight: 700;
          color: var(--data-tx);
          line-height: 1.3;
          margin-bottom: 9px;
        }
        .glossary-page .miss-p {
          font-size: 14px;
          color: var(--data-mid);
          line-height: 1.8;
          margin-bottom: 15px;
        }
        .glossary-page .miss-b {
          background: var(--data-tx);
          border: none;
          border-radius: 11px;
          padding: 12px 22px;
          font-size: 13.5px;
          font-weight: 700;
          color: #fff;
        }
        .glossary-page .miss-box {
          background: var(--card);
          border-radius: 13px;
          padding: 16px 18px;
        }
        .glossary-page .miss-r {
          display: flex;
          gap: 10px;
          padding: 7px 0;
          font-size: 13px;
          line-height: 1.65;
          color: var(--body-text);
        }
        .glossary-page .miss-r > span:first-child {
          color: var(--data-mid);
          font-weight: 700;
          flex-shrink: 0;
        }
        .glossary-page .miss-r > span:last-child {
          flex: 1;
          min-width: 0;
        }

        /* HOW IT WORKS */
        .glossary-page .how {
          background: var(--darkbar);
          border-radius: 16px;
          padding: 26px 30px;
          margin: 18px 0 0;
          text-align: left;
        }
        .glossary-page .how-l {
          font-size: 9.5px;
          font-weight: 700;
          color: #E3B567;
          letter-spacing: 0.7px;
          margin-bottom: 12px;
        }
        .glossary-page .how-t {
          font-size: 20px;
          font-weight: 700;
          color: var(--hero-text);
          line-height: 1.4;
          margin-bottom: 12px;
        }
        .glossary-page .how p {
          font-size: 14px;
          color: #C4A882;
          line-height: 1.85;
          margin-bottom: 11px;
        }
        .glossary-page .how p:last-child {
          margin-bottom: 0;
        }
        .glossary-page .how b {
          color: var(--amber);
        }

        /* REVENUE */
        .glossary-page .rev {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 13px;
          margin: 18px 0 0;
          align-items: stretch;
        }
        .glossary-page .rev-c {
          border-radius: 15px;
          padding: 19px 20px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          text-align: left;
          height: 100%;
          border: 1px solid;
        }
        .glossary-page .rev-c.live {
          background: var(--card);
          border-color: var(--border);
        }
        .glossary-page .rev-c.soon {
          background: #EFEAE0;
          border-color: #DDD4C4;
        }
        .glossary-page .rev-i {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          margin-bottom: 12px;
          flex-shrink: 0;
        }
        .glossary-page .rev-c.live .rev-i {
          background: var(--p-bg);
          border: 1px solid var(--p-bd);
        }
        .glossary-page .rev-c.soon .rev-i {
          background: #E4DCCC;
          border: 1px solid #D4C9B4;
          opacity: 0.6;
        }
        .glossary-page .rev-l {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.6px;
          margin-bottom: 6px;
        }
        .glossary-page .rev-c.live .rev-l {
          color: var(--gold);
        }
        .glossary-page .rev-c.soon .rev-l {
          color: #9A8E7A;
        }
        .glossary-page .rev-t {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.32;
          margin-bottom: 6px;
        }
        .glossary-page .rev-c.live .rev-t {
          color: var(--dark);
        }
        .glossary-page .rev-c.soon .rev-t {
          color: #7A705F;
        }
        .glossary-page .rev-s {
          font-size: 12.5px;
          line-height: 1.7;
        }
        .glossary-page .rev-c.live .rev-s {
          color: var(--sub-text);
        }
        .glossary-page .rev-c.soon .rev-s {
          color: #948872;
        }
        .glossary-page .rev-b {
          border: none;
          border-radius: 11px;
          padding: 12px;
          font-size: 13px;
          font-weight: 700;
          width: 100%;
        }
        .glossary-page .rev-c.live .rev-b {
          background: var(--pink);
          color: #fff;
        }
        .glossary-page .rev-c.live .rev-b.wa {
          background: #1F9D52;
          color: #fff;
        }
        .glossary-page .rev-c.soon .rev-b {
          background: transparent;
          border: 1.5px solid #C9BFAC;
          color: #7A705F;
        }
        .glossary-page .rev-c .rev-b {
          margin: 0;
          white-space: nowrap;
          flex: 0 0 auto;
        }
        .glossary-page .rev-c .rev-s {
          flex: 1 1 auto;
          margin-bottom: 15px;
        }

        /* FOOTER */
        .glossary-page .tf {
          background: var(--dark);
          margin-top: 46px;
          color: #fff;
        }
        .glossary-page .tf-w {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .glossary-page .tf-brand {
          padding: 44px 20px 32px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }
        .glossary-page .tf-lot {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 15px;
        }
        .glossary-page .tf-line {
          height: 1px;
          width: 52px;
          background: rgba(227, 181, 103, 0.25);
        }
        .glossary-page .tf-tag {
          font-size: 24px;
          font-weight: 700;
          color: var(--hero-text);
          margin-bottom: 8px;
          letter-spacing: -0.4px;
        }
        .glossary-page .tf-tag em {
          color: var(--pink);
          font-style: normal;
        }
        .glossary-page .tf-tagsub {
          font-size: 13px;
          color: var(--sub-text);
          line-height: 1.7;
          max-width: 500px;
          margin: 0 auto 18px;
        }
        .glossary-page .tf-cta {
          background: var(--pink);
          border: none;
          border-radius: 22px;
          padding: 11px 26px;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
        }
        .glossary-page .tf-map {
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          padding: 28px 0 30px;
          text-align: left;
        }
        .glossary-page .tf-map-h {
          font-size: 10px;
          font-weight: 700;
          color: #E3B567;
          letter-spacing: 0.7px;
          margin-bottom: 18px;
        }
        .glossary-page .tf-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
        }
        .glossary-page .tf-cat-t {
          font-size: 14px;
          font-weight: 700;
          color: var(--hero-text);
          margin-bottom: 9px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.09);
        }
        .glossary-page .tf-sub {
          font-size: 12px;
          color: var(--sub-text);
          display: block;
          padding: 4.5px 0;
        }
        .glossary-page .tf-sub.lead {
          color: #FF9EBE;
          font-weight: 600;
        }
        .glossary-page .tf-all {
          font-size: 11.5px;
          color: var(--pink);
          font-weight: 600;
          display: block;
          padding-top: 7px;
        }
        .glossary-page .tf-legal {
          padding: 20px 0 26px;
          text-align: left;
        }
        .glossary-page .tf-pol {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 14px;
        }
        .glossary-page .tf-pol span {
          font-size: 11.5px;
          color: var(--dim);
        }
        .glossary-page .tf-copy {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .glossary-page .tf-cl-l {
          font-size: 11.5px;
          color: var(--sub-text);
        }
        .glossary-page .tf-cl-l b {
          color: var(--hero-text);
          font-weight: 600;
        }

        /* MOBILE */
        @media (max-width: 900px) {
          .glossary-page {
            max-width: 430px;
            margin: 0 auto;
            padding-bottom: 78px;
          }
          .glossary-page .wrap,
          .glossary-page .tf-w {
            padding: 0 16px;
          }
          .glossary-page .announce {
            padding: 7px 16px;
            justify-content: center;
          }
          .glossary-page .ann-links {
            display: none;
          }
          .glossary-page .ann-text {
            font-size: 9.5px;
            text-align: center;
          }
          .glossary-page .topnav-in {
            padding: 0 12px;
            height: 70px;
            gap: 10px;
          }
          .glossary-page .burger {
            display: flex;
          }
          .glossary-page .logo {
            margin-right: auto;
            gap: 9px;
          }
          .glossary-page .logo-wm {
            font-size: 10px;
            max-width: 68px;
          }
          .glossary-page .navcats,
          .glossary-page .searchbar,
          .glossary-page .nav-login {
            display: none;
          }
          .glossary-page .bcrumb {
            padding: 0 16px;
          }
          .glossary-page .bc-in {
            font-size: 12px;
          }
          .glossary-page .ghero {
            padding: 26px 0 26px;
          }
          .glossary-page .gh-h1 {
            font-size: 28px;
          }
          .glossary-page .gh-p {
            font-size: 14.5px;
          }
          .glossary-page .gh-search {
            padding: 12px 14px;
            gap: 9px;
          }
          .glossary-page .gh-search input {
            font-size: 15px;
            min-width: 0;
          }
          .glossary-page .gh-go {
            padding: 9px 14px;
            font-size: 12.5px;
          }
          .glossary-page .fbar {
            top: 70px;
          }
          .glossary-page .fbar-in {
            padding: 11px 16px;
            gap: 7px;
            overflow-x: auto;
            flex-wrap: nowrap;
          }
          .glossary-page .f-l,
          .glossary-page .f-count {
            display: none;
          }
          .glossary-page .az {
            padding: 9px 16px;
          }
          .glossary-page .layout {
            grid-template-columns: 1fr;
            gap: 0;
            padding-top: 18px;
          }
          .glossary-page .main {
            max-width: none;
          }
          .glossary-page .side {
            position: static;
            margin-top: 26px;
          }
          .glossary-page .lg {
            scroll-margin-top: 150px;
          }
          .glossary-page .en {
            padding: 16px 17px;
          }
          .glossary-page .en-t {
            font-size: 17.5px;
          }
          .glossary-page .en-type {
            margin-left: 0;
          }
          .glossary-page .miss {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 22px 20px;
          }
          .glossary-page .miss-t {
            font-size: 18px;
          }
          .glossary-page .how {
            padding: 22px 20px;
          }
          .glossary-page .how-t {
            font-size: 18px;
          }
          .glossary-page .rev {
            grid-template-columns: 1fr;
            gap: 11px;
          }
          .glossary-page .rev-c {
            padding: 17px 18px;
            height: auto;
          }
          .glossary-page .rev-c .rev-s {
            flex: 0 0 auto;
          }
          .glossary-page .tf-grid {
            grid-template-columns: 1fr;
            gap: 22px;
          }
          .glossary-page .tf-copy {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>

      {/* ANNOUNCE */}
      <div className="announce">
        <p className="ann-text">
          <strong>Dharma does not demand fear.</strong> It demands devotion.
        </p>
        <div className="ann-links">
          <span className="ann-link">Scripture References</span>
          <span className="ann-link">Glossary</span>
          <span className="ann-link">Our Editorial Method</span>
        </div>
      </div>

      {/* TOPNAV */}
      <nav className="topnav">
        <div className="topnav-in">
          <button className="burger">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="logo">
            <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--dark)' }}>तप्</span>
            <span className="logo-wm">the tapa company</span>
          </div>
          <div className="navcats">
            <button className="navcat">Ritual Guides</button>
            <button className="navcat">Panchang</button>
            <button className="navcat">Dharmic Concepts</button>
          </div>
          <div className="navright">
            <div className="searchbar">
              <span>⌕</span>
              <span>Search…</span>
            </div>
            <div className="nav-act">♡</div>
            <button className="nav-login">Sign in</button>
          </div>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="bcrumb">
        <div className="bc-in">
          <Link href="/">Home</Link> › <b>Glossary</b>
        </div>
      </div>

      {/* HERO */}
      <section className="ghero">
        <div className="wrap">
          <div className="gh-in">
            <p className="gh-ey">GLOSSARY</p>
            <h1 className="gh-h1">Every word we use, explained once</h1>
            <p className="gh-p">
              Forty words or fewer per term, in plain language. If a word in any guide sends you here, this is where it is defined — and where to read more about it.
            </p>
            <div className="gh-search">
              <span style={{ color: '#8A7A68', fontSize: '17px' }}>⌕</span>
              <input
                type="text"
                placeholder="Type a word — tithi, sankalp, akshat…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="gh-go">Search</button>
            </div>
            <div className="gh-meta">
              <span className="gh-m">
                <b>142</b> terms
              </span>
              <span className="gh-m">
                <b>EN + हिं</b> both
              </span>
              <span className="gh-m">
                <b>Free</b>, like everything else
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="fbar">
        <div className="fbar-in">
          <span className="f-l">FILTER</span>
          <button
            className={`fc ${filter === 'all' ? 'on' : ''}`}
            onClick={() => setFilter('all')}
          >
            All terms
          </button>
          <button
            className={`fc ${filter === 'mat' ? 'on' : ''}`}
            onClick={() => setFilter('mat')}
          >
            Materials
          </button>
          <button
            className={`fc ${filter === 'pra' ? 'on' : ''}`}
            onClick={() => setFilter('pra')}
          >
            Practices
          </button>
          <button
            className={`fc ${filter === 'tim' ? 'on' : ''}`}
            onClick={() => setFilter('tim')}
          >
            Time &amp; calendar
          </button>
          <button
            className={`fc ${filter === 'txt' ? 'on' : ''}`}
            onClick={() => setFilter('txt')}
          >
            Texts &amp; terms
          </button>

          <span style={{ width: '1px', height: '22px', background: 'var(--border)', margin: '0 4px' }}></span>

          <button
            className={`fc ${lang === 'all' ? 'on' : ''}`}
            onClick={() => setLang('all')}
          >
            All languages
          </button>
          <button
            className={`fc ${lang === 'SANSKRIT' ? 'on' : ''}`}
            onClick={() => setLang('SANSKRIT')}
          >
            Sanskrit
          </button>
          <button
            className={`fc ${lang === 'HINDI' ? 'on' : ''}`}
            onClick={() => setLang('HINDI')}
          >
            Hindi
          </button>

          <span className="f-count">
            Showing {filteredTerms.length} of 142
          </span>
        </div>
      </div>

      {/* A-Z STRIP */}
      <div className="az">
        <div className="az-in">
          {alphabet.map((L) => {
            const hasTerms = letters.includes(L);
            return (
              <button
                key={L}
                className={`azl ${hasTerms ? '' : 'off'}`}
                onClick={() => hasTerms && jumpToLetter(L)}
                disabled={!hasTerms}
              >
                {L}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="wrap">
        <div className="layout">
          <div className="main">
            {filteredTerms.length === 0 ? (
              <div className="en">
                <p className="en-d">
                  No term matches that. Try a shorter spelling — or tell us the word and we will write the entry.
                </p>
              </div>
            ) : (
              letters.map((L) => {
                const groupTerms = filteredTerms.filter(
                  (x) => x.t[0].toUpperCase() === L
                );
                return (
                  <div key={L} className="lg" id={`L${L}`}>
                    <div className="lg-h">
                      <span className="lg-l">{L}</span>
                      <span className="lg-r"></span>
                    </div>
                    {groupTerms.map((x) => (
                      <div key={x.t} className="en">
                        <div className="en-top">
                          <span className="en-t">{x.t}</span>
                          <span className={`en-type ${x.ty}`}>{TYPE[x.ty]}</span>
                        </div>
                        <span className="en-dev">{x.d}</span>
                        <div className="en-meta">
                          <span className="en-say">{x.s}</span>
                          <span className="en-dot">·</span>
                          <span className="en-lang">{x.lang}</span>
                        </div>
                        <p className="en-d">{x.def}</p>
                        <div className="en-links">
                          <span className="en-lk">APPEARS IN</span>
                          {x.in.map((i) => (
                            <a key={i} className="en-a">
                              {i}
                            </a>
                          ))}
                          {x.c && (
                            <a className="en-a concept">
                              Read the concept: {x.c} ›
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="side">
            <div className="sbx">
              <div className="sbx-h">Most looked up</div>
              <a className="sbx-i">
                <b>Tithi</b>
                <span className="sbx-n">Time</span>
              </a>
              <a className="sbx-i">
                <b>Muhurat</b>
                <span className="sbx-n">Time</span>
              </a>
              <a className="sbx-i">
                <b>Sankalp</b>
                <span className="sbx-n">Practice</span>
              </a>
              <a className="sbx-i">
                <b>Sutak</b>
                <span className="sbx-n">Time</span>
              </a>
              <a className="sbx-i">
                <b>Parana</b>
                <span className="sbx-n">Practice</span>
              </a>
              <a className="sbx-i">
                <b>Akshat</b>
                <span className="sbx-n">Material</span>
              </a>
            </div>

            <div className="sbrule">
              <div className="sbr-h">HOW THIS DIFFERS FROM CONCEPTS</div>
              <p className="sbr-t">
                The glossary <b>defines and points</b> — one paragraph, then a link. <b>Dharmic Concepts explain</b> — the story, the source and the practice behind a word.
              </p>
              <p className="sbr-t" style={{ marginTop: '8px' }}>
                Where a concept article exists, the entry links to it.
              </p>
            </div>

            <button className="sbcta wa">
              <span className="sb-ci">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29z" />
                </svg>
              </span>
              <span className="sb-ct">Join the Tapa Circle</span>
              <span className="sb-cs">WhatsApp reminders · ₹499 a year</span>
            </button>

            <button className="sbcta dk">
              <span className="sb-ci">↓</span>
              <span className="sb-ct">Download the glossary</span>
              <span className="sb-cs">All 142 terms, one PDF</span>
            </button>
          </aside>
        </div>

        {/* MISSING TERM */}
        <div className="miss">
          <div>
            <div className="miss-t">Looked for a word and did not find it?</div>
            <p className="miss-p">
              Tell us the word and where you saw it. Terms people actually search for get written first — that is how this list grows.
            </p>
            <button className="miss-b">Suggest a word ›</button>
          </div>
          <div className="miss-box">
            <div className="miss-r">
              <span>1</span>
              <span>Tell us the word, spelled however you heard it.</span>
            </div>
            <div className="miss-r">
              <span>2</span>
              <span>Tell us where you came across it, if you remember.</span>
            </div>
            <div className="miss-r">
              <span>3</span>
              <span>We write the entry and link it from every guide that uses it.</span>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="how">
          <div className="how-l">HOW THE GLOSSARY WORKS</div>
          <div className="how-t">One entry per word, referenced everywhere it appears.</div>
          <p>
            A term is defined here once. Every guide that uses it links to this entry rather than repeating a definition — so when a definition improves, it improves <b>everywhere at once</b>.
          </p>
          <p>
            Entries carry <b>no classification tag and no confidence score</b>. A definition is not a ritual-authority claim. Where a word carries real weight — bilva, sankalp, tapasya — the entry points at the Dharmic Concept that does the sourcing.
          </p>
        </div>

        {/* REVENUE */}
        <div className="rev">
          <div className="rev-c soon">
            <div className="rev-i">🪔</div>
            <div className="rev-l">RITUAL KIT</div>
            <div className="rev-t">Nothing to buy here</div>
            <p className="rev-s">This is a reference page. Kits sit with the ritual guides, and open in October 2026.</p>
            <button className="rev-b">🔔 Notify me</button>
          </div>
          <div className="rev-c soon">
            <div className="rev-i">🙏</div>
            <div className="rev-l">PUROHIT &amp; PUJA</div>
            <div className="rev-t">Booking not open yet</div>
            <p className="rev-s">Purohit booking opens November 2026. We will tell you when it does.</p>
            <button className="rev-b">🔔 Notify me</button>
          </div>
          <div className="rev-c live">
            <div className="rev-i" style={{ background: '#E9F7EE', borderColor: '#C6E6D2' }}>
              🪔
            </div>
            <div className="rev-l">THE TAPA CIRCLE</div>
            <div className="rev-t">A word a week, if you like</div>
            <p className="rev-s">
              Festival reminders on WhatsApp, with the guide attached — and one glossary term each week. ₹499 a year.
            </p>
            <button className="rev-b wa">Join the Tapa Circle ›</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="tf">
        <div className="tf-brand">
          <div className="tf-lot">
            <span className="tf-line"></span>
            <span style={{ color: '#FD066D', fontSize: '18px' }}>✽</span>
            <span className="tf-line"></span>
          </div>
          <div className="tf-tag">
            Not fear. <em>Only devotion.</em>
          </div>
          <p className="tf-tagsub">
            Every ritual explained from a named source — so you know what comes from scripture, what comes from your family, and what is simply a rumour.
          </p>
          <button className="tf-cta">Read our editorial method ›</button>
        </div>
        <div className="tf-w">
          <div className="tf-map">
            <div className="tf-map-h">BROWSE BY CATEGORY</div>
            <div className="tf-grid">
              <div>
                <div className="tf-cat-t">Ritual Guides</div>
                <a className="tf-sub lead">Beginner's Guides</a>
                <a className="tf-sub">Festive Pujans</a>
                <a className="tf-sub">All-Year Pujans</a>
                <a className="tf-all">All Ritual Guides ›</a>
              </div>
              <div>
                <div className="tf-cat-t">Panchang</div>
                <a className="tf-sub">Today's Panchang</a>
                <a className="tf-sub">Vrat Calendar</a>
                <a className="tf-sub">Festival Calendar</a>
                <a className="tf-sub">Eclipses</a>
                <a className="tf-all">All Panchang ›</a>
              </div>
              <div>
                <div className="tf-cat-t">Dharmic Concepts</div>
                <a className="tf-sub">Materials</a>
                <a className="tf-sub">Meanings &amp; Practices</a>
                <a className="tf-all">All Concepts ›</a>
              </div>
              <div>
                <div className="tf-cat-t">Company</div>
                <a className="tf-sub">Why तप्</a>
                <a className="tf-sub">Our Editorial Method</a>
                <a className="tf-sub">Scripture References</a>
                <a className="tf-sub">Glossary</a>
                <a className="tf-sub">Contact</a>
              </div>
            </div>
          </div>
        </div>
        <div className="tf-w">
          <div className="tf-legal">
            <div className="tf-pol">
              <span>Terms of Use</span>
              <span>Privacy Policy</span>
              <span>Grievance Redressal</span>
              <span>Sitemap</span>
            </div>
            <div className="tf-copy">
              <div className="tf-cl-l">
                © 2026 <b>Tale Scale Networks Private Limited</b>. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
