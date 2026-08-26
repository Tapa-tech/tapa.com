import { Client } from '@elastic/elasticsearch';

let clientInstance: Client | null = null;

export function getElasticsearchClient(): Client {
  if (clientInstance) return clientInstance;

  const node = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';
  const apiKey = process.env.ELASTICSEARCH_API_KEY;
  const username = process.env.ELASTICSEARCH_USERNAME;
  const password = process.env.ELASTICSEARCH_PASSWORD;

  const authOptions: any = {};
  if (apiKey) {
    authOptions.apiKey = apiKey;
  } else if (username && password) {
    authOptions.username = username;
    authOptions.password = password;
  }

  clientInstance = new Client({
    node,
    auth: Object.keys(authOptions).length > 0 ? authOptions : undefined,
    tls: {
      rejectUnauthorized: false,
    },
    maxRetries: 2,
    requestTimeout: 3000,
  });

  return clientInstance;
}

export interface SearchHitResult {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  category: 'RITUAL GUIDES' | 'GLOSSARY' | 'KITS' | 'FESTIVALS';
  tag?: string;
  badge?: string;
  url: string;
  score?: number;
}

export async function searchContentWithElasticsearch(query: string): Promise<SearchHitResult[] | null> {
  const client = getElasticsearchClient();
  const index = process.env.ELASTICSEARCH_INDEX || 'tapa_content';
  const q = query.trim();

  if (!q) return [];

  try {
    const response = await client.search({
      index,
      query: {
        bool: {
          should: [
            // 1. Exact phrase match with high boost
            {
              match_phrase: {
                title: {
                  query: q,
                  boost: 10,
                },
              },
            },
            // 2. Multi-match full text search across title, subtitle, tags, content
            {
              multi_match: {
                query: q,
                fields: ['title^5', 'title.ngram^3', 'subtitle^2', 'content^1', 'tags^2', 'categoryName^2'],
                fuzziness: 'AUTO',
                operator: 'or',
              },
            },
            // 3. Prefix matching for instant typing (partial search)
            {
              prefix: {
                'title.keyword': {
                  value: q.toLowerCase(),
                  boost: 4,
                },
              },
            },
            // 4. Wildcard matching for partial terms (e.g. ekad -> ekadashi)
            {
              wildcard: {
                title: {
                  value: `*${q.toLowerCase()}*`,
                  boost: 2,
                },
              },
            },
          ],
          minimum_should_match: 1,
        },
      },
      size: 20,
    });

    const hits = response.hits?.hits || [];
    return hits.map((hit: any) => {
      const src = hit._source;
      return {
        id: src.id || hit._id,
        title: src.title,
        subtitle: src.subtitle || src.summary || '',
        slug: src.slug,
        category: src.category,
        tag: src.tag,
        badge: src.badge,
        url: src.url || `/${src.category === 'RITUAL GUIDES' ? 'ritual-guides' : src.category === 'GLOSSARY' ? 'glossary' : 'ritual-kits'}/${src.slug}`,
        score: hit._score,
      };
    });
  } catch (error: any) {
    console.warn('[Elasticsearch] Query failed or server unreachable:', error?.message || error);
    // Return null to indicate fallback is needed
    return null;
  }
}
