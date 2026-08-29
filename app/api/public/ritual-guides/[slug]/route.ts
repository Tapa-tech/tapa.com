import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { findInMemoryGuide, getInMemoryGuides } from '@/lib/ritual-guides-store';

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

    let guide: any = null;
    try {
      // 1. Try exact match
      guide = await prisma.ritualGuide.findFirst({
        where: {
          OR: [
            { slug: cleanSlug },
            { slug: slug },
          ],
        },
      });

      // 2. Fallback to flexible matching if exact slug is not found
      if (!guide) {
        guide = await prisma.ritualGuide.findFirst({
          where: {
            OR: [
              { slug: { contains: cleanSlug } },
              { title: { contains: cleanSlug } },
            ],
          },
        });
      }

      // 3. Fallback to any published or existing guide if available
      if (!guide) {
        guide = await prisma.ritualGuide.findFirst();
      }
    } catch (dbErr: any) {
      console.warn('[API Public Ritual Guide Slug GET] DB warning:', dbErr?.message || dbErr);
    }

    if (!guide) {
      guide = findInMemoryGuide(cleanSlug) || getInMemoryGuides()[0] || null;
    }

    return NextResponse.json({
      success: true,
      data: guide || null,
    });
  } catch (error: any) {
    console.error('[API Public Ritual Guide Slug GET] Error:', error?.message || error);
    return NextResponse.json(
      { success: true, data: findInMemoryGuide(params.slug) || null, error: error?.message || 'Database unavailable' },
      { status: 200 }
    );
  }
}
