'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../ritual-kits.css';

interface KitItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  priceSub: string;
  description: string;
  tag: string;
  isPreBook: boolean;
  orderDeadline?: string;
  themeClass: string;
  category: 'By festival' | 'By ritual' | 'Griha & Life Events' | 'Daily Puja Essentials';
}

const ALL_KITS: KitItem[] = [
  {
    id: '1',
    slug: 'ganesh-sthapana-kit',
    name: 'Ganesh Sthapana Kit',
    price: 1650,
    priceSub: '₹1,650 · incl. delivery',
    description: 'Shadu mati idol, chowki cloth, kalash set, durva, modak mould, akshata, dhoop. 21-item samagri box with Gyan Patrika.',
    tag: 'PRE-BOOK',
    isPreBook: true,
    orderDeadline: 'ORDER BY 10 SEP',
    themeClass: 'h-ganesh',
    category: 'By festival'
  },
  {
    id: '2',
    slug: 'shakti-kit',
    name: 'Shakti Kit',
    price: 1751,
    priceSub: '₹1,751 · Navratri',
    description: 'Kalash set, barley and pot, chunri, akhand jyoti vessel, Saptashati, puja powders and the Kanya Pujan items.',
    tag: 'PRE-BOOK',
    isPreBook: true,
    orderDeadline: 'ORDER BY 8 OCT',
    themeClass: 'h-devi',
    category: 'By festival'
  },
  {
    id: '3',
    slug: 'shubh-akshaya',
    name: 'Shubh Akshaya',
    price: 1251,
    priceSub: '₹1,251 · Diwali',
    description: 'The beginner’s kit. Lakshmi and Ganesha idols, diyas and wicks, kalash, puja powders and a booklet explaining each item.',
    tag: 'PRE-BOOK',
    isPreBook: true,
    orderDeadline: 'ORDER BY 1 NOV',
    themeClass: 'h-gold',
    category: 'By festival'
  },
  {
    id: '4',
    slug: 'rudrabhishek-kit',
    name: 'Rudrabhishek Kit',
    price: 1451,
    priceSub: '₹1,451',
    description: 'Gangajal, panchamrit items, dried bilva patra, white chandan, janeyu and the vidhi card.',
    tag: 'IN STOCK',
    isPreBook: false,
    themeClass: 'h-shiva',
    category: 'By ritual'
  },
  {
    id: '5',
    slug: 'satyanarayan-kit',
    name: 'Satyanarayan Kit',
    price: 1951,
    priceSub: '₹1,951',
    description: 'Panchamrit, panchmeva, supari, banana leaves, chowki cloth and the five-chapter katha booklet.',
    tag: 'IN STOCK',
    isPreBook: false,
    themeClass: 'h-vishnu',
    category: 'By ritual'
  },
  {
    id: '6',
    slug: 'sundarkand-kit',
    name: 'Sundarkand Kit',
    price: 2151,
    priceSub: '₹2,151',
    description: 'Gita Press edition, asan, deepak and wicks, chandan, akshat and the recitation card.',
    tag: 'IN STOCK',
    isPreBook: false,
    themeClass: 'h-earth',
    category: 'By ritual'
  },
  {
    id: '7',
    slug: 'griha-pravesh-kit',
    name: 'Griha Pravesh Kit',
    price: 3451,
    priceSub: '₹3,451',
    description: 'Kalash, navgrah samagri, havan samagri, mauli and the full vidhi booklet.',
    tag: 'IN STOCK',
    isPreBook: false,
    themeClass: 'h-sanskar',
    category: 'Griha & Life Events'
  },
  {
    id: '8',
    slug: 'vahan-pujan-kit',
    name: 'Vahan Pujan Kit',
    price: 651,
    priceSub: '₹651',
    description: 'Lemon, chilli, mauli, kumkum, diya and the vidhi card. The smallest kit we make.',
    tag: 'IN STOCK',
    isPreBook: false,
    themeClass: 'h-sanskar',
    category: 'Griha & Life Events'
  },
  {
    id: '9',
    slug: 'shraddha-samagri-kit',
    name: 'Shraddha Samagri Kit',
    price: 1851,
    priceSub: '₹1,851',
    description: 'Til, jau, ghee, kush and pind ingredients, with the tarpan vidhi card.',
    tag: 'IN STOCK',
    isPreBook: false,
    themeClass: 'h-sanskar',
    category: 'Griha & Life Events'
  },
  {
    id: '10',
    slug: 'shubh-ekadash',
    name: 'Shubh Ekadash Diya',
    price: 850,
    priceSub: '₹850',
    description: 'Handcrafted solid brass Panchdhatu Ekadashi diya with engraved lotus motifs for daily temple lighting.',
    tag: 'IN STOCK',
    isPreBook: false,
    themeClass: 'h-gold',
    category: 'Daily Puja Essentials'
  },
  {
    id: '11',
    slug: 'lakshmi-pujan-kit',
    name: 'Lakshmi Pujan Kit',
    price: 1550,
    priceSub: '₹1,550 · Diwali',
    description: 'Silver-plated Kuber Yantra, kamal gatta mala, pure lotus wicks, dhoop, and Mahalakshmi Aarti patrika.',
    tag: 'PRE-BOOK',
    isPreBook: true,
    orderDeadline: 'ORDER BY 2 NOV',
    themeClass: 'h-gold',
    category: 'By festival'
  },
  {
    id: '12',
    slug: 'maha-shivaratri-kit',
    name: 'Maha Shivaratri Kit',
    price: 1350,
    priceSub: '₹1,350 · Shivaratri',
    description: '4-prahar puja samagri, bhasma, white chandan, dhatura seeds, and Shiva Purana vidhi card.',
    tag: 'IN STOCK',
    isPreBook: false,
    themeClass: 'h-shiva',
    category: 'By festival'
  },
  {
    id: '13',
    slug: 'janmashtami-kit',
    name: 'Janmashtami Kit',
    price: 1400,
    priceSub: '₹1,400 · Gokulashtami',
    description: 'Laddu Gopal poshak, makhan-misri vessel, jhula cloth, flute, and midnight abhishek samagri.',
    tag: 'IN STOCK',
    isPreBook: false,
    themeClass: 'h-krishna',
    category: 'By festival'
  },
  {
    id: '14',
    slug: 'daily-consumables-pack',
    name: 'Daily Consumables Box',
    price: 499,
    priceSub: '₹499 · Monthly Box',
    description: 'Bhimseni camphor, dhoop cones, pure cow ghee wicks, akshata, kumkum, and kewra attar.',
    tag: 'IN STOCK',
    isPreBook: false,
    themeClass: 'h-earth',
    category: 'Daily Puja Essentials'
  }
];

