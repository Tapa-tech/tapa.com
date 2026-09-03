'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { VratDetailData } from '@/lib/vrat-detail-service';

export interface PanchangVratCalendarViewProps {
  data: VratDetailData;
}

export default function PanchangVratCalendarView({ data }: PanchangVratCalendarViewProps) {
  const [reminderToast, setReminderToast] = useState(false);

  const handleReminderClick = () => {
    setReminderToast(true);
    setTimeout(() => setReminderToast(false), 3000);
  };

  return (
    <div className="pvc-root">
      {reminderToast && (
        <div className="fixed top-5 right-5 z-50 bg-[#1C1712] text-[#FFFDF5] px-5 py-3 rounded-lg shadow-xl border border-[#E3B567] text-sm flex items-center gap-2 animate-bounce">
          <span>🔔</span>
          <span>Reminder set for {data.name} ({data.shortDate})!</span>
        </div>
      )}

      <section className="hero">
        <div className="wrap">
          <div className="hero-in">
            <div>
              <p className="h-ey">PANCHANG · VRAT DATE</p>
              <div className="h-cd">◷ UPCOMING VRAT</div>
              <h1 className="h-h1">{data.name}</h1>
              <div className="h-date">{data.dateFormatted}</div>
              <div className="h-tithi">{data.tithiFullText}</div>
              <div className="h-btns flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <button className="hb-p w-full sm:w-auto" onClick={handleReminderClick}>
                  🔔 Remind me the evening before
                </button>
                <Link href={data.guide.href} className="hb-g text-center block w-full sm:w-auto">
                  📖 How to observe this vrat
                </Link>
              </div>
            </div>

            <div className="par">
              <div className="par-h">◷ WHEN YOU CAN BREAK THE FAST</div>
              <div className="par-b">
                <div className="par-l">PARANA WINDOW · {data.paranaDateStr}</div>
                <div className="par-v">{data.paranaTimeWindow}</div>
                <p className="par-s">{data.paranaDurationStr}</p>
                <div className="par-div"></div>
                <div className="par-row">
                  <span className="par-k">FAST BEGINS</span>
                  <span className="par-vv">{data.fastBeginsStr}</span>
                </div>
                <div className="par-row">
                  <span className="par-k">TITHI BEGINS</span>
                  <span className="par-vv">{data.tithiBeginsStr}</span>
                </div>
                <div className="par-row">
                  <span className="par-k">TITHI ENDS</span>
                  <span className="par-vv">{data.tithiEndsStr}</span>
                </div>
                <div className="par-row">
                  <span className="par-k">DWADASHI ENDS</span>
                  <span className="par-vv">{data.dwadashiEndsStr}</span>
                </div>
              </div>
              <p className="par-f">
                <b>Why the window closes.</b> {data.paranaReasonNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="ctrl">
        <div className="ctrl-in">
          <div className="city">
            <span className="city-l">COMPUTED FOR</span>
            <span className="city-v">{data.location}</span>
            <span className="city-c">{data.convention}</span>
          </div>
          <span className="warnpill">{data.warningPillText}</span>
          <button className="rem" onClick={handleReminderClick}>
            🔔 Add reminder
          </button>
        </div>
      </div>

      <div className="wrap">
        <div className="layout">
          <div className="main">
            <div className="sh">
              <div className="sh-ey">THE FAST, END TO END</div>
              <div className="sh-t">From sankalp to parana</div>
              <p className="sh-s">
                Roughly {data.sidebar.fastLength}. The part most people get wrong is the end, not the beginning.
              </p>
            </div>

            <div className="tl">
              <div className="tl-bar">
                <div className="tl-fill"></div>
                {data.timelinePoints.map((tp, idx) => {
                  let transform = 'translateX(-50%)';
                  if (idx === 0) transform = 'translateX(-10%)';
                  else if (idx === data.timelinePoints.length - 1) transform = 'translateX(-88%)';

                  return (
                    <React.Fragment key={`${tp.title}-${idx}`}>
                      <div
                        className={`tl-m ${tp.className || ''}`}
                        style={{ left: tp.percentLeft }}
                      ></div>
                      <div
                        className={`tl-lab ${idx % 2 === 0 ? 'top' : 'bot'}`}
                        style={{ left: tp.percentLeft, transform }}
                      >
                        <div className="tl-lt">{tp.title}</div>
                        <div className="tl-ls">{tp.subtitle}</div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="tl-legend">
                <span className="tl-lg">
                  <span className="tl-dot" style={{ borderColor: '#E8A020' }}></span>
                  Fast begins
                </span>
                <span className="tl-lg">
                  <span className="tl-dot" style={{ borderColor: '#1F4460' }}></span>
                  Tithi boundary
                </span>
                <span className="tl-lg">
                  <span className="tl-dot" style={{ borderColor: '#1A5C28' }}></span>
                  Parana window
                </span>
                <span className="tl-lg">
                  <span className="tl-dot" style={{ borderColor: '#D4175A' }}></span>
                  You are here
                </span>
              </div>

              <div className="tlv">
                {data.verticalTimelineItems.map((item, idx) => (
                  <div className="tlv-i" key={`${item.title}-${idx}`}>
                    <div className="tlv-c">
                      <div className={`tlv-d ${item.dotClass}`}></div>
                      {item.hasLine && <div className="tlv-l"></div>}
                    </div>
                    <div className="tlv-b">
                      <div className="tlv-t">{item.title}</div>
                      <div className="tlv-s">
                        {item.subtitle.split('\n').map((line, lIdx) => (
                          <React.Fragment key={lIdx}>
                            {line}
                            {lIdx < item.subtitle.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sh">
              <div className="sh-ey">THE FULL PANCHANG FOR THIS DATE</div>
              <div className="sh-t">{data.dateFormatted}, {data.location.split(',')[0]}</div>
            </div>
            <div className="dt">
              <div className="dt-h">COMPUTED VALUES · {data.convention.toUpperCase()}</div>
              {data.panchangTableRows.map((row, idx) => (
                <div className="dt-r" key={`${row.label}-${idx}`}>
                  <span className="dt-k">{row.label}</span>
                  <span className="dt-v">
                    {row.value}
                    {row.subValue && <span>{row.subValue}</span>}
                  </span>
                </div>
              ))}
            </div>

            <div className="sh">
              <div className="sh-ey">THIS PAGE ANSWERS "WHEN"</div>
              <div className="sh-t">For "how", read the guide</div>
              <p className="sh-s">
                The vidhi, the katha, the fasting forms and the corrections all live in the Ritual Guide — which does not change from one observance to the next.
              </p>
            </div>
            <div className="handoff">
              <div className="ho-i">📖</div>
              <div>
                <div className="ho-l">RITUAL GUIDE</div>
                <div className="ho-t">{data.guide.title}</div>
                <p className="ho-s">{data.guide.description}</p>
              </div>
              <Link href={data.guide.href} className="ho-c text-center block">
                Read the guide ›
              </Link>
            </div>

            {data.faqs && data.faqs.length > 0 && (
              <>
                <div className="sh">
                  <div className="sh-ey">ASKED EVERY TIME</div>
                  <div className="sh-t">Quick answers for this date</div>
                </div>

                {data.faqs.map((faq, idx) => (
                  <div className="qa" key={`${faq.question}-${idx}`}>
                    <div className="qa-q">
                      <span>?</span>
                      {faq.question}
                    </div>
                    <div className="qa-a">{faq.answer}</div>
                  </div>
                ))}
              </>
            )}

            <div className="sh">
              <div className="sh-ey">THIS VRAT RECURS</div>
              <div className="sh-t">Every {data.category} in 2026</div>
              <p className="sh-s">
                Twice a lunar month, twenty-four times a year. Each has its own name and its own parana window.
              </p>
            </div>
            <div className="occ">
              {data.recurringVrats.map((vrat) => (
                <Link
                  key={vrat.id}
                  href={vrat.href}
                  className={`oc ${vrat.isCurrent ? 'now' : ''}`}
                >
                  <div className="oc-d">{vrat.dateStr}</div>
                  <div className="oc-m">{vrat.weekdayStr}</div>
                  <div className="oc-n">
                    {vrat.name} {vrat.isCurrent ? '— this one' : ''}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="side">
            <button className="sb-cta" onClick={handleReminderClick}>
              <span className="sb-ci">🔔</span>
              <span className="sb-ct">Remind me for this vrat</span>
              <span className="sb-cs">Evening before, and again at parana</span>
            </button>

            <div className="sb">
              <div className="sb-h">At a glance</div>
              <div className="sb-r">
                <span className="sb-k">Fast length</span>
                <span className="sb-v">{data.sidebar.fastLength}</span>
              </div>
              <div className="sb-r">
                <span className="sb-k">Grains</span>
                <span className="sb-v">{data.sidebar.grains}</span>
              </div>
              <div className="sb-r">
                <span className="sb-k">Water</span>
                <span className="sb-v">{data.sidebar.water}</span>
              </div>
              <div className="sb-r">
                <span className="sb-k">Nirjala</span>
                <span className="sb-v">{data.sidebar.nirjala}</span>
              </div>
              <div className="sb-r">
                <span className="sb-k">Pandit needed</span>
                <span className="sb-v">{data.sidebar.panditNeeded}</span>
              </div>
              <div className="sb-r">
                <span className="sb-k">Parana</span>
                <span className="sb-v">{data.sidebar.paranaDate}</span>
              </div>
            </div>

            <div className="sb-int">
              <div className="sbi-h">◗ INTELLIGENCE LAYER</div>
              <p className="sbi-t">{data.sidebar.intelligenceText}</p>
              <Link href={data.sidebar.intelligenceHref} className="sbi-c block">
                What counts as a grain? ›
              </Link>
            </div>

            <div className="sb-note">
              <div className="sbn-h">WHY THIS PAGE HAS NO TAGS</div>
              <p className="sbn-t">
                This is a <b>Panchang page</b>. It carries computed dates and timings, so it takes no Dharma/Pratha/Bhranti tag and no confidence score. The claims about how to observe the vrat are tagged and scored — on the Ritual Guide.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="sticky">
        <Link href={data.guide.href} className="a text-center block">
          📖 Guide
        </Link>
        <button className="b" onClick={handleReminderClick}>
          🔔 Remind me
          <small>Evening before + parana</small>
        </button>
      </div>
    </div>
  );
}
