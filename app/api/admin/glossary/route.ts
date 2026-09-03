import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getInMemoryGlossaryTerms, GlossaryTermData } from '@/lib/glossary-store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const language = searchParams.get('language') || '';
    const status = searchParams.get('status') || '';

    let terms: any[] = [];

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        const whereClause: any = {};
        if (query) {
          whereClause.OR = [
            { term: { contains: query, mode: 'insensitive' } },
            { definition: { contains: query, mode: 'insensitive' } },
            { devanagari: { contains: query, mode: 'insensitive' } },
          ];
        }
        if (category && category !== 'ALL') whereClause.category = category;
        if (language && language !== 'ALL') whereClause.language = language;
        if (status && status !== 'ALL') whereClause.status = status;

        terms = await prisma.glossaryTerm.findMany({
          where: whereClause,
          orderBy: [{ displayOrder: 'asc' }, { term: 'asc' }],
        });
      } catch (dbErr: any) {
        console.warn('[Admin Glossary GET] DB warning:', dbErr?.message || dbErr);
      }
    }

    if (!terms || terms.length === 0) {
      terms = getInMemoryGlossaryTerms();
    }

    return NextResponse.json({ success: true, data: terms });
  } catch (error: any) {
    console.error('[Admin Glossary GET] Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to load glossary terms' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      term,
      slug,
      language = 'SANSKRIT',
      devanagari,
      pronunciation,
      category = 'PRACTICE',
      definition,
      appearsIn,
      relatedConceptTitle,
      relatedConceptSlug,
      status = 'PUBLISHED',
      displayOrder = 0,
    } = body;

    if (!term || !definition) {
      return NextResponse.json({ success: false, error: 'Term and definition are required' }, { status: 400 });
    }

    const generatedSlug = slug || term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const appearsInJsonStr = Array.isArray(appearsIn) ? JSON.stringify(appearsIn) : typeof appearsIn === 'string' ? JSON.stringify([appearsIn]) : null;

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      const newTerm = await prisma.glossaryTerm.create({
        data: {
          term,
          slug: generatedSlug,
          language: language.toUpperCase(),
          devanagari: devanagari || null,
          pronunciation: pronunciation || null,
          category: category.toUpperCase(),
          definition,
          appearsInJson: appearsInJsonStr,
          relatedConceptTitle: relatedConceptTitle || null,
          relatedConceptSlug: relatedConceptSlug || null,
          status: status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
          displayOrder: Number(displayOrder) || 0,
        },
      });

      return NextResponse.json({ success: true, data: newTerm });
    }

    const memTerms = getInMemoryGlossaryTerms();
    const createdMem: GlossaryTermData = {
      id: `glossary-${Date.now()}`,
      term,
      slug: generatedSlug,
      language: language.toUpperCase(),
      devanagari: devanagari || null,
      pronunciation: pronunciation || null,
      category: category.toUpperCase(),
      definition,
      appearsInJson: appearsInJsonStr,
      relatedConceptTitle: relatedConceptTitle || null,
      relatedConceptSlug: relatedConceptSlug || null,
      status: status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
      displayOrder: Number(displayOrder) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memTerms.unshift(createdMem);

    return NextResponse.json({ success: true, data: createdMem });
  } catch (error: any) {
    console.error('[Admin Glossary POST] Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create term' }, { status: 500 });
  }
}
