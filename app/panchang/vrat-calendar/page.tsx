import './PanchangVratCalendar.css';
import { getVratDetailData } from '@/lib/vrat-detail-service';
import PanchangVratCalendarView from '@/components/PanchangVratCalendar/PanchangVratCalendarView';

interface PageProps {
  searchParams?: {
    slug?: string;
    vrat?: string;
  };
}

export default async function PanchangVratCalendar({ searchParams }: PageProps) {
  const targetSlug = searchParams?.slug || searchParams?.vrat;
  const data = await getVratDetailData(targetSlug);

  return <PanchangVratCalendarView data={data} />;
}