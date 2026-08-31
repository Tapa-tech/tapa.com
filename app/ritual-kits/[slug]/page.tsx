'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import '../ritual-kits.css';

interface PageProps {
  params: {
    slug: string;
  };
}

interface KitData {
  slug: string;
  name: string;
  devName: string;
  categoryTag: string;
  price: number;
  statusText: string;
  description: string;
  themeClass: string;
  itemsCount: number;
  items: { num: number; name: string }[];
  scriptureText: string;
  userProvides: string[];
  guideTitle: string;
  guideLink: string;
}

const KITS_DATABASE: Record<string, KitData> = {
  'ganesh-sthapana-kit': {
    slug: 'ganesh-sthapana-kit',
    name: 'Ganesh Sthapana Kit',
    devName: 'गणेश स्थापना सम्भार',
    categoryTag: 'LIMITED DATED KIT',
    price: 1650,
    statusText: 'ORDER BY 10 SEP · DISPATCHES 11 SEP',
    description:
      'A 21-item complete puja kit for Ganesh Sthapana on 14 September. Contains the shadu mati idol, chowki, kalash set, fresh durva, modak mould and the Gyan Patrika.',
    themeClass: 'h-ganesh',
    itemsCount: 21,
    items: [
      { num: 1, name: 'Shadu Mati Ganesh Idol (7-inch eco-friendly)' },
      { num: 2, name: 'Red Cloth for Chowki (Pure cotton)' },
      { num: 3, name: 'Copper Kalash Set (With coconut & mango leaves)' },
      { num: 4, name: 'Fresh Durva Grass (Sourced day of dispatch)' },
      { num: 5, name: 'Aluminum Modak Mould (Standard 21-cavity)' },
      { num: 6, name: 'Organic Akshata (Whole un-broken rice)' },
      { num: 7, name: 'Cow Ghee Diya Wicks (Pack of 21)' },
      { num: 8, name: 'Brass Hand Bell (Panchdhatu finish)' },
      { num: 9, name: 'Pure Camphor Cubes (Bhimseni quality)' },
      { num: 10, name: 'Ashtagandha Chandan (Pure paste)' },
      { num: 11, name: 'Roli & Haldi Powders (Natural)' },
      { num: 12, name: 'Dhoop Cones (Sambrani blend)' },
      { num: 13, name: 'Cotton Yajnopavita (Janeu thread)' },
      { num: 14, name: 'Attar Oil (Kewra scent)' },
      { num: 15, name: 'Supari & Cardamom (Puja offering)' },
      { num: 16, name: 'Panchamrit Bowl (Brass finish)' },
      { num: 17, name: 'Aarti Booklet (Hindi & Devanagari)' },
      { num: 18, name: 'Gyan Patrika (Scripture reference guide)' },
      { num: 19, name: 'Incense Stick Stand (Brass)' },
      { num: 20, name: 'Sacred Red Thread (Mauli roll)' },
      { num: 21, name: 'Storage Wooden Box (Eco-reusable)' }
    ],
    scriptureText:
      'The Mudgala Purana (Khanda 4, Adhyaya 12) specifies twenty-one distinct substances for the Sthapana of Ganesha. Every item in this box corresponds to a named verse in that chapter.',
    userProvides: [
      'Fresh flowers (Marigold or Hibiscus)',
      'Fresh fruits (Bananas or Pears)',
      'Clean water in a vessel',
      'Milk, curd, and honey for Panchamrit'
    ],
    guideTitle: 'Read the Ganesh Sthapana Guide ›',
    guideLink: '/ritual-guides/ganesh-chaturthi'
  },

  'shakti-kit': {
    slug: 'shakti-kit',
    name: 'Shakti Kit',
    devName: 'शक्ति स्थापना',
    categoryTag: 'NAVRAATRI DATED KIT',
    price: 1751,
    statusText: 'ORDER BY 8 OCT · DISPATCHES 9 OCT',
    description:
      'A complete 34-item kit for Sharad Navratri Ghatasthapana. Contains kalash set, barley and pot, chunri, akhand jyoti vessel, Durga Saptashati, puja powders and Kanya Pujan items.',
    themeClass: 'h-devi',
    itemsCount: 34,
    items: [
      { num: 1, name: 'Earthen Ghat (Pot for sowing barley)' },
      { num: 2, name: 'Clean Jau Seeds (Organically grown barley)' },
      { num: 3, name: 'Copper Kalash & Coconut' },
      { num: 4, name: 'Red Chunri with Golden Zari' },
      { num: 5, name: 'Brass Akhand Jyoti Deepak' },
      { num: 6, name: 'Durga Saptashati Book (Gita Press)' },
      { num: 7, name: 'Saptamrit powders & Roli' },
      { num: 8, name: 'Cow Ghee for 9-day Jyoti' },
      { num: 9, name: 'Kanya Pujan Gift Trays (Set of 9)' },
      { num: 10, name: 'Navgrah Samagri Pack' },
      { num: 11, name: 'Pure Bhimseni Camphor' },
      { num: 12, name: 'Mauli & Yajnopavita' }
    ],
    scriptureText:
      'Prescribed in the Devi Bhagavata Purana (Skandha 3, Adhyaya 26) for the nine-night observance and Ghatasthapana at the Pratahkala muhurat.',
    userProvides: [
      'Fresh red hibiscus or rose flowers',
      'Fresh fruits for daily bhog',
      'Pure milk and sweets for Prasad'
    ],
    guideTitle: 'Read the Ghatasthapana Guide ›',
    guideLink: '/ritual-guides'
  },

  'shubh-akshaya': {
    slug: 'shubh-akshaya',
    name: 'Shubh Akshaya',
    devName: 'शुभ अक्षय',
    categoryTag: 'DIWALI DATED KIT',
    price: 1251,
    statusText: 'ORDER BY 1 NOV · DISPATCHES 2 NOV',
    description:
      'The beginner’s Diwali kit. Lakshmi and Ganesha idols, clay diyas and wicks, kalash, puja powders, lotus seeds and a booklet explaining each item.',
    themeClass: 'h-gold',
    itemsCount: 18,
    items: [
      { num: 1, name: 'Terracotta Lakshmi & Ganesha Idols' },
      { num: 2, name: 'Handcrafted Clay Diyas (Pack of 11)' },
      { num: 3, name: 'Lotus Seed Rosary (Kamal Gatta)' },
      { num: 4, name: 'Kuber Yantra & Silver Coin' },
      { num: 5, name: 'Pure Cotton Long Wicks' },
      { num: 6, name: 'Puja Booklet with Lakshmi Aarti' }
    ],
    scriptureText:
      'Rooted in the Skandha Purana rules for Kartik Amavasya Mahalakshmi Pujan.',
    userProvides: ['Fresh lotus or marigold flowers', 'Kheel and Batasha sweets'],
    guideTitle: 'Read the Diwali Pujan Guide ›',
    guideLink: '/ritual-guides'
  },

  'rudrabhishek-kit': {
    slug: 'rudrabhishek-kit',
    name: 'Rudrabhishek Kit',
    devName: 'रुद्राभिषेक सम्भार',
    categoryTag: 'ALL-YEAR RITUAL KIT',
    price: 1451,
    statusText: 'IN STOCK · DISPATCHES IN 24 HOURS',
    description:
      'Complete samagri for Rudrabhishek at home. Gangajal, panchamrit items, dried bilva patra, white chandan, janeyu and the recitation vidhi card.',
    themeClass: 'h-shiva',
    itemsCount: 14,
    items: [
      { num: 1, name: 'Original Gangajal (500ml sealed bottle)' },
      { num: 2, name: 'Dried Bilva Patra (Pack of 108 leaves)' },
      { num: 3, name: 'White Sandalwood Paste (Malayagiri)' },
      { num: 4, name: 'Bhasma (Sacred Ash from Kashi)' },
      { num: 5, name: 'Brass Panchpatra & Pali' },
      { num: 6, name: 'Rudra Sukta Vidhi Booklet' }
    ],
    scriptureText:
      'Derived from the Shiva Purana (Vidyeshvara Samhita) instructions for Shivalinga Abhishekam.',
    userProvides: ['Fresh milk, curd, honey & ghee', 'Fresh bilva leaves if available'],
    guideTitle: 'Read the Rudrabhishek Guide ›',
    guideLink: '/ritual-guides'
  },

  'satyanarayan-kit': {
    slug: 'satyanarayan-kit',
    name: 'Satyanarayan Kit',
    devName: 'सत्यनारायण पूजा',
    categoryTag: 'ALL-YEAR RITUAL KIT',
    price: 1951,
    statusText: 'IN STOCK · DISPATCHES IN 24 HOURS',
    description:
      'Everything required for the Satyanarayan Katha. Panchamrit, panchmeva, supari, banana leaves, chowki cloth and the five-chapter katha booklet.',
    themeClass: 'h-vishnu',
    itemsCount: 16,
    items: [
      { num: 1, name: 'Gita Press Satyanarayan Katha Book' },
      { num: 2, name: 'Yellow Silk Cloth for Altar' },
      { num: 3, name: 'Panchmeva Pack (Almonds, raisins, cashews)' },
      { num: 4, name: 'Tulsi Leaves & Tulsi Mala' },
      { num: 5, name: 'Brass Diya & Kapoor Burner' },
      { num: 6, name: 'Panjiri Recipe & Prasad Container' }
    ],
    scriptureText:
      'Based on the Reva Khanda of the Skanda Purana containing the five-chapter Satyanarayan Vrat Katha.',
    userProvides: ['Fresh bananas and banana leaves', 'Wheat flour and sugar for Panjiri'],
    guideTitle: 'Read the Satyanarayan Guide ›',
    guideLink: '/ritual-guides'
  },

  'vahan-pujan-kit': {
    slug: 'vahan-pujan-kit',
    name: 'Vahan Pujan Kit',
    devName: 'वाहन पूजन',
    categoryTag: 'SINGLE ITEM SKU',
    price: 651,
    statusText: 'IN STOCK · DISPATCHES IN 24 HOURS',
    description:
      'Single complete vehicle blessing samagri pack containing lemons, chillies, mauli, kumkum stencil, diya, coconut and vidhi card.',
    themeClass: 'h-sanskar',
    itemsCount: 1,
    items: [
      { num: 1, name: 'Vahan Pujan Complete Blessing Pack (Lemon, Chilli, Mauli, Kumkum, Diya, Coconut & Vidhi Card)' }
    ],
    scriptureText:
      'Traditional raksha sutra and mangal vidhi for safe journeys.',
    userProvides: ['New vehicle keys', 'Sweets for distribution'],
    guideTitle: 'Read the Vahan Pujan Guide ›',
    guideLink: '/ritual-guides'
  },

  'shubh-ekadash': {
    slug: 'shubh-ekadash',
    name: 'Shubh Ekadash Diya',
    devName: 'शुभ एकादश',
    categoryTag: 'SINGLE ITEM SKU',
    price: 850,
    statusText: 'IN STOCK · DISPATCHES IN 24 HOURS',
    description:
      'Handcrafted solid brass Panchdhatu Ekadashi diya with engraved lotus motifs for daily temple lighting.',
    themeClass: 'h-gold',
    itemsCount: 1,
    items: [
      { num: 1, name: 'Handcrafted Panchdhatu Brass Diya (Single Item)' }
    ],
    scriptureText:
      'Rooted in classical Puranic Agni Purana guidelines for sacred lamp lighting.',
    userProvides: ['Pure cow ghee or sesame oil', 'Cotton wicks'],
    guideTitle: 'Read the Deepa Daan Guide ›',
    guideLink: '/ritual-guides'
  }
};

