'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateLivePanchangData } from '@/lib/live-panchang-calc';
import { MONTH_NAMES, VRAT_CALENDAR_2026, getCountdownStatus } from '@/lib/vrat-calendar-data';

const PANCHANG_STYLES = `
:root {
  --bg:#F2EDE4; --card:#FFFFFF; --dark:#1C1712; --pink:#D4175A;
  --amber:#E8A020; --amber-light:#FFF8E8; --amber-border:#E8D8A0; --amber-text:#8B6914;
  --gold:#E3B567; --body-text:#2C2010; --mid-text:#5C4B12; --sub-text:#8A7A68;
  --border:#E8E0D0; --border-light:#F0E8D8;
  --hero-text:#FFFDF5; --dim:#7A6A55; --dimmer:#5C4E36;
  --green-bg:#EBF5EC; --green-text:#1A5C28; --green-border:#C5DFB8;
  --red-light:#F0E9E1; --red-mid:#4A3525;
  --data-bg:#EEF3F7; --data-tx:#1F4460; --data-bd:#C3D6E4; --data-mid:#3E6D8C;
}

.prev{background:#1B3A52;padding:9px 40px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.prev-l{font-size:11px;font-weight:700;color:#8FC4E8;letter-spacing:.7px}
.prev-b{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.18);border-radius:7px;padding:5px 12px;font-size:11.5px;font-weight:600;color:#CFE4F2;cursor:pointer}
.prev-b.on{background:#fff;color:#1B3A52;border-color:#fff}
.prev-n{margin-left:auto;font-size:11px;color:#6F9CBC;font-style:italic}

.bcrumb{background:var(--card);border-bottom:1px solid var(--border);padding:10px 40px}
.bc-in{max-width:1280px;margin:0 auto;font-size:12.5px;color:var(--sub-text)}
.bc-in b{color:var(--body-text);font-weight:500}

.chero{background:
  radial-gradient(ellipse 55% 60% at 80% 30%,rgba(46,96,132,.34) 0%,transparent 62%),
  linear-gradient(155deg,#0C1A26 0%,#1B3A52 38%,#0D1E2C 70%,#070F17 100%);
  padding:42px 0 44px}
.chero-in{display:grid;grid-template-columns:1fr .82fr;gap:44px;align-items:center}
.ch-ey{font-size:11px;color:var(--gold);letter-spacing:1px;margin-bottom:11px}
.ch-h1{font-size:37px;font-weight:700;color:var(--hero-text);line-height:1.14;letter-spacing:-.8px;margin-bottom:13px}
.ch-p{font-size:15.5px;color:#A9C6DC;line-height:1.8;max-width:500px;margin-bottom:18px}
.ch-meta{display:flex;gap:22px;flex-wrap:wrap}
.ch-m{font-size:12px;color:#7FA5C0;display:flex;align-items:center;gap:6px}
.ch-m b{color:var(--gold);font-weight:700;font-size:14px}

.today{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);border-radius:18px;overflow:hidden}
.td-h{padding:13px 20px;border-bottom:1px solid rgba(255,255,255,.11);display:flex;align-items:center;justify-content:space-between}
.td-l{font-size:11px;font-weight:700;color:var(--gold);letter-spacing:.7px}
.td-live{display:flex;align-items:center;gap:6px;font-size:11px;color:#8FC4E8}
.livedot{width:6px;height:6px;border-radius:50%;background:#3FBF6A;box-shadow:0 0 0 3px rgba(63,191,106,.22)}
.td-date{padding:16px 20px 13px;border-bottom:1px solid rgba(255,255,255,.09)}
.td-day{font-size:20px;font-weight:700;color:#fff;line-height:1.2}
.td-sub{font-size:12px;color:#8FC4E8;margin-top:4px}
.td-rows{padding:3px 20px}
.tdr{display:flex;justify-content:space-between;align-items:baseline;padding:9px 0;border-bottom:.5px solid rgba(255,255,255,.07);gap:14px}
.tdr:last-child{border-bottom:none}
.tdk{font-size:11px;color:#8FC4E8;letter-spacing:.4px}
.tdv{font-size:12.5px;color:#fff;font-weight:600;text-align:right}
.td-foot{background:rgba(212,23,90,.15);padding:12px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.tdf-t{font-size:12px;color:#FFD1DF;line-height:1.5}
.tdf-t b{color:#fff;font-weight:700}
.tdf-c{font-size:12px;color:#FF9EBE;font-weight:700;white-space:nowrap}

.ctrl{background:var(--card);border-bottom:1px solid var(--border);position:static;top:78px;z-index:50}
.ctrl-in{max-width:1280px;margin:0 auto;padding:12px 40px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.city{display:flex;align-items:center;gap:9px;background:var(--data-bg);border:1.5px solid var(--data-bd);border-radius:10px;padding:8px 14px}
.city-l{font-size:11px;font-weight:700;color:var(--data-mid);letter-spacing:.5px}
.city-v{font-size:13px;font-weight:700;color:var(--data-tx)}
.city-c{font-size:11.5px;color:var(--pink);font-weight:700;margin-left:4px;cursor:pointer}
.sep{width:1px;height:22px;background:var(--border)}
.fc{background:var(--bg);border:1.5px solid var(--border);border-radius:9px;padding:7px 14px;font-size:12px;font-weight:500;color:var(--body-text);white-space:nowrap;cursor:pointer}
.fc.on{border-color:var(--pink);background:var(--red-light);color:var(--pink);font-weight:700}
.dl{margin-left:auto;background:var(--dark);border:none;border-radius:10px;padding:9px 17px;font-size:12px;font-weight:700;color:#fff;white-space:nowrap;cursor:pointer}

.prov{background:var(--amber-light);border-bottom:1px solid var(--amber-border);padding:10px 40px}
.prov-in{max-width:1280px;margin:0 auto;font-size:12px;color:var(--amber-text);line-height:1.6}
.prov-in b{font-weight:700}

.subs{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.sub{background:var(--card);border:1px solid var(--border);border-radius:15px;padding:20px 21px;display:flex;flex-direction:column;cursor:pointer;text-decoration:none}
.sub:hover{border-color:var(--pink)}
.sub-i{width:40px;height:40px;border-radius:11px;background:var(--data-bg);border:1px solid var(--data-bd);display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:13px}
.sub-t{font-size:17px;font-weight:700;color:var(--dark);margin-bottom:5px}
.sub-s{font-size:12.5px;color:var(--sub-text);line-height:1.7;flex:1;margin-bottom:11px}
.sub-c{font-size:12px;color:var(--pink);font-weight:700}

.dtable{background:var(--card);border:1px solid var(--border);border-radius:15px;overflow:hidden}
.dt-mh{background:var(--data-bg);padding:11px 20px;border-bottom:1px solid var(--data-bd);display:flex;align-items:baseline;justify-content:space-between;gap:12px}
.dt-mt{font-size:13px;font-weight:700;color:var(--data-tx);letter-spacing:.3px}
.dt-mc{font-size:11.5px;color:var(--data-mid)}
.dt-head{display:grid;grid-template-columns:104px 1fr 190px 118px;gap:16px;padding:9px 20px;border-bottom:1px solid var(--border);background:#FCFAF6}
.dt-head span{font-size:11px;font-weight:700;color:var(--sub-text);letter-spacing:.6px}
.dt-r{display:grid;grid-template-columns:104px 1fr 190px 118px;gap:16px;padding:14px 20px;border-bottom:.5px solid var(--border-light);align-items:center}
.dt-r:last-child{border-bottom:none}
.dt-r:hover{background:#FCFAF6}
.dt-r.next{background:var(--red-light)}
.dt-d{font-size:15px;font-weight:700;color:var(--dark);line-height:1.2}
.dt-dw{font-size:11px;color:var(--sub-text);margin-top:2px}
.dt-n{font-size:14.5px;font-weight:600;color:var(--dark);line-height:1.3}
.dt-x{font-size:12px;color:var(--sub-text);margin-top:2px;line-height:1.5}
.dt-t{font-size:12px;color:var(--data-tx);line-height:1.55}
.dt-cd{font-size:11px;font-weight:700;padding:4px 10px;border-radius:6px;background:var(--bg);color:var(--sub-text);border:1px solid var(--border);text-align:center;white-space:nowrap}
.dt-cd.soon{background:var(--red-light);color:var(--pink);border-color:#F0B8CC}
.dt-cd.past{opacity:.5}
.dt-a{font-size:12px;color:var(--pink);font-weight:700;white-space:nowrap;text-align:right}

.mtabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin-bottom:18px;padding-bottom:2px}
.mtabs::-webkit-scrollbar{display:none}
.mt{background:var(--card);border:1.5px solid var(--border);border-radius:10px;padding:9px 15px;font-size:12.5px;font-weight:600;color:var(--body-text);white-space:nowrap;flex-shrink:0;text-align:center;cursor:pointer}
.mt.on{background:var(--dark);border-color:var(--dark);color:#fff}
.mt span{display:block;font-size:11px;font-weight:500;opacity:.6;margin-top:1px}

.fgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.fc-card{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;display:flex;text-decoration:none}
.fc-card:hover{border-color:var(--pink)}
.fc-l{width:76px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px 0;color:#fff}
.fc-dd{font-size:22px;font-weight:700;line-height:1}
.fc-mm{font-size:11px;font-weight:600;letter-spacing:.5px;margin-top:3px;opacity:.85}
.fc-dw{font-size:11px;opacity:.65;margin-top:5px}
.fc-b{padding:14px 16px;flex:1;min-width:0}
.fc-n{font-size:14.5px;font-weight:700;color:var(--dark);line-height:1.3;margin-bottom:3px}
.fc-t{font-size:11.5px;color:var(--data-tx);line-height:1.5;margin-bottom:7px}
.fc-m{display:flex;gap:7px;align-items:center;flex-wrap:wrap}
.tag{font-size:11px;padding:2px 8px;border-radius:5px;font-weight:700}
.tag.g{background:var(--green-bg);color:var(--green-text);border:1px solid var(--green-border)}
.tag.n{background:var(--bg);color:var(--sub-text);border:1px solid var(--border)}
.h-shiva{background:linear-gradient(160deg,#1A1440,#3A2E70)}
.h-krishna{background:linear-gradient(160deg,#151033,#2E2260)}
.h-devi{background:linear-gradient(160deg,#5C1A30,#A83358)}
.h-ganesh{background:linear-gradient(160deg,#6B3410,#B5651D)}
.h-vishnu{background:linear-gradient(160deg,#0C2A3A,#1B5670)}
.h-earth{background:linear-gradient(160deg,#2C1C10,#6B4A28)}

.sh{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin:38px 0 18px}
.sh-ey{font-size:11px;font-weight:700;color:var(--pink);letter-spacing:.8px;margin-bottom:6px}
.sh-t{font-size:22px;font-weight:700;color:var(--dark);letter-spacing:-.4px;line-height:1.25}
.sh-s{font-size:13.5px;color:var(--sub-text);line-height:1.7;margin-top:6px;max-width:640px}
.sh-a{font-size:12.5px;color:var(--pink);font-weight:700;white-space:nowrap;flex-shrink:0;cursor:pointer}
.pagepad{padding:30px 0 0}

.learn{background:var(--data-bg);border:1px solid var(--data-bd);border-radius:18px;padding:30px 34px;display:grid;grid-template-columns:1.1fr 1fr;gap:34px;align-items:center;margin:34px 0 0}
.ln-ey{font-size:11px;font-weight:700;color:var(--data-mid);letter-spacing:.8px;margin-bottom:10px}
.ln-t{font-size:22px;font-weight:700;color:var(--data-tx);line-height:1.28;letter-spacing:-.4px;margin-bottom:11px}
.ln-p{font-size:14px;color:var(--data-mid);line-height:1.82;margin-bottom:16px}
.ln-c{background:var(--data-tx);border:none;border-radius:21px;padding:11px 22px;font-size:12.5px;font-weight:700;color:#fff;cursor:pointer}
.ln-list{display:flex;flex-direction:column;gap:8px}
.ln-i{background:var(--card);border-radius:11px;padding:12px 15px;display:flex;gap:11px;align-items:center}
.ln-n{width:22px;height:22px;border-radius:50%;background:var(--data-bg);border:1px solid var(--data-bd);color:var(--data-tx);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ln-it{font-size:12.5px;font-weight:600;color:var(--dark)}
.ln-is{font-size:11.5px;color:var(--sub-text);margin-top:1px}

.dlband{background:var(--dark);border-radius:18px;padding:30px 34px;display:flex;align-items:center;gap:28px;margin:26px 0 0}
.dl-i{width:54px;height:54px;border-radius:15px;background:rgba(232,160,32,.14);border:1px solid rgba(232,160,32,.3);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.dl-t{font-size:19px;font-weight:700;color:var(--hero-text);margin-bottom:5px}
.dl-s{font-size:13.5px;color:#A99070;line-height:1.72}
.dl-c{margin-left:auto;background:var(--pink);border:none;border-radius:22px;padding:12px 24px;font-size:13px;font-weight:700;color:#fff;white-space:nowrap;flex-shrink:0;cursor:pointer}

.sticky{display:none}

@media (max-width:900px){
  body{max-width:430px;margin:0 auto;padding-bottom:74px}
  .wrap,.tf-w{padding:0 16px}
  .prev{padding:9px 16px;gap:7px}.prev-n{display:none}
  .chero{padding:26px 0 30px}
  .chero-in{grid-template-columns:1fr;gap:24px}
  .ch-h1{font-size:27px}.ch-p{font-size:14px}
  .ctrl{top:70px}
  .ctrl-in{padding:11px 16px;gap:8px}
  .city{width:100%}
  .sep{display:none}
  .dl{display:none}
  .prov{padding:10px 16px}
  .subs{grid-template-columns:1fr 1fr;gap:11px}
  .sub{padding:16px 17px}
  .sub-t{font-size:14.5px}
  .dt-head{display:none}
  .dt-r{grid-template-columns:66px 1fr;gap:12px;padding:13px 16px;align-items:flex-start}
  .dt-d{font-size:14px}
  .dt-t{grid-column:2;font-size:11.5px;margin-top:5px}
  .dt-cd{grid-column:1;margin-top:6px;font-size:11px;padding:3px 6px}
  .dt-a{display:none}
  .dt-mh{padding:10px 16px}
  .fgrid{grid-template-columns:1fr;gap:11px}
  .sh{flex-direction:column;align-items:flex-start;gap:8px}
  .sh-t{font-size:19px}
  .learn,.dlband{grid-template-columns:1fr;flex-direction:column;align-items:flex-start;gap:20px;padding:24px 20px}
  .ln-t{font-size:19px}
  .dl-c{margin-left:0;width:100%}
  .sticky{display:flex;position:fixed;bottom:0;left:0;right:0;z-index:70;background:rgba(255,255,255,.97);backdrop-filter:blur(10px);border-top:1px solid var(--border);padding:10px 14px calc(10px + env(safe-area-inset-bottom));max-width:430px;margin:0 auto;box-shadow:0 -2px 16px rgba(28,23,18,.08)}
  .sticky button{width:100%;background:var(--dark);border:none;border-radius:11px;padding:13px;font-size:13px;font-weight:700;color:#fff;display:flex;flex-direction:column;align-items:center;line-height:1.3}
  .sticky small{font-size:11px;font-weight:500;opacity:.75}
}
`;

