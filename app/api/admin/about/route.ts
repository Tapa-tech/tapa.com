import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getPublicAboutServer, setInMemoryAboutData, seedAboutPageDB } from '@/lib/about-store';

export async function GET() {
  try {
    const data = await getPublicAboutServer();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[Admin About GET] Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to fetch about data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      coreValues = [],
      editorialSources = [],
      kitPoints = [],
      purohitBookingPoints = [],
      purohitArrangementPoints = [],
      circleSteps = [],
      ...mainFields
    } = body;

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      await seedAboutPageDB();
      const existing = await prisma.aboutPage.findUnique({ where: { key: 'default' } });

      if (existing) {
        // Use Prisma transaction to replace child relations cleanly
        await prisma.$transaction(async (tx) => {
          await tx.aboutCoreValue.deleteMany({ where: { aboutPageId: existing.id } });
          await tx.aboutEditorialSource.deleteMany({ where: { aboutPageId: existing.id } });
          await tx.aboutRitualKitPoint.deleteMany({ where: { aboutPageId: existing.id } });
          await tx.aboutPurohitBookingPoint.deleteMany({ where: { aboutPageId: existing.id } });
          await tx.aboutPurohitArrangementPoint.deleteMany({ where: { aboutPageId: existing.id } });
          await tx.aboutCircleStep.deleteMany({ where: { aboutPageId: existing.id } });

          await tx.aboutPage.update({
            where: { id: existing.id },
            data: {
              ...mainFields,
              coreValues: {
                create: coreValues.map((v: any, idx: number) => ({
                  number: v.number || `0${idx + 1}`,
                  title: v.title || '',
                  description: v.description || '',
                  sortOrder: v.sortOrder || idx + 1,
                })),
              },
              editorialSources: {
                create: editorialSources.map((s: any, idx: number) => ({
                  source: s.source || '',
                  score: s.score || '',
                  sortOrder: s.sortOrder || idx + 1,
                })),
              },
              kitPoints: {
                create: kitPoints.map((p: any, idx: number) => ({
                  title: p.title || '',
                  description: p.description || '',
                  sortOrder: p.sortOrder || idx + 1,
                })),
              },
              purohitBookingPoints: {
                create: purohitBookingPoints.map((p: any, idx: number) => ({
                  title: p.title || '',
                  description: p.description || '',
                  sortOrder: p.sortOrder || idx + 1,
                })),
              },
              purohitArrangementPoints: {
                create: purohitArrangementPoints.map((p: any, idx: number) => ({
                  title: p.title || '',
                  description: p.description || '',
                  sortOrder: p.sortOrder || idx + 1,
                })),
              },
              circleSteps: {
                create: circleSteps.map((s: any, idx: number) => ({
                  title: s.title || '',
                  description: s.description || '',
                  sortOrder: s.sortOrder || idx + 1,
                })),
              },
            },
          });
        });
      }
    }

    // Also update in-memory fallback store
    const updatedMem = setInMemoryAboutData({
      ...mainFields,
      coreValues,
      editorialSources,
      kitPoints,
      purohitBookingPoints,
      purohitArrangementPoints,
      circleSteps,
    });

    return NextResponse.json({ success: true, data: updatedMem, message: 'About page content updated successfully!' });
  } catch (error: any) {
    console.error('[Admin About PUT] Error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update about page content' }, { status: 500 });
  }
}
