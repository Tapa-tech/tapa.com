import { prisma } from '@/lib/db';

export const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEiCAYAAABDd+8FAABMJElEQVR4nO2deXxcV3n3f885585o9S7JdgKhQFgS1kAhlCVxKUuBbA5SVqBASShLoaVQWgqyKPB5aYG3ZWsTIKzZpMROgJLy8lI7LS0tJWVNypZCeAO2JO/aZjnn+b1/3DuybMuSLF3JmtH5fj7GZDxz587Mub/7PM95FiASiUQikUgkEolEIpFIJB8ICAE51ecRiUQiMxKFKhKJ1AUEDAAMd1z+tv0dVz8xfazXnNqzijQScTFFcoGACKAHVr9ijYO8lwivSP/lvhhxRXIjClYkJ86zABAKlQvXmKJT8kLiFU2CgRDdxEheRMGK5MT5mv2fF1eoTMQ+fH9H5bz0oe64ziK5EBdSJBcEfbq76+pWks8Zp5c2cULB75zq84o0FlGwIgumH90WAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpYPbdo7MYAhikAGAEIAJpY.PbCdo=';

export interface AboutCoreValueItem {
  id?: string;
  number: string;
  title: string;
  description: string;
  sortOrder?: number;
}

export interface AboutEditorialSourceItem {
  id?: string;
  source: string;
  score: string;
  sortOrder?: number;
}

export interface AboutPointItem {
  id?: string;
  title: string;
  description: string;
  sortOrder?: number;
}

export interface AboutPageFullData {
  id?: string;
  key?: string;
  heroEyebrow: string;
  heroTitle: string;
  heroStandfirst: string;
  heroParagraph1: string;
  heroParagraph2: string;
  heroPullQuote: string;
  filmLogo: string;
  filmSpec: string;
  whySectionNumber: string;
  whyTitleDevanagari: string;
  whyDevanagariDesc: string;
  whyParagraph2: string;
  founderTrayTitle: string;
  founderName: string;
  founderDesignation: string;
  founderLetterTitle: string;
  founderLetterP1: string;
  founderLetterP2: string;
  founderLetterP3: string;
  founderLetterP4: string;
  founderLetterP5: string;
  founderFamilyImage: string;
  founderFamilyCaption: string;
  founderPullQuote1: string;
  founderLetterP6: string;
  founderLetterP7: string;
  founderLetterP8: string;
  founderSignatureName: string;
  founderSignatureTitle: string;
  founderSignatureCompany: string;
  founderPullQuote2: string;
  founderLetterP9: string;
  founderLetterP10: string;
  founderAvatar: string;
  coreValuesHeading: string;
  coreValuesSubtitle: string;
  coreValuesIntro: string;
  editorialSectionNumber: string;
  editorialTitle: string;
  editorialStandfirst: string;
  editorialDharmaTitle: string;
  editorialDharmaSub: string;
  editorialDharmaDesc: string;
  editorialPrathaTitle: string;
  editorialPrathaSub: string;
  editorialPrathaDesc: string;
  editorialBhrantiTitle: string;
  editorialBhrantiSub: string;
  editorialBhrantiDesc: string;
  editorialRuleText: string;
  editorialConsensusText: string;
  editorialSeparatedText: string;
  editorialWeighTitle: string;
  editorialWeighP1: string;
  editorialWeighP2: string;
  editorialCtaText: string;
  editorialCtaUrl: string;
  glossarySectionNumber: string;
  glossaryTitle: string;
  glossaryStandfirst: string;
  glossaryParagraph1: string;
  glossaryParagraph2: string;
  glossaryCtaText: string;
  glossaryCtaUrl: string;
  kitsSectionNumber: string;
  kitsTitle: string;
  kitsStandfirst: string;
  kitsParagraph1: string;
  kitsParagraph2: string;
  kitsHeading: string;
  kitsNote: string;
  kitsCtaText: string;
  kitsCtaUrl: string;
  purohitSectionNumber: string;
  purohitTitle: string;
  purohitChipText: string;
  purohitParagraph: string;
  purohitBookingHeading: string;
  purohitArrangeHeading: string;
  purohitNotHappenHeading: string;
  purohitNotHappenDesc: string;
  purohitNotifyCtaText: string;
  circleSectionNumber: string;
  circleTitle: string;
  circlePriceChip: string;
  circleStandfirst: string;
  circleParagraph1: string;
  circleParagraph2: string;
  circleTrayTitle: string;
  circleLeavingNote: string;
  circleJoinCtaText: string;
  closingLabel: string;
  closingPreText: string;
  closingText: string;
  closingLogo: string;

