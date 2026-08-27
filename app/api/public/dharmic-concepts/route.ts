import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const concepts = await prisma.dharmicConcept.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: concepts || [],
    });
  } catch (error: any) {
    console.error('[API Public Dharmic Concepts GET] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error', data: [] },
      { status: 500 }
    );
  }
}
