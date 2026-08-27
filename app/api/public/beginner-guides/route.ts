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
    console.error('[API Public Beginner Guides GET] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error', data: [] },
      { status: 500 }
    );
  }
}
