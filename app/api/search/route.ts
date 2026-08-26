import { NextResponse } from 'next/server';
import { searchContentWithElasticsearch, SearchHitResult } from '@/lib/elasticsearch';
import { DEFAULT_SEARCH_DOCUMENTS } from '@/lib/elasticsearch-index';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() || '';

  if (!q) {
    return NextResponse.json({
      query: '',
      engine: 'none',
      total: 0,
      grouped: { guides: [], glossary: [], kits: [], festivals: [] },
      results: [],
    });
  }

  // 1. Try searching with Elasticsearch
  let esResults = await searchContentWithElasticsearch(q);
  let engine = 'elasticsearch';

  // 2. Fallback strategy if Elasticsearch is unavailable or returns null
  if (esResults === null) {
    engine = 'fallback';
    const lowerQ = q.toLowerCase();
    esResults = DEFAULT_SEARCH_DOCUMENTS.filter((doc) => {
      return (
        doc.title.toLowerCase().includes(lowerQ) ||
        (doc.subtitle && doc.subtitle.toLowerCase().includes(lowerQ)) ||
        (doc.tag && doc.tag.toLowerCase().includes(lowerQ)) ||
        doc.slug.toLowerCase().includes(lowerQ)
      );
    });
  }

  // Sort / rank results by title match first
  const lowerQ = q.toLowerCase();
  const sorted = [...esResults].sort((a, b) => {
    const aExact = a.title.toLowerCase().startsWith(lowerQ) ? 2 : a.title.toLowerCase().includes(lowerQ) ? 1 : 0;
    const bExact = b.title.toLowerCase().startsWith(lowerQ) ? 2 : b.title.toLowerCase().includes(lowerQ) ? 1 : 0;
    return bExact - aExact;
  });

  // Group by category
  const guides = sorted.filter((r) => r.category === 'RITUAL GUIDES');
  const glossary = sorted.filter((r) => r.category === 'GLOSSARY');
  const kits = sorted.filter((r) => r.category === 'KITS');
  const festivals = sorted.filter((r) => r.category === 'FESTIVALS');

  return NextResponse.json({
    query: q,
    engine,
    total: sorted.length,
    grouped: {
      guides,
      glossary,
      kits,
      festivals,
    },
    results: sorted,
  });
}