  coreValues: AboutCoreValueItem[];
  editorialSources: AboutEditorialSourceItem[];
  kitPoints: AboutPointItem[];
  purohitBookingPoints: AboutPointItem[];
  purohitArrangementPoints: AboutPointItem[];
  circleSteps: AboutPointItem[];
}

export const INITIAL_ABOUT_DATA: AboutPageFullData = {
  heroEyebrow: 'ABOUT',
  heroTitle: 'About — The Tapa Co.',
  heroStandfirst: 'We are a knowledge company that happens to sell ritual kits. In that order, always.',
  heroParagraph1: 'Rituals are not hard to find. Guidance you can trust is. Someone who wants to keep a vrat properly, or set up a puja in a new home, or perform shraddh for a parent, is usually piecing it together at eleven at night from search results, reels and forwarded messages. Some of that is wisdom. Most of it is noise. Almost none of it tells you which is which.',
  heroParagraph2: 'So we tell you what scripture actually says, what is regional or family custom, and what is only fear wearing tradition\'s clothes. All three deserve respect. They are not the same thing, and nobody should have to guess.',
  heroPullQuote: 'Dharma does not demand fear. It demands devotion.',
  filmLogo: LOGO_BASE64,
  filmSpec: 'MONTAGE FILM · 1920 × 820 · SILENT LOOP',

  whySectionNumber: '3',
  whyTitleDevanagari: 'तप्',
  whyDevanagariDesc: 'तप् — a Sanskrit root meaning austerity, discipline, the inner heat of devoted practice. Not suffering. Not obligation. The chosen effort of someone who has decided to show up properly.',
  whyParagraph2: 'The company exists for one reason. The people who could once answer the why behind the what are no longer in the next room. When knowledge fragments, faith does not disappear — it becomes fragile. Every generation deserves access to its own roots, on its own terms.',
  founderTrayTitle: 'Why I started this — a letter from our founder',
  founderName: 'Komal Gupta',
  founderDesignation: 'Founder, The Tapa Co.',
  founderLetterTitle: 'Why Tapa Exists',
  founderLetterP1: 'I did not start The Tapa Co. to sell puja kits or ritual subscriptions.',
  founderLetterP2: 'I started it because I grew up inside something I didn\'t fully appreciate until I left it.',
  founderLetterP3: 'My earliest memories are of devotion that needed no explanation, held by people who could have explained it in any terms they chose. Mine was a highly educated family. Degrees, arguments at the dining table, books in more than one language. And within all of that, my parents at their morning puja before anything else in the day — reciting the shrutis and the smritis themselves, not as inherited habit but as something they had thought about and decided to keep.',
  founderLetterP4: 'That is the part I did not understand until much later. Nobody in my house practised because they did not know better. They practised because they had examined it and found it worth practising. Doordarshan played Ramayan and Mahabharat on weekends and the whole family sat together — asking questions, getting answers, and being allowed to ask the next one.',
  founderLetterP5: 'Everything I was trained on came from there. The way I think, the way I test a claim, the way I refuse to accept something because everybody says so. My thesis came out of that house. So did this company.',
  founderFamilyImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
  founderFamilyCaption: 'Komal Gupta with family',
  founderPullQuote1: '"Faith without understanding is fragile. We are here to rebuild the bridge between what you do at the altar and why it was created."',
  founderLetterP6: 'When I moved out, I noticed how many of my peers wanted to keep the practices but had lost the language. They were piecing together rituals from Instagram posts, WhatsApp forwards, and hurried calls home. When they asked why a particular samagri was needed or why a tithi mattered, nobody could tell them without falling back on "because that is how it is done" or, worse, warnings of bad luck.',
  founderLetterP7: 'Dharma does not require fear to survive. It requires clarity.',
  founderLetterP8: 'At The Tapa Co., every guide we publish, every samagri list we compile, and every Panchang entry we calculate is backed by named scriptures, checked by scholars, and translated into clear, dignified English and Hindi. We distinguish between what is scriptural command (Dharma), what is family tradition (Parampara), and what is individual expression (Bhakti).',
  founderSignatureName: 'Komal Gupta',
  founderSignatureTitle: 'Founder & Chief Editor',
  founderSignatureCompany: 'The Tapa Co.',
  founderPullQuote2: 'Dharma does not demand fear. It demands devotion.',
  founderLetterP9: 'The Tapa Co. exists to restore clarity, authenticity, and trust to ritual practice — to help people understand not just what to do, but why it matters. To separate Dharma from custom, wisdom from hearsay, and devotion from performance.',
  founderLetterP10: 'Our ambition is larger than products. We are building trusted infrastructure for Hindu ritual life — the kind that helps a person practise with confidence and conviction, whether or not there\'s someone in the next room to ask. Because every generation deserves access to its own roots, on its own terms.',
  founderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  coreValuesHeading: 'OUR CORE VALUES',
  coreValuesSubtitle: 'What must never change',
  coreValuesIntro: 'As The Tapa Co. grows, products will evolve, categories will expand, technology will change. But these principles are not features. They are the foundation, and they stay fixed.',

  editorialSectionNumber: '4',
  editorialTitle: 'Our Editorial Method',
  editorialStandfirst: 'Every claim we publish is sorted into one of three categories before it is written.',
  editorialDharmaTitle: 'Dharma',
  editorialDharmaSub: 'SCRIPTURES',
  editorialDharmaDesc: 'A scriptural mandate. Stated in a named text you could go and check yourself. Not "the scriptures say." Not "it is well known." A named text.',
  editorialPrathaTitle: 'Pratha',
  editorialPrathaSub: 'CUSTOMS',
  editorialPrathaDesc: 'Regional, community or family custom. Widely practised, genuinely meaningful, not scripturally mandated. It is not lesser for that.',
  editorialBhrantiTitle: 'Bhranti',
  editorialBhrantiSub: 'CORRECTIONS',
  editorialBhrantiDesc: 'A misconception that needs correcting. Usually fear-based, usually forwarded, usually presented as compulsory. Corrected calmly, never mocked.',
  editorialRuleText: 'One rule holds the whole system up: if we cannot name a text you could go and check, it is not Dharma — however universal the practice feels.',
  editorialConsensusText: 'Consensus is not a citation.',
  editorialSeparatedText: 'Dharma and Pratha are always visibly separated on the page. Every article carries a Myths & Facts section.',
  editorialWeighTitle: 'Which texts, and how we weigh them',
  editorialWeighP1: 'Naming a source is not enough on its own — sources differ in authority, and pretending otherwise is its own kind of dishonesty. So every guidance claim carries a score alongside the named text.',
  editorialWeighP2: 'That last placement is a description, not a demotion. A stotra recited in millions of homes every morning loses nothing by being correctly identified as a composed work rather than a revealed one. Where the same claim also appears in a Purana, we cite the Purana and name the stotra separately as the text you actually recite.',
  editorialCtaText: 'Read the full method ›',
  editorialCtaUrl: '/editorial-method',

  glossarySectionNumber: '5',
  glossaryTitle: 'Glossary',
  glossaryStandfirst: 'Sankalp. Upavasa. Abhishek. Shodashopachara. Tithi and paksha.',
  glossaryParagraph1: 'Every Sanskrit term we use in a guide is defined here in ordinary language, with the Devanagari, a simple transliteration, and where the word comes from.',
  glossaryParagraph2: 'If you have ever nodded along at a term rather than asking what it meant, this page is for you.',
  glossaryCtaText: 'Open the glossary ›',
  glossaryCtaUrl: '/glossary',

  kitsSectionNumber: '7',
  kitsTitle: 'Our Ritual Kits Store',
  kitsStandfirst: 'Assembled to the ritual, not to a price point.',
  kitsParagraph1: 'A ritual kit exists to solve one problem: the samagri list. You know what you are observing and roughly how it goes, and then you are in a shop at eight in the morning trying to remember whether it was five bilva leaves or seven, and whether the panchamrit needs curd or just milk.',
  kitsParagraph2: 'Every Tapa kit is built backwards from a published guide. We write the vidhi first, from a named source. Then we list every item that vidhi actually requires. Then we assemble the kit to that list. Nothing is added to raise the price, and nothing is dropped to lower it.',
  kitsHeading: 'How each kit is built',
  kitsNote: 'Pre-booking opens 1 month before the occasions',
  kitsCtaText: 'See the Ritual Kits ›',
  kitsCtaUrl: '/ritual-kits',

  purohitSectionNumber: '8',
  purohitTitle: 'Puja with Purohit',
  purohitChipText: 'COMING SOON · NOVEMBER 2026',
  purohitParagraph: 'Some anushthans are better performed with someone who has done them a hundred times. Not because you cannot — you can, and every vidhi on this site is written so that you can, but because on the day, hosting twenty people and leading the mantras at the same time is a lot to hold.',
  purohitBookingHeading: 'What the booking includes',
  purohitArrangeHeading: 'What you will need to arrange',
  purohitNotHappenHeading: 'What will not happen',
  purohitNotHappenDesc: 'Our purohits do not upsell at the altar. They will not tell you that something is missing, that something extra is required, or that anything will go wrong. If a purohit associated with Tapa ever does, we want to hear about it, and they will not remain on our network.',
  purohitNotifyCtaText: 'Notify me when bookings open ›',

  circleSectionNumber: '9',
  circleTitle: 'The Tapa Circle',
  circlePriceChip: '₹499/year',
  circleStandfirst: 'The panchang and the guide, on WhatsApp, on the day you need them.',
  circleParagraph1: 'Most people do not want another app. They want to know that Ekadashi is on Thursday, and to have the right guide open when they sit down to do it.',
  circleParagraph2: 'The Circle sends the tithi, the vrat and festival dates, and the relevant ritual guide on the day it applies — on WhatsApp, where you already are. No forwards. No predictions. No messages about what happens if you miss something, because nothing happens if you miss something.',
  circleTrayTitle: 'How to subscribe',
  circleLeavingNote: 'Leaving: reply STOP at any time and it ends with that message. No confirmation call, no retention offer.',
  circleJoinCtaText: 'Join the Circle ›',

  closingLabel: 'THE ONE SENTENCE',
  closingPreText: 'Everything on this site follows from one sentence:',
  closingText: 'Tapa exists so that every Hindu who wants to practise their faith correctly can do so with confidence, without fear, and without being exploited by the systems that were supposed to help them.',
  closingLogo: LOGO_BASE64,

  coreValues: [
    { number: '01', title: 'Dharma before business.', description: 'Revenue can never come at the cost of truth.', sortOrder: 1 },
    { number: '02', title: 'Fear will never be our marketing strategy.', description: 'We will never manipulate people with guilt, superstition, or anxiety. Devotion should arise from love and understanding, not fear.', sortOrder: 2 },
    { number: '03', title: 'Knowledge comes before products.', description: 'Understanding is our first offering. Commerce is only ever a consequence of it.', sortOrder: 3 },
    { number: '04', title: 'Authenticity over convenience.', description: 'When faced with a choice, we choose what is faithful over what is fashionable.', sortOrder: 4 },
    { number: '05', title: 'We serve seekers, not customers.', description: 'Every interaction should leave people feeling more informed, more confident, and more connected to their faith.', sortOrder: 5 },
    { number: '06', title: 'Humility is non-negotiable.', description: 'No individual, no institution, and no company owns Dharma. We are students before we are builders.', sortOrder: 6 },
    { number: '07', title: 'Trust is sacred.', description: 'It takes years to build and moments to lose. We will protect it fiercely.', sortOrder: 7 },
  ],

  editorialSources: [
    { source: 'Shruti — Vedas, Upanishads', score: '5 / 5', sortOrder: 1 },
    { source: 'Mahapurana, Itihasa, Dharmashastra, Kalpa, Agama', score: '4 / 5', sortOrder: 2 },
    { source: 'Nibandha, bhashya, commentarial literature', score: '3 / 5', sortOrder: 3 },
    { source: 'Bhakti-period compositions — Ramcharitmanas, the stotras', score: '3 / 5', sortOrder: 4 },
    { source: 'Regional, oral and family custom', score: '1–2 / 5', sortOrder: 5 },
  ],

  kitPoints: [
    { title: 'Sourced from the guide.', description: 'If an item is in the kit, it appears in a step of the vidhi on our site. If it does not appear in the vidhi, it is not in the box.', sortOrder: 1 },
    { title: 'Tagged.', description: 'The printed vidhi card inside marks which steps are Dharma and which are Pratha. Where we have included something customary — an item your region uses and another does not — it is labelled as custom, so you can use it or set it aside without wondering.', sortOrder: 2 },
    { title: 'Complete for the ritual, not for the shelf.', description: 'Quantities match one observance of that puja. We would rather you buy the right kit once than a general samagri box four times.', sortOrder: 3 },
    { title: 'Fresh items are named, not included.', description: 'Flowers, milk, curd, fruit and bhog cannot travel well and should not. Every kit lists exactly what to pick up and how much of it.', sortOrder: 4 },
    { title: 'One price. One version.', description: 'No premium tier, no economy tier, no deluxe box with the same contents in better packaging. A ritual does not have a budget version.', sortOrder: 5 },
  ],

  purohitBookingPoints: [
    { title: 'A verified purohit for your chosen anushthan, performed in full.', description: 'There is no shortened version and no extended version. One puja, one price.', sortOrder: 1 },
    { title: 'The complete puja samagri comes with the purohit.', description: 'It is part of your package, carried to your home on the day. You do not shop for it, and you are not asked for it at the door.', sortOrder: 2 },
  ],

  purohitArrangementPoints: [
    { title: 'Fresh items are not included,', description: 'because they should not be sitting in a box overnight. Flowers, milk, curd, and the bhog prasad you intend to offer are yours to arrange.', sortOrder: 1 },
    { title: 'You will receive the full list one day before the puja', description: '— every item, with quantities. Not a vague reminder on the morning of. A specific list, the day before, so you can pick it up on your way home.', sortOrder: 2 },
  ],

  circleSteps: [
    { title: 'Enter your WhatsApp number', description: 'The number you actually use. This is the only detail we ask for.', sortOrder: 1 },
    { title: 'Pay ₹499', description: 'UPI, card or netbanking. One payment, covering twelve months from the day you join. It does not auto-renew — we will tell you when the year is ending and you can decide then.', sortOrder: 2 },
    { title: 'Confirm on WhatsApp', description: 'You will receive one message asking you to confirm. Reply to it and you are in. If you do not reply, nothing is sent and we refund you.', sortOrder: 3 },
    { title: 'The first message arrives on the next relevant date', description: 'Not immediately, and not daily. The welcome note tells you exactly what the next date is and when to expect it.', sortOrder: 4 },
  ],
};

