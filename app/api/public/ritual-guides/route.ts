import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const guides = await prisma.ritualGuide.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: guides || [],
    });
  } catch (error: any) {
    console.error('[API Public Ritual Guides GET] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error', data: [] },
      { status: 500 }
    );
  }
}
