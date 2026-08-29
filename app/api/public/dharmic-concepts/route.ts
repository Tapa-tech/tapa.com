import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getInMemoryDharmicConcepts } from '@/lib/ritual-guides-store';

export async function GET() {
  try {
    let concepts: any[] = [];
    try {
      concepts = await prisma.dharmicConcept.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr: any) {
      console.warn('[API Public Dharmic Concepts GET] DB warning:', dbErr?.message || dbErr);
    }

    const memoryConcepts = getInMemoryDharmicConcepts();
    const mergedMap = new Map<string, any>();

    concepts.forEach((c) => {
      if (c.id || c.slug) mergedMap.set(c.id || c.slug, c);
    });

    memoryConcepts.forEach((c) => {
      if (c.id || c.slug) mergedMap.set(c.id || c.slug, c);
    });

    const allConcepts = Array.from(mergedMap.values());

    return NextResponse.json({
      success: true,
      data: allConcepts,
    });
  } catch (error: any) {
    console.error('[API Public Dharmic Concepts GET] Error:', error?.message || error);
    return NextResponse.json(
      { success: true, data: getInMemoryDharmicConcepts(), error: error?.message || 'Database unavailable' },
      { status: 200 }
    );
  }
}
