import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { findInMemoryDharmicConcept, getInMemoryDharmicConcepts } from '@/lib/ritual-guides-store';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 200 });
    }

    const cleanSlug = slug.trim().toLowerCase();

    let concept: any = null;
    try {
      concept = await prisma.dharmicConcept.findFirst({
        where: {
          OR: [
            { slug: cleanSlug },
            { slug: slug },
            { slug: { contains: cleanSlug } },
            { title: { contains: cleanSlug, mode: 'insensitive' } },
          ],
        },
      });

      if (!concept) {
        concept = await prisma.dharmicConcept.findFirst({
          where: { status: 'PUBLISHED' },
        });
      }
    } catch (dbErr: any) {
      console.warn('[API Public Dharmic Concept Slug GET] DB warning:', dbErr?.message || dbErr);
    }

    if (!concept) {
      concept = findInMemoryDharmicConcept(cleanSlug) || getInMemoryDharmicConcepts()[0] || null;
    }

    return NextResponse.json({
      success: true,
      data: concept || null,
    });
  } catch (error: any) {
    console.error('[API Public Dharmic Concept Slug GET] Error:', error?.message || error);
    return NextResponse.json(
      { success: true, data: findInMemoryDharmicConcept(params.slug) || null, error: error?.message || 'Database unavailable' },
      { status: 200 }
    );
  }
}
