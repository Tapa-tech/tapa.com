import React from 'react';

const komalImg = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80';
const whyImg = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80';

const ABOUT_STYLES = `
.ahero { background: var(--darkbar); position: relative; overflow: hidden; }
.ahero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 85% at 80% 35%, rgba(232,160,32,.10) 0%, transparent 64%); }
.film { position: relative; height: 300px; border-bottom: 1px solid rgba(255,255,255,.08); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
.film video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.film-logo { height: 168px; width: auto; display: block; }
.film-spec { font-size: 9.5px; letter-spacing: 1.2px; color: var(--dimmer); }
.ahero-in { position: relative; padding: 34px 0 36px; max-width: 720px; }
.ah-ey { font-size: 10px; color: #E3B567; letter-spacing: 1px; margin-bottom: 11px; }
.ah-h1 { font-size: 40px; font-weight: 700; color: var(--hero-text); line-height: 1.1; letter-spacing: -.9px; margin-bottom: 13px; }
.ah-stand { font-size: 17px; font-weight: 600; color: var(--hero-text); line-height: 1.6; margin-bottom: 14px; }
.ah-p { font-size: 15px; color: #C4A882; line-height: 1.85; margin-bottom: 11px; }
.ah-pull { font-size: 19px; font-weight: 700; color: var(--pink); line-height: 1.45; margin-top: 20px; }

.sec { padding: 34px 0 6px; }
.sec-h { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.sec-n { font-size: 10.5px; font-weight: 700; color: var(--gold); letter-spacing: .7px; background: var(--p-bg); border: 1px solid var(--p-bd); border-radius: 6px; padding: 4px 9px; flex-shrink: 0; }
.sec-t { font-size: 26px; font-weight: 700; color: var(--dark); line-height: 1.25; letter-spacing: -.5px; }
.sec-t .chip { font-size: 11px; font-weight: 700; letter-spacing: .5px; padding: 4px 10px; border-radius: 6px; background: var(--pink); color: #fff; vertical-align: middle; margin-left: 9px; }
.sec-t .chip.soon { background: var(--b-bg); color: var(--b-tx); border: 1px solid var(--b-bd); }
.sec-r { flex: 1; height: 1px; background: var(--border); }

.col { max-width: 860px; }
.pane { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px 26px; }
.pane p { font-size: 14.5px; line-height: 1.85; color: var(--body-text); margin-bottom: 12px; }
.pane p:last-child { margin-bottom: 0; }
.pane .stand { font-size: 16px; font-weight: 600; color: var(--dark); line-height: 1.6; margin-bottom: 14px; }
.pane h3 { font-size: 15px; font-weight: 700; color: var(--dark); margin: 20px 0 10px; }
.pane h3:first-child { margin-top: 0; }
.dev { font-family: 'Tiro Devanagari Hindi', 'Noto Sans Devanagari', serif; }

.tray { background: var(--card); border: 1px solid var(--border); border-radius: 16px; margin-top: 12px; overflow: hidden; }
.tray > summary { list-style: none; cursor: pointer; padding: 16px 20px; display: flex; align-items: center; gap: 14px; font-size: 15px; font-weight: 700; color: var(--dark); }
.tray > summary::-webkit-details-marker { display: none; }
.tray > summary:hover { background: var(--p-bg); }
.tr-av { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; object-position: 50% 22%; flex-shrink: 0; border: 1.5px solid var(--p-bd); }
.tr-sub { display: block; font-size: 11.5px; font-weight: 500; color: var(--sub-text); margin-top: 2px; }
.tr-x { margin-left: auto; width: 28px; height: 28px; border-radius: 8px; border: 1.5px solid var(--p-bd); color: var(--gold); display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; transition: transform .2s; }
.tray[open] .tr-x { transform: rotate(180deg); }
.tr-body { padding: 4px 20px 24px; border-top: 1px solid var(--border-light); }
.letter { padding-top: 18px; max-width: 660px; }
.lt-head { display: flex; align-items: center; gap: 15px; padding-bottom: 16px; margin-bottom: 18px; border-bottom: 1px solid var(--border-light); }
.lt-port { width: 66px; height: 66px; border-radius: 50%; object-fit: cover; object-position: 50% 20%; flex-shrink: 0; border: 2px solid var(--p-bd); }
.lt-who b { display: block; font-size: 15.5px; color: var(--dark); line-height: 1.3; }
.lt-who span { font-size: 12.5px; color: var(--sub-text); }
.lt { max-width: none; }
.lt h3 { font-size: 17px; font-weight: 700; color: var(--dark); margin: 22px 0 10px; }
.lt h3:first-child { margin-top: 0; }
.lt p { font-size: 14.5px; line-height: 1.85; margin-bottom: 12px; color: var(--body-text); }
.lt figure { margin: 18px 0; }
.lt figure img { width: 100%; border-radius: 13px; display: block; }
.lt figcaption { margin-top: 8px; font-size: 12px; color: var(--sub-text); font-style: italic; }
.lt-pull { background: var(--d-bg); border: 1px solid var(--d-bd); border-left: 3px solid var(--amber); border-radius: 11px; padding: 14px 17px; font-size: 15px; font-weight: 700; color: var(--d-tx); line-height: 1.55; margin: 18px 0; }
.sig { border-top: 1px solid var(--border-light); padding-top: 14px; margin-top: 18px; }
.sig b { font-size: 14.5px; color: var(--dark); }
.sig span { display: block; font-size: 12.5px; color: var(--sub-text); }
.sig i { display: block; font-size: 12.5px; color: var(--pink); margin-top: 7px; font-style: normal; }

.vals { margin-top: 20px; background: var(--bg); border: 1px solid var(--border); border-radius: 13px; padding: 18px 20px; }
.vals-h { font-size: 10px; font-weight: 700; color: var(--gold); letter-spacing: .7px; margin-bottom: 10px; }
.vrow { display: flex; gap: 12px; padding: 11px 0; border-bottom: .5px solid var(--border-light); }
.vrow:last-child { border-bottom: none; padding-bottom: 0; }
.vn { font-size: 10.5px; font-weight: 700; color: var(--pink); flex-shrink: 0; width: 18px; padding-top: 2px; }
.vrow b { display: block; font-size: 13.5px; color: var(--dark); margin-bottom: 2px; }
.vrow p { font-size: 13px; color: var(--sub-text); line-height: 1.7; margin: 0; }

.dpb { display: grid; grid-template-columns: repeat(3, 1fr); gap: 11px; margin: 16px 0; }
.dpb div { border-radius: 13px; padding: 15px 16px; border: 1px solid; }
.dpb .d { background: var(--d-bg); border-color: var(--d-bd); }
.dpb .p { background: var(--p-bg); border-color: var(--p-bd); }
.dpb .b { background: var(--b-bg); border-color: var(--b-bd); }
.dpb b { display: block; font-size: 15px; margin-bottom: 2px; }
.dpb .d b { color: var(--d-tx); }
.dpb .p b { color: var(--p-tx); }
.dpb .b b { color: var(--b-tx); }
.dpb i { display: block; font-size: 9.5px; font-weight: 700; letter-spacing: .5px; font-style: normal; opacity: .7; margin-bottom: 7px; }
.dpb p { font-size: 12.5px; line-height: 1.7; margin: 0; color: var(--body-text); }

.stab { width: 100%; border-collapse: collapse; margin: 12px 0 14px; font-size: 13.5px; }
.stab th { text-align: left; font-size: 9.5px; letter-spacing: .6px; color: var(--gold); font-weight: 700; padding-bottom: 9px; border-bottom: 1px solid var(--border); }
.stab th:last-child, .stab td:last-child { text-align: right; white-space: nowrap; }
.stab td { padding: 10px 0; border-bottom: .5px solid var(--border-light); line-height: 1.5; }
.stab tr:last-child td { border-bottom: none; }
.stab .sc { font-weight: 700; color: var(--pink); }

.pts { margin-top: 6px; }
.pt { display: flex; gap: 11px; padding: 11px 0; border-bottom: .5px solid var(--border-light); }
.pt:last-child { border-bottom: none; }
.pt-k { width: 6px; height: 6px; border-radius: 50%; background: var(--amber); flex-shrink: 0; margin-top: 8px; }
.pt b { display: block; font-size: 13.5px; color: var(--dark); margin-bottom: 2px; }
.pt p { font-size: 13px; color: var(--sub-text); line-height: 1.72; margin: 0; }

.steps { counter-reset: s; margin-top: 6px; }
.st { counter-increment: s; display: flex; gap: 12px; padding: 11px 0; border-bottom: .5px solid var(--border-light); }
.st:last-of-type { border-bottom: none; }
.st::before { content: counter(s); width: 22px; height: 22px; border-radius: 7px; background: var(--p-bg); border: 1px solid var(--p-bd); color: var(--p-tx); font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
.st b { display: block; font-size: 13.5px; color: var(--dark); margin-bottom: 2px; }
.st p { font-size: 13px; color: var(--sub-text); line-height: 1.72; margin: 0; }

.rulebox { background: var(--darkbar); border-radius: 13px; padding: 17px 19px; margin: 14px 0; }
.rulebox p { font-size: 14px; line-height: 1.8; color: #C4A882; margin: 0; }
.rulebox b { color: var(--amber); }
.rulebox span { display: block; font-size: 12px; color: var(--dim); margin-top: 7px; }

.btn { display: inline-block; border: none; border-radius: 11px; padding: 12px 22px; font-size: 13.5px; font-weight: 700; background: var(--pink); color: #fff; margin-top: 14px; text-decoration: none; }
.btn.gh { background: transparent; border: 1.5px solid var(--p-bd); color: var(--gold); }
.btn.wa { background: #1F9D52; }
.note { font-size: 13px; color: var(--mid-text); background: var(--p-bg); border: 1px solid var(--p-bd); border-radius: 10px; padding: 11px 14px; margin-top: 14px; line-height: 1.7; }

.work { display: grid; grid-template-columns: repeat(3, 1fr); gap: 13px; }
.wc { background: var(--card); border: 1px solid var(--border); border-radius: 15px; padding: 20px 20px 18px; display: flex; flex-direction: column; }
.wc b { font-size: 16px; color: var(--dark); margin-bottom: 6px; }
.wc p { font-size: 12.5px; line-height: 1.72; color: var(--sub-text); flex: 1; margin: 0; }
.wc .btn { margin-top: 15px; align-self: flex-start; padding: 10px 16px; font-size: 12.5px; }

.close { background: var(--darkbar); border-radius: 18px; padding: 34px 36px; margin: 30px 0 0; position: relative; overflow: hidden; }
.close::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 50% 80% at 88% 50%, rgba(232,160,32,.10) 0%, transparent 60%); }
.close-in { position: relative; }
.close-l { font-size: 9.5px; font-weight: 700; color: #E3B567; letter-spacing: .8px; margin-bottom: 13px; }
.close-t { font-size: 23px; font-weight: 700; color: var(--hero-text); line-height: 1.5; max-width: 760px; }
.close-t b { color: var(--amber); }
.close-logo { margin-top: 28px; height: 112px; width: auto; display: block; }

.vals-sub { font-size: 13.5px; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
.vals-p { font-size: 13px; color: var(--sub-text); line-height: 1.75; margin-bottom: 12px; }
.close-pre { font-size: 14px; color: #C4A882; margin-bottom: 12px; }

@media (max-width: 900px) {
  .film { height: 220px; }
  .film-logo { height: 118px; }
  .close-logo { height: 88px; }
  .ahero-in { padding: 26px 0 28px; }
  .ah-h1 { font-size: 28px; }
  .ah-stand { font-size: 15.5px; }
  .ah-p { font-size: 14px; }
  .ah-pull { font-size: 17px; }
  .pane { padding: 19px 18px; }
  .sec-t { font-size: 21px; }
  .dpb { grid-template-columns: 1fr; gap: 9px; }
  .lt-port { width: 56px; height: 56px; }
  .work { grid-template-columns: 1fr; }
  .close { padding: 24px 22px; border-radius: 16px; }
  .close-t { font-size: 19px; }
}
`;

