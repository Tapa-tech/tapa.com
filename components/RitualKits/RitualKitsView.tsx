'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ProductSummary } from '@/lib/products-server';
import '../../app/ritual-kits/ritual-kits.css';

interface RitualKitsViewProps {
  initialProducts: ProductSummary[];
}

export const RitualKitsView: React.FC<RitualKitsViewProps> = ({ initialProducts = [] }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All kits');

  const filters = ['All kits', 'Pre-book', 'In stock', 'Under ₹1,000', '₹1,000–2,000'];

  const activeProducts = useMemo(() => {
    return initialProducts.filter((p) => p.status === 'ACTIVE');
  }, [initialProducts]);

  const { byFestivalProducts, byRitualProducts, grihaLifeProducts, dailyEssentialsProducts } = useMemo(() => {
    const filterByCat = (categoryCode: string, categoryLabel: string) => {
      let list = activeProducts.filter(
        (p) => p.category === categoryCode || p.category === categoryLabel
      );

      if (activeFilter === 'Pre-book') {
        list = list.filter(
          (p) => p.category === 'BY_FESTIVAL' || p.category === 'By Festival' || p.stock <= 25
        );
      } else if (activeFilter === 'In stock') {
        list = list.filter((p) => p.stock > 25);
      } else if (activeFilter === 'Under ₹1,000') {
        list = list.filter((p) => p.price < 1000);
      } else if (activeFilter === '₹1,000–2,000') {
        list = list.filter((p) => p.price >= 1000 && p.price <= 2000);
      }

      return list;
    };

    return {
      byFestivalProducts: filterByCat('BY_FESTIVAL', 'By Festival'),
      byRitualProducts: filterByCat('BY_RITUAL', 'By Ritual'),
      grihaLifeProducts: filterByCat('GRIHA_LIFE_EVENTS', 'Griha & Life Events'),
      dailyEssentialsProducts: filterByCat('DAILY_PUJA_ESSENTIALS', 'Daily Puja Essentials'),
    };
  }, [activeProducts, activeFilter]);

  const renderProductCard = (product: ProductSummary) => {
    let coverImg = product.featuredImage || '';
    if (!coverImg && product.imagesJson) {
      try {
        const imgs = JSON.parse(product.imagesJson);
        if (Array.isArray(imgs) && imgs.length > 0) coverImg = imgs[0];
      } catch (e) {}
    }

    const isPreBook =
      product.category === 'BY_FESTIVAL' || product.category === 'By Festival' || product.stock <= 25;

    return (
      <Link key={product.id} href={`/product/${product.slug}`} className="c">
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
          {isPreBook && <span className="c-when now">PRE-ORDER</span>}
        </div>
        <div className="c-b">
          <div className="c-t">{product.name}</div>
          <div className="c-d">₹{product.price.toLocaleString('en-IN')}</div>
          <p
            className="c-s"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description || 'Complete authentic puja kit with sacred samagri ingredients.'}
          </p>
          <div className="c-f">
            <span className={`pill ${isPreBook ? 'pr' : 'n'}`}>
              {isPreBook ? 'PRE-BOOK' : 'IN STOCK'}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full">
      {/* BREADCRUMB */}
      <Breadcrumb items={[{ label: 'Ritual Kits' }]} />

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
                <span className="ch-m"><b>{activeProducts.length}</b> kits</span>
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
              <Link href="/ritual-kits/all?category=BY_FESTIVAL" className="sec-a">
                <span>{byFestivalProducts.length} kits</span>View all ›
              </Link>
            </div>
            {byFestivalProducts.length === 0 ? (
              <div style={{ padding: '24px', background: '#FFFDF9', borderRadius: '12px', border: '1px solid #F5E6D3', color: '#6B7280', fontSize: '13px' }}>
                No festival kits currently available for selected filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {byFestivalProducts.slice(0, 3).map(renderProductCard)}
              </div>
            )}
          </div>

          {/* SUB-CATEGORY 2: BY RITUAL */}
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">ALL YEAR · COD AVAILABLE</div>
                <div className="sec-t">By ritual</div>
                <p className="sec-s">Not tied to a date. Order when the household needs it.</p>
              </div>
              <Link href="/ritual-kits/all?category=BY_RITUAL" className="sec-a">
                <span>{byRitualProducts.length} kits</span>View all ›
              </Link>
            </div>
            {byRitualProducts.length === 0 ? (
              <div style={{ padding: '24px', background: '#FFFDF9', borderRadius: '12px', border: '1px solid #F5E6D3', color: '#6B7280', fontSize: '13px' }}>
                No ritual kits currently available for selected filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {byRitualProducts.slice(0, 3).map(renderProductCard)}
              </div>
            )}
          </div>

          {/* SUB-CATEGORY 3: GRIHA & LIFE EVENTS */}
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">ONCE IN A LIFE</div>
                <div className="sec-t">Griha &amp; Life Events</div>
                <p className="sec-s">Higher-value kits for a house, a vehicle, a shop or a sanskar. Purohit booking available alongside from November.</p>
              </div>
              <Link href="/ritual-kits/all?category=GRIHA_LIFE_EVENTS" className="sec-a">
                <span>{grihaLifeProducts.length} kits</span>View all ›
              </Link>
            </div>
            {grihaLifeProducts.length === 0 ? (
              <div style={{ padding: '24px', background: '#FFFDF9', borderRadius: '12px', border: '1px solid #F5E6D3', color: '#6B7280', fontSize: '13px' }}>
                No Griha &amp; Life Event kits currently available for selected filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {grihaLifeProducts.slice(0, 3).map(renderProductCard)}
              </div>
            )}
          </div>

          {/* SUB-CATEGORY 4: DAILY PUJA ESSENTIALS */}
          <div className="sec">
            <div className="sec-h">
              <div>
                <div className="sec-ey">THE THINGS THAT RUN OUT</div>
                <div className="sec-t">Daily Puja Essentials</div>
                <p className="sec-s">Consumables and temple essentials. Buy once, reorder when you need to — or set a monthly box from next year.</p>
              </div>
              <Link href="/ritual-kits/all?category=DAILY_PUJA_ESSENTIALS" className="sec-a">
                <span>{dailyEssentialsProducts.length} items</span>View all ›
              </Link>
            </div>
            {dailyEssentialsProducts.length === 0 ? (
              <div style={{ padding: '24px', background: '#FFFDF9', borderRadius: '12px', border: '1px solid #F5E6D3', color: '#6B7280', fontSize: '13px' }}>
                No daily essentials currently available for selected filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dailyEssentialsProducts.slice(0, 3).map(renderProductCard)}
              </div>
            )}
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
};
