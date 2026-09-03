import { notFound } from 'next/navigation';
import { fetchBeginnerGuideBySlug } from '@/lib/get-beginner-guide';
import BeginnerGuideDetailView from '@/components/BeginnerGuideDetail/BeginnerGuideDetailView';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function BeginnerGuidePage({ params }: PageProps) {
  const { slug } = params;
  const guide = await fetchBeginnerGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return <BeginnerGuideDetailView guide={guide} />;
}
