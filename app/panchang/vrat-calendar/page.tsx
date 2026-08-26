import React from 'react';
import Link from 'next/link';

const VRAT_STYLES = `
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

.bcrumb{background:var(--card);border-bottom:1px solid var(--border);padding:10px 40px}
.bc-in{max-width:1180px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px}
.bc-l{font-size:12.5px;color:var(--sub-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bc-l b{color:var(--body-text);font-weight:500}
.bc-r{display:flex;gap:8px;flex-shrink:0}
.bcb{height:31px;border:1.5px solid var(--border);border-radius:7px;background:var(--card);padding:0 12px;font-size:12px;display:flex;align-items:center;gap:5px;cursor:pointer}

.hero{background:
  radial-gradient(ellipse 55% 60% at 80% 30%,rgba(46,96,132,.32) 0%,transparent 62%),
  linear-gradient(155deg,#0C1A26 0%,#1B3A52 38%,#0D1E2C 70%,#070F17 100%);
  padding:38px 0 40px}
.hero-in{display:grid;grid-template-columns:1fr .8fr;gap:40px;align-items:center}
.h-ey{font-size:11px;color:var(--gold);letter-spacing:1px;margin-bottom:10px}
.h-cd{display:inline-flex;align-items:center;gap:7px;background:rgba(212,23,90,.22);border:1px solid rgba(255,158,190,.4);border-radius:20px;padding:5px 14px;font-size:11.5px;font-weight:700;color:#FF9EBE;margin-bottom:13px}
.h-h1{font-size:39px;font-weight:700;color:var(--hero-text);line-height:1.1;letter-spacing:-.8px;margin-bottom:9px}
.h-date{font-size:18px;color:var(--amber);font-weight:600;margin-bottom:7px}
.h-tithi{font-size:14px;color:#8FC4E8;margin-bottom:20px}
.h-btns{display:flex;gap:10px;flex-wrap:wrap}
.hb-p{background:var(--pink);border:none;border-radius:22px;padding:11px 22px;font-size:13px;font-weight:700;color:#fff;cursor:pointer}
.hb-g{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.28);border-radius:22px;padding:11px 18px;font-size:13px;color:var(--hero-text);cursor:pointer;text-decoration:none;display:inline-block}

.par{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);border-radius:18px;overflow:hidden}
.par-h{padding:13px 20px;border-bottom:1px solid rgba(255,255,255,.11);font-size:11px;font-weight:700;color:var(--gold);letter-spacing:.7px}
.par-b{padding:18px 20px}
.par-l{font-size:11px;color:#8FC4E8;letter-spacing:.5px;margin-bottom:6px}
.par-v{font-size:24px;font-weight:700;color:#fff;line-height:1.15;margin-bottom:5px}
.par-s{font-size:12px;color:#8FC4E8;line-height:1.6}
.par-div{height:1px;background:rgba(255,255,255,.1);margin:16px 0}
.par-row{display:flex;justify-content:space-between;align-items:baseline;gap:14px;padding:7px 0}
.par-k{font-size:11.5px;color:#8FC4E8}
.par-vv{font-size:12.5px;color:#fff;font-weight:600;text-align:right}
.par-f{background:rgba(232,160,32,.16);padding:12px 20px;font-size:12px;color:#F0D9A8;line-height:1.65}
.par-f b{color:var(--amber)}

.ctrl{background:var(--card);border-bottom:1px solid var(--border);position:static;top:78px;z-index:50}
.ctrl-in{max-width:1180px;margin:0 auto;padding:11px 40px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.city{display:flex;align-items:center;gap:9px;background:var(--data-bg);border:1.5px solid var(--data-bd);border-radius:10px;padding:8px 14px}
.city-l{font-size:11px;font-weight:700;color:var(--data-mid);letter-spacing:.5px}
.city-v{font-size:13px;font-weight:700;color:var(--data-tx)}
.city-c{font-size:11.5px;color:var(--pink);font-weight:700;margin-left:4px;cursor:pointer}
.warnpill{font-size:11.5px;color:var(--amber-text);background:var(--amber-light);border:1px solid var(--amber-border);border-radius:9px;padding:7px 13px;line-height:1.5}
.rem{margin-left:auto;background:var(--dark);border:none;border-radius:10px;padding:9px 17px;font-size:12px;font-weight:700;color:#fff;white-space:nowrap;cursor:pointer}
.prov{background:var(--amber-light);border-bottom:1px solid var(--amber-border);padding:10px 40px}
.prov-in{max-width:1180px;margin:0 auto;font-size:12px;color:var(--amber-text);line-height:1.6}
.prov-in b{font-weight:700}

.layout{display:grid;grid-template-columns:1fr 310px;gap:40px;align-items:start;padding-top:32px}
.sh{margin:34px 0 15px}
.sh:first-child{margin-top:0}
.sh-ey{font-size:11px;font-weight:700;color:var(--pink);letter-spacing:.8px;margin-bottom:6px}
.sh-t{font-size:21px;font-weight:700;color:var(--dark);letter-spacing:-.4px;line-height:1.28}
.sh-s{font-size:13.5px;color:var(--sub-text);line-height:1.72;margin-top:6px}

.tl{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px 26px}
.tl-bar{position:relative;height:10px;background:var(--bg);border-radius:6px;margin:34px 0 0}
.tl-fill{position:absolute;left:6%;right:22%;top:0;bottom:0;background:linear-gradient(90deg,#1B3A52,#2E6084);border-radius:6px}
.tl-m{position:absolute;top:-7px;width:24px;height:24px;border-radius:50%;background:var(--card);border:3px solid var(--data-tx);transform:translateX(-50%)}
.tl-m.start{border-color:var(--amber)}
.tl-m.end{border-color:var(--green-text)}
.tl-m.now{border-color:var(--pink);box-shadow:0 0 0 4px rgba(212,23,90,.16)}
.tl-lab{position:absolute;transform:translateX(-50%);text-align:center;width:150px}
.tl-lab.top{top:-58px}
.tl-lab.bot{top:34px}
.tl-lt{font-size:12px;font-weight:700;color:var(--dark);line-height:1.3}
.tl-ls{font-size:11px;color:var(--sub-text);margin-top:2px;line-height:1.45}
.tl-legend{display:flex;gap:20px;margin-top:96px;flex-wrap:wrap;padding-top:18px;border-top:1px solid var(--border-light)}
.tl-lg{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--sub-text)}
.tl-dot{width:10px;height:10px;border-radius:50%;border:2.5px solid;flex-shrink:0}

.tlv{display:none}
.tlv-i{display:flex;gap:15px;position:relative}
.tlv-c{display:flex;flex-direction:column;align-items:center}
.tlv-d{width:20px;height:20px;border-radius:50%;background:var(--card);border:3px solid var(--data-tx);flex-shrink:0}
.tlv-d.start{border-color:var(--amber)}
.tlv-d.end{border-color:var(--green-text)}
.tlv-d.now{border-color:var(--pink);box-shadow:0 0 0 3px rgba(212,23,90,.16)}
.tlv-l{width:2px;flex:1;background:var(--border);margin:4px 0;min-height:18px}
.tlv-b{flex:1;padding-bottom:20px}
.tlv-t{font-size:14px;font-weight:700;color:var(--dark)}
.tlv-s{font-size:12px;color:var(--sub-text);margin-top:2px;line-height:1.6}

.dt{background:var(--card);border:1px solid var(--border);border-radius:15px;overflow:hidden}
.dt-h{background:var(--data-bg);padding:11px 20px;border-bottom:1px solid var(--data-bd);font-size:11.5px;font-weight:700;color:var(--data-tx);letter-spacing:.4px}
.dt-r{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:13px 20px;border-bottom:.5px solid var(--border-light)}
.dt-r:last-child{border-bottom:none}
.dt-k{font-size:12.5px;color:var(--sub-text)}
.dt-v{font-size:13.5px;font-weight:600;color:var(--dark);text-align:right}
.dt-v span{display:block;font-size:11.5px;color:var(--sub-text);font-weight:400;margin-top:2px}

.qa{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:10px}
.qa-q{background:var(--bg);padding:13px 17px;font-size:14.5px;font-weight:700;color:var(--dark);display:flex;gap:10px}
.qa-q span{color:var(--sub-text);flex-shrink:0}
.qa-a{padding:13px 17px;font-size:14px;line-height:1.82;color:var(--body-text)}
.qa-a b{color:var(--dark)}

.handoff{background:linear-gradient(150deg,#0C2A3A,#1B5670);border-radius:18px;padding:28px 32px;display:flex;align-items:center;gap:26px}
.ho-i{width:54px;height:54px;border-radius:15px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.ho-l{font-size:11px;font-weight:700;color:var(--gold);letter-spacing:.6px;margin-bottom:5px}
.ho-t{font-size:19px;font-weight:700;color:#fff;margin-bottom:5px;line-height:1.3}
.ho-s{font-size:13px;color:#A9C6DC;line-height:1.72}
.ho-c{margin-left:auto;background:#fff;border:none;border-radius:22px;padding:12px 22px;font-size:13px;font-weight:700;color:var(--data-tx);white-space:nowrap;flex-shrink:0;cursor:pointer;text-decoration:none;display:inline-block}

.occ{display:grid;grid-template-columns:repeat(4,1fr);gap:11px}
.oc{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px 15px}
.oc.now{border-color:var(--pink);background:var(--red-light)}
.oc-d{font-size:17px;font-weight:700;color:var(--dark);line-height:1.2}
.oc-m{font-size:11.5px;color:var(--sub-text);margin-top:2px}
.oc-n{font-size:12px;color:var(--data-tx);margin-top:7px;line-height:1.5}
.oc.now .oc-n{color:var(--pink);font-weight:700}

.side{position:sticky;top:150px;display:flex;flex-direction:column;gap:13px}
.sb{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden}
.sb-h{padding:12px 16px;border-bottom:1px solid var(--border-light);font-size:12.5px;font-weight:700;color:var(--dark)}
.sb-r{padding:10px 16px;border-bottom:.5px solid var(--border-light);display:flex;justify-content:space-between;gap:10px;font-size:12.5px}
.sb-r:last-child{border-bottom:none}
.sb-k{color:var(--sub-text)}
.sb-v{color:var(--dark);font-weight:600;text-align:right}
.sb-cta{width:100%;background:var(--pink);border:none;border-radius:12px;padding:14px;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer}
.sb-cta.dk{background:var(--dark)}
.sb-ci{font-size:18px}
.sb-ct{font-size:13px;font-weight:700;color:#fff}
.sb-cs{font-size:11px;color:rgba(255,255,255,.6);text-align:center;line-height:1.5}
.sb-note{background:var(--data-bg);border:1px solid var(--data-bd);border-radius:13px;padding:14px 16px}
.sbn-h{font-size:11px;font-weight:700;color:var(--data-mid);letter-spacing:.6px;margin-bottom:8px}
.sbn-t{font-size:12px;color:var(--data-tx);line-height:1.75}
.sbn-t b{font-weight:700}
.sb-int{background:var(--amber-light);border:1px solid var(--amber-border);border-radius:13px;padding:14px 16px}
.sbi-h{font-size:11px;font-weight:700;color:var(--amber-text);letter-spacing:.6px;margin-bottom:8px}
.sbi-t{font-size:12.5px;color:var(--body-text);line-height:1.75}
.sbi-c{font-size:12px;color:var(--pink);font-weight:700;margin-top:8px;display:block;cursor:pointer}

.sticky{display:none}

@media (max-width:900px){
  body{max-width:430px;margin:0 auto;padding-bottom:74px}
  .wrap{padding:0 16px}
  .bcrumb{padding:9px 16px}.bcb{display:none}
  .hero{padding:24px 0 28px}
  .hero-in{grid-template-columns:1fr;gap:22px}
  .h-h1{font-size:28px}.h-date{font-size:17px}
  .h-btns{flex-direction:column}.hb-p,.hb-g{width:100%;text-align:center;padding:12px}
  .ctrl{top:70px}
  .ctrl-in{padding:10px 16px;gap:8px}
  .city{width:100%}
  .warnpill{width:100%}
  .rem{margin-left:0;width:100%}
  .prov{padding:10px 16px}
  .layout{grid-template-columns:1fr;gap:0;padding-top:20px}
  .side{position:static;margin-top:26px}
  .sh-t{font-size:19px}
  .tl{padding:20px 18px}
  .tl-bar,.tl-legend{display:none}
  .tlv{display:block}
  .handoff{flex-direction:column;align-items:flex-start;gap:16px;padding:22px 20px}
  .ho-c{margin-left:0;width:100%}
  .occ{grid-template-columns:1fr 1fr;gap:9px}
  .sticky{display:flex;position:fixed;bottom:0;left:0;right:0;z-index:70;background:rgba(255,255,255,.97);backdrop-filter:blur(10px);border-top:1px solid var(--border);padding:10px 14px calc(10px + env(safe-area-inset-bottom));max-width:430px;margin:0 auto;gap:9px;box-shadow:0 -2px 16px rgba(28,23,18,.08)}
  .sticky .a{flex:1;background:var(--card);border:1.5px solid var(--border);border-radius:11px;padding:12px;font-size:12.5px;font-weight:700;color:var(--body-text);cursor:pointer}
  .sticky .b{flex:1.3;background:var(--pink);border:none;border-radius:11px;padding:12px;font-size:12.5px;font-weight:700;color:#fff;display:flex;flex-direction:column;align-items:center;line-height:1.25;cursor:pointer}
  .sticky .b small{font-size:11px;font-weight:500;opacity:.8}
}
`;

export default function VratCalendarPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: VRAT_STYLES }} />

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
