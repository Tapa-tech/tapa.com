export interface ReassuranceItem {
  icon: string;
  text: string;
}

export interface ChipItem {
  label: string;
  href: string;
}

export interface KandaItem {
  id: string;
  number: number;
  title: string;
  devanagari: string;
  summary: string;
  badge?: string;
  isNow?: boolean;
}

export interface LadderPathItem {
  id: string;
  badgeText: string;
  badgeClass: 'rg' | 'dc' | 'pa';
  title: string;
  subtitle: string;
  href?: string;
}

export interface WorryItem {
  id: string;
  question: string;
  answer: string;
}

export interface RevenueCardItem {
  id: string;
  type: 'live' | 'feat' | 'soon';
  icon: string;
  label: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonClass?: string;
  href?: string;
}

export interface SidebarConfig {
  kandasSequenceTitle: string;
  kandasSequence: Array<{
    number: number;
    title: string;
    isNow?: boolean;
  }>;
  primaryCta?: {
    icon?: string;
    title: string;
    subtext: string;
    type: 'wa' | 'dk';
  };
  companionGuide?: {
    header: string;
    badge: string;
    description: string;
    buttonText: string;
    href?: string;
  };
  whyNoSources?: {
    header: string;
    paragraphs: string[];
  };
}

export interface StickyBarConfig {
  subscribeText: string;
  subscribePrice: string;
  prebookText: string;
  prebookPrice: string;
}

export interface BeginnerGuide {
  slug: string;
  breadcrumbCategory: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  heroTag: string;
  heroPrimaryCta: {
    label: string;
    targetId?: string;
  };
  heroSecondaryCta: {
    label: string;
  };
  reassuranceItems: ReassuranceItem[];
  chips: ChipItem[];
  openingText: string;
  introParagraphs: string[];
  heroArtImage?: {
    src: string;
    alt: string;
  };
  section1Title: {
    num: string;
    title: string;
    subtitle: string;
    anchorId: string;
  };
  kandas: KandaItem[];
  section2Title: {
    num: string;
    title: string;
    anchorId: string;
  };
  section2Paragraphs: string[];
  quoteTurn?: string;
  section3Title: {
    num: string;
    title: string;
    anchorId: string;
  };
  ladderPaths: LadderPathItem[];
  section4Title: {
    num: string;
    title: string;
    anchorId: string;
  };
  worries: WorryItem[];
  closingParagraphs: string[];
  revenueCards: RevenueCardItem[];
  revenueNote: string;
  sidebar: SidebarConfig;
  stickyBar: StickyBarConfig;
}
