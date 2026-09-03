import { PreBookBanner } from '@/components/Homepage/PreBookBanner';
import { HeroSection } from '@/components/Homepage/HeroSection';
import { KitShelf } from '@/components/Homepage/KitShelf';
import { TrustStrip } from '@/components/Homepage/TrustStrip';
import { KnowledgeFirst } from '@/components/Homepage/KnowledgeFirst';
import { CalendarShelf } from '@/components/Homepage/CalendarShelf';
import { CategoryCards } from '@/components/Homepage/CategoryCards';
import { MythsSection } from '@/components/Homepage/MythsSection';
import { EditorialMethodSection } from '@/components/Homepage/EditorialMethodSection';
import { ReminderSection } from '@/components/Homepage/ReminderSection';
import { TapaCircleSection } from '@/components/Homepage/TapaCircleSection';
import { INITIAL_HOMEPAGE_SECTIONS } from '@/lib/homepage-sections';
import { INITIAL_HOMEPAGE_PART3 } from '@/lib/homepage-part3';
import { getPublicProductsServer } from '@/lib/products-server';

export default async function HomePage() {
  const products = await getPublicProductsServer();

  const mappedKits = products.slice(0, 4).map((p, idx) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    description: p.description,
    category: p.category,
    themeClass: idx === 0 ? 'k-top k-ganesh' : idx === 1 ? 'k-top k-teej' : idx === 2 ? 'k-top k-navratri' : 'k-top k-shiva',
    badge: idx === 0 || idx === 1 ? 'PRE-BOOK' : 'ALL YEAR',
    badgeIsPre: idx === 0 || idx === 1,
    cutoffText: 'ORDER BY 8 OCT',
    priceNote: 'incl. delivery',
    ctaText: 'View Kit Details',
    guideHref: `/product/${p.slug}`,
    isLead: idx === 0,
  }));

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <PreBookBanner />
      <HeroSection />
      <KitShelf initialKits={mappedKits} />
      <TrustStrip items={INITIAL_HOMEPAGE_SECTIONS.trustItems} />
      <KnowledgeFirst data={INITIAL_HOMEPAGE_SECTIONS.knowledgeFirst} />
      <CalendarShelf />
      <CategoryCards cards={INITIAL_HOMEPAGE_SECTIONS.categoryCards} />
      <MythsSection data={INITIAL_HOMEPAGE_PART3.myths} />
      <EditorialMethodSection data={INITIAL_HOMEPAGE_PART3.editorialMethod} />
      <ReminderSection />
      <TapaCircleSection data={INITIAL_HOMEPAGE_PART3.tapaCircle} />
    </div>
  );
}
