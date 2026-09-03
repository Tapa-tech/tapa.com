import { getPublicGlossaryServer } from '@/lib/glossary-store';
import GlossaryClient from '@/components/Glossary/GlossaryClient';

export default async function GlossaryPage() {
  const terms = await getPublicGlossaryServer();

  return <GlossaryClient initialTerms={terms} />;
}
