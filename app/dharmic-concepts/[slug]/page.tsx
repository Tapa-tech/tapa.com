'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

interface MythItem {
  myth: string;
  correctionLabel: string;
  correction: string;
}

interface ConceptData {
  title: string;
  slug: string;
  category: string;
  eyebrow: string;
  ratingPill: string;
  classification: string;
  subtitle: string;
  sourceTitle: string;
  sourceClaim: string;
  sourcesList: string;
  audioDuration: string;
  audioNarrated: string;
  jumpChips: { id: string; label: string }[];
  openingHeadline: string;
  openingParagraphs: string[];
  sections: {
    id: string;
    heading: string;
    paragraphs: string[];
  }[];
  keyPrincipleLabel?: string;
  keyPrincipleText?: string;
  keyPrincipleSubtext?: string;
  myths: MythItem[];
  relatedOfferings?: {
    type: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    isWhatsApp?: boolean;
    isSoon?: boolean;
  }[];
}

const STATIC_CONCEPT: ConceptData = {
  title: 'Three Stories, One Thread',
  slug: 'three-stories-one-thread',
  category: 'Meanings & Practices',
  eyebrow: 'DHARMIC CONCEPTS · MEANINGS & PRACTICES',
  ratingPill: 'DHARMA · 4/5',
  classification: 'PURANIC',
  subtitle: 'Wife, friend, devotee — three relationships, one act of protection. Not one of them is a sister and a brother.',
  sourceTitle: 'SOURCE OF TRUTH',
  sourceClaim: 'The three founding narratives of the raksha sutra involve three different relationships, none of them siblings',
  sourcesList: 'Bhavishya Purana · Mahabharata · Bhagavata Purana',
  audioDuration: '7 min',
  audioNarrated: 'narrated',
  jumpChips: [
    { id: 'three', label: ' Three stories' },
    { id: 'sachi', label: 'Sachi & Indra' },
    { id: 'draupadi', label: 'Draupadi & Krishna' },
    { id: 'lakshmi', label: 'Lakshmi & Bali' },
    { id: 'share', label: 'What they share' },
    { id: 'myths', label: '✕ Myths' },
  ],
  openingHeadline: 'The tradition\'s founding stories tell a different tale from the one most people know — three of them, from three texts, involving three completely different relationships.',
  openingParagraphs: [
    'Not one is about a sister and a brother. What they share is a thread, a mantra, and someone who needed protecting.',
  ],
  sections: [
    {
      id: 'sachi',
      heading: '1. Sachi & Indra (Bhavishya Purana)',
      paragraphs: [
        'In the Bhavishya Purana, the devas were locked in a long, grueling war against the asura king Vritrasura. Lord Indra, leader of the devas, faced imminent defeat. Seeing her husband\'s distress, Sachi (Indrani) prepared a sacred thread woven with protective mantras and tied it around Indra\'s right wrist.',
        'Fortified by the thread and the sacred resolve of his wife, Indra returned to the battlefield and triumphed. The relationship here was between wife and husband, centered on protection in battle.',
      ],
    },
    {
      id: 'draupadi',
      heading: '2. Draupadi & Krishna (Mahabharata)',
      paragraphs: [
        'During the Rajasuya Yajna, Lord Krishna killed Shishupala with his Sudarshana Chakra, cutting his own finger in the process. While others rushed to find bandages, Draupadi immediately tore a strip from her silk sari and bound Krishna\'s bleeding finger.',
        'Touched by her spontaneous devotion, Krishna promised to protect her honor whenever she called upon him — a promise he fulfilled during the Cheer Haran in the Kuru assembly. This bond was one of deep spiritual friendship and unconditional devotion.',
      ],
    },
    {
      id: 'lakshmi',
      heading: '3. Lakshmi & King Bali (Bhagavata Purana)',
      paragraphs: [
        'After Vamana Deva granted King Bali his boons, Lord Vishnu bound himself to guard Bali\'s palace gates in the netherworld. Desiring Vishnu\'s return to Vaikuntha, Goddess Lakshmi disguised herself as a humble woman and sought refuge at Bali\'s court.',
        'During the Shravana Purnima, Lakshmi tied a sacred thread to Bali\'s wrist and declared him her brother. When Bali offered her any gift in return, she revealed her true form and asked for Vishnu\'s release. Bali joyfully fulfilled her request.',
      ],
    },
    {
      id: 'share',
      heading: 'What all three stories share',
      paragraphs: [
        'Across all three scriptural accounts, the essence of the raksha thread remains consistent: it is an act of spiritual protection (raksha) born of love, duty, and sacred intent (sankalpa).',
        'Whether between spouses, spiritual friends, or devotee and king, the thread binds the protector to the protected under divine witness.',
      ],
    },
  ],
  keyPrincipleLabel: 'KEY DHARMIC PRINCIPLE',
  keyPrincipleText: 'Dharma does not restrict protection to bloodlines. The thread signifies an intentional spiritual commitment to honor and protect.',
  keyPrincipleSubtext: 'Sourced directly to classical Puranic literature and validated by Tapa Editorial Team.',
  myths: [
    {
      myth: '"Raksha Bandhan is strictly a festival only between biological sisters and brothers."',
      correctionLabel: 'CORRECTION',
      correction: 'Scripture documents threads tied between spouses, friends, and devotees. The core principle is protection (raksha) and spiritual duty (dharma), not exclusive biological relationship.',
    },
    {
      myth: '"Tying a rakhi without a specific muhurat ruins the entire protection."',
      correctionLabel: 'CORRECTION',
      correction: 'While auspicious muhurats are preferred in Panchang, the intention and mantra (Yena baddho bali raja...) carry the sacred efficacy. Devotion is prioritized over rigid timing.',
    },
    {
      myth: '"Removing the thread before a fixed number of days brings bad luck."',
      correctionLabel: 'CORRECTION',
      correction: 'No scriptural text mandates a strict removal day. Threads may be immersed respectfully in water or tied to a sacred tree after the festival without fear.',
    },
  ],
  relatedOfferings: [
    {
      type: 'PUJA KIT',
      title: 'Authentic Raksha Sutra Kit',
      description: 'Hand-dyed organic cotton threads, mauli, akshat, and kumkum prepared according to Vedic guidelines.',
      buttonText: 'Pre-book Kit',
      buttonLink: 'https://tapa.co/kits/raksha-sutra',
    },
    {
      type: 'PANDITJI PUJAN',
      title: 'Raksha Bandhan Vedic Puja',
      description: 'Pre-book verified Panditji for home sankalpa, Vedic mantra chanting, and Havanam.',
      buttonText: 'Book on WhatsApp',
      buttonLink: 'https://wa.me/919876543210?text=Hi%20Tapa%20Co.,%20I%20want%20to%20book%20Raksha%20Bandhan%20Puja',
      isWhatsApp: true,
    },
    {
      type: 'SCRIPTURAL TEXT',
      title: 'Bhavishya Purana Translation',
      description: 'Explore the full Sanskrit verses and commentary on the origins of sacred threads.',
      buttonText: 'Coming Soon',
      buttonLink: '#',
      isSoon: true,
    },
  ],
};

