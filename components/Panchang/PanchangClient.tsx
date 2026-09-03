'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { MONTH_NAMES, getCountdownStatus, type ObservanceItem } from '@/lib/vrat-calendar-data';
import '../../app/panchang/panchang.css';

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

export interface PanchangClientProps {
  initialToday: LivePanchang | null;
  initialCalendar: ObservanceItem[];
}

export default function PanchangClient({ initialToday, initialCalendar }: PanchangClientProps) {
  const [activeTab, setActiveTab] = useState<'pl' | 'vc' | 'fc'>('pl');
  const [purnimantaActive, setPurnimantaActive] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('Sep');

  const livePanchang = initialToday;
  const vratCalendar = initialCalendar;

  const monthObservanceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of MONTH_NAMES) {
      counts[m.short] = 0;
    }
    for (const item of vratCalendar) {
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      if (matchesCategory && counts[item.month] !== undefined) {
        counts[item.month]++;
      }
    }
    return counts;
  }, [vratCalendar, filterCategory]);

  const monthFestivalCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of MONTH_NAMES) {
      counts[m.short] = 0;
    }
    for (const item of vratCalendar) {
      const isFestival = item.category === 'Festival' || Boolean(item.guideSlug);
      if (isFestival && counts[item.month] !== undefined) {
        counts[item.month]++;
      }
    }
    return counts;
  }, [vratCalendar]);

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
        <div style={{ padding: '24px', fontSize: '13px', color: '#8FC4E8' }}>Loading panchang data...</div>
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
          {livePanchang?.nextMajorDate ? livePanchang.nextMajorDate.label : 'Hartalika Teej, 13 Sep'}
        </span>
        <span className="tdf-c">Open guide ›</span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen">
      <Breadcrumb
        items={
          activeTab === 'vc'
            ? [{ label: 'Panchang', href: '/panchang' }, { label: '2026 Vrat Calendar' }]
            : activeTab === 'fc'
            ? [{ label: 'Panchang', href: '/panchang' }, { label: 'Festival Calendar' }]
            : [{ label: 'Panchang' }]
        }
      />

      <section className="chero">
        <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden">
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

      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="pagepad">
          {activeTab === 'pl' && (
            <>
              {/* FOUR WAYS IN */}
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

              {/* NEXT 30 DAYS TABLE */}
              <div className="sh">
                <div>
                  <div className="sh-ey">NEXT 30 DAYS</div>
                  <div className="sh-t">Coming up</div>
                  <p className="sh-s">Dates shown for New Delhi. Change your city above if you observe elsewhere.</p>
                </div>
              </div>

              <div className="dtable">
                <div className="dt-head">
                  <span>DATE &amp; WEEKDAY</span>
                  <span>VRAT / FESTIVAL &amp; TITHI</span>
                  <span>STATUS</span>
                  <span style={{ textAlign: 'right' }}>ACTION</span>
                </div>
                {vratCalendar.slice(0, 10).map((item) => {
                  const status = getCountdownStatus(item.year, item.monthIndex, item.day);
                  const isSoon = status.text.includes('TODAY') || status.text.includes('IN 1 DAY') || status.text.includes('IN 2 DAYS') || status.text.includes('IN 3 DAYS');

                  return (
                    <div className={`dt-r ${isSoon ? 'next' : ''}`} key={item.id}>
                      <div>
                        <div className="dt-d">{item.day} {item.month}</div>
                        <div className="dt-dw">{item.weekday}</div>
                      </div>
                      <div>
                        <div className="dt-n">{item.name}</div>
                        <div className="dt-t">{item.tithi}{item.note ? ` · ${item.note}` : ''}</div>
                      </div>
                      <div>
                        <span className={`dt-cd ${isSoon ? 'soon' : ''} ${status.className}`}>{status.text}</span>
                      </div>
                      <div className="dt-a">
                        {item.guideSlug ? (
                          <Link href={`/ritual-guides/${item.guideSlug}`}>
                            Read guide ›
                          </Link>
                        ) : (
                          <Link href={`/panchang/vrat-calendar/${item.id}`}>
                            Check timings ›
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* LEARN SECTION */}
              <div className="learn">
                <div>
                  <div className="ln-ey">PANCHANG BASICS</div>
                  <div className="ln-t">How Panchang calculations work for your city</div>
                  <p className="ln-p">
                    A Tithi is determined by the angular distance between the Sun and Moon (every 12 degrees). Because sunrise time varies across geographical coordinates, a Tithi active at sunrise in Delhi may end before sunrise in London or New York.
                  </p>
                  <button className="ln-c">Read complete Panchang guide ›</button>
                </div>
                <div className="ln-list">
                  <div className="ln-i">
                    <div className="ln-n">1</div>
                    <div>
                      <div className="ln-it">Tithi (Lunar Day)</div>
                      <div className="ln-is">The exact lunar angle determining vrata timings</div>
                    </div>
                  </div>
                  <div className="ln-i">
                    <div className="ln-n">2</div>
                    <div>
                      <div className="ln-it">Nakshatra (Constellation)</div>
                      <div className="ln-is">Moon position across 27 stellar divisions</div>
                    </div>
                  </div>
                  <div className="ln-i">
                    <div className="ln-n">3</div>
                    <div>
                      <div className="ln-it">Yoga &amp; Karana</div>
                      <div className="ln-is">Auspicious periods and half-tithi divisions</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DOWNLOAD BAND */}
              <div className="dlband">
                <div className="dl-i">📅</div>
                <div>
                  <div className="dl-t">Get the 2026 Vrat Calendar PDF</div>
                  <div className="dl-s">Download a print-ready single-page calendar with all major fasts, festival dates, and parana timings for 2026.</div>
                </div>
                <button className="dl-c">Download 2026 PDF ›</button>
              </div>
            </>
          )}

          {activeTab === 'vc' && (
            <>
              <div className="mtabs">
                {MONTH_NAMES.map((m) => {
                  const count = monthObservanceCounts[m.short] || 0;
                  const isSel = selectedMonth === m.short;
                  return (
                    <button
                      key={m.short}
                      className={`mt ${isSel ? 'on' : ''}`}
                      onClick={() => setSelectedMonth(m.short)}
                    >
                      {m.short}
                      <span>{count} dates</span>
                    </button>
                  );
                })}
              </div>

              <div className="fgrid">
                {vratCalendar
                  .filter((item) => {
                    const matchesMonth = item.month === selectedMonth;
                    const matchesCat = filterCategory === 'All' || item.category === filterCategory;
                    return matchesMonth && matchesCat;
                  })
                  .map((item) => {
                    const deityClass = getDeityColorClass(item.name, item.category);
                    return (
                      <Link
                        className="fc-card"
                        key={item.id}
                        href={item.guideSlug ? `/ritual-guides/${item.guideSlug}` : `/panchang/vrat-calendar/${item.id}`}
                      >
                        <div className={`fc-l ${deityClass}`}>
                          <div className="fc-dd">{item.day}</div>
                          <div className="fc-mm">{item.month}</div>
                          <div className="fc-dw">{item.weekday.slice(0, 3)}</div>
                        </div>
                        <div className="fc-b">
                          <div className="fc-n">{item.name}</div>
                          <div className="fc-t">{item.tithi}</div>
                          {item.note && <div className="fc-t" style={{ fontStyle: 'italic', opacity: 0.85 }}>{item.note}</div>}
                          <div className="fc-m">
                            <span className="tag g">{item.category}</span>
                            {item.guideSlug && <span className="tag n">Guide</span>}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </>
          )}

          {activeTab === 'fc' && (
            <>
              <div className="mtabs">
                {MONTH_NAMES.map((m) => {
                  const count = monthFestivalCounts[m.short] || 0;
                  const isSel = selectedMonth === m.short;
                  return (
                    <button
                      key={m.short}
                      className={`mt ${isSel ? 'on' : ''}`}
                      onClick={() => setSelectedMonth(m.short)}
                    >
                      {m.short}
                      <span>{count} festivals</span>
                    </button>
                  );
                })}
              </div>

              <div className="fgrid">
                {vratCalendar
                  .filter((item) => {
                    const matchesMonth = item.month === selectedMonth;
                    const isFest = item.category === 'Festival' || Boolean(item.guideSlug);
                    return matchesMonth && isFest;
                  })
                  .map((item) => {
                    const deityClass = getDeityColorClass(item.name, item.category);
                    return (
                      <Link
                        className="fc-card"
                        key={item.id}
                        href={item.guideSlug ? `/ritual-guides/${item.guideSlug}` : `/panchang/vrat-calendar/${item.id}`}
                      >
                        <div className={`fc-l ${deityClass}`}>
                          <div className="fc-dd">{item.day}</div>
                          <div className="fc-mm">{item.month}</div>
                          <div className="fc-dw">{item.weekday.slice(0, 3)}</div>
                        </div>
                        <div className="fc-b">
                          <div className="fc-n">{item.name}</div>
                          <div className="fc-t">{item.tithi}</div>
                          {item.note && <div className="fc-t" style={{ fontStyle: 'italic', opacity: 0.85 }}>{item.note}</div>}
                          <div className="fc-m">
                            <span className="tag g">Festival</span>
                            {item.guideSlug && <span className="tag n">Guide Available</span>}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
