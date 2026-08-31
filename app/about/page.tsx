import WorkWithUsForms from '@/components/WorkWithUs/WorkWithUsForms';
import './about.css';


const komalImg = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80';
const whyImg = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80';
const LOGO_BASE64 = 'data:image/png;base64,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3jfYccULYr3hyiUK1gojjVsNhD0bLnvTGlN4+aEck0MFEIKAxdUC3NxuEhAIeRw3QCW13uSzezq3Pjwmla5M4g++gmAWtxracOVzWsV9YIw+MKcdQQKhTZyUGXatH7zlXmPNbWP0AJjLGhOIqVC1WWxXgcVb2HV1a/q+sUh6JREFa4VQK2oeXn/55kR4o4i4KlTy2hEkKARgDD9BUNYMrvtmScMPW8QJwVx29bIBFn61FH5zOPi/qxVJx0z4lUMUrBVAekHfJ0S/NSKfaZXk9An6YHJKDiWoRVgzyupu02TvSsdMfKQsBrcVYEDkEn8HAAjEHWTFrzWFl+1Z3/OWLbjbx0z4lUMUrBXBednE5h3vW20Kzzucc1GzQLTFWArx1TW/vOkAcI0DABG9/TB97omotSB8mym8f2jDZb8b+8GvHKJgNTiTcauOy7XpXf3A9e8dFmN/c0g2n/46654Nf8f41w+L+90f845D8P//80/bT9c31/b0b5l9/w0l9Z1N/4YfD99144/9v5y+efT+/9f7z60vH76W70t49/9z09v1t3d9v6bve4d36uT+ef5p8P7f8v/3t/z890v/1/c/3d/c1+e2a6d7q+44b+9t6cff55u+eO6J5s5x70p3vj8L1vN3vF/f60b/+t77X/c+f33N/T9//d9/z93f/w77x/81+X3/x38v/8e+f/v93//t3v3f7//j/z/9/x9/7/59//f/9+v/m//f/9v7f9/+/+v+v8v3+/+3+v8vf/32v4/+/+f3t3f//+f397f39/e3+/+f//9+/v//97/3+/+///9+/f7+7u4=';

type SectionHeaderProps = {
  number: string;
  title: React.ReactNode;
};

function SectionHeader({ number, title }: SectionHeaderProps) {
  return (
    <div className="sec-h">
      <span className="sec-n">{number}</span>
      <h2 className="sec-t">{title}</h2>
      <span className="sec-r"></span>
    </div>
  );
}

type SourceRowProps = {
  source: string;
  score: string;
};

function SourceRow({ source, score }: SourceRowProps) {
  return (
    <tr>
      <td>{source}</td>
      <td className="sc">{score}</td>
    </tr>
  );
}

type PointProps = {
  title: string;
  description: string;
};

function Point({ title, description }: PointProps) {
  return (
    <div className="pt">
      <span className="pt-k"></span>
      <div>
        <b>{title}</b>
        <p>{description}</p>
      </div>
    </div>
  );
}

type ValueRowProps = {
  number: string;
  title: string;
  description: string;
};

function ValueRow({ number, title, description }: ValueRowProps) {
  return (
    <div className="vrow">
      <span className="vn">{number}</span>
      <div>
        <b>{title}</b>
        <p>{description}</p>
      </div>
    </div>
  );
}

type CircleStepProps = {
  title: string;
  description: string;
};

