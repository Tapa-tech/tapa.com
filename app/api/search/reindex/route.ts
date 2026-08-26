import { NextResponse } from 'next/server';
import { indexAllContent } from '@/lib/elasticsearch-index';

export async function POST() {
  const result = await indexAllContent();
  return NextResponse.json(result);
}

export async function GET() {
  const result = await indexAllContent();
  return NextResponse.json(result);
}
