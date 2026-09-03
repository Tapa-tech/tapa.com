import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getInMemoryGlossaryTerms, seedGlossaryTermsDB } from '@/lib/glossary-store';

export async function GET() {
  try {
    let terms: any[] = [];

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        await seedGlossaryTermsDB();
        terms = await prisma.glossaryTerm.findMany({
          where: { status: 'PUBLISHED' },
          orderBy: [{ displayOrder: 'asc' }, { term: 'asc' }],
        });
      } catch (dbErr: any) {
        console.warn('[Public Glossary API] DB query warning:', dbErr?.message || dbErr);
      }
    }

    if (!terms || terms.length === 0) {
      terms = getInMemoryGlossaryTerms().filter((t) => t.status === 'PUBLISHED');
    }

    const res = NextResponse.json({
      success: true,
      data: terms,
    });
    res.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
    return res;
  } catch (error: any) {
    console.error('[Public Glossary API] Unexpected error:', error);
    return NextResponse.json({ success: true, data: getInMemoryGlossaryTerms() });
  }
}
