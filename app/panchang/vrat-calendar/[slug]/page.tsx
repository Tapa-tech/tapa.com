import '../PanchangVratCalendar.css';
import { getVratDetailData } from '@/lib/vrat-detail-service';
import PanchangVratCalendarView from '@/components/PanchangVratCalendar/PanchangVratCalendarView';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function PanchangVratCalendarSlugPage({ params }: PageProps) {
  const data = await getVratDetailData(params.slug);

  return <PanchangVratCalendarView data={data} />;
}
