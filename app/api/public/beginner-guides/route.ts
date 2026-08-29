import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const guides = await prisma.beginnerGuide.findMany({
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