export default function DharmicConceptDetailPage({ params }: PageProps) {
  const slug = params?.slug || 'three-stories-one-thread';


  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLang, setAudioLang] = useState<'EN' | 'HI'>('EN');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Static concept data determination
  const concept: ConceptData = (slug === 'three-stories-one-thread' || slug === 'raksha-sutra')
    ? STATIC_CONCEPT
    : {
      ...STATIC_CONCEPT,
      title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      slug: slug,
      subtitle: `Scriptural origin, spiritual meaning, and offering rules for ${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}.`,
    };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({ title: concept.title, url: window.location.href }).catch(() => { });
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
      }
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    showToast(!isSaved ? 'Concept saved to your bookmarks!' : 'Removed from bookmarks');
  };

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    showToast(!isPlayingAudio ? 'Playing audio narration...' : 'Audio paused');
  };

  return (
    <div className="dc-detail-root w-full max-w-full overflow-x-hidden min-h-screen">


      {/* ANNOUNCEMENT BANNER */}
      <div className="announce">
        <p className="ann-text"><strong>Dharma does not demand fear.</strong> It demands devotion.</p>
        <div className="ann-links">
          <Link href="/scriptures" className="ann-link">Scripture References</Link>
          <Link href="/glossary" className="ann-link">Glossary</Link>
          <Link href="/editorial-method" className="ann-link">Our Editorial Method</Link>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <Link href="/dharmic-concepts">Dharmic Concepts</Link> › {concept.category} › <b>{concept.title}</b>
          </div>
          <div className="bc-r">
            <div className="lang">
              <button className={lang === 'EN' ? 'on' : ''} onClick={() => setLang('EN')}>EN</button>
              <button className={lang === 'HI' ? 'on' : ''} onClick={() => setLang('HI')}>हिं</button>
            </div>
            <button className="bcb" onClick={toggleSave}>
              {isSaved ? '🔖 Saved' : '🔖 Save'}
            </button>
            <button className="bcb" onClick={handleShare}>↗ Share</button>
          </div>
        </div>
      </div>

      {/* HERO BANNER */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-ov"></div>
        <button className="hero-share" onClick={handleShare}>↗ Share</button>
        <div className="hero-c">
          <div className="hero-in">
            <p className="hero-ey">{concept.eyebrow}</p>
            <div className="hero-tag">◆ {concept.ratingPill} · {concept.classification}</div>
            <h1 className="hero-h1">{concept.title}</h1>
            <p className="hero-sub">{concept.subtitle}</p>
            <div className="hero-btns">
              <button className="hb-p" onClick={() => {
                const el = document.getElementById(concept.jumpChips[0]?.id || 'three');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Read the guide
              </button>
              <button className="hb-g" onClick={toggleSave}>
                {isSaved ? '✓ Saved' : 'Save this'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & AUDIO STRIP */}
      <div className="strip">
        <div className="strip-in">
          <div className="tp">
            <span className="tpi"><span className="tpd" style={{ background: '#27500A' }}></span>Scripturally sourced</span>
            <span className="tpi"><span className="tpd" style={{ background: '#E8A020' }}></span>Region aware</span>
            <span className="tpi"><span className="tpd" style={{ background: '#FD066D' }}></span>Fear-free</span>
          </div>
          <div className="audio">
            <button className="aplay" onClick={toggleAudio}>
              {isPlayingAudio ? '⏸' : '▶'}
            </button>
            <div>
              <div className="alab">Listen to this concept</div>
              <div className="asub">{concept.audioDuration} · {concept.audioNarrated}</div>
            </div>
            <div className="alangs">
              <button className={`alg ${audioLang === 'EN' ? 'on' : ''}`} onClick={() => setAudioLang('EN')}>EN</button>
              <button className={`alg ${audioLang === 'HI' ? 'on' : ''}`} onClick={() => setAudioLang('HI')}>हिं</button>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY JUMP CHIPS BAR */}
      <div className="chips">
        <div className="chips-in">
          <span className="chip-l">JUMP TO</span>
          {concept.jumpChips.map((chip) => (
            <a
              key={chip.id}
              className="chip"
              href={`#${chip.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(chip.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {chip.label}
            </a>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT CONTENT */}
      <div className="wrap">
        <div className="layout">
          <div className="main">

            {/* SOURCE OF TRUTH CARD */}
            <div className="cc">
              <div className="cc-h">
                <span className="cc-hl">{concept.sourceTitle}</span>
                <span className="cc-hr" style={{ cursor: 'pointer' }} onClick={() => showToast('Opening scriptural source citations...')}>
                  Read source ›
                </span>
              </div>
              <div className="cc-b">
                <div className="cc-core">CORE CLAIM</div>
                <div className="cc-claim">{concept.sourceClaim}</div>
                <div className="cc-row">
                  <span className="pill d">{concept.ratingPill}</span>
                  <span className="badge">{concept.classification}</span>
                  <span className="pill src">{concept.sourcesList}</span>
                </div>
              </div>
            </div>

            {/* OPENING PROSE */}
            <div className="sh" id="three">
              <span className="sh-p">+</span>
              <span className="sh-t">{concept.openingHeadline}</span>
            </div>
            {concept.openingParagraphs.map((para, idx) => (
              <p key={idx} className="p">{para}</p>
            ))}

            {/* CONCEPT DYNAMIC SECTIONS */}
            {concept.sections.map((sec) => (
              <div key={sec.id} id={sec.id} style={{ scrollMarginTop: '140px' }}>
                <div className="sh">
                  <span className="sh-p">+</span>
                  <span className="sh-t">{sec.heading}</span>
                </div>
                {sec.paragraphs.map((para, pIdx) => (
                  <p key={pIdx} className="p">{para}</p>
                ))}
              </div>
            ))}

            {/* KEY PRINCIPLE PULL PANEL */}
            {concept.keyPrincipleText && (
              <div className="pull" id="share">
                <div className="pull-l">{concept.keyPrincipleLabel || 'KEY DHARMIC PRINCIPLE'}</div>
                <p><b>{concept.keyPrincipleText}</b></p>
                {concept.keyPrincipleSubtext && <p>{concept.keyPrincipleSubtext}</p>}
              </div>
            )}

            {/* MYTHS & MISCONCEPTIONS SECTION */}
            {concept.myths && concept.myths.length > 0 && (
              <div id="myths" style={{ scrollMarginTop: '140px', marginTop: '36px' }}>
                <div className="sh">
                  <span className="sh-p">✕</span>
                  <span className="sh-t">Myths &amp; Corrections</span>
                </div>
                <p className="p" style={{ marginBottom: '20px' }}>
                  Distinguishing scriptural principles from regional customs and common misunderstandings.
                </p>

                {concept.myths.map((m, mIdx) => (
                  <div key={mIdx} className="myth">
                    <div className="my-q">
                      <div className="my-qt">{m.myth}</div>
                      <div className="my-bd">{m.correctionLabel || 'CORRECTION'}</div>
                    </div>
                    <div className="my-a">{m.correction}</div>
                  </div>
                ))}
              </div>
            )}

            {/* REVENUE / OFFERINGS ROW */}
            {concept.relatedOfferings && concept.relatedOfferings.length > 0 && (
              <div style={{ marginTop: '40px' }}>
                <div className="sh">
                  <span className="sh-p">🛍</span>
                  <span className="sh-t">Scriptural Offerings &amp; Services</span>
                </div>

                <div className="rev">
                  {concept.relatedOfferings.map((off, oIdx) => (
                    <div key={oIdx} className={`rev-c ${off.isSoon ? 'soon' : 'live'}`}>
                      <div className="rev-i">{off.isWhatsApp ? '💬' : off.isSoon ? '📖' : '🏺'}</div>
                      <div className="rev-l">{off.type}</div>
                      <div className="rev-t">{off.title}</div>
                      <div className="rev-s">{off.description}</div>
                      <a
                        href={off.buttonLink}
                        target={off.buttonLink.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className={`rev-b ${off.isWhatsApp ? 'wa' : ''}`}
                        onClick={(e) => {
                          if (off.isSoon) {
                            e.preventDefault();
                            showToast('This item is coming soon to the Tapa store!');
                          }
                        }}
                      >
                        {off.buttonText}
                      </a>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--sub-text)', textAlign: 'center', marginTop: '12px' }}>
                  All items and services are scripturally verified by Tapa Editorial Team.
                </p>
              </div>
            )}

            {/* RELATED CONCEPTS & GUIDES GRID */}
            <div className="relgrid">
              <div className="rel">
                <div className="rel-h">RELATED CONCEPT</div>
                <div className="rel-i">
                  <span>
                    <span className="rel-n">Sankalpa: The Power of Stated Intent</span>
                    <span className="rel-s">Why every Vedic ritual begins with a formal vow</span>
                  </span>
                  <span className="rel-a">›</span>
                </div>
              </div>

              <div className="rel">
                <div className="rel-h">FESTIVE GUIDE</div>
                <div className="rel-i">
                  <span>
                    <span className="rel-n">Sharad Navratri 9-Day Guide</span>
                    <span className="rel-s">Ghatasthapana to Kanya Pujan step-by-step</span>
                  </span>
                  <span className="rel-a">›</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT STICKY SIDEBAR */}
          <aside className="side">
            {/* WHATSAPP CTA */}
            <a
              href="https://wa.me/919876543210?text=Hi%20Tapa%20Co.,%20I%20have%20a%20question%20about%20dharmic%20concepts"
              target="_blank"
              rel="noopener noreferrer"
              className="sbcta wa"
            >
              <span className="sb-ci">💬</span>
              <span className="sb-ct">Ask an Editorial Expert</span>
              <span className="sb-cs">Direct WhatsApp assistance for ritual questions</span>
            </a>

            {/* BOOK PANDITJI CTA */}
            <a
              href="https://tapa.co/book-panditji"
              target="_blank"
              rel="noopener noreferrer"
              className="sbcta dk"
            >
              <span className="sb-ci">🪔</span>
              <span className="sb-ct">Book Verified Panditji</span>
              <span className="sb-cs">City-precise Vedic Pujans at home</span>
            </a>

            {/* SCRIPTURE NOTE */}
            <div className="sbn">
              <div className="sbn-h">SCRIPTURE VERIFIED</div>
              <div className="sbn-t">
                Sourced directly from <b>Bhavishya Purana</b> and <b>Mahabharata</b>. Cross-checked for regional variations across North &amp; South traditions.
              </div>
              <span className="sbn-c" style={{ cursor: 'pointer' }} onClick={() => showToast('Editorial Method: 100% fear-free, scripturally grounded.')}>
                Our Editorial Method →
              </span>
            </div>

            {/* COMPLETE KIT CARD */}
            <div className="sbcomp">
              <div className="sbcomp-h">
                <span className="sbcomp-l">FEATURED RITUAL KIT</span>
              </div>
              <div className="sbcomp-t">
                Complete authentic samagri kit for Vedic pujans with pure cow ghee, organic kumkum &amp; sacred threads.
              </div>
              <a
                href="https://tapa.co/kits/navratri"
                target="_blank"
                rel="noopener noreferrer"
                className="sbcomp-b"
              >
                Explore Ritual Kits →
              </a>
            </div>

            {/* KEY QUOTE */}
            <div className="sbq">
              <div className="sbq-t">"Dharma does not demand fear. It demands devotion."</div>
              <div className="sbq-s">Every rule in scripture has a spiritual purpose — understanding the purpose removes anxiety.</div>
            </div>
          </aside>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="toast">
          <span>✓</span> {toastMessage}
        </div>
      )}
    </div>
  );
}