export default function PanchangPage() {
  const [activeTab, setActiveTab] = useState<'pl' | 'vc' | 'fc'>('pl');
  const [purnimantaActive, setPurnimantaActive] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('Sep');

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const livePanchang = calculateLivePanchangData();

  const renderTodayPanel = () => (
    <div className="today">
      <div className="td-h">
        <span className="td-l">☀ TODAY&apos;S PANCHANG</span>
        <span className="td-live">
          <span className="livedot"></span>DELHI-NCR
        </span>
      </div>
      <div className="td-date">
        <div className="td-day">{livePanchang.tithiHeader}</div>
        <div className="td-sub">{livePanchang.formattedFullDate}</div>
      </div>
      <div className="td-rows">
        <div className="tdr">
          <span className="tdk">PAKSHA</span>
          <span className="tdv">{livePanchang.pakshaDesc}</span>
        </div>
        <div className="tdr">
          <span className="tdk">NAKSHATRA</span>
          <span className="tdv">{livePanchang.nakshatra}</span>
        </div>
        <div className="tdr">
          <span className="tdk">SUNRISE / SUNSET</span>
          <span className="tdv">{livePanchang.sunriseSunset}</span>
        </div>
        <div className="tdr">
          <span className="tdk">RAHU KAAL</span>
          <span className="tdv">{livePanchang.rahuKaal}</span>
        </div>
        <div className="tdr">
          <span className="tdk">YOGA · KARANA</span>
          <span className="tdv">{livePanchang.yogaKarana}</span>
        </div>
      </div>
      <div className="td-foot">
        <span className="tdf-t">
          <b>Next major date —</b> Ganesh Chaturthi, 14 September
        </span>
        <span className="tdf-c">Open guide ›</span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: PANCHANG_STYLES }} />

      {/* Breadcrumb */}
      <div className="bcrumb">
        <div className="bc-in">
          {activeTab === 'pl' && <>Home › <b>Panchang</b></>}
          {activeTab === 'vc' && <>Home › Panchang › <b>2026 Vrat Calendar</b></>}
          {activeTab === 'fc' && <>Home › Panchang › <b>Festival Calendar</b></>}
        </div>
      </div>

      {/* Hero Section */}
      <section className="chero">
        <div className="wrap">
          <div className="chero-in">
            {activeTab === 'pl' && (
              <div>
                <p className="ch-ey">PANCHANG</p>
                <h1 className="ch-h1">The calendar that follows the Moon</h1>
                <p className="ch-p">
                  Today&apos;s tithi, the year&apos;s vrat dates, and how to read any of it yourself. Computed for your city — because a festival date genuinely differs between Delhi and Mumbai, and both are correct.
                </p>
                <div className="ch-meta">
                  <span className="ch-m"><b>365</b> days computed</span>
                  <span className="ch-m"><b>142</b> vrat dates in 2026</span>
                  <span className="ch-m"><b>Drik Panchang</b> source</span>
                </div>
              </div>
            )}
            {activeTab === 'vc' && (
              <div>
                <p className="ch-ey">PANCHANG · CALENDAR</p>
                <h1 className="ch-h1">2026 Vrat Calendar</h1>
                <p className="ch-p">
                  Every Ekadashi, Pradosh, Chaturthi, Purnima and Amavasya of the year — with the tithi each one follows, so you can check any of it against your own panchang.
                </p>
                <div className="ch-meta">
                  <span className="ch-m"><b>142</b> dates</span>
                  <span className="ch-m"><b>24</b> Ekadashis</span>
                  <span className="ch-m"><b>24</b> Pradosh vrats</span>
                </div>
              </div>
            )}
            {activeTab === 'fc' && (
              <div>
                <p className="ch-ey">PANCHANG · CALENDAR</p>
                <h1 className="ch-h1">Festival Calendar 2026</h1>
                <p className="ch-p">
                  For anyone who plans in months rather than tithis. Gregorian dates first, with the tithi beneath — so you can book leave and still know which lunar day you are actually observing.
                </p>
                <div className="ch-meta">
                  <span className="ch-m"><b>48</b> festivals</span>
                  <span className="ch-m"><b>34</b> with a full guide</span>
                  <span className="ch-m"><b>14</b> guides coming</span>
                </div>
              </div>
            )}
            {renderTodayPanel()}
          </div>
        </div>
      </section>

      {/* Control / Filter Bar */}
      <div className="ctrl">
        <div className="ctrl-in">
          <div className="city">
            <span className="city-l">COMPUTED FOR</span>
            <span className="city-v">New Delhi</span>
            <span className="city-c">Change ›</span>
          </div>
          <div className="sep"></div>

          {activeTab === 'pl' && (
            <>
              <button
                className={`fc ${purnimantaActive ? 'on' : ''}`}
                onClick={() => setPurnimantaActive(true)}
              >
                Purnimanta
              </button>
              <button
                className={`fc ${!purnimantaActive ? 'on' : ''}`}
                onClick={() => setPurnimantaActive(false)}
              >
                Amanta
              </button>
              <button className="dl">↓ Download 2026 calendar</button>
            </>
          )}

          {activeTab === 'vc' && (
            <>
              {['All', 'Ekadashi', 'Pradosh', 'Chaturthi', 'Purnima', 'Amavasya'].map((cat) => (
                <button
                  key={cat}
                  className={`fc ${filterCategory === cat ? 'on' : ''}`}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat}
                </button>
              ))}
              <button className="dl">↓ Download PDF</button>
            </>
          )}

          {activeTab === 'fc' && (
            <>
              {['All festivals', 'Major only', 'Shiva', 'Vishnu', 'Devi', 'Ganesha'].map((cat) => (
                <button
                  key={cat}
                  className={`fc ${filterCategory === cat ? 'on' : ''}`}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat}
                </button>
              ))}
              <button className="dl">↓ Download PDF</button>
            </>
          )}
        </div>
      </div>

      {/* Stage Body */}
      <div className="wrap">
        <div className="pagepad">
          {/* VIEW 1: PANCHANG LANDING */}
          {activeTab === 'pl' && (
            <>
              <div className="sh">
                <div>
                  <div className="sh-ey">FOUR WAYS IN</div>
                  <div className="sh-t">What you can look up</div>
                </div>
              </div>
              <div className="subs">
                <a className="sub" onClick={() => setActiveTab('pl')}>
                  <div className="sub-i">☀</div>
                  <div className="sub-t">Today&apos;s Panchang</div>
                  <p className="sub-s">The full day — tithi, nakshatra, yoga, karana, sunrise, sunset and Rahu Kaal.</p>
                  <span className="sub-c">Open today ›</span>
                </a>
                <a className="sub" onClick={() => { setActiveTab('vc'); scrollToTop(); }}>
                  <div className="sub-i">📿</div>
                  <div className="sub-t">2026 Vrat Calendar</div>
                  <p className="sub-s">Every Ekadashi, Pradosh, Chaturthi, Purnima and Amavasya for the year.</p>
                  <span className="sub-c">142 dates ›</span>
                </a>
                <a className="sub" onClick={() => { setActiveTab('fc'); scrollToTop(); }}>
                  <div className="sub-i">🎆</div>
                  <div className="sub-t">Festival Calendar</div>
                  <p className="sub-s">Gregorian dates month by month, for anyone who thinks in months rather than tithis.</p>
                  <span className="sub-c">Browse by month ›</span>
                </a>
                <Link className="sub" href="/panchang/eclipses">
                  <div className="sub-i">🌑</div>
                  <div className="sub-t">Eclipse &amp; Grahan</div>
                  <p className="sub-s">Upcoming eclipses, visibility by city, and what actually determines Sutak Kaal.</p>
                  <span className="sub-c">2 in 2026 ›</span>
                </Link>
              </div>

              <div className="sh">
                <div>
                  <div className="sh-ey">NEXT 30 DAYS</div>
                  <div className="sh-t">Coming up</div>
                  <p className="sh-s">Dates shown for New Delhi. Change your city above if you observe elsewhere.</p>
                </div>
                <a className="sh-a" onClick={() => { setActiveTab('vc'); scrollToTop(); }}>Full vrat calendar ›</a>
              </div>

              <div className="dtable">
                <div className="dt-head">
                  <span>DATE</span>
                  <span>OBSERVANCE</span>
                  <span>TITHI</span>
                  <span></span>
                </div>
                <div className="dt-r next">
                  <div>
                    <div className="dt-d">11 Sep</div>
                    <div className="dt-dw">Friday</div>
                  </div>
                  <div>
                    <div className="dt-n">Parsva Ekadashi</div>
                    <div className="dt-x">Grain avoidance · parana next morning</div>
                  </div>
                  <div className="dt-t">Bhadrapada Shukla Ekadashi</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                    <span className="dt-cd soon">IN 4 DAYS</span>
                    <span className="dt-a">Guide ›</span>
                  </div>
                </div>
                <div className="dt-r">
                  <div>
                    <div className="dt-d">13 Sep</div>
                    <div className="dt-dw">Sunday</div>
                  </div>
                  <div>
                    <div className="dt-n">Hartalika Teej</div>
                    <div className="dt-x">Sand Shivalinga · night vigil</div>
                  </div>
                  <div className="dt-t">Bhadrapada Shukla Tritiya</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                    <span className="dt-cd soon">IN 6 DAYS</span>
                    <span className="dt-a">Guide ›</span>
                  </div>
                </div>
                <div className="dt-r">
                  <div>
                    <div className="dt-d">14 Sep</div>
                    <div className="dt-dw">Monday</div>
                  </div>
                  <div>
                    <div className="dt-n">Ganesh Chaturthi</div>
                    <div className="dt-x">Prana pratishtha · Madhyahna muhurat</div>
                  </div>
                  <div className="dt-t">Bhadrapada Shukla Chaturthi</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                    <span className="dt-cd soon">IN 7 DAYS</span>
                    <span className="dt-a">Guide ›</span>
                  </div>
                </div>
                <div className="dt-r">
                  <div>
                    <div className="dt-d">19 Sep</div>
                    <div className="dt-dw">Saturday</div>
                  </div>
                  <div>
                    <div className="dt-n">Radha Ashtami</div>
                  </div>
                  <div className="dt-t">Bhadrapada Shukla Ashtami</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                    <span className="dt-cd">IN 12 DAYS</span>
                    <span className="dt-a">Guide ›</span>
                  </div>
                </div>
                <div className="dt-r">
                  <div>
                    <div className="dt-d">23 Sep</div>
                    <div className="dt-dw">Wednesday</div>
                  </div>
                  <div>
                    <div className="dt-n">Anant Chaturdashi</div>
                    <div className="dt-x">Ganesh Visarjan</div>
                  </div>
                  <div className="dt-t">Bhadrapada Shukla Chaturdashi</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                    <span className="dt-cd">IN 16 DAYS</span>
                    <span className="dt-a">Guide ›</span>
                  </div>
                </div>
                <div className="dt-r">
                  <div>
                    <div className="dt-d">26 Sep</div>
                    <div className="dt-dw">Saturday</div>
                  </div>
                  <div>
                    <div className="dt-n">Pitru Paksha begins</div>
                    <div className="dt-x">Shraddha period · 16 days</div>
                  </div>
                  <div className="dt-t">Bhadrapada Purnima</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                    <span className="dt-cd">IN 19 DAYS</span>
                    <span className="dt-a">Guide ›</span>
                  </div>
                </div>
              </div>

              <div className="learn">
                <div>
                  <div className="ln-ey">BEFORE YOU USE ANY OF THIS</div>
                  <div className="ln-t">Learn to read it once, and never ask again</div>
                  <p className="ln-p">Panch means five. Ang means limb. Five things tracked daily — and once you can read them, you will never have to ask anyone which day a festival falls on.</p>
                  <button className="ln-c">How to read today&apos;s Panchang ›</button>
                </div>
                <div className="ln-list">
                  <div className="ln-i">
                    <span className="ln-n">1</span>
                    <div>
                      <div className="ln-it">Tithi</div>
                      <div className="ln-is">The lunar day — what fixes almost every festival</div>
                    </div>
                  </div>
                  <div className="ln-i">
                    <span className="ln-n">2</span>
                    <div>
                      <div className="ln-it">Paksha</div>
                      <div className="ln-is">Waxing or waning half of the month</div>
                    </div>
                  </div>
                  <div className="ln-i">
                    <span className="ln-n">3</span>
                    <div>
                      <div className="ln-it">Nakshatra</div>
                      <div className="ln-is">Where the Moon sits among 27 segments</div>
                    </div>
                  </div>
                  <div className="ln-i">
                    <span className="ln-n">4</span>
                    <div>
                      <div className="ln-it">Vara &amp; the rest</div>
                      <div className="ln-is">Weekday, yoga, karana — the finer grain</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dlband">
                <div className="dl-i">📅</div>
                <div>
                  <div className="dl-t">The full 2026 calendar, on one PDF</div>
                  <p className="dl-s">Every tithi, vrat and festival date for the year, computed for your city. Print it, or keep it on your phone.</p>
                </div>
                <button className="dl-c">Download calendar ›</button>
              </div>
            </>
          )}

          {/* VIEW 2: VRAT CALENDAR 2026 */}
          {activeTab === 'vc' && (() => {
            const currentMonthInfo = MONTH_NAMES.find((m) => m.short === selectedMonth) || MONTH_NAMES[8];
            const monthObservances = VRAT_CALENDAR_2026.filter((item) => {
              const matchesMonth = item.month === selectedMonth;
              const matchesCategory =
                filterCategory === 'All' ||
                item.category === filterCategory ||
                (filterCategory === 'All festivals' && item.category === 'Festival');
              return matchesMonth && matchesCategory;
            });

            return (
              <>
                <div className="mtabs">
                  {MONTH_NAMES.map((m) => {
                    const monthCount = VRAT_CALENDAR_2026.filter((item) => {
                      const matchesMonth = item.month === m.short;
                      const matchesCategory =
                        filterCategory === 'All' ||
                        item.category === filterCategory;
                      return matchesMonth && matchesCategory;
                    }).length;

                    return (
                      <button
                        key={m.short}
                        className={`mt ${selectedMonth === m.short ? 'on' : ''}`}
                        onClick={() => setSelectedMonth(m.short)}
                      >
                        {m.short}
                        <span>{monthCount > 0 ? `${monthCount} dates` : '—'}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="dtable">
                  <div className="dt-mh">
                    <span className="dt-mt">{currentMonthInfo.full}</span>
                    <span className="dt-mc">
                      {monthObservances.length} observances · {currentMonthInfo.vedic}
                    </span>
                  </div>
                  <div className="dt-head">
                    <span>DATE</span>
                    <span>OBSERVANCE</span>
                    <span>TITHI</span>
                    <span></span>
                  </div>
                  {monthObservances.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--sub-text)', fontSize: '13px' }}>
                      No {filterCategory === 'All' ? '' : filterCategory} observances found in {currentMonthInfo.short} 2026.
                    </div>
                  ) : (
                    monthObservances.map((item) => {
                      const status = getCountdownStatus(item.year, item.monthIndex, item.day);
                      const isNext = status.text === 'TOMORROW' || status.text === 'TODAY';
                      return (
                        <div className={`dt-r ${isNext ? 'next' : ''}`} key={item.id}>
                          <div>
                            <div className="dt-d">{item.day} {item.month}</div>
                            <div className="dt-dw">{item.weekday}</div>
                          </div>
                          <div>
                            <div className="dt-n">{item.name}</div>
                            {item.note && <div className="dt-x">{item.note}</div>}
                          </div>
                          <div className="dt-t">{item.tithi}</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                            <span className={status.className}>{status.text}</span>
                            {item.guideSlug ? (
                              <Link href={`/ritual-guides/${item.guideSlug}`} className="dt-a">Guide ›</Link>
                            ) : (
                              <span className="dt-a">Guide ›</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="learn">
                  <div>
                    <div className="ln-ey">WHY YOUR CITY MATTERS</div>
                    <div className="ln-t">Two apps can show different dates, and both can be right</div>
                    <p className="ln-p">A tithi begins at a fixed moment in time — but the Hindu day begins at sunrise, and sunrise is not the same everywhere. A tithi that starts before sunrise in Delhi may start after it in Mumbai, moving the date by a day.</p>
                    <button className="ln-c">Read the full explanation ›</button>
                  </div>
                  <div className="ln-list">
                    <div className="ln-i">
                      <span className="ln-n">✓</span>
                      <div>
                        <div className="ln-it">Set your city once</div>
                        <div className="ln-is">Every date on the platform recomputes</div>
                      </div>
                    </div>
                    <div className="ln-i">
                      <span className="ln-n">✓</span>
                      <div>
                        <div className="ln-it">Purnimanta or Amanta</div>
                        <div className="ln-is">North India uses Purnimanta — the default here</div>
                      </div>
                    </div>
                    <div className="ln-i">
                      <span className="ln-n">✓</span>
                      <div>
                        <div className="ln-it">Verified manually</div>
                        <div className="ln-is">Entered and checked, never auto-fetched</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dlband">
                  <div className="dl-i">📿</div>
                  <div>
                    <div className="dl-t">All 142 dates, on one page</div>
                    <p className="dl-s">The complete 2026 vrat calendar as a PDF — computed for your city, ready to print or forward.</p>
                  </div>
                  <button className="dl-c">Download PDF ›</button>
                </div>
              </>
            );
          })()}

          {/* VIEW 3: FESTIVAL CALENDAR */}
          {activeTab === 'fc' && (() => {
            const currentMonthInfo = MONTH_NAMES.find((m) => m.short === selectedMonth) || MONTH_NAMES[8];
            return (
              <>
                <div className="mtabs">
                  {MONTH_NAMES.map((m) => {
                    const monthFestCount = VRAT_CALENDAR_2026.filter(
                      (item) => item.month === m.short && (item.category === 'Festival' || item.guideSlug)
                    ).length;

                    return (
                      <button
                        key={m.short}
                        className={`mt ${selectedMonth === m.short ? 'on' : ''}`}
                        onClick={() => setSelectedMonth(m.short)}
                      >
                        {m.short}
                        <span>{monthFestCount > 0 ? `${monthFestCount} festivals` : '—'}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="sh" style={{ marginTop: 0 }}>
                  <div>
                    <div className="sh-ey">{currentMonthInfo.full}</div>
                    <div className="sh-t">{currentMonthInfo.vedic}</div>
                    <p className="sh-s">Festival calendar for {currentMonthInfo.short} 2026.</p>
                  </div>
                  <a className="sh-a">Add to your calendar ›</a>
                </div>

              <div className="fgrid">
                <a className="fc-card">
                  <div className="fc-l h-krishna">
                    <div className="fc-dd">4</div>
                    <div className="fc-mm">SEP</div>
                    <div className="fc-dw">Friday</div>
                  </div>
                  <div className="fc-b">
                    <div className="fc-n">Krishna Janmashtami</div>
                    <div className="fc-t">Bhadrapada Krishna Ashtami · Smarta</div>
                    <div className="fc-m">
                      <span className="tag g">GUIDE LIVE</span>
                      <span className="tag n">Also 5 Sep — Vaishnava</span>
                    </div>
                  </div>
                </a>
                <a className="fc-card">
                  <div className="fc-l h-shiva">
                    <div className="fc-dd">13</div>
                    <div className="fc-mm">SEP</div>
                    <div className="fc-dw">Sunday</div>
                  </div>
                  <div className="fc-b">
                    <div className="fc-n">Hartalika Teej</div>
                    <div className="fc-t">Bhadrapada Shukla Tritiya</div>
                    <div className="fc-m">
                      <span className="tag g">GUIDE LIVE</span>
                    </div>
                  </div>
                </a>
                <a className="fc-card">
                  <div className="fc-l h-ganesh">
                    <div className="fc-dd">14</div>
                    <div className="fc-mm">SEP</div>
                    <div className="fc-dw">Monday</div>
                  </div>
                  <div className="fc-b">
                    <div className="fc-n">Ganesh Chaturthi</div>
                    <div className="fc-t">Bhadrapada Shukla Chaturthi</div>
                    <div className="fc-m">
                      <span className="tag g">GUIDE LIVE</span>
                      <span className="tag n">Madhyahna muhurat</span>
                    </div>
                  </div>
                </a>
                <a className="fc-card">
                  <div className="fc-l h-devi">
                    <div className="fc-dd">19</div>
                    <div className="fc-mm">SEP</div>
                    <div className="fc-dw">Saturday</div>
                  </div>
                  <div className="fc-b">
                    <div className="fc-n">Radha Ashtami</div>
                    <div className="fc-t">Bhadrapada Shukla Ashtami</div>
                    <div className="fc-m">
                      <span className="tag g">GUIDE LIVE</span>
                    </div>
                  </div>
                </a>
                <a className="fc-card">
                  <div className="fc-l h-ganesh">
                    <div className="fc-dd">23</div>
                    <div className="fc-mm">SEP</div>
                    <div className="fc-dw">Wednesday</div>
                  </div>
                  <div className="fc-b">
                    <div className="fc-n">Anant Chaturdashi</div>
                    <div className="fc-t">Bhadrapada Shukla Chaturdashi</div>
                    <div className="fc-m">
                      <span className="tag g">GUIDE LIVE</span>
                      <span className="tag n">Ganesh Visarjan</span>
                    </div>
                  </div>
                </a>
                <a className="fc-card">
                  <div className="fc-l h-earth">
                    <div className="fc-dd">26</div>
                    <div className="fc-mm">SEP</div>
                    <div className="fc-dw">Saturday</div>
                  </div>
                  <div className="fc-b">
                    <div className="fc-n">Pitru Paksha begins</div>
                    <div className="fc-t">Bhadrapada Purnima · 16 days</div>
                    <div className="fc-m">
                      <span className="tag n">GUIDE COMING</span>
                    </div>
                  </div>
                </a>
              </div>

              <div className="sh">
                <div>
                  <div className="sh-ey">NEXT MONTH</div>
                  <div className="sh-t">October — Navratri and Deepavali</div>
                  <p className="sh-s">The two largest observances of the year fall within five weeks of each other.</p>
                </div>
                <a className="sh-a">See October ›</a>
              </div>

              <div className="fgrid">
                <a className="fc-card">
                  <div className="fc-l h-devi">
                    <div className="fc-dd">11</div>
                    <div className="fc-mm">OCT</div>
                    <div className="fc-dw">Sunday</div>
                  </div>
                  <div className="fc-b">
                    <div className="fc-n">Sharad Navratri begins</div>
                    <div className="fc-t">Ashwin Shukla Pratipada · Ghatsthapana</div>
                    <div className="fc-m">
                      <span className="tag n">GUIDE COMING</span>
                    </div>
                  </div>
                </a>
                <a className="fc-card">
                  <div className="fc-l h-devi">
                    <div className="fc-dd">19</div>
                    <div className="fc-mm">OCT</div>
                    <div className="fc-dw">Monday</div>
                  </div>
                  <div className="fc-b">
                    <div className="fc-n">Durga Ashtami</div>
                    <div className="fc-t">Ashwin Shukla Ashtami</div>
                    <div className="fc-m">
                      <span className="tag n">GUIDE COMING</span>
                    </div>
                  </div>
                </a>
                <a className="fc-card">
                  <div className="fc-l h-vishnu">
                    <div className="fc-dd">21</div>
                    <div className="fc-mm">OCT</div>
                    <div className="fc-dw">Wednesday</div>
                  </div>
                  <div className="fc-b">
                    <div className="fc-n">Vijayadashami</div>
                    <div className="fc-t">Ashwin Shukla Dashami</div>
                    <div className="fc-m">
                      <span className="tag n">GUIDE COMING</span>
                    </div>
                  </div>
                </a>
              </div>

                <div className="dlband">
                  <div className="dl-i">🎆</div>
                  <div>
                    <div className="dl-t">The whole year, month by month</div>
                    <p className="dl-s">Every festival date for 2026 as a PDF — Gregorian dates with the tithi beneath each one.</p>
                  </div>
                  <button className="dl-c">Download PDF ›</button>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="sticky">
        <button>
          Download full calendar (PDF)
          <small>Computed for New Delhi · 2026</small>
        </button>
      </div>
    </div>
  );
}