const LOGO_BASE64 = 'data:image/png;base64,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3jfYccULYr3hyiUK1gojjVsNhD0bLnvTGlN4+aEck0MFEIKAxdUC3NxuEhAIeRw3QCW13uSzezq3Pjwmla5M4g++gmAWtxracOVzWsV9YIw+MKcdQQKhTZyUGXatH7zlXmPNbWP0AJjLGhOIqVC1WWxXgcVb2HV1a/q+sUh6JREFa4VQK2oeXn/55kR4o4i4KlTy2hEkKARgDD9BUNYMrvtmScMPW8QJwVx29bIBFn61FH5zOPi/qxVJx0z4lUMUrBVAekHfJ0S/NSKfaZXk9An6YHJKDiWoRVgzyupu02TvSsdMfKQsBrcVYEDkEn8HAAjEHWTFrzWFl+1Z3/OWLbjbx0z4lUMUrBXBednE5h3vW20Kzzucc1GzQLTFWArx1TW/vOkAcI0DABG9/TB97omotSB8mym8f2jDZb8b+8GvHKJgNTiTcauOy7XpXf3A9e8dFmN/c0g2n/46654Nf8f41w+L+90f845D8P//80/bT9c31/b0b5l9/w0l9Z1N/4YfD99144/9v5y+efT+/9f7z60vH76W70t49/9z09v1t3d9v6bve4d36uT+ef5p8P7f8v/3t/z890v/1/c/3d/c1+e2a6d7q+44b+9t6cff55u+eO6J5s5x70p3vj8L1vN3vF/f60b/+t77X/c+f33N/T9//d9/z93f/w77x/81+X3/x38v/8e+f/v93//t3v3f7//j/z/9/x9/7/59//f/9+v/m//f/9v7f9/+/+v+v8v3+/+3+v8vf/32v4/+/+f3t3f//+f397f39/e3+/+f//9+/v//97/3+/+///9+/f7+7u4=';