export default function AllRitualKitsListingPage() {
  const [quickFilter, setQuickFilter] = useState<string>('All kits');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('cutoff');

  const quickFilters = ['All kits', 'Pre-book', 'In stock', 'Under ₹1,000', '₹1,000–2,000'];

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleStatus = (st: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
    );
  };

  const togglePriceRange = (range: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const clearAllFilters = () => {
    setQuickFilter('All kits');
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setSelectedPriceRanges([]);
  };

  // MULTI-FILTER EVALUATION
  const filteredKits = ALL_KITS.filter((kit) => {
    // Top Bar Quick Chip Filter
    if (quickFilter === 'Pre-book' && !kit.isPreBook) return false;
    if (quickFilter === 'In stock' && kit.isPreBook) return false;
    if (quickFilter === 'Under ₹1,000' && kit.price >= 1000) return false;
    if (quickFilter === '₹1,000–2,000' && (kit.price < 1000 || kit.price > 2000)) return false;

    // Multi-Select Facet Categories
    if (selectedCategories.length > 0 && !selectedCategories.includes(kit.category)) {
      return false;
    }

    // Multi-Select Facet Statuses
    if (selectedStatuses.length > 0) {
      const statusLabel = kit.isPreBook ? 'Pre-book' : 'In stock';
      if (!selectedStatuses.includes(statusLabel)) {
        return false;
      }
    }

    // Multi-Select Facet Price Ranges
    if (selectedPriceRanges.length > 0) {
      const matchesPrice = selectedPriceRanges.some((range) => {
        if (range === 'Under ₹1,000') return kit.price < 1000;
        if (range === '₹1,000–2,000') return kit.price >= 1000 && kit.price <= 2000;
        if (range === 'Over ₹2,000') return kit.price > 2000;
        return false;
      });
      if (!matchesPrice) return false;
    }

    return true;
  });

  // SORTING
  const sortedKits = [...filteredKits].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // Default: array order
  });

  const hasActiveFilters =
    quickFilter !== 'All kits' ||
    selectedCategories.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedPriceRanges.length > 0;

  return (
    <div className="w-full">
      {/* BREADCRUMB */}
      <div className="bcrumb">
        <div className="bc-in">
          <div className="bc-l">
            <Link href="/">Home</Link> › <Link href="/ritual-kits">Ritual Kits</Link> › <b>All Ritual Kits</b>
          </div>
        </div>
      </div>

      {/* SUB-CATEGORY HERO */}
      <section className="chero shero rk">
        <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="chero-in">
            <div>
              <p className="sh-crumbline">
                RITUAL KITS <b>›</b> ALL KITS
              </p>
              <h1 className="ch-h1 sh-h1">All Ritual Kits</h1>
              <p className="ch-p">
                Every kit across all festivals, rituals, life events and temple essentials. Scripture-sourced, authentic samagri, delivered to your doorstep.
              </p>
              <div className="ch-meta">
                <span className="ch-m">
                  <b>{ALL_KITS.length}</b> kits
                </span>
                <span className="ch-m">
                  <b>4</b> sub-categories
                </span>
                <span className="ch-m">
                  <b>Free</b> cancellation until dispatch
                </span>
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
          {quickFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`fc ${quickFilter === filter ? 'on' : ''}`}
              onClick={() => setQuickFilter(quickFilter === filter ? 'All kits' : filter)}
            >
              {filter}
            </button>
          ))}
          <div className="f-sort flex items-center gap-2">
            <span>Sort —</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-[var(--body-text)] cursor-pointer outline-none border-none"
            >
              <option value="cutoff">Cut-off — soonest first</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* SHELL: FACETS RAIL + STAGE */}
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="shell">
          {/* MULTI-SELECT FACETS RAIL */}
          <aside className="facets">
            {/* CATEGORY FACET */}
            <div className="fg">
              <div className="fg-h">
                CATEGORY <span>4</span>
              </div>
              <div
                className={`fo ${selectedCategories.length === 0 ? 'on' : ''}`}
                onClick={() => setSelectedCategories([])}
              >
                <span className="fo-b"></span>All categories
                <span className="fo-n">{ALL_KITS.length}</span>
              </div>
              {(
                ['By festival', 'By ritual', 'Griha & Life Events', 'Daily Puja Essentials'] as const
              ).map((cat) => (
                <div
                  key={cat}
                  className={`fo ${selectedCategories.includes(cat) ? 'on' : ''}`}
                  onClick={() => toggleCategory(cat)}
                >
                  <span className="fo-b"></span>{cat}
                  <span className="fo-n">
                    {ALL_KITS.filter((k) => k.category === cat).length}
                  </span>
                </div>
              ))}
            </div>

            {/* AVAILABILITY FACET */}
            <div className="fg">
              <div className="fg-h">
                AVAILABILITY <span>2</span>
              </div>
              <div
                className={`fo ${selectedStatuses.includes('Pre-book') ? 'on' : ''}`}
                onClick={() => toggleStatus('Pre-book')}
              >
                <span className="fo-b"></span>Pre-booking Open
                <span className="fo-n">
                  {ALL_KITS.filter((k) => k.isPreBook).length}
                </span>
              </div>
              <div
                className={`fo ${selectedStatuses.includes('In stock') ? 'on' : ''}`}
                onClick={() => toggleStatus('In stock')}
              >
                <span className="fo-b"></span>In Stock
                <span className="fo-n">
                  {ALL_KITS.filter((k) => !k.isPreBook).length}
                </span>
              </div>
            </div>

            {/* PRICE FACET */}
            <div className="fg">
              <div className="fg-h">
                PRICE RANGE <span>3</span>
              </div>
              <div
                className={`fo ${selectedPriceRanges.includes('Under ₹1,000') ? 'on' : ''}`}
                onClick={() => togglePriceRange('Under ₹1,000')}
              >
                <span className="fo-b"></span>Under ₹1,000
                <span className="fo-n">
                  {ALL_KITS.filter((k) => k.price < 1000).length}
                </span>
              </div>
              <div
                className={`fo ${selectedPriceRanges.includes('₹1,000–2,000') ? 'on' : ''}`}
                onClick={() => togglePriceRange('₹1,000–2,000')}
              >
                <span className="fo-b"></span>₹1,000–₹2,000
                <span className="fo-n">
                  {ALL_KITS.filter((k) => k.price >= 1000 && k.price <= 2000).length}
                </span>
              </div>
              <div
                className={`fo ${selectedPriceRanges.includes('Over ₹2,000') ? 'on' : ''}`}
                onClick={() => togglePriceRange('Over ₹2,000')}
              >
                <span className="fo-b"></span>Over ₹2,000
                <span className="fo-n">
                  {ALL_KITS.filter((k) => k.price > 2000).length}
                </span>
              </div>
            </div>

            {/* CONFIDENCE FACET */}
            <div className="fg">
              <div className="fg-h">
                SCRIPTURE SOURCED <span>1</span>
              </div>
              <div className="fo on">
                <span className="fo-b"></span>Dharma Verified
                <span className="fo-n">{ALL_KITS.length}</span>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="fclear">
                <b onClick={clearAllFilters}>Clear all filters</b>
              </div>
            )}
          </aside>

          {/* MAIN STAGE */}
          <div id="stage">
            {/* ACTIVE APPLIED CHIPS */}
            {hasActiveFilters && (
              <div className="applied">
                {selectedCategories.map((cat) => (
                  <span key={cat} className="ap cursor-pointer" onClick={() => toggleCategory(cat)}>
                    {cat} <i>✕</i>
                  </span>
                ))}
                {selectedStatuses.map((st) => (
                  <span key={st} className="ap cursor-pointer" onClick={() => toggleStatus(st)}>
                    {st} <i>✕</i>
                  </span>
                ))}
                {selectedPriceRanges.map((pr) => (
                  <span key={pr} className="ap cursor-pointer" onClick={() => togglePriceRange(pr)}>
                    {pr} <i>✕</i>
                  </span>
                ))}
                {quickFilter !== 'All kits' && (
                  <span className="ap cursor-pointer" onClick={() => setQuickFilter('All kits')}>
                    {quickFilter} <i>✕</i>
                  </span>
                )}
                <span className="ap-clr cursor-pointer" onClick={clearAllFilters}>
                  Clear all
                </span>
              </div>
            )}

            <div className="rhead">
              <div className="rh-c">
                {sortedKits.length}
                <span>
                  {sortedKits.length === 1 ? 'kit' : 'kits'} · {hasActiveFilters ? 'filtered results' : 'all items across categories'}
                </span>
              </div>
              <div className="rh-r">
                <span className="f-sort">
                  Sort — <b>{sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : sortBy === 'name' ? 'Name: A to Z' : 'Cut-off — soonest first'}</b>
                </span>
              </div>
            </div>

            {/* KITS GRID */}
            {sortedKits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {sortedKits.map((kit) => (
                  <Link key={kit.id} href={`/ritual-kits/${kit.slug}`} className="c">
                    <div className={`c-top ${kit.themeClass}`}>
                      {kit.orderDeadline ? (
                        <span className={`c-when ${kit.tag === 'PRE-BOOK' ? 'now' : ''}`}>
                          {kit.orderDeadline}
                        </span>
                      ) : (
                        <span className="c-when">{kit.category}</span>
                      )}
                    </div>
                    <div className="c-b">
                      <div className="c-t">{kit.name}</div>
                      <div className="c-d">{kit.priceSub}</div>
                      <p className="c-s">{kit.description}</p>
                      <div className="c-f">
                        <span className={`pill ${kit.isPreBook ? 'pr' : 'n'}`}>
                          {kit.tag}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-[var(--card)] border border-[var(--border)] rounded-xl my-4">
                <p className="text-[16px] font-bold text-[var(--dark)] mb-2">No kits found matching selected filters</p>
                <p className="text-[13px] text-[var(--sub-text)] mb-4">Try clearing some of your active filters to see more results.</p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="bg-[var(--pink)] text-white font-bold text-[13px] px-4 py-2 rounded-lg"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* METHOD BAND */}
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 my-12">
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
            <div className="mbr d">
              <div className="mbr-k">DHARMA</div>
              <div className="mbr-v">Named in a text you could open yourself.</div>
            </div>
            <div className="mbr p">
              <div className="mbr-k">PRATHA</div>
              <div className="mbr-v">Regional or family custom. Real — not scripture.</div>
            </div>
            <div className="mbr b">
              <div className="mbr-k">BHRANTI</div>
              <div className="mbr-v">A misconception. Corrected in every guide it appears in.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
