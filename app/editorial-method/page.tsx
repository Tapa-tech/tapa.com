'use client';

import React from 'react';
import './editorial-method.css';

export default function EditorialMethodPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen" style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--body-text)' }}>
      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-in">
            <p className="hero-ey">OUR EDITORIAL METHOD</p>
            <h1 className="hero-h1">How we decide what is true</h1>
            <p className="hero-p">
              Every claim on this platform is placed in one of three categories, and most carry a score out of five. The score says <strong>how close the source sits to Shruti</strong> — not how important the ritual is, and not how strongly anyone believes it.
            </p>
            <div className="hero-rule"></div>
            <p className="hero-note">
              If you arrived by tapping "Read source" on an article — this is the right place. The specific text for that claim is named on the article itself; this page explains the system behind it.
            </p>
          </div>
        </div>
      </section>

      {/* TOC BAR */}
      <div className="toc">
        <div className="toc-in">
          <span className="toc-l">ON THIS PAGE</span>
          <a className="tc" href="#naming">The naming rule</a>
          <a className="tc" href="#three">The three tags</a>
          <a className="tc" href="#score">The score and its badge</a>
          <a className="tc" href="#anatomy">Reading a credibility card</a>
          <a className="tc" href="#panchang">Why Panchang is different</a>
          <a className="tc" href="#sources">Our sources</a>
          <a className="tc" href="#process">How an article is made</a>
          <a className="tc" href="#never">What we will never do</a>
          <a className="tc" href="#challenge">Challenge a claim</a>
        </div>
      </div>

      {/* INTRO SECTION */}
      <section className="sec">
        <div className="wrap">
          <div className="s-n">THE PROBLEM THIS SOLVES</div>
          <div className="s-t">Most ritual advice does not tell you where it came from</div>
          <p className="p">
            Someone tells you a vrat must be kept without water. Someone else says a particular day is unlucky. A forwarded message warns you what happens if you skip a step. None of it says whether it comes from a text, from a region, from a family — or from nowhere at all.
          </p>
          <p className="p">
            That is the gap. Not a shortage of information about Hindu ritual, but <strong>no way to tell which kind of information you are looking at.</strong>
          </p>
        </div>
      </section>

      <div className="wrap"><div className="hr"></div></div>

      {/* SECTION 01: THE NAMING RULE */}
      <section className="sec" id="naming">
        <div className="wrap">
          <div className="s-n">SECTION 01</div>
          <div className="s-t">The naming rule</div>
          <p className="s-s">One rule decides more classifications than any other, and it is the rule that is easiest to bend without noticing.</p>

          <div className="namerule">
            <div className="nr-l">THE RULE</div>
            <div className="nr-q">If we cannot name the text you could go and check, the answer is no. It is not Dharma.</div>
            <p className="nr-p">Two things have to be true. We can name the text. And <b>you could go and verify it yourself.</b> Both, not either.</p>
            <p className="nr-p">What this rules out is the most tempting case: a practice everybody follows, that every pandit endorses, that has clearly been done for centuries — and nobody can say which text it comes from. That is Pratha. Not because it is lesser, but because we cannot show our working, and showing our working is the whole promise.</p>
            <p className="nr-p">The pressure always runs one way — to round up. Something feels obviously scriptural, so it takes a Dharma tag and later nobody can say where it came from. Every time that happens the Dharma tag is worth slightly less. <b>A correct Pratha costs us nothing. A wrong Dharma costs us the only thing we have.</b></p>
          </div>

          <div className="swap">
            <div className="swap-h">
              <span>INSTEAD OF</span>
              <span>WE WRITE</span>
            </div>
            <div className="swap-r">
              <span>"The Vedas say…"</span>
              <span>Shri Rudram, Taittiriya Samhita 4.5</span>
            </div>
            <div className="swap-r">
              <span>"Scripture prescribes…"</span>
              <span>Shiva Purana, Rudra Samhita</span>
            </div>
            <div className="swap-r">
              <span>"It is traditionally held that…"</span>
              <span>This is a regional tradition in Rajasthan and UP. It is valid but not universally binding.</span>
            </div>
            <div className="swap-r">
              <span>"Pandits agree that…"</span>
              <span>Either the text gets named, or it is tagged Pratha.</span>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap"><div className="hr"></div></div>

      {/* SECTION 02: THE THREE TAGS */}
      <section className="sec" id="three">
        <div className="wrap">
          <div className="s-n">SECTION 02</div>
          <div className="s-t">The three tags</div>
          <p className="s-s">These are not degrees of truth. They are different kinds of authority — and knowing which one you are looking at is the entire point. A 2/5 Pratha is not lesser than a 5/5 Dharma. It is a different kind of claim.</p>

          <div className="band d">
            <div className="band-h">
              <span className="band-tag">DHARMA</span>
              <div>
                <div className="band-t">Traceable to a named text</div>
                <p className="band-s">A specific scripture, chapter or section you could open and check for yourself. Universal authority.</p>
              </div>
            </div>
            <div className="band-b">
              <p>Not "the scriptures say" — <strong>which</strong> scripture, and where in it. If we cannot name a source you could go and verify, the claim does not get this tag, however widely it is believed.</p>
              <span className="range">Scores 3/5 to 5/5 — never below 3</span>
              <div className="eg">
                <div className="eg-l">FROM THE JANMASHTAMI GUIDE</div>
                <p className="eg-q">"The midnight puja is performed during Nishita Kaal — the birth moment named in the text."</p>
                <p className="eg-src"><b>Bhagavata Purana</b> · Skandha 10, Chapters 1–4 · Puranic · 4/5</p>
              </div>
            </div>
          </div>

          <div className="band p">
            <div className="band-h">
              <span className="band-tag">PRATHA</span>
              <div>
                <div className="band-t">Regional, community, lineage or family custom</div>
                <p className="band-s">Widely practised, real, worth keeping — and not traceable to a named text. Contextual authority.</p>
              </div>
            </div>
            <div className="band-b">
              <p>It might be centuries old. It might be the most meaningful part of the day for your family. We are not ranking it below Dharma or suggesting you drop it. We are only saying: <strong>this one is yours, not scripture's.</strong></p>
              <p>Which matters when someone tells you your way is wrong, or that another region's practice is the correct one. Neither is true. They are different customs, and both are legitimate.</p>
              <span className="range">Scores 1/5 to 2/5 — never above 2</span>
              <div className="eg">
                <div className="eg-l">FROM THE BILVA CONCEPT ARTICLE</div>
                <p className="eg-q">"The smooth underside of the leaf faces the Shivalinga."</p>
                <p className="eg-src">Widely observed across Shaiva practice · <b>no named text mandates this orientation</b></p>
              </div>
            </div>
          </div>

          <div className="band b">
            <div className="band-h">
              <span className="band-tag">BHRANTI</span>
              <div>
                <div className="band-t">Fear-based or commercially manufactured</div>
                <p className="band-s">No source class, and no score. Corrected in plain language, in every guide where it appears.</p>
              </div>
            </div>
            <div className="band-b">
              <p>Bhranti carries no score because there is nothing to score. We recognise it by shape — a threatened consequence for omission, a claim of total invalidation, an exclusivity rule, devotion ranked by difficulty or expense, a prescription derived from a birth chart, or a manufactured product requirement.</p>
              <p>A claim can be sincere, ancient and widely believed and still be Bhranti. <strong>Age is not authority.</strong> The correction is always gentle, and always cites what actually contradicts it.</p>
              <div className="eg">
                <div className="eg-l">FROM THE RUDRABHISHEK GUIDE</div>
                <p className="eg-q">"Only a Brahmin can perform Rudrabhishek."</p>
                <p className="eg-src">No source text restricts performance. <b>Correction badge — no score.</b></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap"><div className="hr"></div></div>

      {/* SECTION 03: THE SCORE AND ITS BADGE */}
      <section className="sec" id="score">
        <div className="wrap">
          <div className="s-n">SECTION 03</div>
          <div className="s-t">The score, and the badge beside it</div>
          <p className="s-s">The number describes <strong>which class of source the claim comes from</strong>. The badge names that class in a word. Together they tell you how close the claim sits to Shruti — the oldest and most universally accepted layer of the tradition.</p>

          <div className="scores">
            <div className="sc">
              <div className="sc-n"><span className="sc-b">5</span><span className="sc-o">/ 5</span></div>
              <span className="badge vedic">VEDIC</span>
              <div>
                <div className="sc-t">Directly in Shruti</div>
                <p className="sc-s">Veda, Brahmana, Aranyaka or a principal Upanishad. <em>Example — the Abhisheka ritual, Krishna Yajurveda, Shri Rudram.</em></p>
              </div>
            </div>
            <div className="sc">
              <div className="sc-n"><span className="sc-b">4</span><span className="sc-o">/ 5</span></div>
              <span className="badge puranic">PURANIC</span>
              <div>
                <div className="sc-t">Clearly stated in a Mahapurana, Itihasa, Dharmashastra, Kalpa Sutra or Agama</div>
                <p className="sc-s">The layer most ritual practice actually rests on. <em>Example — the Sawan Somwar vrat.</em></p>
              </div>
            </div>
            <div className="sc">
              <div className="sc-n"><span className="sc-b">3</span><span className="sc-o">/ 5</span></div>
              <span className="badge shastra">SHASTRA</span>
              <div>
                <div className="sc-t">In a named nibandha, bhashya, Upapurana or scholarly work</div>
                <p className="sc-s">Named secondary texts — still named. <em>Example — vrat tithi determination per Nirnaya Sindhu.</em></p>
              </div>
            </div>
            <div className="sc">
              <div className="sc-n"><span className="sc-b">2</span><span className="sc-o">/ 5</span></div>
              <span className="badge regional">REGIONAL</span>
              <div>
                <div className="sc-t">Regional, community, sampradaya or panchang convention</div>
                <p className="sc-s">Where most Pratha sits. <em>Example — Sinjara, the Kanwar Yatra.</em></p>
              </div>
            </div>
            <div className="sc">
              <div className="sc-n"><span className="sc-b">1</span><span className="sc-o">/ 5</span></div>
              <span className="badge oral">ORAL</span>
              <div>
                <div className="sc-t">Family, oral or folk practice</div>
                <p className="sc-s">Passed down rather than written down. We say so plainly rather than dressing it up.</p>
              </div>
            </div>
            <div className="sc">
              <div className="sc-n"><span className="sc-b" style={{ fontSize: '22px', color: 'var(--sub-text)' }}>—</span></div>
              <span className="badge corr">CORRECTION</span>
              <div>
                <div className="sc-t">Bhranti — no score</div>
                <p className="sc-s">Nothing to score. A correction badge appears instead, on the myth card.</p>
              </div>
            </div>
          </div>

          <div className="gate">
            <div className="gt d">
              <div className="gt-k">DHARMA · 3 TO 5</div>
              <p className="gt-v">If a claim would score below 3, it is not Dharma. The tag is wrong, not the score.</p>
            </div>
            <div className="gt p">
              <div className="gt-k">PRATHA · 1 TO 2</div>
              <p className="gt-v">If a Pratha claim seems to deserve a 3, a named text has been found — and it is Dharma.</p>
            </div>
          </div>

          <div className="rulebox">
            <div className="rb-l">WHAT WE PUBLISH, AND WHAT WE DO NOT — YET</div>
            <div className="rb-t">You are seeing what each band means. You are not seeing the decision rules behind it.</div>
            <p className="rb-p">There is an internal framework. It is written down, applied to every article, and it includes things this page does not show:</p>
            <div className="rb-list">
              <div className="rb-i"><span>—</span>The full decision tree a writer runs, question by question.</div>
              <div className="rb-i"><span>—</span>The complete source register — every text we accept at each tier, and the cautions attached to specific ones.</div>
              <div className="rb-i"><span>—</span>How verification and corroboration modify a score once the tier is set.</div>
            </div>
            <p className="rb-p">We are keeping those internal while the method is young. <b>We intend to publish them in full once we have been in the open long enough to defend them properly</b> — with a year of articles behind us rather than a handful.</p>
            <p className="rb-p">We would rather tell you that plainly than let you assume there is nothing behind the number. If a specific score looks wrong to you, the route to challenge it is at the bottom of this page, and it is open today.</p>
          </div>
        </div>
      </section>

      <div className="wrap"><div className="hr"></div></div>

      {/* SECTION 04: READING A CREDIBILITY CARD */}
      <section className="sec" id="anatomy">
        <div className="wrap">
          <div className="s-n">SECTION 04</div>
          <div className="s-t">Reading a credibility card</div>
          <p className="s-s">The card at the top of every Ritual Guide and Dharmic Concept. Four things, and each one is doing a specific job.</p>

          <div className="anat">
            <div className="anat-l">AS IT APPEARS ON THE ARTICLE</div>
            <div className="cc">
              <div className="cc-h">
                <span className="cc-hl">SOURCE OF TRUTH</span>
                <span className="cc-hr">Read source ›</span>
              </div>
              <div className="cc-b">
                <div className="cc-core">CORE PRACTICE</div>
                <div className="cc-claim">Vrat and worship of Shiva-Parvati on Shravan Shukla Tritiya</div>
                <div className="cc-row">
                  <span className="pill d">DHARMA · 4/5</span>
                  <span className="badge puranic">PURANIC</span>
                  <span className="pill src">Shiva Purana</span>
                </div>
                <p className="cc-comp">This guide: <b>1 core practice</b> (Dharma) · <b>4 regional customs</b> (Pratha) · <b>2 corrections</b></p>
              </div>
            </div>

            <div className="callouts">
              <div className="co">
                <span className="co-n">1</span>
                <span><b>The core-claim label</b> names what the score is about. A bare number has no subject — four out of five, of what? The score belongs to the thing the article is about, never an average and never the highest score on the page.</span>
              </div>
              <div className="co">
                <span className="co-n">2</span>
                <span><b>The tag and score</b> together. Dharma 4/5 means: named in a Mahapurana, Dharmashastra, Kalpa Sutra or Agama.</span>
              </div>
              <div className="co">
                <span className="co-n">3</span>
                <span><b>The badge</b> names the source class in one word, so you know what kind of text without opening the citation.</span>
              </div>
              <div className="co">
                <span className="co-n">4</span>
                <span><b>The composition line</b> tells you the page is mixed before you meet the mix. A guide with one Dharma core and four Pratha customs says so, up front.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap"><div className="hr"></div></div>

      {/* SECTION 05: WHY PANCHANG IS DIFFERENT */}
      <section className="sec" id="panchang">
        <div className="wrap">
          <div className="s-n">SECTION 05</div>
          <div className="s-t">Why Panchang carries no tag and no score</div>
          <p className="p">Panchang content — today's tithi, a festival date, sunrise, Rahu Kaal timing — carries <strong>no classification tag and no score.</strong> Not because it is less reliable, but because it is a different kind of claim.</p>
          <p className="p">A tithi is computed, not interpreted. There is no scriptural authority to weigh, because nobody is making a claim about what you should do — only about where the Sun and Moon are. The almanac source is named directly in a Source Strip, which replaces the credibility card.</p>
          <p className="p">Where a Panchang article does make a claim about practice — that Sutak applies only where an eclipse is visible, for instance — <strong>that specific claim is tagged and corrected like any other.</strong> The data is not. The interpretation is.</p>
          <p className="p">Panchang sourcing never counts toward a Dharma or Pratha badge anywhere else on the platform. And where publishers disagree on a tithi boundary, we say so in the article rather than presenting one publisher's answer as the correct one.</p>
        </div>
      </section>

      <div className="wrap"><div className="hr"></div></div>

      {/* SECTION 06: WHERE OUR SOURCES COME FROM */}
      <section className="sec" id="sources">
        <div className="wrap">
          <div className="s-n">SECTION 06</div>
          <div className="s-t">Where our sources come from</div>
          <p className="s-s">Primary texts and established editions, not aggregator websites. A verse quoted in a digest is not a verified verse — verification means the original.</p>

          <div className="srcgrid">
            <div className="src">
              <div className="src-k">TIER 1 — SHRUTI · BADGE: VEDIC</div>
              <p className="src-l">The four <b>Vedas</b> with their Samhita, Brahmana and Aranyaka portions · the <b>principal Upanishads</b> · ritual suktas in frequent use — <b>Shri Rudram</b>, <b>Purusha Sukta</b>, <b>Sri Sukta</b>, <b>Durga Sukta</b></p>
              <p className="src-n">Cited by text, book and chapter wherever the text is divided that way.</p>
            </div>
            <div className="src">
              <div className="src-k">TIER 2 — SMRITI, ITIHASA, PURANA · PURANIC</div>
              <p className="src-l">The eighteen <b>Mahapuranas</b> · <b>Valmiki Ramayana</b> and the <b>Mahabharata</b> including the Gita · the <b>Dharmashastras</b> · the <b>Kalpa Sutras</b>, especially the Grihya Sutras which govern domestic ritual · <b>Agama and Tantra</b>, the authority for puja procedure</p>
              <p className="src-n">Where two Mahapuranas conflict, we say so in the article rather than picking the one that suits the ritual.</p>
            </div>
            <div className="src">
              <div className="src-k">TIER 3 — NIBANDHA &amp; COMMENTARY · SHASTRA</div>
              <p className="src-l">Ritual digests — <b>Nirnaya Sindhu</b>, <b>Dharmasindhu</b>, <b>Hemadri's Chaturvarga Chintamani</b> · bhashyas by <b>Shankara</b>, <b>Ramanuja</b>, <b>Madhva</b>, <b>Sayana</b> · <b>Upapuranas</b> · peer-reviewed indological scholarship</p>
              <p className="src-n">The digests are the operative authority for vrat determination and tithi rules in North India — they matter to our content more than their tier suggests.</p>
            </div>
            <div className="src">
              <div className="src-k">CALENDAR DATA — NOT A DHARMA SOURCE</div>
              <p className="src-l"><b>Drik Panchang</b> — computed for Delhi-NCR, Purnimanta convention</p>
              <p className="src-n">Entered and verified manually. We do not auto-fetch, because a page served from your own IP returns the wrong city. Panchang sourcing never counts toward a Dharma or Pratha badge.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap"><div className="hr"></div></div>

      {/* SECTION 07: HOW AN ARTICLE GETS MADE */}
      <section className="sec" id="process">
        <div className="wrap">
          <div className="s-n">SECTION 07</div>
          <div className="s-t">How an article gets made</div>
          <p className="s-s">Six stages. Nothing goes live from a first draft.</p>

          <div className="stage">
            <div className="st-c"><div className="st-n">1</div><div className="st-l"></div></div>
            <div className="st-b">
              <div className="st-t">Editorial draft</div>
              <p className="st-s">Built from the named text, not from what is commonly said about the ritual. Every claim is logged against its source before any prose is written.</p>
              <div className="st-o">WRITER</div>
            </div>
          </div>
          <div className="stage">
            <div className="st-c"><div className="st-n">2</div><div className="st-l"></div></div>
            <div className="st-b">
              <div className="st-t">Source verification</div>
              <p className="st-s">Each citation checked against the original text — not against a digest that quotes it. Claims that do not survive are downgraded or dropped.</p>
              <div className="st-o">EDITOR</div>
            </div>
          </div>
          <div className="stage">
            <div className="st-c"><div className="st-n">3</div><div className="st-l"></div></div>
            <div className="st-b">
              <div className="st-t">Practitioner review</div>
              <p className="st-s">Including an iconographic accuracy check on every deity image — attributes, hands, vahana, posture, consorts. An article that corrects misconceptions in its text while carrying a wrongly-armed Ganesha has undermined itself.</p>
              <div className="st-o">EXTERNAL REVIEWER</div>
            </div>
          </div>
          <div className="stage">
            <div className="st-c"><div className="st-n">4</div><div className="st-l"></div></div>
            <div className="st-b">
              <div className="st-t">Fear-language audit</div>
              <p className="st-s">Every line read once more for one question: does this create, imply or reinforce fear? Includes the astrology and prescription check. Lines that fail are rewritten, even when factually correct.</p>
              <div className="st-o">EDITOR</div>
            </div>
          </div>
          <div className="stage">
            <div className="st-c"><div className="st-n">5</div><div className="st-l"></div></div>
            <div className="st-b">
              <div className="st-t">Regional variance check</div>
              <p className="st-s">Whether the regional detail is accurately scoped — and whether we have quietly presented one region's custom as universal.</p>
              <div className="st-o">REGIONAL REVIEWER</div>
            </div>
          </div>
          <div className="stage">
            <div className="st-c"><div className="st-n end">6</div></div>
            <div className="st-b">
              <div className="st-t">Approval — and revisable after</div>
              <p className="st-s">Going live is not the end of the process. Corrections are made openly, and the article notes when a claim has been revised.</p>
              <div className="st-o">RI EDITOR</div>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap"><div className="hr"></div></div>

      {/* SECTION 08: THREE TESTS EVERY LINE HAS TO PASS */}
      <section className="sec">
        <div className="wrap">
          <div className="s-n">SECTION 08</div>
          <div className="s-t">Three tests every line has to pass</div>
          <p className="s-s">Applied to every sentence on this platform, including this one.</p>
          <div className="tests">
            <div className="test">
              <div className="test-n">TEST 1 · FEAR</div>
              <p className="test-q">Does this line create, imply, or reinforce fear about ritual practice?</p>
              <div className="test-f">If yes → rewrite. Always.</div>
            </div>
            <div className="test">
              <div className="test-n">TEST 2 · CLARITY</div>
              <p className="test-q">If someone doing this for the first time read this, would they know exactly what to do?</p>
              <div className="test-f">If no → rewrite.</div>
            </div>
            <div className="test">
              <div className="test-n">TEST 3 · SOURCE</div>
              <p className="test-q">If challenged, can we point to a specific text, chapter, or section for this claim?</p>
              <div className="test-f">If no → do not make the claim.</div>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap"><div className="hr"></div></div>

      {/* SECTION 09: WHAT WE WILL NEVER DO */}
      <section className="sec" id="never">
        <div className="wrap">
          <div className="s-n">SECTION 09</div>
          <div className="s-t">What we will never do</div>
          <p className="s-s">Not preferences. These are the conditions under which this platform is worth having.</p>
          <div className="comms">
            <div className="comm">
              <div className="comm-t">Use fear to sell anything</div>
              <p className="comm-s">No remedies for misfortune, no warnings about what happens if you skip a step, no dosha framed as a problem we can solve for a fee.</p>
            </div>
            <div className="comm">
              <div className="comm-t">Publish astrology or personal prescription</div>
              <p className="comm-s">No horoscopes, no rashifal, no kundli matching. We never derive a ritual from a birth chart, rashi or planetary period. Calendar mechanics, yes. Personal prescription, never.</p>
            </div>
            <div className="comm">
              <div className="comm-t">Let commerce change what we print</div>
              <p className="comm-s">Selling a kit for a ritual does not alter a word of the guide for it. The guide says a kit is unnecessary, because it is.</p>
            </div>
            <div className="comm">
              <div className="comm-t">Present custom as scripture</div>
              <p className="comm-s">If we cannot name the text, we say Pratha. Even when the practice is universal. Even when it would read better as Dharma.</p>
            </div>
            <div className="comm">
              <div className="comm-t">Restrict practice by who you are</div>
              <p className="comm-s">Where a source text places no restriction on who may perform a ritual, neither do we — and we correct claims that do.</p>
            </div>
            <div className="comm">
              <div className="comm-t">Put a guide behind a paywall</div>
              <p className="comm-s">Every ritual guide, every samagri list, every correction is free to read and will stay that way.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap"><div className="hr"></div></div>

      {/* SECTION 10: TELL US WE ARE WRONG */}
      <section className="sec" id="challenge" style={{ paddingBottom: '60px' }}>
        <div className="wrap">
          <div className="s-n">SECTION 10</div>
          <div className="s-t">Tell us we are wrong</div>
          <div className="chal">
            <div>
              <div className="ch-t">A method nobody can question is not a method</div>
              <p className="ch-p">If a citation is wrong, a score sits too high, a regional practice is misrepresented, or something has been tagged Pratha that you can point to in a text — we want to hear it. Especially the last one.</p>
              <p className="ch-p">Every challenge gets a reply from a person. Where you are right, the article changes and says that it changed.</p>
              <button className="ch-c" onClick={() => alert('Challenge a claim form coming soon')}>Challenge a claim ›</button>
            </div>
            <div className="ch-steps">
              <div className="ch-s"><span className="ch-num">1</span><span>Tell us the <b>article and the specific line</b>.</span></div>
              <div className="ch-s"><span className="ch-num">2</span><span>Tell us what you believe is correct, and <b>where it comes from</b> — a text, a regional tradition, a family practice.</span></div>
              <div className="ch-s"><span className="ch-num">3</span><span>We check it against the source edition, not a digest.</span></div>
              <div className="ch-s"><span className="ch-num">4</span><span>You get a reply either way — <b>including when we disagree</b>, with our reasoning.</span></div>
            </div>
          </div>

          <div className="close">
            <p>Nobody owns Dharma. Not a company, not an institution, not a person. We are students of this before we are publishers of it, and we read it that way — carefully, against the text, and without assuming the version we grew up with is the only one.</p>
            <p>What we can promise is the method: name the text or do not make the claim, separate what is written from what is done, never use fear, and correct in the open. That is the whole of it. Everything else on this platform follows from those four things.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