const globalForAbout = global as unknown as {
  inMemoryAboutPageData?: AboutPageFullData;
};

export function getInMemoryAboutData(): AboutPageFullData {
  if (!globalForAbout.inMemoryAboutPageData) {
    globalForAbout.inMemoryAboutPageData = JSON.parse(JSON.stringify(INITIAL_ABOUT_DATA));
  }
  return globalForAbout.inMemoryAboutPageData || INITIAL_ABOUT_DATA;
}

export function setInMemoryAboutData(data: AboutPageFullData): AboutPageFullData {
  globalForAbout.inMemoryAboutPageData = data;
  return globalForAbout.inMemoryAboutPageData;
}

export async function seedAboutPageDB(): Promise<void> {
  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      const existing = await prisma.aboutPage.findUnique({
        where: { key: 'default' },
      });

      if (!existing) {
        const {
          coreValues,
          editorialSources,
          kitPoints,
          purohitBookingPoints,
          purohitArrangementPoints,
          circleSteps,
          ...mainData
        } = INITIAL_ABOUT_DATA;

        await prisma.aboutPage.create({
          data: {
            ...mainData,
            key: 'default',
            coreValues: {
              create: coreValues.map((v) => ({
                number: v.number,
                title: v.title,
                description: v.description,
                sortOrder: v.sortOrder || 0,
              })),
            },
            editorialSources: {
              create: editorialSources.map((s) => ({
                source: s.source,
                score: s.score,
                sortOrder: s.sortOrder || 0,
              })),
            },
            kitPoints: {
              create: kitPoints.map((p) => ({
                title: p.title,
                description: p.description,
                sortOrder: p.sortOrder || 0,
              })),
            },
            purohitBookingPoints: {
              create: purohitBookingPoints.map((p) => ({
                title: p.title,
                description: p.description,
                sortOrder: p.sortOrder || 0,
              })),
            },
            purohitArrangementPoints: {
              create: purohitArrangementPoints.map((p) => ({
                title: p.title,
                description: p.description,
                sortOrder: p.sortOrder || 0,
              })),
            },
            circleSteps: {
              create: circleSteps.map((s) => ({
                title: s.title,
                description: s.description,
                sortOrder: s.sortOrder || 0,
              })),
            },
          },
        });
      }
    } catch (err) {
      console.warn('[About Store] Seed DB warning:', err);
    }
  }
}

