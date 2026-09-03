import { NextResponse } from 'next/server';
import { getPublicAboutServer } from '@/lib/about-store';

export async function GET() {
  try {
    const data = await getPublicAboutServer();
    const res = NextResponse.json({ success: true, data });
    res.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
    return res;
  } catch (error: any) {
    console.error('[Public About API] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch about page data' }, { status: 500 });
  }
}
