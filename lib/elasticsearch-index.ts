import { getElasticsearchClient, SearchHitResult } from './elasticsearch';
import { PrismaClient } from '@prisma/client';
import { VRAT_CALENDAR_2026 } from './vrat-calendar-data';

const prisma = new PrismaClient();

export const DEFAULT_SEARCH_DOCUMENTS: SearchHitResult[] = [
  // RITUAL GUIDES
  {
    id: 'rg-ganesh-chaturthi',
    title: 'Ganesh Sthapana & Puja',
    subtitle: 'Festive · Madhyahna muhurat, prana pratishtha & 21 durva offering',
    slug: 'ganesh-chaturthi',
    category: 'RITUAL GUIDES',
    tag: 'Festive',
    badge: 'GUIDE LIVE',
    url: '/ritual-guides/ganesh-chaturthi',
  },
  {
    id: 'rg-hartalika-teej',
    title: 'Hartalika Teej',
    subtitle: 'Festive · Sand Shivalinga worship, fasting & night vigil',
    slug: 'hartalika-teej',
    category: 'RITUAL GUIDES',
    tag: 'Festive',
    badge: 'GUIDE LIVE',
    url: '/ritual-guides/hartalika-teej',
  },
  {
    id: 'rg-aja-ekadashi',
    title: 'Aja Ekadashi',
    subtitle: 'All-Year · Grain avoidance, Vrat Katha & morning parana',
    slug: 'aja-ekadashi',
    category: 'RITUAL GUIDES',
    tag: 'All-Year',
    badge: 'GUIDE LIVE',
    url: '/ritual-guides/aja-ekadashi',
  },
  {
    id: 'rg-kamika-ekadashi',
    title: 'Kamika Ekadashi',
    subtitle: 'All-Year · Shravana Krishna Ekadashi fasting & Tulsi offering',
    slug: 'kamika-ekadashi',
    category: 'RITUAL GUIDES',
    tag: 'All-Year',
    badge: 'GUIDE LIVE',
    url: '/ritual-guides/kamika-ekadashi',
  },
  {
    id: 'rg-parsva-ekadashi',
    title: 'Parsva Ekadashi',
    subtitle: 'All-Year · Vamana incarnation worship & Chaturmas midpoint',
    slug: 'parsva-ekadashi',
    category: 'RITUAL GUIDES',
    tag: 'All-Year',
    badge: 'GUIDE LIVE',
    url: '/ritual-guides/parsva-ekadashi',
  },
  {
    id: 'rg-sharad-navratri',
    title: 'Sharad Navratri',
    subtitle: 'Festive · Nine nights of Devi worship, Ghatasthapana & Kanya Pujan',
    slug: 'sharad-navratri',
    category: 'RITUAL GUIDES',
    tag: 'Festive',
    badge: 'GUIDE LIVE',
    url: '/ritual-guides/sharad-navratri',
  },
  {
    id: 'rg-diwali',
    title: 'Diwali & Lakshmi Puja',
    subtitle: 'Festive · Amavasya Pradosh Kaal Lakshmi-Ganesha pujan',
    slug: 'diwali-beginners',
    category: 'RITUAL GUIDES',
    tag: 'Festive',
    badge: 'GUIDE LIVE',
    url: '/ritual-guides/diwali-beginners',
  },
  {
    id: 'rg-raksha-bandhan',
    title: 'Raksha Bandhan',
    subtitle: 'Festive · Sacred thread tying, Bhadra timing & rakhi pujan',
    slug: 'raksha-bandhan',
    category: 'RITUAL GUIDES',
    tag: 'Festive',
    badge: 'GUIDE LIVE',
    url: '/ritual-guides/raksha-bandhan',
  },

  // GLOSSARY & DHARMIC CONCEPTS
  {
    id: 'gl-ekadashi',
    title: 'Ekadashi',
    subtitle: 'The eleventh tithi of waxing/waning moon dedicated to Vishnu',
    slug: 'ekadashi',
    category: 'GLOSSARY',
    tag: 'Tithi & Fasting',
    url: '/glossary#ekadashi',
  },
  {
    id: 'gl-parana',
    title: 'Parana',
    subtitle: 'Breaking the fast during the prescribed Dwadashi muhurat',
    slug: 'parana',
    category: 'GLOSSARY',
    tag: 'Fasting Rules',
    url: '/glossary#parana',
  },
  {
    id: 'gl-durva',
    title: 'Durva',
    subtitle: '21 grass blades offered exclusively to Lord Ganesha',
    slug: 'durva',
    category: 'GLOSSARY',
    tag: 'Materials',
    url: '/dharmic-concepts#durva',
  },
  {
    id: 'gl-sthapana',
    title: 'Sthapana',
    subtitle: 'Prana pratishtha and consecration of the deity idol',
    slug: 'sthapana',
    category: 'GLOSSARY',
    tag: 'Rituals',
    url: '/glossary#sthapana',
  },
  {
    id: 'gl-bilva',
    title: 'Bilva Leaf',
    subtitle: 'Three-petaled sacred leaf beloved of Mahadev Shiva',
    slug: 'bilva',
    category: 'GLOSSARY',
    tag: 'Materials',
    url: '/dharmic-concepts#bilva',
  },
  {
    id: 'gl-tulsi',
    title: 'Tulsi',
    subtitle: 'Sacred Vrinda leaf offered to Lord Vishnu',
    slug: 'tulsi',
    category: 'GLOSSARY',
    tag: 'Materials',
    url: '/dharmic-concepts#tulsi',
  },
  {
    id: 'gl-sutak',
    title: 'Sutak',
    subtitle: 'Inauspicious period during eclipses or family events',
    slug: 'sutak',
    category: 'GLOSSARY',
    tag: 'Timing & Rules',
    url: '/glossary#sutak',
  },
  {
    id: 'gl-rahu-kaal',
    title: 'Rahu Kaal',
    subtitle: '90-minute daily period avoided for auspicious beginnings',
    slug: 'rahu-kaal',
    category: 'GLOSSARY',
    tag: 'Timing',
    url: '/panchang#rahu-kaal',
  },

  // RITUAL KITS
  {
    id: 'kit-ganesh-sthapana',
    title: 'Ganesh Sthapana Kit',
    subtitle: 'Complete 21-item eco-friendly sthapana kit — ₹1,650',
    slug: 'ganesh-sthapana-kit',
    category: 'KITS',
    tag: 'Festive Kit',
    url: '/#prebook-kits',
  },
  {
    id: 'kit-navratri-puja',
    title: 'Sharad Navratri Puja Kit',
    subtitle: 'Ghatasthapana, Akhand Jyot & Kanya Pujan essentials — ₹2,100',
    slug: 'navratri-puja-kit',
    category: 'KITS',
    tag: 'Festive Kit',
    url: '/#prebook-kits',
  },

  // FESTIVALS
  {
    id: 'fest-janmashtami',
    title: 'Krishna Janmashtami',
    subtitle: 'Bhadrapada Krishna Ashtami · Nishita Kaal birth celebration',
    slug: 'janmashtami',
    category: 'FESTIVALS',
    tag: 'Major Festival',
    url: '/panchang/vrat-calendar',
  },
  {
    id: 'fest-mahashivratri',
    title: 'Maha Shivratri',
    subtitle: 'Phalguna Krishna Chaturdashi · Four prahar Shiva Abhishekam',
    slug: 'mahashivratri',
    category: 'FESTIVALS',
    tag: 'Major Festival',
    url: '/panchang/vrat-calendar',
  },
];

