export interface BrandBandData {
  tagline: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  hindiText: string;
}

export interface UtilityBandData {
  searchPlaceholder: string;
  authText: string;
  signInText: string;
  signUpText: string;
}

export interface SitemapCategoryColumn {
  title: string;
  links: {
    label: string;
    href: string;
    isLead?: boolean;
  }[];
  allLinkText: string;
  allLinkHref: string;
}

export interface SitemapPreBookingBox {
  title: string;
  statusText: string;
  statusSubtext: string;
  linkText?: string;
  linkHref?: string;
}

export interface SitemapBandData {
  browseHeading: string;
  categories: SitemapCategoryColumn[];
  preBookingBoxes: SitemapPreBookingBox[];
}

export interface ColumnsBandLink {
  label: string;
  href: string;
  badgeText?: string;
  isLocked?: boolean;
  isCursorPointer?: boolean;
}

export interface ColumnsBandColumn {
  header: string;
  links: ColumnsBandLink[];
}

export interface ContactReachItem {
  iconType: 'whatsapp' | 'email' | 'form';
  title: string;
  subtitle: string;
  href: string;
}

export interface SocialLinkItem {
  key: string;
  label: string;
  href: string;
  title: string;
}

export interface ColumnsBandData {
  columns: ColumnsBandColumn[];
  contactSubheading: string;
  contactItems: ContactReachItem[];
  followSubheading: string;
  socialLinks: SocialLinkItem[];
}

export interface CorrectionsBandData {
  heading: string;
  paragraph: string;
  reportCtaText: string;
  reportCtaHref: string;
}

export interface LegalBandData {
  policyLinks: {
    label: string;
    href?: string;
  }[];
  grievanceHeading: string;
  grievanceOfficerName: string;
  grievanceOfficerTitle: string;
  grievanceEmail: string;
  grievancePhone: string;
  grievanceNotice: string;
  companyEntityText: string;
  companyAddress: string;
  copyrightText: string;
  locationTag: string;
}

export interface FooterConfigData {
  id?: string;
  key: string;
  brand: BrandBandData;
  utility: UtilityBandData;
  sitemap: SitemapBandData;
  columns: ColumnsBandData;
  corrections: CorrectionsBandData;
  legal: LegalBandData;
  status?: string;
}

