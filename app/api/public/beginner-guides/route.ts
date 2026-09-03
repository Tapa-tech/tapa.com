import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const guides = await prisma.beginnerGuide.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        status: true,
        bannerEyebrow: true,
        bannerBadgeText: true,
        bannerBadgeIcon: true,
        bannerTitle: true,
        bannerDescription: true,
        introHeading: true,
        introDescription: true,
        introImage: true,
        introImageAltText: true,
        introImageCaption: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: guides || [],
    });
  } catch (error: any) {
    console.error('[API Public Beginner Guides GET] Error:', error?.message || error);
    return NextResponse.json(
      { success: true, data: [], error: error?.message || 'Database unavailable' },
      { status: 200 }
    );
  }
}
