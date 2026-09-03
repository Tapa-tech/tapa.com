import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getInMemoryGuides } from '@/lib/ritual-guides-store';
import { getCachedOrFetch, CACHE_KEYS } from '@/lib/redis';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getCachedOrFetch(
      CACHE_KEYS.PUBLIC_RITUAL_GUIDES_ALL,
      async () => {
        let guides: any[] = [];
        try {
          guides = await prisma.ritualGuide.findMany({
            select: {
              id: true,
              slug: true,
              title: true,
              guideTitle: true,
              guideSubtitle: true,
              sectionLabel: true,
              category: true,
              festivalName: true,
              status: true,
              kathaImage: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
          });
        } catch (dbErr: any) {
          console.warn('[API Public Ritual Guides GET] DB warning:', dbErr?.message || dbErr);
        }

        if (!guides || guides.length === 0) {
          guides = getInMemoryGuides();
        }
        return guides;
      },
      900
    );

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error: any) {
    console.error('[API Public Ritual Guides GET] Error:', error?.message || error);
    return NextResponse.json(
      { success: true, data: getInMemoryGuides(), error: error?.message || 'Database unavailable' },
      { status: 200 }
    );
  }
}
