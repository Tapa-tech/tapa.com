import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase();

    // 1. Exact slug match
    let guide = await prisma.beginnerGuide.findFirst({
      where: {
        OR: [
          { slug: cleanSlug },
          { slug: slug },
        ],
      },
    });

    // 2. Flexible fallback search by title/slug substring
    if (!guide) {
      guide = await prisma.beginnerGuide.findFirst({
        where: {
          OR: [
            { slug: { contains: cleanSlug } },
            { title: { contains: cleanSlug } },
          ],
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: guide || null,
    });
  } catch (error: any) {
    console.error('[API Public Beginner Guide Slug GET] Error:', error?.message || error);
    return NextResponse.json(
      { success: true, data: null, error: error?.message || 'Database unavailable' },
      { status: 200 }
    );
  }
}
