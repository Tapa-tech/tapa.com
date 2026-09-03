export interface TrustItem {
  title: string;
  subtitle: string;
}

export interface KnowledgeFirstItem {
  icon: string;
  title: string;
  subtitle: string;
}

export interface KnowledgeFirstConfig {
  eyebrow: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  items: KnowledgeFirstItem[];
}

export interface CategoryCardItem {
  key: string;
  icon: string;
  themeClass: string; // "a" | "b" | "c"
  title: string;
  href: string;
  description: string;
  chips: string[];
  ctaText: string;
}

export interface HomepageSectionsData {
  trustItems: TrustItem[];
  knowledgeFirst: KnowledgeFirstConfig;
  categoryCards: CategoryCardItem[];
}

export const INITIAL_HOMEPAGE_SECTIONS: HomepageSectionsData = {
  trustItems: [
    {
      title: 'Delivered before the date',
      subtitle: 'Or your money back. Cut-off dates shown on every kit.',
    },
    {
      title: 'Cash on delivery',
      subtitle: 'Available on serviceable pincodes across Delhi-NCR.',
    },
    {
      title: 'Sourced, not resold',
      subtitle: 'Chandni Chowk, Moradabad, Khurja, Haridwar, Varanasi.',
    },
    {
      title: 'A booklet in every kit',
      subtitle: 'Gyan Patrika — the why, not just the what.',
    },
  ],
  knowledgeFirst: {
    eyebrow: 'BEFORE YOU BUY ANYTHING',
    title: 'You do not need a kit to perform any of this',
    description:
      'Every ritual guide on this platform is free, complete, and will stay that way. The samagri list is published in full, with substitutions where an item is hard to find. A kit saves you a morning in the market. It does not make the puja more valid, and we will never suggest otherwise.',
    ctaText: 'Read a guide instead ›',
    ctaHref: '/ritual-guides',
    items: [
      {
        icon: '📋',
        title: 'The full samagri list is free',
        subtitle: 'Published on every guide, with substitutions.',
      },
      {
        icon: '🪔',
        title: 'A sincere substitute is accepted',
        subtitle: 'If an item is unavailable where you live, the tradition allows for it.',
      },
      {
        icon: '🙏',
        title: 'No pandit required',
        subtitle: 'Any devotee can perform household puja. That is Dharma, not our opinion.',
      },
    ],
  },
  categoryCards: [
    {
      key: 'rg',
      icon: '🪔',
      themeClass: 'a',
      title: 'Ritual Guides',
      href: '/ritual-guides',
      description:
        "The complete vidhi for a festival or vrat — step by step, every claim tagged and sourced. Start with Beginner's Guides if this is your first time.",
      chips: ["Beginner's Guides", 'Festive', 'All-Year', 'Navagraha'],
      ctaText: 'Browse ritual guides ›',
    },
    {
      key: 'pa',
      icon: '☀',
      themeClass: 'b',
      title: 'Panchang',
      href: '/panchang',
      description:
        "Today's tithi, paksha, nakshatra and sunrise — and the year's full vrat calendar. Learn to read it yourself instead of asking every time.",
      chips: ['Today', '2026 Vrat Calendar', 'Eclipses'],
      ctaText: 'Open Panchang ›',
    },
    {
      key: 'dc',
      icon: '🌿',
      themeClass: 'c',
      title: 'Dharmic Concepts',
      href: '/dharmic-concepts',
      description:
        'Why bilva and not tulsi. Why midnight and not dawn. The object in your hand has a story, and it is usually older than the ritual.',
      chips: ['Materials', 'Practices', 'Ideas'],
      ctaText: 'Explore concepts ›',
    },
  ],
};
