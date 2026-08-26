import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    // 1. Try exact match
    let guide = await prisma.ritualGuide.findFirst({
      where: {
        OR: [
          { slug: cleanSlug },
          { slug: slug },
        ],
      },
    });

    // 2. Fallback to flexible matching if exact slug is not found (e.g., 'sharad-navratri' -> 'sharad-navratri-the-complete-9-day-guide')
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

    return NextResponse.json({
      success: true,
      data: guide || null,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
