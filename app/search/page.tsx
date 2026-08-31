import { SearchSystemContainer } from '@/components/Search/SearchSystemContainer';
import './search-system.css';

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#F2EDE4] text-[#2C2010]">
      <SearchSystemContainer initialQuery="ekadashi" showPreviewNav={true} />
    </main>
  );
}
