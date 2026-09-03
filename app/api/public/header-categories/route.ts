import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { INITIAL_HEADER_CATEGORIES, HeaderCategoryStructure } from '@/lib/header-categories';

export async function GET() {
  try {
    let categories: any[] = [];

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        categories = await prisma.headerCategory.findMany({
          where: { status: 'PUBLISHED' },
          orderBy: { displayOrder: 'asc' },
        });

        if (categories.length === 0) {
          await prisma.headerCategory.createMany({
            data: INITIAL_HEADER_CATEGORIES.map((cat) => ({
              key: cat.key,
              title: cat.title,
              displayOrder: cat.displayOrder,
              status: cat.status,
              columnsJson: JSON.stringify(cat.columns),
              featuredJson: JSON.stringify(cat.featured),
              footerJson: JSON.stringify(cat.footer),
            })),
            skipDuplicates: true,
          });

          categories = await prisma.headerCategory.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { displayOrder: 'asc' },
          });
        }
      } catch (dbErr) {
        console.warn('[Public Header Categories API] DB query warning:', dbErr);
      }
    }

    const formattedData: Record<string, HeaderCategoryStructure> = {};

    if (categories.length > 0) {
      for (const cat of categories) {
        try {
          formattedData[cat.key] = {
            id: cat.id,
            key: cat.key,
            title: cat.title,
            displayOrder: cat.displayOrder,
            status: cat.status,
            columns: typeof cat.columnsJson === 'string' ? JSON.parse(cat.columnsJson) : cat.columnsJson,
            featured: typeof cat.featuredJson === 'string' ? JSON.parse(cat.featuredJson) : cat.featuredJson,
            footer: typeof cat.footerJson === 'string' ? JSON.parse(cat.footerJson) : cat.footerJson,
          };
        } catch (parseErr) {
          console.warn(`[Public Header Categories API] Error parsing JSON for key ${cat.key}:`, parseErr);
        }
      }
    } else {
      for (const cat of INITIAL_HEADER_CATEGORIES) {
        formattedData[cat.key] = cat;
      }
    }

    const res = NextResponse.json({
      success: true,
      data: formattedData,
    });
    res.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
    return res;
  } catch (err: any) {
    console.error('[Public Header Categories API] Unexpected error:', err);

    const fallbackMap: Record<string, HeaderCategoryStructure> = {};
    for (const cat of INITIAL_HEADER_CATEGORIES) {
      fallbackMap[cat.key] = cat;
    }
    const res = NextResponse.json({ success: true, data: fallbackMap });
    res.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
    return res;
  }
}
