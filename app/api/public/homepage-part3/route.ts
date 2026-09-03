import { NextResponse } from 'next/server';
import { INITIAL_HOMEPAGE_PART3 } from '@/lib/homepage-part3';

export async function GET() {
  try {
    const res = NextResponse.json({
      success: true,
      data: INITIAL_HOMEPAGE_PART3,
    });
    res.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
    return res;
  } catch (err: any) {
    console.error('[Public Homepage Part 3 API] Error:', err);
    return NextResponse.json({
      success: true,
      data: INITIAL_HOMEPAGE_PART3,
    });
  }
}