export async function getPublicAboutServer(): Promise<AboutPageFullData> {
  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      await seedAboutPageDB();
      const page = await prisma.aboutPage.findUnique({
        where: { key: 'default' },
        include: {
          coreValues: { orderBy: { sortOrder: 'asc' } },
          editorialSources: { orderBy: { sortOrder: 'asc' } },
          kitPoints: { orderBy: { sortOrder: 'asc' } },
          purohitBookingPoints: { orderBy: { sortOrder: 'asc' } },
          purohitArrangementPoints: { orderBy: { sortOrder: 'asc' } },
          circleSteps: { orderBy: { sortOrder: 'asc' } },
        },
      });

      if (page) {
        return {
          ...page,
          heroEyebrow: page.heroEyebrow || INITIAL_ABOUT_DATA.heroEyebrow,
          heroTitle: page.heroTitle || INITIAL_ABOUT_DATA.heroTitle,
          heroStandfirst: page.heroStandfirst || INITIAL_ABOUT_DATA.heroStandfirst,
          heroParagraph1: page.heroParagraph1 || INITIAL_ABOUT_DATA.heroParagraph1,
          heroParagraph2: page.heroParagraph2 || INITIAL_ABOUT_DATA.heroParagraph2,
          heroPullQuote: page.heroPullQuote || INITIAL_ABOUT_DATA.heroPullQuote,
          filmLogo: page.filmLogo || INITIAL_ABOUT_DATA.filmLogo,
          filmSpec: page.filmSpec || INITIAL_ABOUT_DATA.filmSpec,
          whySectionNumber: page.whySectionNumber || INITIAL_ABOUT_DATA.whySectionNumber,
          whyTitleDevanagari: page.whyTitleDevanagari || INITIAL_ABOUT_DATA.whyTitleDevanagari,
          whyDevanagariDesc: page.whyDevanagariDesc || INITIAL_ABOUT_DATA.whyDevanagariDesc,
          whyParagraph2: page.whyParagraph2 || INITIAL_ABOUT_DATA.whyParagraph2,
          founderTrayTitle: page.founderTrayTitle || INITIAL_ABOUT_DATA.founderTrayTitle,
          founderName: page.founderName || INITIAL_ABOUT_DATA.founderName,
          founderDesignation: page.founderDesignation || INITIAL_ABOUT_DATA.founderDesignation,
          founderLetterTitle: page.founderLetterTitle || INITIAL_ABOUT_DATA.founderLetterTitle,
          founderLetterP1: page.founderLetterP1 || INITIAL_ABOUT_DATA.founderLetterP1,
          founderLetterP2: page.founderLetterP2 || INITIAL_ABOUT_DATA.founderLetterP2,
          founderLetterP3: page.founderLetterP3 || INITIAL_ABOUT_DATA.founderLetterP3,
          founderLetterP4: page.founderLetterP4 || INITIAL_ABOUT_DATA.founderLetterP4,
          founderLetterP5: page.founderLetterP5 || INITIAL_ABOUT_DATA.founderLetterP5,
          founderFamilyImage: page.founderFamilyImage || INITIAL_ABOUT_DATA.founderFamilyImage,
          founderFamilyCaption: page.founderFamilyCaption || INITIAL_ABOUT_DATA.founderFamilyCaption,
          founderPullQuote1: page.founderPullQuote1 || INITIAL_ABOUT_DATA.founderPullQuote1,
          founderLetterP6: page.founderLetterP6 || INITIAL_ABOUT_DATA.founderLetterP6,
          founderLetterP7: page.founderLetterP7 || INITIAL_ABOUT_DATA.founderLetterP7,
          founderLetterP8: page.founderLetterP8 || INITIAL_ABOUT_DATA.founderLetterP8,
          founderSignatureName: page.founderSignatureName || INITIAL_ABOUT_DATA.founderSignatureName,
          founderSignatureTitle: page.founderSignatureTitle || INITIAL_ABOUT_DATA.founderSignatureTitle,
          founderSignatureCompany: page.founderSignatureCompany || INITIAL_ABOUT_DATA.founderSignatureCompany,
          founderPullQuote2: page.founderPullQuote2 || INITIAL_ABOUT_DATA.founderPullQuote2,
          founderLetterP9: page.founderLetterP9 || INITIAL_ABOUT_DATA.founderLetterP9,
          founderLetterP10: page.founderLetterP10 || INITIAL_ABOUT_DATA.founderLetterP10,
          founderAvatar: page.founderAvatar || INITIAL_ABOUT_DATA.founderAvatar,
          coreValuesHeading: page.coreValuesHeading || INITIAL_ABOUT_DATA.coreValuesHeading,
          coreValuesSubtitle: page.coreValuesSubtitle || INITIAL_ABOUT_DATA.coreValuesSubtitle,
          coreValuesIntro: page.coreValuesIntro || INITIAL_ABOUT_DATA.coreValuesIntro,
          editorialSectionNumber: page.editorialSectionNumber || INITIAL_ABOUT_DATA.editorialSectionNumber,
          editorialTitle: page.editorialTitle || INITIAL_ABOUT_DATA.editorialTitle,
          editorialStandfirst: page.editorialStandfirst || INITIAL_ABOUT_DATA.editorialStandfirst,
          editorialDharmaTitle: page.editorialDharmaTitle || INITIAL_ABOUT_DATA.editorialDharmaTitle,
          editorialDharmaSub: page.editorialDharmaSub || INITIAL_ABOUT_DATA.editorialDharmaSub,
          editorialDharmaDesc: page.editorialDharmaDesc || INITIAL_ABOUT_DATA.editorialDharmaDesc,
          editorialPrathaTitle: page.editorialPrathaTitle || INITIAL_ABOUT_DATA.editorialPrathaTitle,
          editorialPrathaSub: page.editorialPrathaSub || INITIAL_ABOUT_DATA.editorialPrathaSub,
          editorialPrathaDesc: page.editorialPrathaDesc || INITIAL_ABOUT_DATA.editorialPrathaDesc,
          editorialBhrantiTitle: page.editorialBhrantiTitle || INITIAL_ABOUT_DATA.editorialBhrantiTitle,
          editorialBhrantiSub: page.editorialBhrantiSub || INITIAL_ABOUT_DATA.editorialBhrantiSub,
          editorialBhrantiDesc: page.editorialBhrantiDesc || INITIAL_ABOUT_DATA.editorialBhrantiDesc,
          editorialRuleText: page.editorialRuleText || INITIAL_ABOUT_DATA.editorialRuleText,
          editorialConsensusText: page.editorialConsensusText || INITIAL_ABOUT_DATA.editorialConsensusText,
          editorialSeparatedText: page.editorialSeparatedText || INITIAL_ABOUT_DATA.editorialSeparatedText,
          editorialWeighTitle: page.editorialWeighTitle || INITIAL_ABOUT_DATA.editorialWeighTitle,
          editorialWeighP1: page.editorialWeighP1 || INITIAL_ABOUT_DATA.editorialWeighP1,
          editorialWeighP2: page.editorialWeighP2 || INITIAL_ABOUT_DATA.editorialWeighP2,
          editorialCtaText: page.editorialCtaText || INITIAL_ABOUT_DATA.editorialCtaText,
          editorialCtaUrl: page.editorialCtaUrl || INITIAL_ABOUT_DATA.editorialCtaUrl,
          glossarySectionNumber: page.glossarySectionNumber || INITIAL_ABOUT_DATA.glossarySectionNumber,
          glossaryTitle: page.glossaryTitle || INITIAL_ABOUT_DATA.glossaryTitle,
          glossaryStandfirst: page.glossaryStandfirst || INITIAL_ABOUT_DATA.glossaryStandfirst,
          glossaryParagraph1: page.glossaryParagraph1 || INITIAL_ABOUT_DATA.glossaryParagraph1,
          glossaryParagraph2: page.glossaryParagraph2 || INITIAL_ABOUT_DATA.glossaryParagraph2,
          glossaryCtaText: page.glossaryCtaText || INITIAL_ABOUT_DATA.glossaryCtaText,
          glossaryCtaUrl: page.glossaryCtaUrl || INITIAL_ABOUT_DATA.glossaryCtaUrl,
          kitsSectionNumber: page.kitsSectionNumber || INITIAL_ABOUT_DATA.kitsSectionNumber,
          kitsTitle: page.kitsTitle || INITIAL_ABOUT_DATA.kitsTitle,
          kitsStandfirst: page.kitsStandfirst || INITIAL_ABOUT_DATA.kitsStandfirst,
          kitsParagraph1: page.kitsParagraph1 || INITIAL_ABOUT_DATA.kitsParagraph1,
          kitsParagraph2: page.kitsParagraph2 || INITIAL_ABOUT_DATA.kitsParagraph2,
          kitsHeading: page.kitsHeading || INITIAL_ABOUT_DATA.kitsHeading,
          kitsNote: page.kitsNote || INITIAL_ABOUT_DATA.kitsNote,
          kitsCtaText: page.kitsCtaText || INITIAL_ABOUT_DATA.kitsCtaText,
          kitsCtaUrl: page.kitsCtaUrl || INITIAL_ABOUT_DATA.kitsCtaUrl,
          purohitSectionNumber: page.purohitSectionNumber || INITIAL_ABOUT_DATA.purohitSectionNumber,
          purohitTitle: page.purohitTitle || INITIAL_ABOUT_DATA.purohitTitle,
          purohitChipText: page.purohitChipText || INITIAL_ABOUT_DATA.purohitChipText,
          purohitParagraph: page.purohitParagraph || INITIAL_ABOUT_DATA.purohitParagraph,
          purohitBookingHeading: page.purohitBookingHeading || INITIAL_ABOUT_DATA.purohitBookingHeading,
          purohitArrangeHeading: page.purohitArrangeHeading || INITIAL_ABOUT_DATA.purohitArrangeHeading,
          purohitNotHappenHeading: page.purohitNotHappenHeading || INITIAL_ABOUT_DATA.purohitNotHappenHeading,
          purohitNotHappenDesc: page.purohitNotHappenDesc || INITIAL_ABOUT_DATA.purohitNotHappenDesc,
          purohitNotifyCtaText: page.purohitNotifyCtaText || INITIAL_ABOUT_DATA.purohitNotifyCtaText,
          circleSectionNumber: page.circleSectionNumber || INITIAL_ABOUT_DATA.circleSectionNumber,
          circleTitle: page.circleTitle || INITIAL_ABOUT_DATA.circleTitle,
          circlePriceChip: page.circlePriceChip || INITIAL_ABOUT_DATA.circlePriceChip,
          circleStandfirst: page.circleStandfirst || INITIAL_ABOUT_DATA.circleStandfirst,
          circleParagraph1: page.circleParagraph1 || INITIAL_ABOUT_DATA.circleParagraph1,
          circleParagraph2: page.circleParagraph2 || INITIAL_ABOUT_DATA.circleParagraph2,
          circleTrayTitle: page.circleTrayTitle || INITIAL_ABOUT_DATA.circleTrayTitle,
          circleLeavingNote: page.circleLeavingNote || INITIAL_ABOUT_DATA.circleLeavingNote,
          circleJoinCtaText: page.circleJoinCtaText || INITIAL_ABOUT_DATA.circleJoinCtaText,
          closingLabel: page.closingLabel || INITIAL_ABOUT_DATA.closingLabel,
          closingPreText: page.closingPreText || INITIAL_ABOUT_DATA.closingPreText,
          closingText: page.closingText || INITIAL_ABOUT_DATA.closingText,
          closingLogo: page.closingLogo || INITIAL_ABOUT_DATA.closingLogo,
          coreValues: page.coreValues && page.coreValues.length > 0 ? page.coreValues : INITIAL_ABOUT_DATA.coreValues,
          editorialSources: page.editorialSources && page.editorialSources.length > 0 ? page.editorialSources : INITIAL_ABOUT_DATA.editorialSources,
          kitPoints: page.kitPoints && page.kitPoints.length > 0 ? page.kitPoints : INITIAL_ABOUT_DATA.kitPoints,
          purohitBookingPoints: page.purohitBookingPoints && page.purohitBookingPoints.length > 0 ? page.purohitBookingPoints : INITIAL_ABOUT_DATA.purohitBookingPoints,
          purohitArrangementPoints: page.purohitArrangementPoints && page.purohitArrangementPoints.length > 0 ? page.purohitArrangementPoints : INITIAL_ABOUT_DATA.purohitArrangementPoints,
          circleSteps: page.circleSteps && page.circleSteps.length > 0 ? page.circleSteps : INITIAL_ABOUT_DATA.circleSteps,
        };
      }
    } catch (err) {
      console.warn('[About Store] DB query fallback:', err);
    }
  }

  return getInMemoryAboutData();
}
