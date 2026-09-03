import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { INITIAL_HEADER_CATEGORIES } from '@/lib/header-categories';

export const GET = withAdminAuth(async () => {
  try {
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      let count = await prisma.headerCategory.count();
      if (count === 0) {
        for (const cat of INITIAL_HEADER_CATEGORIES) {
          await prisma.headerCategory.create({
            data: {
              key: cat.key,
              title: cat.title,
              displayOrder: cat.displayOrder,
              status: cat.status,
              columnsJson: JSON.stringify(cat.columns),
              featuredJson: JSON.stringify(cat.featured),
              footerJson: JSON.stringify(cat.footer),
            },
          });
        }
      }

      const categories = await prisma.headerCategory.findMany({
        orderBy: { displayOrder: 'asc' },
      });

      const parsedCategories = categories.map((cat) => ({
        id: cat.id,
        key: cat.key,
        title: cat.title,
        displayOrder: cat.displayOrder,
        status: cat.status,
        columns: typeof cat.columnsJson === 'string' ? JSON.parse(cat.columnsJson) : cat.columnsJson,
        featured: typeof cat.featuredJson === 'string' ? JSON.parse(cat.featuredJson) : cat.featuredJson,
        footer: typeof cat.footerJson === 'string' ? JSON.parse(cat.footerJson) : cat.footerJson,
      }));

      return NextResponse.json({ success: true, data: parsedCategories });
    }

    return NextResponse.json({ success: true, data: INITIAL_HEADER_CATEGORIES });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch header categories' },
      { status: 500 }
    );
  }
});

export const POST = withAdminAuth(async (req) => {
  try {
    const body = await req.json();
    const { key, title, displayOrder, status, columns, featured, footer } = body || {};

    if (!key || !title) {
      return NextResponse.json(
        { success: false, error: 'Category key and title are required.' },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      const created = await prisma.headerCategory.upsert({
        where: { key },
        update: {
          title,
          displayOrder: Number(displayOrder) || 0,
          status: status || 'PUBLISHED',
          columnsJson: typeof columns === 'string' ? columns : JSON.stringify(columns || []),
          featuredJson: typeof featured === 'string' ? featured : JSON.stringify(featured || {}),
          footerJson: typeof footer === 'string' ? footer : JSON.stringify(footer || {}),
        },
        create: {
          key,
          title,
          displayOrder: Number(displayOrder) || 0,
          status: status || 'PUBLISHED',
          columnsJson: typeof columns === 'string' ? columns : JSON.stringify(columns || []),
          featuredJson: typeof featured === 'string' ? featured : JSON.stringify(featured || {}),
          footerJson: typeof footer === 'string' ? footer : JSON.stringify(footer || {}),
        },
      });

      return NextResponse.json({ success: true, data: created });
    }

    return NextResponse.json({ success: true, data: body });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save header category' },
      { status: 500 }
    );
  }
});