export default function AboutPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ABOUT_STYLES }} />
      <section className="ahero">
        <div className="film">
          <img className="film-logo" src={LOGO_BASE64} alt="तप् · the tapa company" />
          <div className="film-spec">MONTAGE FILM · 1920 × 820 · SILENT LOOP</div>
        </div>
        <div className="wrap">
          <div className="ahero-in">
            <p className="ah-ey">ABOUT</p>
            <h1 className="ah-h1">About The Tapa Co.</h1>
            <p className="ah-stand">We are a knowledge company that happens to sell ritual kits. In that order, always.</p>
            <p className="ah-p">Rituals are not hard to find. Guidance you can trust is. Someone who wants to keep a vrat properly, or set up a puja in a new home, or perform shraddh for a parent, is usually piecing it together at eleven at night from search results, reels and forwarded messages. Some of that is wisdom. Most of it is noise. Almost none of it tells you which is which.</p>
            <p className="ah-p">So we tell you what scripture actually says, what is regional or family custom, and what is only fear wearing tradition's clothes. All three deserve respect. They are not the same thing, and nobody should have to guess.</p>
            <p className="ah-pull">Dharma does not demand fear. It demands devotion.</p>
          </div>
        </div>
      </section>

      <div className="wrap">
        {/* ══ 01 · WHY तप् ══ */}
        <section className="sec">
          <div className="sec-h">
            <span className="sec-n">1</span>
            <h2 className="sec-t">Why <span className="dev">तप्</span></h2>
            <span className="sec-r"></span>
          </div>
          <div className="col">
            <div>
              <div className="pane">
                <p><span className="dev" style={{ fontSize: '19px', color: 'var(--gold)' }}>तप्</span> — a Sanskrit root meaning austerity, discipline, the inner heat of devoted practice. Not suffering. Not obligation. The chosen effort of someone who has decided to show up properly.</p>
                <p>The company exists for one reason. The people who could once answer the <em>why</em> behind the <em>what</em> are no longer in the next room. When knowledge fragments, faith does not disappear — it becomes fragile. Every generation deserves access to its own roots, on its own terms.</p>
              </div>

              <details className="tray">
                <summary>
                  <img className="tr-av" src={komalImg} alt="Komal Gupta, founder of The Tapa Co." />
                  <div>
                    <b>Why Tapa Exists — A Note from the Founder</b>
                    <span className="tr-sub">Komal Gupta · Founder, The Tapa Co.</span>
                  </div>
                  <span className="tr-x">▼</span>
                </summary>
                <div className="tr-body">
                  <div className="letter">
                    <div className="lt-head">
                      <img className="lt-port" src={komalImg} alt="Komal Gupta" />
                      <div className="lt-who">
                        <b>Komal Gupta</b>
                        <span>Founder, The Tapa Co.</span>
                      </div>
                    </div>
                    <div className="lt">
                      <h3>Why Tapa Exists</h3>
                      <p>I did not start The Tapa Co. to sell puja kits or ritual subscriptions.</p>
                      <p>I started it because I grew up inside something I didn't fully appreciate until I left it.</p>
                      <p>My earliest memories are of devotion that needed no explanation, held by people who could have explained it in any terms they chose. Mine was a highly educated family. Degrees, arguments at the dining table, books in more than one language. And within all of that, my parents at their morning puja before anything else in the day — reciting the shrutis and the smritis themselves, not as inherited habit but as something they had thought about and decided to keep.</p>
                      <p>That is the part I did not understand until much later. Nobody in my house practised because they did not know better. They practised because they had examined it and found it worth practising. Doordarshan played Ramayan and Mahabharat on weekends and the whole family sat together — asking questions, getting answers, and being allowed to ask the next one.</p>
                      <p>Everything I was trained on came from there. The way I think, the way I test a claim, the way I refuse to accept something because everybody says so. My thesis came out of that house. So did this company.</p>

                      <figure>
                        <img src={whyImg} alt="Why Tapa Exists" />
                        <figcaption>Komal Gupta with family</figcaption>
                      </figure>

                      <div className="lt-pull">
                        &quot;Faith without understanding is fragile. We are here to rebuild the bridge between what you do at the altar and why it was created.&quot;
                      </div>

                      <p>When I moved out, I noticed how many of my peers wanted to keep the practices but had lost the language. They were piecing together rituals from Instagram posts, WhatsApp forwards, and hurried calls home. When they asked <i>why</i> a particular samagri was needed or <i>why</i> a tithi mattered, nobody could tell them without falling back on &quot;because that is how it is done&quot; or, worse, warnings of bad luck.</p>

                      <p>Dharma does not require fear to survive. It requires clarity.</p>

                      <p>At The Tapa Co., every guide we publish, every samagri list we compile, and every Panchang entry we calculate is backed by named scriptures, checked by scholars, and translated into clear, dignified English and Hindi. We distinguish between what is scriptural command (Dharma), what is family tradition (Parampara), and what is individual expression (Bhakti).</p>

                      <div className="sig">
                        <b>Komal Gupta</b>
                        <span>Founder &amp; Chief Editor</span>
                        <i>The Tapa Co.</i>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* ══ 02 · OUR THREE-LAYER AUTHORITY MODEL ══ */}
        <section className="sec">
          <div className="sec-h">
            <span className="sec-n">2</span>
            <h2 className="sec-t">Our Three-Layer Authority Model</h2>
            <span className="sec-r"></span>
          </div>
          <div className="col">
            <div className="pane">
              <p className="stand">We classify every ritual element into three distinct layers of authority so you always know <i>why</i> you are doing what you are doing.</p>

              <div className="dpb">
                <div className="d">
                  <i>LAYER 1 · SCRIPTURAL</i>
                  <b>Dharma <span className="dev">धर्म</span></b>
                  <p>Directly sourced from Vedas, Upanishads, Puranas, or Agamas. Non-negotiable core principles verified by scholars.</p>
                </div>
                <div className="p">
                  <i>LAYER 2 · INHERITED</i>
                  <b>Parampara <span className="dev">परंपरा</span></b>
                  <p>Lineage, kul-pratha, or regional traditions passed down through generations. Respected and preserved.</p>
                </div>
                <div className="b">
                  <i>LAYER 3 · INDIVIDUAL</i>
                  <b>Bhakti <span className="dev">भक्ति</span></b>
                  <p>Personal devotion, bhav, and adaptation suited to modern life and capability. Encouraged with sincerity.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 03 · HOW WE RATE A PRACTICE ══ */}
        <section className="sec">
          <div className="sec-h">
            <span className="sec-n">3</span>
            <h2 className="sec-t">How We Rate a Practice</h2>
            <span className="sec-r"></span>
          </div>
          <div className="col">
            <div className="pane">
              <p className="stand">Every ritual guide and claim undergoes a 4-point authenticity score before publication.</p>

              <table className="stab">
                <thead>
                  <tr>
                    <th>CRITERIA</th>
                    <th>DESCRIPTION</th>
                    <th>RATING SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Textual Evidence</b></td>
                    <td>Found in classical Puranic literature, Samhitas, or Sutras</td>
                    <td><span className="sc">Primary</span></td>
                  </tr>
                  <tr>
                    <td><b>Scholarly Consensus</b></td>
                    <td>Verified across multiple regional traditions &amp; acharyas</td>
                    <td><span className="sc">Strong</span></td>
                  </tr>
                  <tr>
                    <td><b>Lineage Custom</b></td>
                    <td>Valid kul-pratha supported by oral transmission</td>
                    <td><span className="sc">Secondary</span></td>
                  </tr>
                  <tr>
                    <td><b>Modern Adaptation</b></td>
                    <td>Practical adjustment for city living without breaking vidhi</td>
                    <td><span className="sc">Permissible</span></td>
                  </tr>
                </tbody>
              </table>

              <div className="pts">
                <div className="pt">
                  <span className="pt-k"></span>
                  <div>
                    <b>1. Authentic (Shastriya)</b>
                    <p>Directly prescribed in recognized scriptures with complete samagri and mantra specifications.</p>
                  </div>
                </div>
                <div className="pt">
                  <span className="pt-k"></span>
                  <div>
                    <b>2. Customary (Laukik / Pratha)</b>
                    <p>Evolved through regional or family tradition; valid and meaningful when performed with devotion.</p>
                  </div>
                </div>
                <div className="pt">
                  <span className="pt-k"></span>
                  <div>
                    <b>3. Modern Adaptation</b>
                    <p>Modified practice designed for modern apartments or time constraints while preserving core intent.</p>
                  </div>
                </div>
                <div className="pt">
                  <span className="pt-k"></span>
                  <div>
                    <b>4. Misconception (Bramah / Bhay)</b>
                    <p>Practices born of fear, commercial exploitation, or superstition. Explicitly identified and explained.</p>
                  </div>
                </div>
              </div>

              <div className="steps">
                <div className="st">
                  <div>
                    <b>Identify the Source Text</b>
                    <p>We trace every ritual step back to its original Sanskrit or Prakrit source.</p>
                  </div>
                </div>
                <div className="st">
                  <div>
                    <b>Verify Regional Variations</b>
                    <p>We cross-check how North, South, East, and West India practice the same vrat or festival.</p>
                  </div>
                </div>
                <div className="st">
                  <div>
                    <b>Translate Without Loss of Meaning</b>
                    <p>We write in accessible English and Hindi while preserving the exact sacred terminology.</p>
                  </div>
                </div>
              </div>

              <div className="rulebox">
                <p><b>Core Editorial Principle:</b> We never urge fear. If a step cannot be performed due to circumstance, sincere <b>Bhakti (devotion)</b> and <b>Manas Puja (mental worship)</b> fulfill the ritual.</p>
                <span>— The Tapa Co. Editorial Board</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 04 · OUR VALUES ══ */}
        <section className="sec">
          <div className="sec-h">
            <span className="sec-n">4</span>
            <h2 className="sec-t">Our Values</h2>
            <span className="sec-r"></span>
          </div>
          <div className="col">
            <div className="vals">
              <div className="vals-h">OUR CORE COMMITMENTS</div>

              <div className="vrow">
                <span className="vn">01</span>
                <div>
                  <b>Scripture First</b>
                  <p>Every claim is cited. If something is a belief or folk tradition rather than text, we state it clearly.</p>
                </div>
              </div>

              <div className="vrow">
                <span className="vn">02</span>
                <div>
                  <b>Clear Language, Zero Jargon</b>
                  <p>We explain complex Vedic and Puranic concepts in simple, elegant language for modern readers.</p>
                </div>
              </div>

              <div className="vrow">
                <span className="vn">03</span>
                <div>
                  <b>Respect for Family Pratha</b>
                  <p>We honor the rituals your grandmother taught you. Tradition is lived experience, not just books.</p>
                </div>
              </div>

              <div className="vrow">
                <span className="vn">04</span>
                <div>
                  <b>No Fear-Mongering</b>
                  <p>Dharma is about connection and consciousness. We never use guilt or fear of bad luck to sell products.</p>
                </div>
              </div>

              <div className="vrow">
                <span className="vn">05</span>
                <div>
                  <b>Intellectual Rigour</b>
                  <p>Our team works with traditional scholars, Sanskritists, and historians to ensure absolute accuracy.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 05 · WHAT WE DO — AND DON'T DO ══ */}
        <section className="sec">
          <div className="sec-h">
            <span className="sec-n">5</span>
            <h2 className="sec-t">What We Do — And Don't Do</h2>
            <span className="sec-r"></span>
          </div>
          <div className="col">
            <div className="work">
              <div className="wc">
                <b>Ritual Guides</b>
                <p>Step-by-step guides with precise samagri lists, mantras, and timings for vrats and pujas.</p>
                <a href="/ritual-guides" className="btn">Explore Guides ›</a>
              </div>
              <div className="wc">
                <b>City-Precise Panchang</b>
                <p>Calculated using high-precision astronomical algorithms for sunrise, tithi, and muhurat in your location.</p>
                <a href="/panchang" className="btn gh">View Panchang ›</a>
              </div>
              <div className="wc">
                <b>Authentic Samagri Kits</b>
                <p>Pure, scripture-compliant ritual items sourced responsibly for your home worship.</p>
                <a href="/ritual-kits" className="btn wa">Shop Kits ›</a>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 06 · CLOSE ══ */}
        <section className="close">
          <div className="close-in">
            <p className="close-l">OUR PHILOSOPHY</p>
            <div className="close-pre">Dharma is not a mystery to be guarded. It is a path to be walked.</div>
            <h2 className="close-t">We build for those who want to <b>understand</b> what they practice, not just follow blindly.</h2>
            <img className="close-logo" src={LOGO_BASE64} alt="तप्" />
          </div>
        </section>
      </div>
    </>
  );
}