export async function ensureIndexCreated(): Promise<void> {
  const client = getElasticsearchClient();
  const index = process.env.ELASTICSEARCH_INDEX || 'tapa_content';

  try {
    const exists = await client.indices.exists({ index });
    if (exists) return;

    await client.indices.create({
      index,
      settings: {
        analysis: {
          analyzer: {
            ngram_analyzer: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase', 'ngram_filter'],
            },
          },
          filter: {
            ngram_filter: {
              type: 'edge_ngram',
              min_gram: 2,
              max_gram: 15,
            },
          },
        },
      },
      mappings: {
        properties: {
          id: { type: 'keyword' },
          title: {
            type: 'text',
            analyzer: 'standard',
            fields: {
              ngram: {
                type: 'text',
                analyzer: 'ngram_analyzer',
              },
              keyword: {
                type: 'keyword',
                normalizer: 'lowercase',
              },
            },
          },
          subtitle: { type: 'text' },
          content: { type: 'text' },
          slug: { type: 'keyword' },
          category: { type: 'keyword' },
          tag: { type: 'text' },
          url: { type: 'keyword' },
        },
      },
    });
    console.log(`[Elasticsearch] Created index '${index}' with edge_ngram analyzer.`);
  } catch (error: any) {
    console.warn('[Elasticsearch] Could not verify/create index:', error?.message || error);
  }
}

export async function indexAllContent(): Promise<{ success: boolean; count: number }> {
  const client = getElasticsearchClient();
  const index = process.env.ELASTICSEARCH_INDEX || 'tapa_content';

  try {
    await ensureIndexCreated();

    // 1. Load Prisma DB content
    const dbGuides = await prisma.ritualGuide.findMany().catch(() => []);
    const dbConcepts = await prisma.dharmicConcept.findMany().catch(() => []);

    const documents: SearchHitResult[] = [...DEFAULT_SEARCH_DOCUMENTS];

    dbGuides.forEach((g) => {
      documents.push({
        id: `db-guide-${g.id}`,
        title: g.guideTitle || g.title,
        subtitle: g.guideSubtitle || g.category || 'Ritual Guide',
        slug: g.slug,
        category: 'RITUAL GUIDES',
        tag: g.category || 'Guide',
        url: `/ritual-guides/${g.slug}`,
      });
    });

    dbConcepts.forEach((c) => {
      documents.push({
        id: `db-concept-${c.id}`,
        title: c.bannerTitle || c.title,
        subtitle: c.summary || c.category || 'Dharmic Concept',
        slug: c.slug,
        category: 'GLOSSARY',
        tag: c.category || 'Concept',
        url: `/dharmic-concepts#${c.slug}`,
      });
    });

    VRAT_CALENDAR_2026.forEach((v) => {
      if (v.guideSlug) {
        documents.push({
          id: `vrat-${v.id}`,
          title: v.name,
          subtitle: `${v.tithi} · ${v.note || ''}`,
          slug: v.guideSlug,
          category: v.category === 'Festival' ? 'FESTIVALS' : 'RITUAL GUIDES',
          tag: v.category,
          url: `/ritual-guides/${v.guideSlug}`,
        });
      }
    });

    const body = documents.flatMap((doc) => [
      { index: { _index: index, _id: doc.id } },
      {
        id: doc.id,
        title: doc.title,
        subtitle: doc.subtitle,
        slug: doc.slug,
        category: doc.category,
        tag: doc.tag,
        badge: doc.badge || '',
        url: doc.url,
      },
    ]);

    const bulkResponse = await client.bulk({ refresh: true, operations: body });
    if (bulkResponse.errors) {
      console.warn('[Elasticsearch] Bulk indexing had errors');
    }

    console.log(`[Elasticsearch] Indexed ${documents.length} documents into index '${index}'`);
    return { success: true, count: documents.length };
  } catch (error: any) {
    console.warn('[Elasticsearch] Indexing failed:', error?.message || error);
    return { success: false, count: 0 };
  }
}
