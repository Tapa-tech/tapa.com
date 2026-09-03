import { prisma } from '@/lib/db';

export interface GlossaryTermData {
  id?: string;
  term: string;
  slug: string;
  language: string;
  devanagari?: string | null;
  pronunciation?: string | null;
  category: string; // MATERIAL, PRACTICE, TIME, TEXT
  definition: string;
  appearsInJson?: string | null;
  relatedConceptTitle?: string | null;
  relatedConceptSlug?: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const INITIAL_STATIC_GLOSSARY_TERMS: GlossaryTermData[] = [
  {
    term: 'Aarti',
    slug: 'aarti',
    language: 'HINDI',
    devanagari: 'आरती',
    pronunciation: 'aar-tee',
    category: 'PRACTICE',
    definition: 'The closing act of a puja. A lit lamp is circled in front of the deity while a song is sung, and the flame is then offered to everyone present.',
    appearsInJson: JSON.stringify(['Sharad Navratri', 'Diwali for Beginners']),
    relatedConceptTitle: null,
    relatedConceptSlug: null,
    status: 'PUBLISHED',
    displayOrder: 1,
  },
  {
    term: 'Abhishek',
    slug: 'abhishek',
    language: 'SANSKRIT',
    devanagari: 'अभिषेक',
    pronunciation: 'a-bhi-shek',
    category: 'PRACTICE',
    definition: 'Bathing the deity — water, milk, honey or panchamrit poured over an idol or Shivalinga while mantras are recited.',
    appearsInJson: JSON.stringify(['Sawan Somwar Vrat']),
    relatedConceptTitle: 'Abhishek — why the pouring',
    relatedConceptSlug: 'abhishek',
    status: 'PUBLISHED',
    displayOrder: 2,
  },
  {
    term: 'Akhand Jyoti',
    slug: 'akhand-jyoti',
    language: 'SANSKRIT',
    devanagari: 'अखण्ड ज्योति',
    pronunciation: 'a-khand jyo-ti',
    category: 'PRACTICE',
    definition: 'A lamp kept continuously lit through an observance, most often across the nine nights of Navratri. Relight it if it goes out; nothing is void.',
    appearsInJson: JSON.stringify(['Sharad Navratri']),
    relatedConceptTitle: null,
    relatedConceptSlug: null,
    status: 'PUBLISHED',
    displayOrder: 3,
  },
  {
    term: 'Akshat',
    slug: 'akshat',
    language: 'SANSKRIT',
    devanagari: 'अक्षत',
    pronunciation: 'ak-shat',
    category: 'MATERIAL',
    definition: 'Unbroken rice grains, usually mixed with a little turmeric or kumkum. Offered in almost every puja. The point is that the grains are whole.',
    appearsInJson: JSON.stringify(['Sharad Navratri', 'Diwali for Beginners', 'Ganesh Chaturthi']),
    relatedConceptTitle: null,
    relatedConceptSlug: null,
    status: 'PUBLISHED',
    displayOrder: 4,
  },
  {
    term: 'Bilva',
    slug: 'bilva',
    language: 'SANSKRIT',
    devanagari: 'बिल्व',
    pronunciation: 'bil-va',
    category: 'MATERIAL',
    definition: 'The leaf offered to Shiva, in threes on one stem. Also called bel patra. Offered smooth side down by widespread practice.',
    appearsInJson: JSON.stringify(['Sawan Somwar Vrat']),
    relatedConceptTitle: 'Why is bilva dear to Mahadev?',
    relatedConceptSlug: 'bilva',
    status: 'PUBLISHED',
    displayOrder: 5,
  },
  {
    term: 'Chaturmas',
    slug: 'chaturmas',
    language: 'SANSKRIT',
    devanagari: 'चातुर्मास',
    pronunciation: 'cha-tur-maas',
    category: 'TIME',
    definition: 'The four monsoon months from Devshayani to Devutthana Ekadashi. Weddings and some new undertakings are traditionally deferred through this period.',
    appearsInJson: JSON.stringify(['Parsva Ekadashi']),
    relatedConceptTitle: 'Chaturmas — the four months',
    relatedConceptSlug: 'chaturmas',
    status: 'PUBLISHED',
    displayOrder: 6,
  },
  {
    term: 'Dakshina',
    slug: 'dakshina',
    language: 'SANSKRIT',
    devanagari: 'दक्षिणा',
    pronunciation: 'dak-shi-na',
    category: 'PRACTICE',
    definition: 'What is offered to a purohit after a ritual. Traditionally given according to means and not fixed as a fee.',
    appearsInJson: JSON.stringify(['Purohit & Puja']),
    relatedConceptTitle: null,
    relatedConceptSlug: null,
    status: 'PUBLISHED',
    displayOrder: 7,
  },
  {
    term: 'Ghatasthapana',
    slug: 'ghatasthapana',
    language: 'SANSKRIT',
    devanagari: 'घटस्थापना',
    pronunciation: 'ghat-sthaa-pa-na',
    category: 'PRACTICE',
    definition: 'The installation of the kalash on the first day of Navratri, performed in the morning while Pratipada prevails and before Hindu midday.',
    appearsInJson: JSON.stringify(['Sharad Navratri', 'Navratri Panchang']),
    relatedConceptTitle: null,
    relatedConceptSlug: null,
    status: 'PUBLISHED',
    displayOrder: 8,
  },
  {
    term: 'Kalash',
    slug: 'kalash',
    language: 'SANSKRIT',
    devanagari: 'कलश',
    pronunciation: 'ka-lash',
    category: 'MATERIAL',
    definition: 'A brass or copper pot filled with water, topped with mango leaves and a coconut. It stands for the presence invited into the space.',
    appearsInJson: JSON.stringify(['Sharad Navratri', 'Diwali for Beginners']),
    relatedConceptTitle: null,
    relatedConceptSlug: null,
    status: 'PUBLISHED',
    displayOrder: 9,
  },
  {
    term: 'Muhurat',
    slug: 'muhurat',
    language: 'SANSKRIT',
    devanagari: 'मुहूर्त',
    pronunciation: 'mu-hoor-t',
    category: 'TIME',
    definition: 'A window of time considered suitable for a ritual, calculated from the panchang. A recommendation, not a deadline — a puja done later is still complete.',
    appearsInJson: JSON.stringify(['Navratri Panchang', 'Ganesh Chaturthi']),
    relatedConceptTitle: 'How to read a Panchang',
    relatedConceptSlug: 'muhurat',
    status: 'PUBLISHED',
    displayOrder: 10,
  },
  {
    term: 'Nakshatra',
    slug: 'nakshatra',
    language: 'SANSKRIT',
    devanagari: 'नक्षत्र',
    pronunciation: 'nak-shat-ra',
    category: 'TIME',
    definition: 'One of twenty-seven segments of the sky through which the Moon moves. One of the five limbs the panchang tracks each day.',
    appearsInJson: JSON.stringify(["Today's Panchang"]),
    relatedConceptTitle: 'How to read a Panchang',
    relatedConceptSlug: 'nakshatra',
    status: 'PUBLISHED',
    displayOrder: 11,
  },
  {
    term: 'Paksha',
    slug: 'paksha',
    language: 'SANSKRIT',
    devanagari: 'पक्ष',
    pronunciation: 'pak-sha',
    category: 'TIME',
    definition: 'Half a lunar month. Shukla is the waxing half, Krishna the waning half. Every festival date names one.',
    appearsInJson: JSON.stringify(["Today's Panchang", 'Vrat Calendar']),
    relatedConceptTitle: 'How to read a Panchang',
    relatedConceptSlug: 'paksha',
    status: 'PUBLISHED',
    displayOrder: 12,
  },
  {
    term: 'Panchamrit',
    slug: 'panchamrit',
    language: 'SANSKRIT',
    devanagari: 'पञ्चामृत',
    pronunciation: 'pan-chaam-rit',
    category: 'MATERIAL',
    definition: 'Five ingredients mixed for abhishek and prasad — milk, curd, ghee, honey and sugar. Made fresh, distributed after.',
    appearsInJson: JSON.stringify(['Sawan Somwar Vrat']),
    relatedConceptTitle: null,
    relatedConceptSlug: null,
    status: 'PUBLISHED',
    displayOrder: 13,
  },
  {
    term: 'Parana',
    slug: 'parana',
    language: 'SANSKRIT',
    devanagari: 'पारण',
    pronunciation: 'paa-ran',
    category: 'PRACTICE',
    definition: 'Breaking a fast, within a stated window on the morning after. For Ekadashi it must fall after sunrise and before Dwadashi ends.',
    appearsInJson: JSON.stringify(['Aja Ekadashi', 'Vrat Calendar']),
    relatedConceptTitle: null,
    relatedConceptSlug: null,
    status: 'PUBLISHED',
    displayOrder: 14,
  },
  {
    term: 'Sankalp',
    slug: 'sankalp',
    language: 'SANSKRIT',
    devanagari: 'सङ्कल्प',
    pronunciation: 'san-kalp',
    category: 'PRACTICE',
    definition: 'The resolve stated at the start of a vrat or puja — what you are doing, and for whom. Said aloud or silently, in any language.',
    appearsInJson: JSON.stringify(['Sharad Navratri', 'Sawan Somwar Vrat']),
    relatedConceptTitle: 'Sankalp — saying it out loud',
    relatedConceptSlug: 'sankalp',
    status: 'PUBLISHED',
    displayOrder: 15,
  },
  {
    term: 'Sutak',
    slug: 'sutak',
    language: 'SANSKRIT',
    devanagari: 'सूतक',
    pronunciation: 'soo-tak',
    category: 'TIME',
    definition: 'A period before and during an eclipse in which some activities are set aside. It applies only where the eclipse is actually visible.',
    appearsInJson: JSON.stringify(['August 2026 Eclipses']),
    relatedConceptTitle: null,
    relatedConceptSlug: null,
    status: 'PUBLISHED',
    displayOrder: 16,
  },
  {
    term: 'Tithi',
    slug: 'tithi',
    language: 'SANSKRIT',
    devanagari: 'तिथि',
    pronunciation: 'ti-thi',
    category: 'TIME',
    definition: 'The lunar day, and the thing that fixes almost every festival date. A tithi can start and end at any hour, which is why dates shift each year.',
    appearsInJson: JSON.stringify(["Today's Panchang", 'Vrat Calendar', 'Navratri Panchang']),
    relatedConceptTitle: 'How to read a Panchang',
    relatedConceptSlug: 'tithi',
    status: 'PUBLISHED',
    displayOrder: 17,
  },
  {
    term: 'Vrat',
    slug: 'vrat',
    language: 'SANSKRIT',
    devanagari: 'व्रत',
    pronunciation: 'vrat',
    category: 'PRACTICE',
    definition: 'A vow kept for a day. Fasting is often part of it and is rarely the whole of it — the vow is the observance, the food rule is one expression.',
    appearsInJson: JSON.stringify(['What is a vrat?', 'Vrat Calendar']),
    relatedConceptTitle: 'Vrat — what a vow is',
    relatedConceptSlug: 'vrat',
    status: 'PUBLISHED',
    displayOrder: 18,
  },
];

const globalForGlossary = global as unknown as {
  inMemoryGlossaryTerms?: GlossaryTermData[];
};

export function getInMemoryGlossaryTerms(): GlossaryTermData[] {
  if (!globalForGlossary.inMemoryGlossaryTerms || globalForGlossary.inMemoryGlossaryTerms.length === 0) {
    globalForGlossary.inMemoryGlossaryTerms = INITIAL_STATIC_GLOSSARY_TERMS.map((t, idx) => ({
      ...t,
      id: `glossary-static-${idx + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }
  return globalForGlossary.inMemoryGlossaryTerms;
}

export async function seedGlossaryTermsDB(): Promise<void> {
  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      const count = await prisma.glossaryTerm.count();
      if (count === 0) {
        await prisma.glossaryTerm.createMany({
          data: INITIAL_STATIC_GLOSSARY_TERMS.map((t) => ({
            term: t.term,
            slug: t.slug,
            language: t.language,
            devanagari: t.devanagari || null,
            pronunciation: t.pronunciation || null,
            category: t.category,
            definition: t.definition,
            appearsInJson: t.appearsInJson || null,
            relatedConceptTitle: t.relatedConceptTitle || null,
            relatedConceptSlug: t.relatedConceptSlug || null,
            status: t.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
            displayOrder: t.displayOrder || 0,
          })),
          skipDuplicates: true,
        });
      }
    } catch (err) {
      console.warn('[Glossary Store] Seeding DB warning:', err);
    }
  }
}

export async function getPublicGlossaryServer(): Promise<GlossaryTermData[]> {
  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      await seedGlossaryTermsDB();
      const terms = await prisma.glossaryTerm.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: [{ displayOrder: 'asc' }, { term: 'asc' }],
      });
      if (terms && terms.length > 0) {
        return terms.map((t) => ({
          ...t,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
        })) as GlossaryTermData[];
      }
    } catch (err) {
      console.warn('[Glossary Store] DB query fallback:', err);
    }
  }

  return getInMemoryGlossaryTerms().filter((t) => t.status === 'PUBLISHED');
}