function CircleStep({ title, description }: CircleStepProps) {
  return (
    <div className="st">
      <div>
        <b>{title}</b>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
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
        <section className="sec">
          <SectionHeader number="3" title={<>Why <span className="dev">तप्</span></>} />
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
                        <ValueRow number="01" title="Dharma before business." description="Revenue can never come at the cost of truth." />
                        <ValueRow number="02" title="Fear will never be our marketing strategy." description="We will never manipulate people with guilt, superstition, or anxiety. Devotion should arise from love and understanding, not fear." />
                        <ValueRow number="03" title="Knowledge comes before products." description="Understanding is our first offering. Commerce is only ever a consequence of it." />
                        <ValueRow number="04" title="Authenticity over convenience." description="When faced with a choice, we choose what is faithful over what is fashionable." />
                        <ValueRow number="05" title="We serve seekers, not customers." description="Every interaction should leave people feeling more informed, more confident, and more connected to their faith." />
                        <ValueRow number="06" title="Humility is non-negotiable." description="No individual, no institution, and no company owns Dharma. We are students before we are builders." />
                        <ValueRow number="07" title="Trust is sacred." description="It takes years to build and moments to lose. We will protect it fiercely." />
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </section>
        <section className="sec">
          <SectionHeader number="4" title="Our Editorial Method" />
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
                    <SourceRow source="Shruti — Vedas, Upanishads" score="5 / 5" />
                    <SourceRow source="Mahapurana, Itihasa, Dharmashastra, Kalpa, Agama" score="4 / 5" />
                    <SourceRow source="Nibandha, bhashya, commentarial literature" score="3 / 5" />
                    <SourceRow source="Bhakti-period compositions — Ramcharitmanas, the stotras" score="3 / 5" />
                    <SourceRow source="Regional, oral and family custom" score="1–2 / 5" />
                  </tbody>
                </table>
              </div>

              <p>That last placement is a description, not a demotion. A stotra recited in millions of homes every morning loses nothing by being correctly identified as a composed work rather than a revealed one. Where the same claim also appears in a Purana, we cite the Purana and name the stotra separately as the text you actually recite.</p>
              <a href="/editorial-method" className="btn">Read the full method ›</a>
            </div>
          </div>
        </section>
        <section className="sec">
          <SectionHeader number="5" title="Glossary" />
          <div className="col">
            <div className="pane">
              <p className="stand">Sankalp. Upavasa. Abhishek. Shodashopachara. Tithi and paksha.</p>
              <p>Every Sanskrit term we use in a guide is defined here in ordinary language, with the Devanagari, a simple transliteration, and where the word comes from.</p>
              <p>If you have ever nodded along at a term rather than asking what it meant, this page is for you.</p>
              <a href="/glossary" className="btn gh">Open the glossary ›</a>
            </div>
          </div>
        </section>
        <section className="sec">
          <SectionHeader number="7" title="Our Ritual Kits Store" />
          <div className="col">
            <div className="pane">
              <p className="stand" style={{ color: 'var(--pink)' }}>Assembled to the ritual, not to a price point.</p>
              <p>A ritual kit exists to solve one problem: the samagri list. You know what you are observing and roughly how it goes, and then you are in a shop at eight in the morning trying to remember whether it was five bilva leaves or seven, and whether the panchamrit needs curd or just milk.</p>
              <p>Every Tapa kit is built backwards from a published guide. We write the vidhi first, from a named source. Then we list every item that vidhi actually requires. Then we assemble the kit to that list. Nothing is added to raise the price, and nothing is dropped to lower it.</p>

              <h3>How each kit is built</h3>
              <div className="pts">
                <Point title="Sourced from the guide." description="If an item is in the kit, it appears in a step of the vidhi on our site. If it does not appear in the vidhi, it is not in the box." />
                <Point title="Tagged." description="The printed vidhi card inside marks which steps are Dharma and which are Pratha. Where we have included something customary — an item your region uses and another does not — it is labelled as custom, so you can use it or set it aside without wondering." />
                <Point title="Complete for the ritual, not for the shelf." description="Quantities match one observance of that puja. We would rather you buy the right kit once than a general samagri box four times." />
                <Point title="Fresh items are named, not included." description="Flowers, milk, curd, fruit and bhog cannot travel well and should not. Every kit lists exactly what to pick up and how much of it." />
                <Point title="One price. One version." description="No premium tier, no economy tier, no deluxe box with the same contents in better packaging. A ritual does not have a budget version." />
              </div>

              <div className="note">Pre-booking opens 1 month before the occasions</div>
              <a href="/ritual-kits" className="btn">See the Ritual Kits ›</a>
            </div>
          </div>
        </section>
        <section className="sec">
          <SectionHeader number="8" title={<>Puja with Purohit <span className="chip soon">COMING SOON · NOVEMBER 2026</span></>} />
          <div className="col">
            <div className="pane">
              <p>Some anushthans are better performed with someone who has done them a hundred times. Not because you cannot — you can, and every vidhi on this site is written so that you can, but because on the day, hosting twenty people and leading the mantras at the same time is a lot to hold.</p>

              <h3>What the booking includes</h3>
              <div className="pts">
                <Point title="A verified purohit for your chosen anushthan, performed in full." description="There is no shortened version and no extended version. One puja, one price." />
                <Point title="The complete puja samagri comes with the purohit." description="It is part of your package, carried to your home on the day. You do not shop for it, and you are not asked for it at the door." />
              </div>

              <h3>What you will need to arrange</h3>
              <div className="pts">
                <Point title="Fresh items are not included," description="because they should not be sitting in a box overnight. Flowers, milk, curd, and the bhog prasad you intend to offer are yours to arrange." />
                <Point title="You will receive the full list one day before the puja" description="— every item, with quantities. Not a vague reminder on the morning of. A specific list, the day before, so you can pick it up on your way home." />
              </div>

              <h3>What will not happen</h3>
              <p>Our purohits do not upsell at the altar. They will not tell you that something is missing, that something extra is required, or that anything will go wrong. If a purohit associated with Tapa ever does, we want to hear about it, and they will not remain on our network.</p>
              <button type="button" className="btn gh">Notify me when bookings open ›</button>
            </div>
          </div>
        </section>
        <section className="sec">
          <SectionHeader number="9" title={<>The Tapa Circle <span className="chip">₹499/year</span></>} />
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
                    <CircleStep title="Enter your WhatsApp number" description="The number you actually use. This is the only detail we ask for." />
                    <CircleStep title="Pay ₹499" description="UPI, card or netbanking. One payment, covering twelve months from the day you join. It does not auto-renew — we will tell you when the year is ending and you can decide then." />
                    <CircleStep title="Confirm on WhatsApp" description="You will receive one message asking you to confirm. Reply to it and you are in. If you do not reply, nothing is sent and we refund you." />
                    <CircleStep title="The first message arrives on the next relevant date" description="Not immediately, and not daily. The welcome note tells you exactly what the next date is and when to expect it." />
                  </div>
                  <div className="note"><b>Leaving:</b> reply STOP at any time and it ends with that message. No confirmation call, no retention offer.</div>
                </div>
              </details>

              <button type="button" className="btn wa" style={{ marginTop: '14px' }}>Join the Circle ›</button>
            </div>
          </div>
        </section>
        <WorkWithUsForms />
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
