'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ProductSummary } from '@/lib/products-server';
import '../../app/ritual-kits/ritual-kits.css';

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
  category: string;
  rawCategory: string;
  featuredImage?: string | null;
  imagesJson?: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  BY_FESTIVAL: 'By festival',
  BY_RITUAL: 'By ritual',
  GRIHA_LIFE_EVENTS: 'Griha & Life Events',
  DAILY_PUJA_ESSENTIALS: 'Daily Puja Essentials',
};

const QUICK_FILTERS = [
  'All kits',
  'Pre-book',
  'In stock',
  'Under ₹1,000',
  '₹1,000–2,000',
];

const PRICE_RANGES = [
  'Under ₹1,000',
  '₹1,000–2,000',
  'Over ₹2,000',
];

const SORT_OPTIONS = [
  { value: 'cutoff', label: 'Cut-off — soonest first' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
];

const normalizeCategory = (input?: string | null): string => {
  if (!input) return '';
  const clean = input.trim().toUpperCase().replace(/[-\s]+/g, '_');
  if (clean === 'BY_FESTIVAL' || clean === 'BY_FESTIVE' || clean === 'FESTIVAL') return 'By festival';
  if (clean === 'BY_RITUAL' || clean === 'RITUAL') return 'By ritual';
  if (clean.includes('GRIHA') || clean.includes('LIFE')) return 'Griha & Life Events';
  if (clean.includes('DAILY') || clean.includes('ESSENTIAL')) return 'Daily Puja Essentials';
  return CATEGORY_LABELS[input] || input;
};

const getThemeClass = (category?: string) => {
  switch (category) {
    case 'BY_RITUAL':
    case 'By ritual':
      return 'h-shiva';
    case 'GRIHA_LIFE_EVENTS':
    case 'Griha & Life Events':
      return 'h-sanskar';
    default:
      return 'h-devi';
  }
};

const getImage = (featuredImage?: string | null, imagesJson?: string | null) => {
  if (featuredImage) return featuredImage;
  if (!imagesJson) return '';
  try {
    const images = JSON.parse(imagesJson);
    return Array.isArray(images) && images.length ? images[0] : '';
  } catch {
    return '';
  }
};

const matchesPriceRange = (price: number, range: string) => {
  switch (range) {
    case 'Under ₹1,000':
      return price < 1000;
    case '₹1,000–2,000':
      return price >= 1000 && price <= 2000;
    case 'Over ₹2,000':
      return price > 2000;
    default:
      return false;
  }
};

function mapProductToKitItem(item: any): KitItem {
  const isPreBook =
    item.category === 'BY_FESTIVAL' ||
    item.category === 'By Festival' ||
    item.stock <= 25;

  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    price: Number(item.price) || 0,
    priceSub: `₹${(Number(item.price) || 0).toLocaleString('en-IN')}`,
    description: item.description || 'Scripture-sourced authentic puja kit.',
    tag: isPreBook ? 'PRE-BOOK' : 'IN STOCK',
    isPreBook,
    orderDeadline: isPreBook ? 'ORDER BEFORE RITUAL' : undefined,
    themeClass: getThemeClass(item.category),
    category: normalizeCategory(item.category),
    rawCategory: item.category || '',
    featuredImage: item.featuredImage || null,
    imagesJson: item.imagesJson || null,
  };
}

interface AllRitualKitsViewProps {
  initialProducts?: ProductSummary[];
}