export default function RitualKitDetailPage({ params }: PageProps) {
  const { slug } = params;
  const { addItem } = useCart();
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [addedStatus, setAddedStatus] = useState<string | null>(null);

  // Lookup kit data or fallback to default template
  const kit: KitData = KITS_DATABASE[slug] || {
    slug: slug,
    name: slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    devName: 'पूजा सम्भार',
    categoryTag: 'AUTHENTIC RITUAL KIT',
    price: 1450,
    statusText: 'IN STOCK · DISPATCHES IN 24 HOURS',
    description:
      'Scripture-verified, authentic puja kit containing sacred samagri, utensils, and a step-by-step vidhi booklet.',
    themeClass: 'h-ganesh',
    itemsCount: 15,
    items: [
      { num: 1, name: 'Sacred Utensils & Kalash Set' },
      { num: 2, name: 'Pure Puja Powders (Kumkum, Roli, Chandan)' },
      { num: 3, name: 'Organic Akshata & Whole Grains' },
      { num: 4, name: 'Cotton Wicks & Pure Cow Ghee' },
      { num: 5, name: 'Bhimseni Camphor & Dhoop Cones' },
      { num: 6, name: 'Mauli Thread & Yajnopavita' },
      { num: 7, name: 'Gyan Patrika Vidhi Booklet' }
    ],
    scriptureText:
      'Every item in this kit is sourced in accordance with classical dharmic scriptures.',
    userProvides: ['Fresh flowers', 'Fresh fruits for bhog'],
    guideTitle: 'Read the Ritual Guide ›',
    guideLink: '/ritual-guides'
  };

  const isMultiItem = kit.items.length > 1;

  const handleAddToCart = (actionType: 'prebook' | 'add') => {
    addItem({
      id: kit.slug,
      slug: kit.slug,
      name: kit.name,
      price: kit.price,
      cutoff: kit.statusText,
    });

    const statusMsg = actionType === 'prebook' ? '✓ Pre-booked' : '✓ Added to cart';
    setAddedStatus(statusMsg);
    setTimeout(() => {
      setAddedStatus(null);
    }, 2500);
  };

  const handlePincodeCheck = () => {
    if (!pincode || pincode.trim().length < 6) {
      setPincodeStatus('Please enter a valid 6-digit pincode.');
      return;
    }
    setPincodeStatus(`✓ Delivery available for ${pincode.trim()} (Standard: 2–4 days)`);
  };

  return (
    <div className="w-full">
      {/* BREADCRUMB */}
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <Link href="/ritual-kits">Ritual Kits</Link> ›{' '}
            <a>{kit.categoryTag}</a> › <b>{kit.name}</b>
          </div>
        </div>
      </div>

      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        {/* PDP HERO GRID */}
        <div className="pdp">
          {/* GALLERY COLUMN */}
          <div className="gal">
            <div className="gal-m">
              <div className={`gal-placeholder ${kit.themeClass}`}>
                <div className="dev-ph">{kit.devName}</div>
                <div className="en-ph">{kit.name}</div>
              </div>
            </div>
            <div className="gal-s">
              <div
                className={`gal-t ${selectedThumb === 0 ? 'on' : ''}`}
                onClick={() => setSelectedThumb(0)}
              >
                <div className="gal-t-ph">१</div>
              </div>
              <div
                className={`gal-t ${selectedThumb === 1 ? 'on' : ''}`}
                onClick={() => setSelectedThumb(1)}
              >
                <div className="gal-t-ph">२</div>
              </div>
              <div
                className={`gal-t ${selectedThumb === 2 ? 'on' : ''}`}
                onClick={() => setSelectedThumb(2)}
              >
                <div className="gal-t-ph">३</div>
              </div>
            </div>
          </div>

          {/* BUY COLUMN */}
          <div className="buy">
            <div className="b-cat">{kit.categoryTag}</div>
            <div className="b-dev">{kit.devName}</div>
            <h1 className="b-h1">{kit.name}</h1>
            <p className="b-desc">{kit.description}</p>

            <div className="b-price">
              <span className="b-p">₹{kit.price.toLocaleString('en-IN')}</span>
              <span className="b-tax">incl. delivery and taxes</span>
            </div>

            <div className="b-status">
              <span>◔</span> {kit.statusText}
            </div>

            <button
              type="button"
              className="b-cta"
              onClick={() => handleAddToCart('prebook')}
            >
              {addedStatus && addedStatus.includes('Pre-booked')
                ? addedStatus
                : `Pre-book now — ₹${kit.price.toLocaleString('en-IN')} ›`}
            </button>

            <button
              type="button"
              className="b-cta2"
              onClick={() => handleAddToCart('add')}
            >
              {addedStatus && addedStatus.includes('cart')
                ? addedStatus
                : 'Add to cart'}
            </button>

            {/* PINCODE CHECK */}
            <div className="pin">
              <input
                type="text"
                className="pin-i"
                placeholder="Enter pincode for delivery date"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
              />
              <button type="button" className="pin-b" onClick={handlePincodeCheck}>
                Check
              </button>
            </div>
            {pincodeStatus && (
              <p
                style={{
                  fontSize: '12px',
                  color: pincodeStatus.startsWith('✓') ? '#27500A' : '#FD066D',
                  marginTop: '6px'
                }}
              >
                {pincodeStatus}
              </p>
            )}

            <div className="b-terms">
              Prepaid order · Free cancellation until dispatch · Replaced if damaged in transit
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CONDITIONAL RENDERING BASED ON ITEM COUNT           */}
        {/* ---------------------------------------------------- */}

        {isMultiItem ? (
          /* ==================================================== */
          /* MULTI ITEM SKU LAYOUT (PDP_-_Multi_Item_SKU.html)     */
          /* ==================================================== */
          <div className="sec">
            <div className="tray">
              <div className="tray-top">
                <span className="tray-ey">EVERY ITEM ACCOUNTED FOR</span>
                <span className="tray-dev">{kit.devName}</span>
              </div>
              <div className="tray-b"></div>
              <div className="tray-sum">
                <span className="ts-n">{kit.itemsCount} ITEMS IN THIS KIT</span>
                <span className="ts-k">SCRIPTURE-SOURCED</span>
              </div>

              {/* CLIPPED LIST WHEN NOT EXPANDED */}
              <div className={`tray-l ${!isExpanded ? 'clipped' : ''}`}>
                {kit.items.map((item) => (
                  <div key={item.num} className="ti">
                    <span className="ti-n">{String(item.num).padStart(2, '0')}</span>
                    <span className="ti-t">{item.name}</span>
                    <span className="ti-c">✓</span>
                  </div>
                ))}
              </div>

              {/* EMBEDDED KNOWLEDGE BLOCK INSIDE TRAY */}
              <div className="tray-kb">
                <div className="kb-g">
                  {/* SCRIPTURE SOURCING */}
                  <div className="kb-c">
                    <div className="kb-ey">WHY THESE {kit.itemsCount} ITEMS?</div>
                    <div className="kb-t">Scripture sourcing</div>
                    <p className="kb-p">{kit.scriptureText}</p>
                    <div className="rcard">
                      <div className="rc-top">
                        <span className="rc-dev">धर्मः प्रमाणम्</span>
                        <span className="rc-lb">VERIFIED SOURCE</span>
                      </div>
                      <div className="rc-b"></div>
                      <div className="rc-in">
                        <div className="rc-st">
                          <span className="rc-n">१</span>
                          <span className="rc-tx">Named text citations included in Gyan Patrika</span>
                        </div>
                        <div className="rc-st">
                          <span className="rc-n">२</span>
                          <span className="rc-tx">No un-scriptural additions or substitutes</span>
                        </div>
                      </div>
                      <div className="rc-ft">
                        <span className="rc-fn">The Tapa Co. Editorial Method</span>
                        <span className="rc-fa">DHARMA · 4/5</span>
                      </div>
                    </div>
                  </div>

                  {/* WHAT YOU PROVIDE */}
                  <div className="kb-c">
                    <div className="kb-ey">WHAT IS NOT IN THIS KIT</div>
                    <div className="kb-t">Things you provide</div>
                    <p className="kb-p">
                      Perishable items that cannot be stored or shipped in advance are not included in the box. You will need to arrange these fresh:
                    </p>
                    <ul className="kb-l">
                      {kit.userProvides.map((item, idx) => (
                        <li key={idx}>
                          <b>{item}</b>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* EXPAND/COLLAPSE TOGGLE BAR */}
              <div className="tray-x">
                <span className="tray-xn">
                  {kit.itemsCount} items in this box · view full checklist and scripture sourcing below
                </span>
                <button
                  type="button"
                  className="tray-xb"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Collapse list ▲' : 'View full list & details ▾'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ==================================================== */
          /* SINGLE ITEM SKU LAYOUT (PDP_-_Single_Item_SKU.html)   */
          /* ==================================================== */
          <>
            {/* STANDALONE CONTENTS TRAY */}
            <div className="sec">
              <div className="tray">
                <div className="tray-top">
                  <span className="tray-ey">SINGLE ITEM SKU</span>
                  <span className="tray-dev">{kit.devName}</span>
                </div>
                <div className="tray-b"></div>
                <div className="tray-sum">
                  <span className="ts-n">1 ITEM IN THIS KIT</span>
                  <span className="ts-k">AUTHENTIC SPECIFICATION</span>
                </div>
                <div className="tray-l">
                  {kit.items.map((item) => (
                    <div key={item.num} className="ti">
                      <span className="ti-n">{String(item.num).padStart(2, '0')}</span>
                      <span className="ti-t">{item.name}</span>
                      <span className="ti-c">✓</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STANDALONE KNOWLEDGE BLOCK */}
            <div className="sec">
              <div className="kb">
                <div className="kb-g">
                  {/* SCRIPTURE SOURCING */}
                  <div className="kb-c">
                    <div className="kb-ey">AUTHENTICITY &amp; SOURCING</div>
                    <div className="kb-t">Scripture sourcing</div>
                    <p className="kb-p">{kit.scriptureText}</p>
                    <div className="rcard">
                      <div className="rc-top">
                        <span className="rc-dev">धर्मः प्रमाणम्</span>
                        <span className="rc-lb">VERIFIED SOURCE</span>
                      </div>
                      <div className="rc-b"></div>
                      <div className="rc-in">
                        <div className="rc-st">
                          <span className="rc-n">१</span>
                          <span className="rc-tx">Crafted to classical Puranic specifications</span>
                        </div>
                        <div className="rc-st">
                          <span className="rc-n">२</span>
                          <span className="rc-tx">No synthetic alloy or adulteration</span>
                        </div>
                      </div>
                      <div className="rc-ft">
                        <span className="rc-fn">The Tapa Co. Editorial Method</span>
                        <span className="rc-fa">DHARMA · 5/5</span>
                      </div>
                    </div>
                  </div>

                  {/* WHAT YOU PROVIDE */}
                  <div className="kb-c">
                    <div className="kb-ey">WHAT YOU PROVIDE</div>
                    <div className="kb-t">Usage recommendations</div>
                    <p className="kb-p">
                      Complementary items required for performing the ritual with this item:
                    </p>
                    <ul className="kb-l">
                      {kit.userProvides.map((item, idx) => (
                        <li key={idx}>
                          <b>{item}</b>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="kb-f">
                  <span className="kb-fn">
                    Scripture verified · Sourced according to classical dharmic texts
                  </span>
                  <Link href={kit.guideLink} className="kb-b">
                    {kit.guideTitle}
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* RELATED KITS GRID */}
        <div className="sec">
          <div className="sec-h">
            <div>
              <div className="sec-ey">RECOMMENDED</div>
              <div className="sec-t">More Ritual Kits</div>
            </div>
            <Link href="/ritual-kits" className="sec-a">
              View all kits ›
            </Link>
          </div>
          <div className="xg">
            <Link href="/ritual-kits/shakti-kit" className="xc">
              <div className="xc-i h-devi">
                <span className="xc-ph">शक्ति</span>
              </div>
              <div className="xc-bd">
                <div className="xc-t">Shakti Kit</div>
                <p className="xc-s">34-item kit for Sharad Navratri Ghatasthapana and 9-night puja.</p>
                <span className="xc-p">₹1,751</span>
              </div>
            </Link>

            <Link href="/ritual-kits/shubh-akshaya" className="xc">
              <div className="xc-i h-gold">
                <span className="xc-ph">अक्षय</span>
              </div>
              <div className="xc-bd">
                <div className="xc-t">Shubh Akshaya</div>
                <p className="xc-s">The beginner’s Diwali kit with Lakshmi Ganesha idols.</p>
                <span className="xc-p">₹1,251</span>
              </div>
            </Link>

            <Link href="/ritual-kits/rudrabhishek-kit" className="xc">
              <div className="xc-i h-shiva">
                <span className="xc-ph">शिव</span>
              </div>
              <div className="xc-bd">
                <div className="xc-t">Rudrabhishek Kit</div>
                <p className="xc-s">Gangajal, dried bilva, bhasma and Rudra Sukta katha.</p>
                <span className="xc-p">₹1,451</span>
              </div>
            </Link>

            <Link href="/ritual-kits/vahan-pujan-kit" className="xc">
              <div className="xc-i h-sanskar">
                <span className="xc-ph">वाहन</span>
              </div>
              <div className="xc-bd">
                <div className="xc-t">Vahan Pujan Kit</div>
                <p className="xc-s">Single item complete blessing samagri pack.</p>
                <span className="xc-p">₹651</span>
              </div>
            </Link>
          </div>
        </div>

        {/* RELATED GUIDES */}
        <div className="sec mb-12">
          <div className="sec-h">
            <div>
              <div className="sec-ey">PUJA KNOWLEDGE</div>
              <div className="sec-t">Read before you puja</div>
            </div>
            <Link href="/ritual-guides" className="sec-a">
              All guides ›
            </Link>
          </div>
          <div className="rgd">
            <Link href="/ritual-guides/ganesh-chaturthi" className="rgc">
              <div className="rgc-i h-ganesh">
                <span>गणेश पूजा</span>
              </div>
              <div className="rgc-bd">
                <div className="rgc-k">FESTIVE PUJAN</div>
                <div className="rgc-t">Ganesh Chaturthi Guide</div>
                <p className="rgc-s">Step-by-step Sthapana vidhi, 21 durva rule, and Madhyahna muhurat timing.</p>
                <div className="rgc-f">
                  <span className="pill d">DHARMA · 4/5</span>
                </div>
              </div>
            </Link>

            <Link href="/ritual-guides" className="rgc">
              <div className="rgc-i h-gold">
                <span>चौकी विन्यास</span>
              </div>
              <div className="rgc-bd">
                <div className="rgc-k">BEGINNER’S GUIDE</div>
                <div className="rgc-t">How to setup a Puja Chowki</div>
                <p className="rgc-s">Altar direction, cloth colors, idol placement and kalash position.</p>
                <div className="rgc-f">
                  <span className="pill d">DHARMA · 5/5</span>
                </div>
              </div>
            </Link>

            <Link href="/ritual-guides" className="rgc">
              <div className="rgc-i h-earth">
                <span>मोदक भोग</span>
              </div>
              <div className="rgc-bd">
                <div className="rgc-k">BHOG VIDHI</div>
                <div className="rgc-t">Modak Preparation &amp; Offering</div>
                <p className="rgc-s">Why 21 modaks are offered and the verse from Ganesha Purana.</p>
                <div className="rgc-f">
                  <span className="pill d">DHARMA · 4/5</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
