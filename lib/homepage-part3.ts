export interface MythItemData {
  question: string;
  correction: string;
}

export interface MythsSectionData {
  eyebrow: string;
  title: string;
  description: string;
  items: MythItemData[];
}

export interface EditorialPillarData {
  key: string;
  title: string;
  description: string;
}

export interface EditorialMethodSectionData {
  eyebrow: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  pillars: EditorialPillarData[];
}

export interface TapaCircleSectionData {
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

export interface HomepagePart3Data {
  myths: MythsSectionData;
  editorialMethod: EditorialMethodSectionData;
  tapaCircle: TapaCircleSectionData;
}

export const INITIAL_HOMEPAGE_PART3: HomepagePart3Data = {
  myths: {
    eyebrow: 'THE PART NOBODY ELSE PUBLISHES',
    title: 'Corrections, not warnings',
    description:
      'Every guide ends with the misconceptions attached to that ritual, and what the source text actually says. Selling you a kit does not change what we print here.',
    items: [
      {
        question: '"Only a pandit can perform Ganesh Sthapana."',
        correction:
          'Nothing in the source tradition restricts prana pratishtha to priests. A pandit adds timing precision and convenience — not validity.',
      },
      {
        question: '"Seeing the moon on Chaturthi brings misfortune."',
        correction:
          'The Syamantaka Mani story is a Puranic narrative, not a basis for fear. The traditional response is reciting a verse — nothing lasting is held to follow.',
      },
      {
        question: '"A bought kit is less sincere than one you assemble."',
        correction:
          'No text ranks devotion by where the samagri came from. Equally, no text says you need a kit. Both are conveniences. Neither is the vrat.',
      },
    ],
  },
  editorialMethod: {
    eyebrow: 'HOW WE DECIDE WHAT IS TRUE',
    title: 'Every claim is tagged, scored, and traceable to a named text',
    description:
      'If we cannot name the text a reader could check, we do not make the claim. Where something is your family\'s custom rather than scripture, we say so. Commerce does not get a vote in this.',
    ctaText: 'Read our editorial method ›',
    ctaHref: '/editorial-method',
    pillars: [
      {
        key: 'dharma',
        title: 'DHARMA',
        description: 'Named in a text you could open yourself. Carries a confidence score out of five.',
      },
      {
        key: 'pratha',
        title: 'PRATHA',
        description:
          'Regional or family custom. Real, valid, worth keeping — but not scripture, and we will not pretend it is.',
      },
      {
        key: 'bhranti',
        title: 'BHRANTI',
        description: 'A misconception, usually fear-based. Corrected in plain language, every time.',
      },
    ],
  },
  tapaCircle: {
    badge: 'THE TAPA CIRCLE',
    title: 'Never miss a date, or a cut-off',
    description:
      'Festival and vrat reminders on WhatsApp, with the guide attached and the kit cut-off if there is one. ₹499 a year.',
    ctaText: 'Join the Tapa Circle ›',
    ctaHref: '/account',
  },
};
