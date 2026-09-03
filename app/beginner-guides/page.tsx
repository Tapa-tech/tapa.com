import { notFound } from 'next/navigation';
import { fetchBeginnerGuideBySlug } from '@/lib/get-beginner-guide';
import BeginnerGuideDetailView from '@/components/BeginnerGuideDetail/BeginnerGuideDetailView';

export default async function BeginnerGuidesIndexPage() {
  const guide = (await fetchBeginnerGuideBySlug('seven-kandas')) || (await fetchBeginnerGuideBySlug('sundarkand-path'));

  if (!guide) {
    notFound();
  }

  return <BeginnerGuideDetailView guide={guide} />;
}