export const INITIAL_FOOTER_CONFIG: FooterConfigData = {
  key: 'default',
  brand: {
    tagline: 'Not fear. <em>Only devotion.</em>',
    subtitle: 'Every ritual explained from a named source — so you know what comes from scripture, what comes from your family, and what is simply a rumour.',
    ctaText: 'Read our editorial method ›',
    ctaHref: '/editorial-method',
    hindiText: 'हर अनुष्ठान, सही विधि से',
  },
  utility: {
    searchPlaceholder: 'Search rituals',
    authText: 'Save rituals, track orders, manage reminders',
    signInText: 'Sign in',
    signUpText: 'Create account',
  },
  sitemap: {
    browseHeading: 'BROWSE BY CATEGORY',
    categories: [
      {
        title: 'Ritual Guides',
        links: [
          { label: "Beginner's Guides", href: '/ritual-guides', isLead: true },
          { label: 'Festive Pujans', href: '/ritual-guides' },
          { label: 'All-Year Pujans', href: '/ritual-guides' },
          { label: 'Sanskar & Life Events', href: '/ritual-guides' },
        ],
        allLinkText: 'All Ritual Guides ›',
        allLinkHref: '/ritual-guides',
      },
      {
        title: 'Panchang',
        links: [
          { label: "Today's Panchang", href: '/panchang' },
          { label: 'Vrat Calendar', href: '/panchang/vrat-calendar' },
          { label: 'Festival Calendar', href: '/panchang/festival-calendar' },
          { label: 'Tithi & Paksha', href: '/panchang' },
          { label: 'Eclipses', href: '/panchang/eclipses' },
        ],
        allLinkText: 'All Panchang ›',
        allLinkHref: '/panchang',
      },
      {
        title: 'Dharmic Concepts',
        links: [
          { label: 'Materials', href: '/dharmic-concepts' },
          { label: 'Meanings & Practices', href: '/dharmic-concepts' },
          { label: 'Daily Puja', href: '/dharmic-concepts' },
          { label: 'Dharma vs Pratha', href: '/dharmic-concepts' },
          { label: 'Mantras', href: '/dharmic-concepts' },
        ],
        allLinkText: 'All Concepts ›',
        allLinkHref: '/dharmic-concepts',
      },
      {
        title: 'Ritual Kits',
        links: [
          { label: 'Ganesh Sthapana Kit', href: '/ritual-kits' },
          { label: 'Hartalika Teej Kit', href: '/ritual-kits' },
          { label: 'Shakti Kit', href: '/ritual-kits' },
          { label: 'Shiva Puja Kit', href: '/ritual-kits' },
        ],
        allLinkText: 'All Kits ›',
        allLinkHref: '/ritual-kits',
      },
    ],
    preBookingBoxes: [
      {
        title: 'Ritual Kits Pre-Booking',
        statusText: 'Open now for Ganesh Chaturthi & Teej',
        statusSubtext: 'Prepaid orders only · Free cancellation until dispatch',
      },
      {
        title: 'Purohit & Puja Booking',
        statusText: 'November 2026',
        statusSubtext: 'Verified purohits, fixed dakhshina · ',
        linkText: 'Join network ›',
        linkHref: '/about',
      },
      {
        title: 'Bhajan Mandali',
        statusText: 'Coming soon',
        statusSubtext: 'Verified singers for kirtan and chowki',
      },
    ],
  },
  columns: {
    columns: [
      {
        header: 'ABOUT',
        links: [
          { label: 'Why तप्', href: '/about' },
          { label: 'Our Editorial Method', href: '/editorial-method' },
          { label: 'Scripture References', href: '/editorial-method' },
          { label: 'Glossary', href: '/glossary' },
          { label: 'The Tapa Circle', href: '/account', badgeText: '₹499/YR' },
          { label: 'Join the Purohit Network', href: '/about' },
          { label: 'For Retailers', href: '#', isLocked: true },
        ],
      },
      {
        header: 'HELP',
        links: [
          { label: 'Track Your Order', href: '#', isLocked: true },
          { label: 'Shipping & Delivery', href: '#', isLocked: true },
          { label: 'Returns & Refunds', href: '#', isLocked: true },
          { label: 'Cancellations', href: '#', isLocked: true },
          { label: 'Payment & COD', href: '#', isLocked: true },
          { label: 'FAQs', href: '/about' },
          { label: 'Contact Support', href: '/about' },
        ],
      },
      {
        header: 'FOR YOU',
        links: [
          { label: 'My Account', href: '/account' },
          { label: 'Saved Rituals', href: '/account' },
          { label: 'Order History', href: '#', isLocked: true },
          { label: 'My Reminders', href: '/account' },
          { label: 'Notification Preferences', href: '/account' },
          { label: 'English / हिंदी', href: '#', isCursorPointer: true },
        ],
      },
    ],
    contactSubheading: 'GET IN TOUCH',
    contactItems: [
      {
        iconType: 'whatsapp',
        title: 'Chat on WhatsApp',
        subtitle: 'Support · Mon–Sat, 10am–7pm IST',
        href: '#',
      },
      {
        iconType: 'email',
        title: 'Email us',
        subtitle: 'hello@thetapaco.com',
        href: 'mailto:hello@thetapaco.com',
      },
      {
        iconType: 'form',
        title: 'Contact form',
        subtitle: 'Partnerships, press, everything else',
        href: '#',
      },
    ],
    followSubheading: 'FOLLOW',
    socialLinks: [
      { key: 'IG', label: 'IG', href: 'https://www.instagram.com/thetapaco', title: 'Instagram' },
      { key: 'FB', label: 'FB', href: 'https://www.facebook.com/thetapaco', title: 'Facebook' },
      { key: 'LI', label: 'LI', href: 'https://www.linkedin.com/company/thetapaco/', title: 'LinkedIn' },
      { key: 'WEB', label: 'WEB', href: 'https://thetapaco.com/', title: 'Website' },
    ],
  },
  corrections: {
    heading: 'Every article carries a named source.',
    paragraph:
      'Where a practice comes from scripture, we cite the text. Where it comes from custom, we say so. Where it is a misconception, we correct it. Find an error and we will fix it, and record the correction.',
    reportCtaText: 'Report a correction ›',
    reportCtaHref: '#',
  },
  legal: {
    policyLinks: [
      { label: 'Terms of Use' },
      { label: 'Privacy Policy' },
      { label: 'Shipping Policy' },
      { label: 'Returns & Refunds' },
      { label: 'Cancellation Policy' },
      { label: 'Grievance Redressal' },
      { label: 'Sitemap' },
    ],
    grievanceHeading: 'GRIEVANCE OFFICER',
    grievanceOfficerName: '[Grievance Officer Name]',
    grievanceOfficerTitle: 'Lead Compliance',
    grievanceEmail: 'grievance@thetapaco.com',
    grievancePhone: '+91 124 456 7890',
    grievanceNotice: 'Response within 48 hours, per Consumer Protection (E-Commerce) Rules, 2020.',
    companyEntityText: 'Tale Scale Networks Private Limited · CIN U74999HR2026PTC123456 · GSTIN 06AAACT1234F1Z2',
    companyAddress: 'Sector 43, Gurgaon, Haryana 122002',
    copyrightText: '© 2026 Tale Scale Networks Private Limited. All rights reserved.',
    locationTag: 'Made in Gurgaon',
  },
};
