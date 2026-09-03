import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getInMemoryGlossaryTerms } from '@/lib/glossary-store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      const term = await prisma.glossaryTerm.findFirst({
        where: { OR: [{ id }, { slug: id }] },
      });
      if (term) return NextResponse.json({ success: true, data: term });
    }

    const mem = getInMemoryGlossaryTerms().find((t) => t.id === id || t.slug === id);
    if (mem) return NextResponse.json({ success: true, data: mem });

    return NextResponse.json({ success: false, error: 'Glossary term not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to load term' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      term,
      slug,
      language,
      devanagari,
      pronunciation,
      category,
      definition,
      appearsIn,
      relatedConceptTitle,
      relatedConceptSlug,
      status,
      displayOrder,
    } = body;

    const appearsInJsonStr = Array.isArray(appearsIn)
      ? JSON.stringify(appearsIn)
      : typeof appearsIn === 'string'
      ? JSON.stringify([appearsIn])
      : undefined;

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      const updated = await prisma.glossaryTerm.update({
        where: { id },
        data: {
          ...(term && { term }),
          ...(slug && { slug }),
          ...(language && { language: language.toUpperCase() }),
          devanagari: devanagari !== undefined ? devanagari : undefined,
          pronunciation: pronunciation !== undefined ? pronunciation : undefined,
          ...(category && { category: category.toUpperCase() }),
          ...(definition && { definition }),
          ...(appearsInJsonStr !== undefined && { appearsInJson: appearsInJsonStr }),
          relatedConceptTitle: relatedConceptTitle !== undefined ? relatedConceptTitle : undefined,
          relatedConceptSlug: relatedConceptSlug !== undefined ? relatedConceptSlug : undefined,
          ...(status && { status: status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT' }),
          ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
        },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    const memTerms = getInMemoryGlossaryTerms();
    const idx = memTerms.findIndex((t) => t.id === id || t.slug === id);
    if (idx >= 0) {
      memTerms[idx] = {
        ...memTerms[idx],
        ...body,
        ...(language && { language: language.toUpperCase() }),
        ...(category && { category: category.toUpperCase() }),
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, data: memTerms[idx] });
    }

    return NextResponse.json({ success: false, error: 'Glossary term not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update term' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      await prisma.glossaryTerm.delete({ where: { id } });
      return NextResponse.json({ success: true, message: 'Glossary term deleted successfully' });
    }

    const memTerms = getInMemoryGlossaryTerms();
    const idx = memTerms.findIndex((t) => t.id === id || t.slug === id);
    if (idx >= 0) {
      memTerms.splice(idx, 1);
    }
    return NextResponse.json({ success: true, message: 'Glossary term deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to delete term' }, { status: 500 });
  }
}
