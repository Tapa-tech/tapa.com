'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateLivePanchangData } from '@/lib/live-panchang-calc';
import { MONTH_NAMES, VRAT_CALENDAR_2026, getCountdownStatus } from '@/lib/vrat-calendar-data';
import './panchang.css';


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
      {/* <style dangerouslySetInnerHTML={{ __html: PANCHANG_STYLES }} /> */}

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
