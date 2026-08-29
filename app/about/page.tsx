import React from 'react';
import WorkWithUsForms from '@/components/WorkWithUs/WorkWithUsForms';

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
      
      {/* ══ HERO ══ */}
      <section className="ahero">
        <div className="film">
          <img className="film-logo" src={LOGO_BASE64} alt="तप्" />
          <div className="film-spec">MONTAGE FILM · 1920 × 820 · SILENT LOOP</div>
        </div>
        <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden">
          <div className="ahero-in px-4 md:px-0">
            <p className="ah-ey">ABOUT</p>
            <h1 className="ah-h1">About — The Tapa Co.</h1>
            <p className="ah-stand">We are a knowledge company that happens to sell ritual kits. In that order, always.</p>
            <p className="ah-p">Rituals are not hard to find. Guidance you can trust is. Someone who wants to keep a vrat properly, or set up a puja in a new home, or perform shraddh for a parent, is usually piecing it together at eleven at night from search results, reels and forwarded messages. Some of that is wisdom. Most of it is noise. Almost none of it tells you which is which.</p>
            <p className="ah-p">So we tell you what scripture actually says, what is regional or family custom, and what is only fear wearing tradition&apos;s clothes. All three deserve respect. They are not the same thing, and nobody should have to guess.</p>
            <p className="ah-pull">Dharma does not demand fear. It demands devotion.</p>
          </div>
        </div>
      </section>

      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden">
        {/* ══ 01 · WHY तप् ══ */}
        <section className="sec">
          <div className="sec-h">
            <span className="sec-n">3</span>
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
                  <img className="tr-av" src={komalImg} alt="Komal Gupta" />
                  <span>Why I started this — a letter from our founder</span>
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
                      <p>I started it because I grew up inside something I didn&apos;t fully appreciate until I left it.</p>
                      <p>My earliest memories are of devotion that needed no explanation, held by people who could have explained it in any terms they chose. Mine was a highly educated family. Degrees, arguments at the dining table, books in more than one language. And within all of that, my parents at their morning puja before anything else in the day — reciting the shrutis and the smritis themselves, not as inherited habit but as something they had thought about and decided to keep.</p>
                      <p>That is the part I did not understand until much later. Nobody in my house practised because they did not know better. They practised because they had examined it and found it worth practising. Doordarshan played Ramayan and Mahabharat on weekends and the whole family sat together — asking questions, getting answers, and being allowed to ask the next one.</p>
                      <p>Everything I was trained on came from there. The way I think, the way I test a claim, the way I refuse to accept something because everybody says so. My thesis came out of that house. So did this company.</p>

                      <figure>
                        <img src={whyImg} alt="Komal Gupta with family" />
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

                      <div className="lt-pull" style={{ margin: '24px 0 18px' }}>
                        Dharma does not demand fear. It demands devotion.
                      </div>

                      <p>The Tapa Co. exists to restore clarity, authenticity, and trust to ritual practice — to help people understand not just what to do, but why it matters. To separate Dharma from custom, wisdom from hearsay, and devotion from performance.</p>
                      <p>Our ambition is larger than products. We are building trusted infrastructure for Hindu ritual life — the kind that helps a person practise with confidence and conviction, whether or not there&apos;s someone in the next room to ask. Because every generation deserves access to its own roots, on its own terms.</p>

                      <div className="vals">
                        <div className="vals-h">OUR CORE VALUES</div>
                        <div className="vals-sub">What must never change</div>
                        <p className="vals-p">As The Tapa Co. grows, products will evolve, categories will expand, technology will change. But these principles are not features. They are the foundation, and they stay fixed.</p>
                        <div className="vrow"><span className="vn">01</span><div><b>Dharma before business.</b><p>Revenue can never come at the cost of truth.</p></div></div>
                        <div className="vrow"><span className="vn">02</span><div><b>Fear will never be our marketing strategy.</b><p>We will never manipulate people with guilt, superstition, or anxiety. Devotion should arise from love and understanding, not fear.</p></div></div>
                        <div className="vrow"><span className="vn">03</span><div><b>Knowledge comes before products.</b><p>Understanding is our first offering. Commerce is only ever a consequence of it.</p></div></div>
                        <div className="vrow"><span className="vn">04</span><div><b>Authenticity over convenience.</b><p>When faced with a choice, we choose what is faithful over what is fashionable.</p></div></div>
                        <div className="vrow"><span className="vn">05</span><div><b>We serve seekers, not customers.</b><p>Every interaction should leave people feeling more informed, more confident, and more connected to their faith.</p></div></div>
                        <div className="vrow"><span className="vn">06</span><div><b>Humility is non-negotiable.</b><p>No individual, no institution, and no company owns Dharma. We are students before we are builders.</p></div></div>
                        <div className="vrow"><span className="vn">07</span><div><b>Trust is sacred.</b><p>It takes years to build and moments to lose. We will protect it fiercely.</p></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* ══ 02 · EDITORIAL METHOD ══ */}
        <section className="sec">
          <div className="sec-h">
            <span className="sec-n">4</span>
            <h2 className="sec-t">Our Editorial Method</h2>
            <span className="sec-r"></span>
          </div>
          <div className="col">
            <div className="pane">
              <p className="stand">Every claim we publish is sorted into one of three categories before it is written.</p>

              <div className="dpb">
                <div className="d">
                  <b>Dharma</b>
                  <i>SCRIPTURES</i>
                  <p>A scriptural mandate. Stated in a named text you could go and check yourself. Not &quot;the scriptures say.&quot; Not &quot;it is well known.&quot; A named text.</p>
                </div>
                <div className="p">
                  <b>Pratha</b>
                  <i>CUSTOMS</i>
                  <p>Regional, community or family custom. Widely practised, genuinely meaningful, not scripturally mandated. It is not lesser for that.</p>
                </div>
                <div className="b">
                  <b>Bhranti</b>
                  <i>CORRECTIONS</i>
                  <p>A misconception that needs correcting. Usually fear-based, usually forwarded, usually presented as compulsory. Corrected calmly, never mocked.</p>
                </div>
              </div>

              <div className="rulebox">
                <p>One rule holds the whole system up: <b>if we cannot name a text you could go and check, it is not Dharma — however universal the practice feels.</b></p>
                <span>Consensus is not a citation.</span>
              </div>

              <p>Dharma and Pratha are always visibly separated on the page. Every article carries a Myths &amp; Facts section.</p>

              <h3>Which texts, and how we weigh them</h3>
              <p>Naming a source is not enough on its own — sources differ in authority, and pretending otherwise is its own kind of dishonesty. So every guidance claim carries a score alongside the named text.</p>

              <div className="overflow-x-auto w-full max-w-full">
                <table className="stab min-w-[400px] md:min-w-full">
                  <thead>
                    <tr>
                      <th>SOURCE</th>
                      <th>SCORE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Shruti — Vedas, Upanishads</td>
                      <td className="sc">5 / 5</td>
                    </tr>
                    <tr>
                      <td>Mahapurana, Itihasa, Dharmashastra, Kalpa, Agama</td>
                      <td className="sc">4 / 5</td>
                    </tr>
                    <tr>
                      <td>Nibandha, bhashya, commentarial literature</td>
                      <td className="sc">3 / 5</td>
                    </tr>
                    <tr>
                      <td>Bhakti-period compositions — Ramcharitmanas, the stotras</td>
                      <td className="sc">3 / 5</td>
                    </tr>
                    <tr>
                      <td>Regional, oral and family custom</td>
                      <td className="sc">1–2 / 5</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>That last placement is a description, not a demotion. A stotra recited in millions of homes every morning loses nothing by being correctly identified as a composed work rather than a revealed one. Where the same claim also appears in a Purana, we cite the Purana and name the stotra separately as the text you actually recite.</p>
              <a href="/editorial-method" className="btn">Read the full method ›</a>
            </div>
          </div>
        </section>

        {/* ══ 03 · GLOSSARY ══ */}
        <section className="sec">
          <div className="sec-h">
            <span className="sec-n">5</span>
            <h2 className="sec-t">Glossary</h2>
            <span className="sec-r"></span>
          </div>
          <div className="col">
            <div className="pane">
              <p className="stand">Sankalp. Upavasa. Abhishek. Shodashopachara. Tithi and paksha.</p>
              <p>Every Sanskrit term we use in a guide is defined here in ordinary language, with the Devanagari, a simple transliteration, and where the word comes from.</p>
              <p>If you have ever nodded along at a term rather than asking what it meant, this page is for you.</p>
              <a href="/glossary" className="btn gh">Open the glossary ›</a>
            </div>
          </div>
        </section>

        {/* ══ 04 · RITUAL KITS ══ */}
        <section className="sec">
          <div className="sec-h">
            <span className="sec-n">7</span>
            <h2 className="sec-t">Our Ritual Kits Store</h2>
            <span className="sec-r"></span>
          </div>
          <div className="col">
            <div className="pane">
              <p className="stand" style={{ color: 'var(--pink)' }}>Assembled to the ritual, not to a price point.</p>
              <p>A ritual kit exists to solve one problem: the samagri list. You know what you are observing and roughly how it goes, and then you are in a shop at eight in the morning trying to remember whether it was five bilva leaves or seven, and whether the panchamrit needs curd or just milk.</p>
              <p>Every Tapa kit is built backwards from a published guide. We write the vidhi first, from a named source. Then we list every item that vidhi actually requires. Then we assemble the kit to that list. Nothing is added to raise the price, and nothing is dropped to lower it.</p>

              <h3>How each kit is built</h3>
              <div className="pts">
                <div className="pt">
                  <span className="pt-k"></span>
                  <div>
                    <b>Sourced from the guide.</b>
                    <p>If an item is in the kit, it appears in a step of the vidhi on our site. If it does not appear in the vidhi, it is not in the box.</p>
                  </div>
                </div>
                <div className="pt">
                  <span className="pt-k"></span>
                  <div>
                    <b>Tagged.</b>
                    <p>The printed vidhi card inside marks which steps are Dharma and which are Pratha. Where we have included something customary — an item your region uses and another does not — it is labelled as custom, so you can use it or set it aside without wondering.</p>
                  </div>
                </div>
                <div className="pt">
                  <span className="pt-k"></span>
                  <div>
                    <b>Complete for the ritual, not for the shelf.</b>
                    <p>Quantities match one observance of that puja. We would rather you buy the right kit once than a general samagri box four times.</p>
                  </div>
                </div>
                <div className="pt">
                  <span className="pt-k"></span>
                  <div>
                    <b>Fresh items are named, not included.</b>
                    <p>Flowers, milk, curd, fruit and bhog cannot travel well and should not. Every kit lists exactly what to pick up and how much of it.</p>
                  </div>
                </div>
                <div className="pt">
                  <span className="pt-k"></span>
                  <div>
                    <b>One price. One version.</b>
                    <p>No premium tier, no economy tier, no deluxe box with the same contents in better packaging. A ritual does not have a budget version.</p>
                  </div>
                </div>
              </div>

              <div className="note">Pre-booking opens 1 month before the occasions</div>
              <a href="/ritual-kits" className="btn">See the Ritual Kits ›</a>
            </div>
          </div>
        </section>

        {/* ══ 05 · PUJA WITH PUROHIT ══ */}
        <section className="sec">
          <div className="sec-h">
            <span className="sec-n">8</span>
            <h2 className="sec-t">Puja with Purohit <span className="chip soon">COMING SOON · NOVEMBER 2026</span></h2>
            <span className="sec-r"></span>
          </div>
          <div className="col">
            <div className="pane">
              <p>Some anushthans are better performed with someone who has done them a hundred times. Not because you cannot — you can, and every vidhi on this site is written so that you can, but because on the day, hosting twenty people and leading the mantras at the same time is a lot to hold.</p>

              <h3>What the booking includes</h3>
              <div className="pts">
                <div className="pt">
                  <span className="pt-k"></span>
                  <div>
                    <b>A verified purohit for your chosen anushthan, performed in full.</b>
                    <p>There is no shortened version and no extended version. One puja, one price.</p>
                  </div>
                </div>
                <div className="pt">
                  <span className="pt-k"></span>
                  <div>
                    <b>The complete puja samagri comes with the purohit.</b>
                    <p>It is part of your package, carried to your home on the day. You do not shop for it, and you are not asked for it at the door.</p>
                  </div>
                </div>
              </div>

              <h3>What you will need to arrange</h3>
              <div className="pts">
                <div className="pt">
                  <span className="pt-k"></span>
                  <div>
                    <b>Fresh items are not included,</b>
                    <p>because they should not be sitting in a box overnight. Flowers, milk, curd, and the bhog prasad you intend to offer are yours to arrange.</p>
                  </div>
                </div>
                <div className="pt">
                  <span className="pt-k"></span>
                  <div>
                    <b>You will receive the full list one day before the puja</b>
                    <p>— every item, with quantities. Not a vague reminder on the morning of. A specific list, the day before, so you can pick it up on your way home.</p>
                  </div>
                </div>
              </div>

              <h3>What will not happen</h3>
              <p>Our purohits do not upsell at the altar. They will not tell you that something is missing, that something extra is required, or that anything will go wrong. If a purohit associated with Tapa ever does, we want to hear about it, and they will not remain on our network.</p>
              <button type="button" className="btn gh">Notify me when bookings open ›</button>
            </div>
          </div>
        </section>

        {/* ══ 06 · THE TAPA CIRCLE ══ */}
        <section className="sec">
          <div className="sec-h">
            <span className="sec-n">9</span>
            <h2 className="sec-t">The Tapa Circle <span className="chip">₹499/year</span></h2>
            <span className="sec-r"></span>
          </div>
          <div className="col">
            <div>
              <div className="pane">
                <p className="stand">The panchang and the guide, on WhatsApp, on the day you need them.</p>
                <p>Most people do not want another app. They want to know that Ekadashi is on Thursday, and to have the right guide open when they sit down to do it.</p>
                <p>The Circle sends the tithi, the vrat and festival dates, and the relevant ritual guide on the day it applies — on WhatsApp, where you already are. No forwards. No predictions. No messages about what happens if you miss something, because nothing happens if you miss something.</p>
              </div>

              <details className="tray">
                <summary>
                  <span>How to subscribe</span>
                  <span className="tr-x">▼</span>
                </summary>
                <div className="tr-body">
                  <div className="steps" style={{ paddingTop: '14px' }}>
                    <div className="st">
                      <div>
                        <b>Enter your WhatsApp number</b>
                        <p>The number you actually use. This is the only detail we ask for.</p>
                      </div>
                    </div>
                    <div className="st">
                      <div>
                        <b>Pay ₹499</b>
                        <p>UPI, card or netbanking. One payment, covering twelve months from the day you join. It does not auto-renew — we will tell you when the year is ending and you can decide then.</p>
                      </div>
                    </div>
                    <div className="st">
                      <div>
                        <b>Confirm on WhatsApp</b>
                        <p>You will receive one message asking you to confirm. Reply to it and you are in. If you do not reply, nothing is sent and we refund you.</p>
                      </div>
                    </div>
                    <div className="st">
                      <div>
                        <b>The first message arrives on the next relevant date</b>
                        <p>Not immediately, and not daily. The welcome note tells you exactly what the next date is and when to expect it.</p>
                      </div>
                    </div>
                  </div>
                  <div className="note"><b>Leaving:</b> reply STOP at any time and it ends with that message. No confirmation call, no retention offer.</div>
                </div>
              </details>

              <button type="button" className="btn wa" style={{ marginTop: '14px' }}>Join the Circle ›</button>
            </div>
          </div>
        </section>

        {/* ══ 07 · WORK WITH US ══ */}
        <WorkWithUsForms />

        {/* ══ CLOSE ══ */}
        <div className="close">
          <div className="close-in">
            <div className="close-l">THE ONE SENTENCE</div>
            <p className="close-pre">Everything on this site follows from one sentence:</p>
            <p className="close-t">Tapa exists so that every Hindu who wants to practise their faith correctly can do so <b>with confidence, without fear,</b> and without being exploited by the systems that were supposed to help them.</p>
            <img className="close-logo" src={LOGO_BASE64} alt="तप्" />
          </div>
        </div>
      </div>
    </>
  );
}
