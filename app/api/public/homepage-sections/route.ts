import { NextResponse } from 'next/server';
import { INITIAL_HOMEPAGE_SECTIONS } from '@/lib/homepage-sections';

export async function GET() {
  try {
    const res = NextResponse.json({
      success: true,
      data: INITIAL_HOMEPAGE_SECTIONS,
    });
    res.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
    return res;
  } catch (err: any) {
    console.error('[Public Homepage Sections API] Error:', err);
    return NextResponse.json({
      success: true,
      data: INITIAL_HOMEPAGE_SECTIONS,
    });
  }
}
