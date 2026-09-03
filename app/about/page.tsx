import { getPublicAboutServer } from '@/lib/about-store';
import AboutClientView from '@/components/About/AboutClientView';

export default async function AboutPage() {
  const aboutData = await getPublicAboutServer();

  return <AboutClientView aboutData={aboutData} />;
}
