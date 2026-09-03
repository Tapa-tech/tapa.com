import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { findInMemoryGuide, getInMemoryGuides } from '@/lib/ritual-guides-store';
import { getCachedOrFetch, CACHE_KEYS } from '@/lib/redis';

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

    const guide = await getCachedOrFetch(
      CACHE_KEYS.PUBLIC_RITUAL_GUIDE_SLUG(cleanSlug),
      async () => {
        let g: any = null;
        try {
          g = await prisma.ritualGuide.findFirst({
            where: {
              OR: [
                { slug: cleanSlug },
                { slug: slug },
                { slug: { contains: cleanSlug } },
                { title: { contains: cleanSlug } },
              ],
            },
          });

          if (!g) {
            g = await prisma.ritualGuide.findFirst({
              where: { status: 'PUBLISHED' },
            });
          }
        } catch (dbErr: any) {
          console.warn('[API Public Ritual Guide Slug GET] DB warning:', dbErr?.message || dbErr);
        }

        if (!g) {
          g = findInMemoryGuide(cleanSlug) || getInMemoryGuides()[0] || null;
        }

        return g;
      },
      1800
    );

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
