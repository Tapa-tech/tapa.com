import { getBeginnerGuideBySlug } from '@/lib/beginner-guides-data';
import BeginnerGuideDetailView from '@/components/BeginnerGuideDetail/BeginnerGuideDetailView';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function RitualGuideBeginnerPage({ params }: PageProps) {
  const { slug } = params;
  const guide = getBeginnerGuideBySlug(slug);

  return <BeginnerGuideDetailView guide={guide} />;
}
