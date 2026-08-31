'use client';

import { useState } from 'react';
import Link from 'next/link';
import './ritual-kits.css';

export default function RitualKitsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('All kits');

  const filters = ['All kits', 'Pre-book', 'In stock', 'Under ₹1,000', '₹1,000–2,000'];

  return (
    <div className="w-full">
      {/* BREADCRUMB */}
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <b>Ritual Kits</b>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="chero rk">
        <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="chero-in">
            <div>
              <p className="ch-ey">RITUAL KITS · PRE-BOOKING OPEN</p>
              <h1 className="ch-h1">Everything the vidhi asks for, in one box</h1>
              <p className="ch-p">
                Sourced, packed and delivered before the date. Nothing you could not buy yourself — we have just done the finding. Every samagri list stays free on the guide.
              </p>
              <div className="ch-meta">
                <span className="ch-m"><b>14</b> kits</span>
                <span className="ch-m"><b>4</b> sub-categories</span>
                <span className="ch-m"><b>Free</b> cancellation until dispatch</span>
              </div>
            </div>
            <div className="ch-side">
              <div className="chs-l">◷ WORTH SAYING PLAINLY</div>
              <div className="chs-t">You do not need a kit</div>
              <p className="chs-d">
                Every samagri list is free and complete. A kit saves you a morning in the market. It does not make the puja more valid.
              </p>
              <Link href="/ritual-guides" className="chs-c">
                Read a guide instead ›
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="filters">
        <div className="f-in">
          <span className="f-l">FILTER</span>
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`fc ${activeFilter === filter ? 'on' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
          <span className="f-sort">Sort — <b>Cut-off — soonest first</b> ▾</span>
        </div>
      </div>

      {/* MAIN LISTING SECTIONS */}
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="pagepad">

          {/* SUB-CATEGORY 1: BY FESTIVAL */}
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">DATED · CUT-OFF APPLIES</div>
                <div className="sec-t">By festival</div>
                <p className="sec-s">Prepaid, no COD. The cut-off is real — perishable samagri is packed to order and cannot be resold.</p>
              </div>
              <Link href="/ritual-kits/all" className="sec-a">
                <span>9 kits</span>View all ›
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/ritual-kits/ganesh-sthapana-kit" className="c">
                <div className="c-top h-ganesh">
                  <span className="c-when now">ORDER BY 10 SEP</span>
                </div>
                <div className="c-b">
                  <div className="c-t">Ganesh Sthapana Kit</div>
                  <div className="c-d">₹1,650 · incl. delivery</div>
                  <p className="c-s">Shadu mati idol, chowki cloth, kalash set, durva, modak mould, akshata, dhoop. 21-item samagri box with Gyan Patrika.</p>
                  <div className="c-f">
                    <span className="pill pr">PRE-BOOK</span>
                  </div>
                </div>
              </Link>
              <Link href="/ritual-kits/shakti-kit" className="c">
                <div className="c-top h-devi">
                  <span className="c-when">ORDER BY 8 OCT</span>
                </div>
                <div className="c-b">
                  <div className="c-t">Shakti Kit</div>
                  <div className="c-d">₹1,751 · Navratri</div>
                  <p className="c-s">Kalash set, barley and pot, chunri, akhand jyoti vessel, Saptashati, puja powders and the Kanya Pujan items.</p>
                  <div className="c-f">
                    <span className="pill pr">PRE-BOOK</span>
                  </div>
                </div>
              </Link>
              <Link href="/ritual-kits/shubh-akshaya" className="c">
                <div className="c-top h-gold">
                  <span className="c-when">ORDER BY 1 NOV</span>
                </div>
                <div className="c-b">
                  <div className="c-t">Shubh Akshaya</div>
                  <div className="c-d">₹1,251 · Diwali</div>
                  <p className="c-s">The beginner’s kit. Lakshmi and Ganesha idols, diyas and wicks, kalash, puja powders and a booklet explaining each item.</p>
                  <div className="c-f">
                    <span className="pill pr">PRE-BOOK</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* SUB-CATEGORY 2: BY RITUAL */}
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">ALL YEAR · COD AVAILABLE</div>
                <div className="sec-t">By ritual</div>
                <p className="sec-s">Not tied to a date. Order when the household needs it.</p>
              </div>
              <Link href="/ritual-kits/all" className="sec-a">
                <span>7 kits</span>View all ›
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/ritual-kits/rudrabhishek-kit" className="c">
                <div className="c-top h-shiva"></div>
                <div className="c-b">
                  <div className="c-t">Rudrabhishek Kit</div>
                  <div className="c-d">₹1,451</div>
                  <p className="c-s">Gangajal, panchamrit items, dried bilva patra, white chandan and the vidhi card.</p>
                  <div className="c-f">
                    <span className="pill n">IN STOCK</span>
                  </div>
                </div>
              </Link>
              <Link href="/ritual-kits/satyanarayan-kit" className="c">
                <div className="c-top h-vishnu"></div>
                <div className="c-b">
                  <div className="c-t">Satyanarayan Kit</div>
                  <div className="c-d">₹1,951</div>
                  <p className="c-s">Panchamrit, panchmeva, supari, banana leaves and the five-chapter katha booklet.</p>
                  <div className="c-f">
                    <span className="pill n">IN STOCK</span>
                  </div>
                </div>
              </Link>
              <Link href="/ritual-kits/sundarkand-kit" className="c">
                <div className="c-top h-earth"></div>
                <div className="c-b">
                  <div className="c-t">Sundarkand Kit</div>
                  <div className="c-d">₹2,151</div>
                  <p className="c-s">Gita Press edition, asan, deepak and wicks, chandan, akshat and the recitation card.</p>
                  <div className="c-f">
                    <span className="pill n">IN STOCK</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* SUB-CATEGORY 3: GRIHA & LIFE EVENTS */}
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">ONCE IN A LIFE</div>
                <div className="sec-t">Griha &amp; Life Events</div>
                <p className="sec-s">Higher-value kits for a house, a vehicle, a shop or a sanskar. Purohit booking available alongside from November.</p>
              </div>
              <Link href="/ritual-kits/all" className="sec-a">
                <span>10 kits</span>View all ›
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/ritual-kits/griha-pravesh-kit" className="c">
                <div className="c-top h-sanskar"></div>
                <div className="c-b">
                  <div className="c-t">Griha Pravesh Kit</div>
                  <div className="c-d">₹3,451</div>
                  <p className="c-s">Kalash, navgrah samagri, havan samagri, mauli and the full vidhi booklet.</p>
                  <div className="c-f">
                    <span className="pill n">IN STOCK</span>
                  </div>
                </div>
              </Link>
              <Link href="/ritual-kits/vahan-pujan-kit" className="c">
                <div className="c-top h-sanskar"></div>
                <div className="c-b">
                  <div className="c-t">Vahan Pujan Kit</div>
                  <div className="c-d">₹651</div>
                  <p className="c-s">Lemon, chilli, mauli, kumkum, diya and the vidhi card. The smallest kit we make.</p>
                  <div className="c-f">
                    <span className="pill n">IN STOCK</span>
                  </div>
                </div>
              </Link>
              <Link href="/ritual-kits/shraddha-samagri-kit" className="c">
                <div className="c-top h-sanskar"></div>
                <div className="c-b">
                  <div className="c-t">Shraddha Samagri Kit</div>
                  <div className="c-d">₹1,851</div>
                  <p className="c-s">Til, jau, ghee, kush and pind ingredients, with the tarpan vidhi card.</p>
                  <div className="c-f">
                    <span className="pill n">IN STOCK</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* SUB-CATEGORY 4: DAILY PUJA ESSENTIALS */}
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">THE THINGS THAT RUN OUT</div>
                <div className="sec-t">Daily Puja Essentials</div>
                <p className="sec-s">Consumables and temple essentials. Buy once, reorder when you need to — or set a monthly box from next year.</p>
              </div>
              <Link href="/ritual-kits/all" className="sec-a">
                <span>2 groups</span>View all ›
              </Link>
            </div>
            <div className="rows">
              <div className="row">
                <span className="row-n">
                  <span className="row-t">Consumables</span>
                  <span className="row-s">Dhoop · agarbatti · camphor · kumkum · akshat · chandan · pure ghee · cotton wicks</span>
                </span>
                <span className="row-a">›</span>
              </div>
              <div className="row">
                <span className="row-n">
                  <span className="row-t">Temple essentials</span>
                  <span className="row-s">Diyas in brass and clay · bell · copper kalash · panchpatra · asana · rudraksha, tulsi and sphatik mala</span>
                </span>
                <span className="row-a">›</span>
              </div>
              <div className="row">
                <span className="row-n">
                  <span className="row-t">Monthly Essentials Box — from 2027</span>
                  <span className="row-s">Curated replenishment, delivered monthly. Not open yet.</span>
                </span>
                <span className="row-a">›</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* METHOD BAND */}
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 mb-12">
        <div className="methodband">
          <div>
            <div className="mb-ey">HOW WE DECIDE WHAT IS TRUE</div>
            <div className="mb-t">Every badge on this page means something specific</div>
            <p className="mb-p">
              Dharma, Pratha or Bhranti — with a confidence score you can check. If we cannot name the text a reader could open, we do not make the claim.
            </p>
            <Link href="/editorial-method" className="mb-c">
              Read our editorial method ›
            </Link>
          </div>
          <div className="mb-r">
            <div className="mbr d"><div className="mbr-k">DHARMA</div><div className="mbr-v">Named in a text you could open yourself.</div></div>
            <div className="mbr p"><div className="mbr-k">PRATHA</div><div className="mbr-v">Regional or family custom. Real — not scripture.</div></div>
            <div className="mbr b"><div className="mbr-k">BHRANTI</div><div className="mbr-v">A misconception. Corrected in every guide it appears in.</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
