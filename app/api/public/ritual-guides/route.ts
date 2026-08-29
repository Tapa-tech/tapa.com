import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getInMemoryGuides } from '@/lib/ritual-guides-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let guides: any[] = [];
    try {
      guides = await prisma.ritualGuide.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr: any) {
      console.warn('[API Public Ritual Guides GET] DB warning:', dbErr?.message || dbErr);
    }

    if (!guides || guides.length === 0) {
      guides = getInMemoryGuides();
    }

    return NextResponse.json({
      success: true,
      data: guides || [],
    });
  } catch (error: any) {
    console.error('[API Public Ritual Guides GET] Error:', error?.message || error);
    return NextResponse.json(
      { success: true, data: getInMemoryGuides(), error: error?.message || 'Database unavailable' },
      { status: 200 }
    );
  }
}
