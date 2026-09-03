import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { INITIAL_FOOTER_CONFIG } from '@/lib/footer-config';

export const GET = withAdminAuth(async () => {
  try {
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      let record = await prisma.footerConfig.findUnique({
        where: { key: 'default' },
      });

      if (!record) {
        record = await prisma.footerConfig.create({
          data: {
            key: 'default',
            brandJson: JSON.stringify(INITIAL_FOOTER_CONFIG.brand),
            utilityJson: JSON.stringify(INITIAL_FOOTER_CONFIG.utility),
            sitemapJson: JSON.stringify(INITIAL_FOOTER_CONFIG.sitemap),
            columnsJson: JSON.stringify(INITIAL_FOOTER_CONFIG.columns),
            correctionsJson: JSON.stringify(INITIAL_FOOTER_CONFIG.corrections),
            legalJson: JSON.stringify(INITIAL_FOOTER_CONFIG.legal),
            status: 'PUBLISHED',
          },
        });
      }

      const formatted = {
        id: record.id,
        key: record.key,
        brand: typeof record.brandJson === 'string' ? JSON.parse(record.brandJson) : record.brandJson,
        utility: typeof record.utilityJson === 'string' ? JSON.parse(record.utilityJson) : record.utilityJson,
        sitemap: typeof record.sitemapJson === 'string' ? JSON.parse(record.sitemapJson) : record.sitemapJson,
        columns: typeof record.columnsJson === 'string' ? JSON.parse(record.columnsJson) : record.columnsJson,
        corrections: typeof record.correctionsJson === 'string' ? JSON.parse(record.correctionsJson) : record.correctionsJson,
        legal: typeof record.legalJson === 'string' ? JSON.parse(record.legalJson) : record.legalJson,
        status: record.status,
      };

      return NextResponse.json({ success: true, data: formatted });
    }

    return NextResponse.json({ success: true, data: INITIAL_FOOTER_CONFIG });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch footer config' },
      { status: 500 }
    );
  }
});

export const POST = withAdminAuth(async (req) => {
  try {
    const body = await req.json();
    const { brand, utility, sitemap, columns, corrections, legal, status } = body || {};

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      const updated = await prisma.footerConfig.upsert({
        where: { key: 'default' },
        update: {
          brandJson: typeof brand === 'string' ? brand : JSON.stringify(brand || {}),
          utilityJson: typeof utility === 'string' ? utility : JSON.stringify(utility || {}),
          sitemapJson: typeof sitemap === 'string' ? sitemap : JSON.stringify(sitemap || {}),
          columnsJson: typeof columns === 'string' ? columns : JSON.stringify(columns || {}),
          correctionsJson: typeof corrections === 'string' ? corrections : JSON.stringify(corrections || {}),
          legalJson: typeof legal === 'string' ? legal : JSON.stringify(legal || {}),
          status: status || 'PUBLISHED',
        },
        create: {
          key: 'default',
          brandJson: typeof brand === 'string' ? brand : JSON.stringify(brand || {}),
          utilityJson: typeof utility === 'string' ? utility : JSON.stringify(utility || {}),
          sitemapJson: typeof sitemap === 'string' ? sitemap : JSON.stringify(sitemap || {}),
          columnsJson: typeof columns === 'string' ? columns : JSON.stringify(columns || {}),
          correctionsJson: typeof corrections === 'string' ? corrections : JSON.stringify(corrections || {}),
          legalJson: typeof legal === 'string' ? legal : JSON.stringify(legal || {}),
          status: status || 'PUBLISHED',
        },
      });

      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: true, data: body });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save footer config' },
      { status: 500 }
    );
  }
});
