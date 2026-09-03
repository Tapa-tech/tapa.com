import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { INITIAL_FOOTER_CONFIG, FooterConfigData } from '@/lib/footer-config';

export async function GET() {
  try {
    let footerRecord: any = null;

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        footerRecord = await prisma.footerConfig.findUnique({
          where: { key: 'default' },
        });

        // Auto-seed initial footer configuration if empty
        if (!footerRecord) {
          footerRecord = await prisma.footerConfig.create({
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
      } catch (dbErr) {
        console.warn('[Public Footer Config API] DB query warning:', dbErr);
      }
    }

    if (footerRecord) {
      try {
        const formatted: FooterConfigData = {
          id: footerRecord.id,
          key: footerRecord.key,
          brand: typeof footerRecord.brandJson === 'string' ? JSON.parse(footerRecord.brandJson) : footerRecord.brandJson,
          utility: typeof footerRecord.utilityJson === 'string' ? JSON.parse(footerRecord.utilityJson) : footerRecord.utilityJson,
          sitemap: typeof footerRecord.sitemapJson === 'string' ? JSON.parse(footerRecord.sitemapJson) : footerRecord.sitemapJson,
          columns: typeof footerRecord.columnsJson === 'string' ? JSON.parse(footerRecord.columnsJson) : footerRecord.columnsJson,
          corrections: typeof footerRecord.correctionsJson === 'string' ? JSON.parse(footerRecord.correctionsJson) : footerRecord.correctionsJson,
          legal: typeof footerRecord.legalJson === 'string' ? JSON.parse(footerRecord.legalJson) : footerRecord.legalJson,
          status: footerRecord.status,
        };
        const response = NextResponse.json({ success: true, data: formatted });
        response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
        return response;
      } catch (parseErr) {
        console.warn('[Public Footer Config API] JSON parse error:', parseErr);
      }
    }

    const fallbackResponse = NextResponse.json({ success: true, data: INITIAL_FOOTER_CONFIG });
    fallbackResponse.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    return fallbackResponse;
  } catch (err: any) {
    console.error('[Public Footer Config API] Error:', err);
    return NextResponse.json({ success: true, data: INITIAL_FOOTER_CONFIG });
  }
}