function AllRitualKitsContent({ initialProducts = [] }: AllRitualKitsViewProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<KitItem[]>(() =>
    initialProducts.map(mapProductToKitItem)
  );
  const [loading, setLoading] = useState<boolean>(initialProducts.length === 0);
  const [error, setError] = useState<string | null>(null);

  const [quickFilter, setQuickFilter] = useState('All kits');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('cutoff');

  // Client fallback fetch if initialProducts empty
  useEffect(() => {
    if (initialProducts.length > 0) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/public/products', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const result = await response.json();
        if (isMounted) {
          if (result.success && Array.isArray(result.data)) {
            setProducts(result.data.map(mapProductToKitItem));
          } else {
            setProducts([]);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('[All Kits] Fetch error:', err);
          setError(err?.message || 'Failed to load catalog');
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [initialProducts]);

  // Handle URL categoryParam with robust normalization
  useEffect(() => {
    if (categoryParam) {
      const normalized = normalizeCategory(categoryParam);
      if (normalized) {
        setSelectedCategories([normalized]);
      }
    }
  }, [categoryParam]);

  const categoryOptions = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.category))).filter(
        Boolean
      ),
    [products]
  );

  const categoryCounts = useMemo(() => {
    return products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const statusCounts = useMemo(
    () => ({
      'Pre-book': products.filter((product) => product.isPreBook).length,
      'In stock': products.filter((product) => !product.isPreBook).length,
    }),
    [products]
  );

  const toggleValue = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const clearAllFilters = () => {
    setQuickFilter('All kits');
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setSelectedPriceRanges([]);
  };

  const filteredKits = useMemo(() => {
    return products.filter((kit) => {
      const quickFilterMatch =
        quickFilter === 'All kits' ||
        (quickFilter === 'Pre-book' && kit.isPreBook) ||
        (quickFilter === 'In stock' && !kit.isPreBook) ||
        (quickFilter === 'Under ₹1,000' && kit.price < 1000) ||
        (quickFilter === '₹1,000–2,000' &&
          kit.price >= 1000 &&
          kit.price <= 2000);

      if (!quickFilterMatch) return false;

      if (
        selectedCategories.length &&
        !selectedCategories.includes(kit.category)
      ) {
        return false;
      }

      if (selectedStatuses.length) {
        const status = kit.isPreBook ? 'Pre-book' : 'In stock';
        if (!selectedStatuses.includes(status)) {
          return false;
        }
      }

      if (
        selectedPriceRanges.length &&
        !selectedPriceRanges.some((range) =>
          matchesPriceRange(kit.price, range)
        )
      ) {
        return false;
      }

      return true;
    });
  }, [
    products,
    quickFilter,
    selectedCategories,
    selectedStatuses,
    selectedPriceRanges,
  ]);

  const sortedKits = useMemo(() => {
    const result = [...filteredKits];
    switch (sortBy) {
      case 'price-low':
        return result.sort((a, b) => a.price - b.price);
      case 'price-high':
        return result.sort((a, b) => b.price - a.price);
      case 'name':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return result;
    }
  }, [filteredKits, sortBy]);

  const hasActiveFilters =
    quickFilter !== 'All kits' ||
    selectedCategories.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedPriceRanges.length > 0;

  return (
    <div className="w-full">
      <Breadcrumb
        items={[
          { label: 'Ritual Kits', href: '/ritual-kits' },
          { label: 'All Catalog' },
        ]}
      />

      <section className="chero rk">
        <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="chero-in">
            <div>
              <p className="ch-ey">ALL RITUAL KITS & SAMAGRI · FULL CATALOG</p>
              <h1 className="ch-h1">Complete collection for every puja</h1>
              <p className="ch-p">
                Explore every festival kit, ritual box, griha sanskar set and daily puja essential in one place. Filter by category, price, or booking status.
              </p>
              <div className="ch-meta">
                <span className="ch-m"><b>{products.length}</b> total items</span>
                <span className="ch-m"><b>{categoryOptions.length}</b> categories</span>
                <span className="ch-m"><b>100%</b> scriptural ingredients</span>
              </div>
            </div>
            <div className="ch-side">
              <div className="chs-l">◷ SCRIPTURAL TRANSPARENCY</div>
              <div className="chs-t">Every list stays free</div>
              <p className="chs-d">
                If you prefer sourcing samagri locally, open any guide to print or copy the full checklist at zero cost.
              </p>
              <Link href="/ritual-guides" className="chs-c">
                Explore free guides ›
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="filters">
        <div className="f-in">
          <span className="f-l">FILTER</span>
          {QUICK_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`fc ${quickFilter === filter ? 'on' : ''}`}
              onClick={() => setQuickFilter(filter)}
            >
              {filter}
            </button>
          ))}

          <div className="f-sort">
            <label htmlFor="sort-select">Sort — </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="bg-transparent font-bold border-none outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 py-8">
        <div className="shell">
          <aside className="facets">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 18px',
                borderBottom: '1px solid #F0E8D8',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#A07800',
                  letterSpacing: '0.6px',
                }}
              >
                FILTER BY
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#DE1B59',
                    cursor: 'pointer',
                  }}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* CATEGORY FACETS */}
            <div className="fg">
              <div className="fg-h">Category</div>
              {Object.values(CATEGORY_LABELS).map((cat) => {
                const count = categoryCounts[cat] || 0;
                const isChecked = selectedCategories.includes(cat);
                return (
                  <div
                    key={cat}
                    className={`fo ${isChecked ? 'on' : ''}`}
                    onClick={() => toggleValue(cat, setSelectedCategories)}
                  >
                    <div className="fo-b" />
                    <span>{cat}</span>
                    <span className="fo-c">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* STATUS FACETS */}
            <div className="fg">
              <div className="fg-h">Availability</div>
              {['Pre-book', 'In stock'].map((st) => {
                const count = statusCounts[st as keyof typeof statusCounts] || 0;
                const isChecked = selectedStatuses.includes(st);
                return (
                  <div
                    key={st}
                    className={`fo ${isChecked ? 'on' : ''}`}
                    onClick={() => toggleValue(st, setSelectedStatuses)}
                  >
                    <div className="fo-b" />
                    <span>{st}</span>
                    <span className="fo-c">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* PRICE RANGE FACETS */}
            <div className="fg">
              <div className="fg-h">Price Range</div>
              {PRICE_RANGES.map((range) => {
                const isChecked = selectedPriceRanges.includes(range);
                return (
                  <div
                    key={range}
                    className={`fo ${isChecked ? 'on' : ''}`}
                    onClick={() => toggleValue(range, setSelectedPriceRanges)}
                  >
                    <div className="fo-b" />
                    <span>{range}</span>
                  </div>
                );
              })}
            </div>
          </aside>

          <main className="stage">
            <div
              style={{
                fontSize: '13px',
                color: '#8A7A68',
                marginBottom: '16px',
              }}
            >
              Showing <b>{sortedKits.length}</b> of <b>{products.length}</b> kits
            </div>

            {loading ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: '#8A7A68' }}>
                Loading catalog...
              </div>
            ) : error ? (
              <div
                style={{
                  padding: '48px',
                  background: '#FFF5F5',
                  borderRadius: '16px',
                  border: '1px solid #FED7D7',
                  textAlign: 'center',
                  color: '#C53030',
                }}
              >
                <p style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600 }}>
                  ⚠️ {error}
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  style={{
                    background: '#DE1B59',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Reset filters
                </button>
              </div>
            ) : sortedKits.length === 0 ? (
              <div
                style={{
                  padding: '48px',
                  background: '#FFFDF9',
                  borderRadius: '16px',
                  border: '1px solid #F5E6D3',
                  textAlign: 'center',
                  color: '#8A7A68',
                }}
              >
                <p style={{ margin: '0 0 16px', fontSize: '14px' }}>
                  No kits match your selected filter criteria.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  style={{
                    background: '#DE1B59',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sortedKits.map((kit) => {
                  const coverImg = getImage(kit.featuredImage, kit.imagesJson);
                  return (
                    <Link key={kit.id} href={`/product/${kit.slug}`} className="c">
                      <div
                        className="c-top"
                        style={{
                          backgroundImage: coverImg ? `url(${coverImg})` : undefined,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          minHeight: '140px',
                          backgroundColor: '#F9F6F0',
                        }}
                      >
                        {kit.orderDeadline && (
                          <span className="c-when now">{kit.orderDeadline}</span>
                        )}
                      </div>

                      <div className="c-b">
                        <div className="c-t">{kit.name}</div>
                        <div className="c-d">{kit.priceSub}</div>
                        <p
                          className="c-s"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {kit.description}
                        </p>
                        <div className="c-f">
                          <span className={`pill ${kit.isPreBook ? 'pr' : 'n'}`}>
                            {kit.tag}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export function AllRitualKitsView({ initialProducts }: AllRitualKitsViewProps) {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#8A7A68' }}>
          Loading catalog...
        </div>
      }
    >
      <AllRitualKitsContent initialProducts={initialProducts} />
    </Suspense>
  );
}
