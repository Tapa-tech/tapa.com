'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MONTH_NAMES, getCountdownStatus, type ObservanceItem } from '@/lib/vrat-calendar-data';
import './panchang.css';

interface NextMajorDate {
  name: string;
  day: number;
  month: string;
  note: string;
  label: string;
}

interface LivePanchang {
  tithiHeader: string;
  formattedFullDate: string;
  pakshaDesc: string;
  nakshatra: string;
  sunriseSunset: string;
  rahuKaal: string;
  yogaKarana: string;
  nextMajorDate: NextMajorDate | null;
}

function getDeityColorClass(name: string, category: string): string {
  const n = name.toLowerCase();
  if (n.includes('shiv') || n.includes('shivaratri')) return 'h-shiva';
  if (n.includes('ganesh') || n.includes('vinayaka')) return 'h-ganesh';
  if (n.includes('krishna') || n.includes('vishnu') || n.includes('rama') || n.includes('narasimha')) return 'h-vishnu';
  if (n.includes('devi') || n.includes('durga') || n.includes('lakshmi') || n.includes('gauri') || n.includes('teej')) return 'h-devi';
  if (category === 'Other') return 'h-earth';
  return 'h-krishna';
}

export default function PanchangPage() {
  const [activeTab, setActiveTab] = useState<'pl' | 'vc' | 'fc'>('pl');
  const [purnimantaActive, setPurnimantaActive] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('Sep');

  const [livePanchang, setLivePanchang] = useState<LivePanchang | null>(null);
  const [vratCalendar, setVratCalendar] = useState<ObservanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/panchang/today').then((res) => res.json()),
      fetch('/api/panchang/vrat-calendar?year=2026').then((res) => res.json()),
    ])
      .then(([today, calendar]) => {
        setLivePanchang(today);
        setVratCalendar(calendar);
      })
      .catch((err) => console.error('Panchang fetch failed', err))
      .finally(() => setLoading(false));
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderTodayPanel = () => (
    <div className="today">
      <div className="td-h">
        <span className="td-l">☀ TODAY&apos;S PANCHANG</span>
        <span className="td-live">
          <span className="livedot"></span>DELHI-NCR
        </span>
      </div>
      {!livePanchang ? (
        <div style={{ padding: '24px 0', fontSize: '13px' }}>Loading…</div>
      ) : (
        <>
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
        </>
      )}
      <div className="td-foot">
        <span className="tdf-t">
          <b>Next major date —</b>{' '}
          {livePanchang?.nextMajorDate ? livePanchang.nextMajorDate.label : 'Loading…'}
        </span>
        <span className="tdf-c">Open guide ›</span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen">
      <div className="bcrumb">
        <div className="bc-in">
          {activeTab === 'pl' && <>Home › <b>Panchang</b></>}
          {activeTab === 'vc' && <>Home › Panchang › <b>2026 Vrat Calendar</b></>}
          {activeTab === 'fc' && <>Home › Panchang › <b>Festival Calendar</b></>}
        </div>
      </div>

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
                  <span className="ch-m"><b>{vratCalendar.length}</b> vrat dates in 2026</span>
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
                  <span className="ch-m"><b>{vratCalendar.length}</b> dates</span>
                  <span className="ch-m"><b>{vratCalendar.filter((i) => i.category === 'Ekadashi').length}</b> Ekadashis</span>
                  <span className="ch-m"><b>{vratCalendar.filter((i) => i.category === 'Pradosh').length}</b> Pradosh vrats</span>
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
                  <span className="ch-m"><b>{vratCalendar.filter((i) => i.category === 'Festival').length}</b> festivals</span>
                  <span className="ch-m"><b>{vratCalendar.filter((i) => i.guideSlug).length}</b> with a full guide</span>
                </div>
              </div>
            )}
            {renderTodayPanel()}
          </div>
        </div>
      </section>

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
              <button className={`fc ${purnimantaActive ? 'on' : ''}`} onClick={() => setPurnimantaActive(true)}>
                Purnimanta
              </button>
              <button className={`fc ${!purnimantaActive ? 'on' : ''}`} onClick={() => setPurnimantaActive(false)}>
                Amanta
              </button>
              <button className="dl">↓ Download 2026 calendar</button>
            </>
          )}

          {activeTab === 'vc' && (
            <>
              {['All', 'Ekadashi', 'Pradosh', 'Chaturthi', 'Purnima', 'Amavasya'].map((cat) => (
                <button key={cat} className={`fc ${filterCategory === cat ? 'on' : ''}`} onClick={() => setFilterCategory(cat)}>
                  {cat}
                </button>
              ))}
              <button className="dl">↓ Download PDF</button>
            </>
          )}

          {activeTab === 'fc' && (
            <>
              {['All festivals', 'Major only', 'Shiva', 'Vishnu', 'Devi', 'Ganesha'].map((cat) => (
                <button key={cat} className={`fc ${filterCategory === cat ? 'on' : ''}`} onClick={() => setFilterCategory(cat)}>
                  {cat}
                </button>
              ))}
              <button className="dl">↓ Download PDF</button>
            </>
          )}
        </div>
      </div>

      <div className="wrap">
        <div className="pagepad">
          {loading && (
            <div style={{ padding: '48px', textAlign: 'center', fontSize: '14px' }}>
              Loading panchang data…
            </div>
          )}

          {!loading && activeTab === 'pl' && (
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
                  <span className="sub-c">{vratCalendar.length} dates ›</span>
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
                {vratCalendar
                  .filter((item) => {
                    const status = getCountdownStatus(item.year, item.monthIndex, item.day);
                    return status.className.includes('soon') || status.text === 'TODAY' || (!status.className.includes('past') && status.text.startsWith('IN'));
                  })
                  .slice(0, 6)
                  .map((item) => {
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
                          <span className="dt-a">Guide ›</span>
                        </div>
                      </div>
                    );
                  })}
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

          {!loading && activeTab === 'vc' && (() => {
            const currentMonthInfo = MONTH_NAMES.find((m) => m.short === selectedMonth) || MONTH_NAMES[8];
            const monthObservances = vratCalendar.filter((item) => {
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
                    const monthCount = vratCalendar.filter((item) => {
                      const matchesMonth = item.month === m.short;
                      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
                      return matchesMonth && matchesCategory;
                    }).length;

                    return (
                      <button key={m.short} className={`mt ${selectedMonth === m.short ? 'on' : ''}`} onClick={() => setSelectedMonth(m.short)}>
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
                    <div className="dl-t">All {vratCalendar.length} dates, on one page</div>
                    <p className="dl-s">The complete 2026 vrat calendar as a PDF — computed for your city, ready to print or forward.</p>
                  </div>
                  <button className="dl-c">Download PDF ›</button>
                </div>
              </>
            );
          })()}

          {!loading && activeTab === 'fc' && (() => {
            const currentMonthInfo = MONTH_NAMES.find((m) => m.short === selectedMonth) || MONTH_NAMES[8];
            const monthFestivals = vratCalendar.filter(
              (item) => item.month === selectedMonth && (item.category === 'Festival' || item.guideSlug)
            );

            return (
              <>
                <div className="mtabs">
                  {MONTH_NAMES.map((m) => {
                    const monthFestCount = vratCalendar.filter(
                      (item) => item.month === m.short && (item.category === 'Festival' || item.guideSlug)
                    ).length;

                    return (
                      <button key={m.short} className={`mt ${selectedMonth === m.short ? 'on' : ''}`} onClick={() => setSelectedMonth(m.short)}>
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
                  {monthFestivals.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--sub-text)', fontSize: '13px' }}>
                      No festivals found in {currentMonthInfo.short} 2026.
                    </div>
                  ) : (
                    monthFestivals.map((item) => (
                      <a className="fc-card" key={item.id}>
                        <div className={`fc-l ${getDeityColorClass(item.name, item.category)}`}>
                          <div className="fc-dd">{item.day}</div>
                          <div className="fc-mm">{item.month.toUpperCase()}</div>
                          <div className="fc-dw">{item.weekday}</div>
                        </div>
                        <div className="fc-b">
                          <div className="fc-n">{item.name}</div>
                          <div className="fc-t">{item.tithi}</div>
                          <div className="fc-m">
                            <span className={item.guideSlug ? 'tag g' : 'tag n'}>
                              {item.guideSlug ? 'GUIDE LIVE' : 'GUIDE COMING'}
                            </span>
                          </div>
                        </div>
                      </a>
                    ))
                  )}
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

      <div className="sticky">
        <button>
          Download full calendar (PDF)
          <small>Computed for New Delhi · 2026</small>
        </button>
      </div>
    </div>
  );
}