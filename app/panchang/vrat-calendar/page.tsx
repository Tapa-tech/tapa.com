import React from 'react';
import Link from 'next/link';
import './vrat.css';

export default function VratCalendarPage() {
  return (
    <>


      {/* Breadcrumbs */}
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <Link href="/panchang">Panchang</Link> › <Link href="/panchang">2026 Vrat Calendar</Link> › <b>Aja Ekadashi — 8 September</b>
          </div>
          <div className="bc-r">
            <button className="bcb">🔔 Remind me</button>
            <button className="bcb">↗ Share</button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-in">
            <div>
              <p className="h-ey">PANCHANG · VRAT DATE</p>
              <div className="h-cd">◷ TOMORROW</div>
              <h1 className="h-h1">Aja Ekadashi</h1>
              <div className="h-date">Tuesday, 8 September 2026</div>
              <div className="h-tithi">Bhadrapada Krishna Ekadashi · Purnimanta · computed for New Delhi</div>
              <div className="h-btns">
                <button className="hb-p">🔔 Remind me the evening before</button>
                <Link href="/ritual-guides/what-is-a-vrat" className="hb-g">💬 How to observe this vrat</Link>
              </div>
            </div>

            {/* Parana Card */}
            <div className="par">
              <div className="par-h">◷ WHEN YOU CAN BREAK THE FAST</div>
              <div className="par-b">
                <div className="par-l">PARANA WINDOW · 9 SEPTEMBER</div>
                <div className="par-v">6:02 AM – 8:17 AM</div>
                <p className="par-s">Break the fast inside this window on the morning after. Duration approximately 2 hours 15 minutes.</p>
                <div className="par-div"></div>
                <div className="par-row">
                  <span className="par-k">FAST BEGINS</span>
                  <span className="par-vv">Sunrise, 8 Sep · 6:02 AM</span>
                </div>
                <div className="par-row">
                  <span className="par-k">TITHI BEGINS</span>
                  <span className="par-vv">7 Sep · 7:14 PM</span>
                </div>
                <div className="par-row">
                  <span className="par-k">TITHI ENDS</span>
                  <span className="par-vv">8 Sep · 8:04 PM</span>
                </div>
                <div className="par-row">
                  <span className="par-k">DWADASHI ENDS</span>
                  <span className="par-vv">9 Sep · 8:17 AM</span>
                </div>
              </div>
              <p className="par-f">
                <b>Why the window closes.</b> Parana must happen after sunrise and before Dwadashi tithi ends. Miss it and the tradition treats the vrat as incomplete — so this is the one timing worth setting an alarm for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* City Control Bar */}
      <div className="ctrl">
        <div className="ctrl-in">
          <div className="city">
            <span className="city-l">COMPUTED FOR</span>
            <span className="city-v">New Delhi</span>
            <span className="city-c">Change ›</span>
          </div>
          <span className="warnpill">⚠ Ekadashi dates differ by city — Vaishnava observers may see 9 September</span>
          <button className="rem">🔔 Add reminder</button>
        </div>
      </div>

      {/* Main Page Layout */}
      <div className="wrap">
        <div className="layout">
          <div className="main">
            {/* Fast Timeline */}
            <div className="sh">
              <div className="sh-ey">THE FAST, END TO END</div>
              <h2 className="sh-t">From sankalp to parana</h2>
              <p className="sh-s">Roughly 26 hours. The part most people get wrong is the end, not the beginning.</p>
            </div>

            <div className="tl">
              <div className="tl-bar">
                <div className="tl-fill"></div>
                <div className="tl-m start" style={{ left: '6%' }}></div>
                <div className="tl-lab top" style={{ left: '6%' }}>
                  <div className="tl-lt">Sankalp &amp; sunrise</div>
                  <div className="tl-ls">8 Sep · 6:02 AM</div>
                </div>
                <div className="tl-m now" style={{ left: '40%' }}></div>
                <div className="tl-lab bot" style={{ left: '40%' }}>
                  <div className="tl-lt">The fast</div>
                  <div className="tl-ls">No grains · fruit, milk and water permitted</div>
                </div>
                <div className="tl-m" style={{ left: '63%' }}></div>
                <div className="tl-lab top" style={{ left: '63%' }}>
                  <div className="tl-lt">Tithi ends</div>
                  <div className="tl-ls">8 Sep · 8:04 PM</div>
                </div>
                <div className="tl-m end" style={{ left: '78%' }}></div>
                <div className="tl-lab bot" style={{ left: '78%' }}>
                  <div className="tl-lt">Parana window opens</div>
                  <div className="tl-ls">9 Sep sunrise</div>
                </div>
                <div className="tl-m end" style={{ left: '96%' }}></div>
                <div className="tl-lab top" style={{ left: '96%' }}>
                  <div className="tl-lt">Window closes</div>
                  <div className="tl-ls">Dwadashi ends</div>
                </div>
              </div>
              <div className="tl-legend">
                <span className="tl-lg">
                  <span className="tl-dot" style={{ borderColor: '#E8A020' }}></span>Fast begins
                </span>
                <span className="tl-lg">
                  <span className="tl-dot" style={{ borderColor: '#1F4460' }}></span>Tithi boundary
                </span>
                <span className="tl-lg">
                  <span className="tl-dot" style={{ borderColor: '#1A5C28' }}></span>Parana window
                </span>
                <span className="tl-lg">
                  <span className="tl-dot" style={{ borderColor: '#D4175A' }}></span>You are here
                </span>
              </div>

              {/* Mobile Timeline */}
              <div className="tlv">
                <div className="tlv-i">
                  <div className="tlv-c">
                    <div className="tlv-d start"></div>
                    <div className="tlv-l"></div>
                  </div>
                  <div className="tlv-b">
                    <div className="tlv-t">Sankalp &amp; sunrise</div>
                    <div className="tlv-s">8 September · 6:02 AM<br />A simple resolve. The fast begins here.</div>
                  </div>
                </div>
                <div className="tlv-i">
                  <div className="tlv-c">
                    <div className="tlv-d now"></div>
                    <div className="tlv-l"></div>
                  </div>
                  <div className="tlv-b">
                    <div className="tlv-t">The fast — through the day and night</div>
                    <div className="tlv-s">No grains. Fruit, milk and water permitted. Nirjala is one form, not the requirement.</div>
                  </div>
                </div>
                <div className="tlv-i">
                  <div className="tlv-c">
                    <div className="tlv-d"></div>
                    <div className="tlv-l"></div>
                  </div>
                  <div className="tlv-b">
                    <div className="tlv-t">Ekadashi tithi ends</div>
                    <div className="tlv-s">8 September · 8:04 PM<br />The fast continues past this point — it ends at parana, not at the tithi.</div>
                  </div>
                </div>
                <div className="tlv-i">
                  <div className="tlv-c">
                    <div className="tlv-d end"></div>
                    <div className="tlv-l"></div>
                  </div>
                  <div className="tlv-b">
                    <div className="tlv-t">Parana window opens</div>
                    <div className="tlv-s">9 September, sunrise · 6:02 AM</div>
                  </div>
                </div>
                <div className="tlv-i">
                  <div className="tlv-c">
                    <div className="tlv-d end"></div>
                  </div>
                  <div className="tlv-b">
                    <div className="tlv-t">Window closes — Dwadashi ends</div>
                    <div className="tlv-s">9 September · 8:17 AM<br />Break the fast before this.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Computed Values Table */}
            <div className="sh">
              <div className="sh-ey">THE FULL PANCHANG FOR THIS DATE</div>
              <h2 className="sh-t">8 September 2026, New Delhi</h2>
            </div>
            <div className="dt">
              <div className="dt-h">COMPUTED VALUES · PURNIMANTA</div>
              <div className="dt-r">
                <span className="dt-k">Tithi</span>
                <span className="dt-v">
                  Bhadrapada Krishna Ekadashi<span>Begins 7 Sep 7:14 PM · ends 8 Sep 8:04 PM</span>
                </span>
              </div>
              <div className="dt-r">
                <span className="dt-k">Paksha</span>
                <span className="dt-v">Krishna — waning</span>
              </div>
              <div className="dt-r">
                <span className="dt-k">Nakshatra</span>
                <span className="dt-v">
                  Punarvasu<span>Until 8 Sep 9:42 PM</span>
                </span>
              </div>
              <div className="dt-r">
                <span className="dt-k">Yoga · Karana</span>
                <span className="dt-v">Shobhana · Bava</span>
              </div>
              <div className="dt-r">
                <span className="dt-k">Sunrise · Sunset</span>
                <span className="dt-v">6:02 AM · 18:32 PM</span>
              </div>
              <div className="dt-r">
                <span className="dt-k">Rahu Kaal</span>
                <span className="dt-v">
                  15:18 – 16:51 PM<span>Avoided by convention for new beginnings</span>
                </span>
              </div>
              <div className="dt-r">
                <span className="dt-k">Parana window</span>
                <span className="dt-v">
                  9 Sep, 6:02 AM – 8:17 AM<span>Approximately 2h 15m</span>
                </span>
              </div>
            </div>

            {/* Guide Handoff Banner */}
            <div className="sh">
              <div className="sh-ey">THIS PAGE ANSWERS &quot;WHEN&quot;</div>
              <h2 className="sh-t">For &quot;how&quot;, read the guide</h2>
              <p className="sh-s">The vidhi, the katha, the fasting forms and the corrections all live in the Ritual Guide — which does not change from one Ekadashi to the next.</p>
            </div>
            <div className="handoff">
              <div className="ho-i">📖</div>
              <div>
                <div className="ho-l">RITUAL GUIDE</div>
                <div className="ho-t">How to observe an Ekadashi vrat</div>
                <p className="ho-s">Sankalp, the grain rule and what actually counts as a grain, the three fasting forms, and the parana rule explained once for all 24 Ekadashis of the year.</p>
              </div>
              <Link href="/ritual-guides/what-is-a-vrat" className="ho-c">Read the guide ›</Link>
            </div>

            {/* Q&A Section */}
            <div className="sh">
              <div className="sh-ey">ASKED EVERY TIME</div>
              <h2 className="sh-t">Quick answers for this date</h2>
            </div>

            <div className="qa">
              <div className="qa-q"><span>?</span>Do I fast on the 8th or the 9th?</div>
              <div className="qa-a">
                The <b>8th</b>, if you follow the Smarta convention — which most households without a formal sampradaya affiliation do. Vaishnava observers follow a different rule for the same tithi and may fast on the <b>9th</b>. Both are correct within their frameworks.
              </div>
            </div>
            <div className="qa">
              <div className="qa-q"><span>?</span>What if I wake up after the parana window has closed?</div>
              <div className="qa-a">
                Break the fast anyway, as soon as you can. The tradition treats a late parana as an imperfect observance, not a void one — and there is no penance attached. <b>Set an alarm next time.</b> That is the whole remedy.
              </div>
            </div>
            <div className="qa">
              <div className="qa-q"><span>?</span>Can I drink water during the fast?</div>
              <div className="qa-a">
                Yes. Nirjala — without water — is one form some observers choose, but it is not what the Ekadashi vrat asks for. <b>Fruit, milk and water are permitted</b> in the widely observed form. The rule that matters is the grain rule.
              </div>
            </div>
            <div className="qa">
              <div className="qa-q"><span>?</span>Why does the date differ between apps?</div>
              <div className="qa-a">
                A tithi starts at a fixed moment, but the Hindu day starts at sunrise — and sunrise differs by city. A tithi beginning before sunrise in Delhi may begin after it in Chennai, moving the date by a day. <b>Set your city above</b> and the page recomputes.
              </div>
            </div>

            {/* Recurring Vrats */}
            <div className="sh">
              <div className="sh-ey">THIS VRAT RECURS</div>
              <h2 className="sh-t">Every Ekadashi in 2026</h2>
              <p className="sh-s">Twice a lunar month, twenty-four times a year. Each has its own name and its own parana window.</p>
            </div>
            <div className="occ">
              <div className="oc">
                <div className="oc-d">22 Aug</div>
                <div className="oc-m">Saturday</div>
                <div className="oc-n">Kamika Ekadashi</div>
              </div>
              <div className="oc now">
                <div className="oc-d">8 Sep</div>
                <div className="oc-m">Tuesday</div>
                <div className="oc-n">Aja Ekadashi — this one</div>
              </div>
              <div className="oc">
                <div className="oc-d">22 Sep</div>
                <div className="oc-m">Tuesday</div>
                <div className="oc-n">Parsva Ekadashi</div>
              </div>
              <div className="oc">
                <div className="oc-d">7 Oct</div>
                <div className="oc-m">Wednesday</div>
                <div className="oc-n">Indira Ekadashi</div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <aside className="side">
            <button className="sb-cta">
              <span className="sb-ci">🔔</span>
              <span className="sb-ct">Remind me for this vrat</span>
              <span className="sb-cs">Evening before, and again at parana</span>
            </button>

            <div className="sb">
              <div className="sb-h">At a glance</div>
              <div className="sb-r">
                <span className="sb-k">Fast length</span>
                <span className="sb-v">~26 hours</span>
              </div>
              <div className="sb-r">
                <span className="sb-k">Grains</span>
                <span className="sb-v">Avoided</span>
              </div>
              <div className="sb-r">
                <span className="sb-k">Water</span>
                <span className="sb-v">Permitted</span>
              </div>
              <div className="sb-r">
                <span className="sb-k">Nirjala</span>
                <span className="sb-v">Optional</span>
              </div>
              <div className="sb-r">
                <span className="sb-k">Pandit needed</span>
                <span className="sb-v">No</span>
              </div>
              <div className="sb-r">
                <span className="sb-k">Parana</span>
                <span className="sb-v">9 Sep morning</span>
              </div>
            </div>

            <div className="sb-int">
              <div className="sbi-h">◗ INTELLIGENCE LAYER</div>
              <p className="sbi-t">
                Grain avoidance applies on every Ekadashi, not only this one. What counts as a grain — and what surprisingly does not — is explained once, and applies to all twenty-four.
              </p>
              <span className="sbi-c">What counts as a grain? ›</span>
            </div>

            <div className="sb-note">
              <div className="sbn-h">WHY THIS PAGE HAS NO TAGS</div>
              <p className="sbn-t">
                This is a <b>Panchang page</b>. It carries computed dates and timings, so it takes no Dharma/Pratha/Bhranti tag and no confidence score. The claims about how to observe the vrat are tagged and scored — on the Ritual Guide.
              </p>
            </div>

            <button className="sb-cta dk">
              <span className="sb-ci">↓</span>
              <span className="sb-ct">Download 2026 Vrat Calendar</span>
              <span className="sb-cs">All 24 Ekadashis with parana windows</span>
            </button>
          </aside>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="sticky">
        <button className="a">📖 Guide</button>
        <button className="b">
          🔔 Remind me<small>Evening before + parana</small>
        </button>
      </div>
    </>
  );
}
