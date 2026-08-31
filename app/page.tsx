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

export default function HomePage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <PreBookBanner />
      <HeroSection />
      <KitShelf />
      <TrustStrip />
      <KnowledgeFirst />
      <CalendarShelf />
      <CategoryCards />
      <MythsSection />
      <EditorialMethodSection />
      <ReminderSection />
      <TapaCircleSection />
    </div>
  );
}
