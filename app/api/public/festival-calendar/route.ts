import { NextResponse } from 'next/server';
import { getFestivalsForYear } from '@/lib/festivals-service';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get('year') || '2026';
    const year = parseInt(yearParam, 10) || 2026;

    const festivals = await getFestivalsForYear(year);

    return NextResponse.json({
      success: true,
      year,
      count: festivals.length,
      data: festivals,
    });
  } catch (err: any) {
    console.error('[Public Festival Calendar API] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch festival calendar entries' },
      { status: 500 }
    );
  }
}
