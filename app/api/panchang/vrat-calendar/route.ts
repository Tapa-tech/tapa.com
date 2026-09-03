
import { NextResponse } from 'next/server';
import { generateVratCalendar } from '@/lib/panchang-engine';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const year = Number(searchParams.get('year')) || 2026;

    const data = generateVratCalendar(year);

    const res = NextResponse.json(data);
    res.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
    return res;
}