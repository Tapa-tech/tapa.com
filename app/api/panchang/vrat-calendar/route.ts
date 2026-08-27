
import { NextResponse } from 'next/server';
import { generateVratCalendar } from '@/lib/panchang-engine';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const year = Number(searchParams.get('year')) || 2026;

    const data = generateVratCalendar(year);

    return NextResponse.json(data);
}