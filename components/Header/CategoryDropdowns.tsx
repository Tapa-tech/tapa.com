import React from 'react';
import Link from 'next/link';
import { HEADER_DROPDOWNS } from '@/lib/mock-data';

interface CategoryDropdownsProps {
  dropdownKey: string | null;
  onMouseLeaveNav: () => void;
}

export const CategoryDropdowns: React.FC<CategoryDropdownsProps> = ({
  dropdownKey,
  onMouseLeaveNav,
}) => {
  if (!dropdownKey || !(dropdownKey in HEADER_DROPDOWNS)) {
    return null;
  }

  const data = HEADER_DROPDOWNS[dropdownKey as keyof typeof HEADER_DROPDOWNS];

  return (
    <div className="dd open" onMouseLeave={onMouseLeaveNav}>
      {dropdownKey === 'rg' && (
        <>
          <div className="dd-in">
            <div>
              <div className="col-h">START HERE</div>
              <Link className="dl lead" href="/ritual-guides">
                <b>Beginner's Guides</b>
                <small>No tags, no citations, no Sanskrit to look up</small>
              </Link>
              <Link className="dl" href="/ritual-guides/what-is-a-vrat"><b>What Is a Vrat</b></Link>
              <Link className="dl" href="/ritual-guides/first-puja"><b>Your First Puja at Home</b></Link>
              <Link className="dl" href="/ritual-guides/seven-kandas"><b>The Seven Kandas</b></Link>
            </div>
            <div>
              <div className="col-h">BY OCCASION</div>
              <Link className="dl" href="/ritual-guides">
                <b>Festive Pujans</b>
                <small>Fixed to a tithi — 18 guides</small>
              </Link>
              <Link className="dl" href="/ritual-guides">
                <b>All-Year Pujans</b>
                <small>Recurring observances — 9 guides</small>
              </Link>
              <Link className="dl" href="/ritual-guides" style={{ color: 'var(--pink)', fontWeight: 700 }}>
                All Ritual Guides ›
              </Link>
            </div>
            <div>
              <div className="col-h">COMING UP</div>
              <Link className="dl" href="/ritual-guides/hartalika-teej">
                <b><span className="dot" style={{ background: '#3E8B4A' }}></span>Hartalika Teej</b>
                <small>13 September<span className="when">IN 6 DAYS</span></small>
              </Link>
              <Link className="dl" href="/ritual-guides/ganesh-chaturthi">
                <b><span className="dot" style={{ background: '#B5651D' }}></span>Ganesh Chaturthi</b>
                <small>14 September<span className="when">IN 7 DAYS</span></small>
              </Link>
              <Link className="dl" href="/ritual-guides/sharad-navratri">
                <b><span className="dot" style={{ background: '#A83358' }}></span>Sharad Navratri</b>
                <small>11 October</small>
              </Link>
            </div>
            <div className="feat">
              <div className="feat-l">{data.featured.label}</div>
              <div className="feat-t">{data.featured.title}</div>
              <p className="feat-s">{data.featured.description}</p>
              <Link className="feat-b" href="/editorial-method" style={{ textAlign: 'center', display: 'block' }}>
                {data.featured.cta}
              </Link>
            </div>
          </div>
          <div className="dd-foot">
            <span><b>34</b> guides live · <b>21</b> more by December</span>
            <Link href="/ritual-guides">Browse all ›</Link>
          </div>
        </>
      )}

      {dropdownKey === 'pa' && (
        <>
          <div className="dd-in">
            <div>
              <div className="col-h">RIGHT NOW</div>
              <div className="live-now">
                <span className="ln-d"></span>
                <span>
                  <span className="ln-t">TODAY · DELHI-NCR</span>
                  <span className="ln-v">Bhadrapada Krishna Ekadashi</span>
                </span>
              </div>
              <Link className="dl" href="/panchang">
                <b>Today's Panchang</b>
                <small>Tithi, nakshatra, sunrise, Rahu Kaal</small>
              </Link>
              <Link className="dl" href="/panchang" style={{ color: 'var(--pink)', fontWeight: 700 }}>Change city ›</Link>
            </div>
            <div>
              <div className="col-h">CALENDARS</div>
              <Link className="dl" href="/panchang/vrat-calendar"><b>Vrat Calendar</b><small>142 dates this year</small></Link>
              <Link className="dl" href="/panchang/festival-calendar"><b>Festival Calendar</b><small>Month by month</small></Link>
              <Link className="dl" href="/panchang/eclipses"><b>Eclipses</b><small>Visibility decides everything</small></Link>
            </div>
            <div>
              <div className="col-h">UNDERSTAND IT</div>
              <Link className="dl" href="/panchang"><b>How to Read a Panchang</b><small>Five limbs, explained once</small></Link>
              <Link className="dl" href="/panchang"><b>Why dates differ by city</b></Link>
              <Link className="dl" href="/panchang"><b>Purnimanta vs Amanta</b></Link>
            </div>
            <div className="feat data">
              <div className="feat-l">{data.featured.label}</div>
              <div className="feat-t">{data.featured.title}</div>
              <p className="feat-s">{data.featured.description}</p>
              <button className="feat-b">{data.featured.cta}</button>
            </div>
          </div>
          <div className="dd-foot">
            <span>Computed for <b>New Delhi</b> · Purnimanta · verified manually</span>
            <Link href="/panchang">All Panchang ›</Link>
          </div>
        </>
      )}

      {dropdownKey === 'dc' && (
        <>
          <div className="dd-in">
            <div>
              <div className="col-h">START HERE</div>
              <Link className="dl lead" href="/dharmic-concepts/">
                <b>Why is bilva dear to Mahadev?</b>
                <small>The leaf, the story, the offering rules</small>
              </Link>
              <Link className="dl" href="/dharmic-concepts/bilva">
                <b>Three Stories, One Thread</b>
                <small>Wife, friend, devotee — not siblings</small>
              </Link>
            </div>
            <div>
              <div className="col-h">BY TYPE</div>
              <Link className="dl" href="/dharmic-concepts"><b>Materials</b><small>Objects and what they mean</small></Link>
              <Link className="dl" href="/dharmic-concepts"><b>Meanings &amp; Practices</b><small>Acts and ideas behind the ritual</small></Link>
              <Link className="dl" href="/dharmic-concepts" style={{ color: 'var(--pink)', fontWeight: 700 }}>All Concepts ›</Link>
            </div>
            <div>
              <div className="col-h">IN THE SERIES</div>
              <Link className="dl" href="/dharmic-concepts/bilva"><b>Bilva<span className="pill live">LIVE</span></b></Link>
              <Link className="dl" href="/dharmic-concepts/tulsi"><b>Tulsi<span className="pill soon">SOON</span></b></Link>
              <Link className="dl" href="/dharmic-concepts/durva"><b>Durva<span className="pill soon">SOON</span></b></Link>
            </div>
            <div className="feat amber">
              <div className="feat-l">{data.featured.label}</div>
              <div className="feat-t">{data.featured.title}</div>
              <p className="feat-s">{data.featured.description}</p>
              <Link className="feat-b" href="/glossary" style={{ textAlign: 'center', display: 'block' }}>
                {data.featured.cta}
              </Link>
            </div>
          </div>
          <div className="dd-foot">
            <span>Paragraph only. No tables. Every concept sourced to a named text.</span>
            <Link href="/editorial-method">Our editorial method ›</Link>
          </div>
        </>
      )}

      {dropdownKey === 'rk' && (
        <>
          <div className="dd-in">
            <div>
              <div className="col-h">SHOP BY</div>
              <Link className="dl" href="/ritual-kits"><b>By festival</b><small>Dated kits, with a cut-off</small></Link>
              <Link className="dl" href="/ritual-kits"><b>By deity</b><small>All-year kits</small></Link>
              <Link className="dl" href="/ritual-kits"><b>Gyan Patrikas</b><small>Knowledge booklets</small></Link>
            </div>
            <div>
              <div className="col-h">OPEN FOR PRE-BOOKING</div>
              <Link className="dl" href="/ritual-kits"><b>Ganesh Sthapana Kit</b><small>₹1,650 <span className="when">ORDER BY 10 SEP</span></small></Link>
              <Link className="dl" href="/ritual-kits"><b>Hartalika Teej Kit</b><small>₹950 <span className="when">ORDER BY 9 SEP</span></small></Link>
              <Link className="dl" href="/ritual-kits"><b>Shakti Kit</b><small>₹1,751 · Navratri</small></Link>
            </div>
            <div>
              <div className="col-h">BEFORE YOU BUY</div>
              <Link className="dl" href="/ritual-kits"><b>What is in a kit</b></Link>
              <Link className="dl" href="/ritual-kits"><b>Delivery and cut-offs</b></Link>
              <Link className="dl" href="/ritual-kits"><b>Cancellations and refunds</b></Link>
            </div>
            <div className="feat amber">
              <div className="feat-l">{data.featured.label}</div>
              <div className="feat-t">{data.featured.title}</div>
              <p className="feat-s">{data.featured.description}</p>
              <Link className="feat-b" href="/ritual-guides" style={{ textAlign: 'center', display: 'block' }}>
                {data.featured.cta}
              </Link>
            </div>
          </div>
          <div className="dd-foot">
            <span>Dated kits are prepaid, no COD · free cancellation until dispatch</span>
            <Link href="/ritual-kits">All kits ›</Link>
          </div>
        </>
      )}
    </div>
  );
};
