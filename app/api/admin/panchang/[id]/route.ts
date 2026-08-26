import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { calculatePanchangForDate } from '@/lib/panchang-calculator';

export const PUT = withAdminAuth(async (req, { params }) => {
  try {
    const { id } = params;
    const body = await req.json();

    const existing = await prisma.panchangEntry.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Panchang record not found.' },
        { status: 404 }
      );
    }

    // Check if refresh requested
    if (body.action === 'refresh') {
      const parts = existing.date.split('/');
      let calculated;
      if (parts.length === 3) {
        calculated = calculatePanchangForDate(
          parseInt(parts[2], 10),
          parseInt(parts[1], 10),
          parseInt(parts[0], 10)
        );
      } else {
        const d = new Date(existing.dateObj);
        calculated = calculatePanchangForDate(
          d.getUTCFullYear(),
          d.getUTCMonth() + 1,
          d.getUTCDate()
        );
      }

      const updated = await prisma.panchangEntry.update({
        where: { id },
        data: {
          tithiName: calculated.tithiName,
          tithiDetail: calculated.tithiDetail,
          paksha: calculated.paksha,
          pakshaDetail: calculated.pakshaDetail,
          nakshatra: calculated.nakshatra,
          isAuspicious: calculated.isAuspicious,
          sunrise: calculated.sunrise,
          sunset: calculated.sunset,
          source: 'AUTO SYNCED',
          lastSynced: calculated.lastSynced,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Panchang record recalculated and refreshed.',
        data: updated,
      });
    }

    // Manual update
    const updated = await prisma.panchangEntry.update({
      where: { id },
      data: {
        tithiName: body.tithiName ?? existing.tithiName,
        tithiDetail: body.tithiDetail ?? existing.tithiDetail,
        paksha: body.paksha ?? existing.paksha,
        pakshaDetail: body.pakshaDetail ?? existing.pakshaDetail,
        nakshatra: body.nakshatra ?? existing.nakshatra,
        isAuspicious: body.isAuspicious !== undefined ? Boolean(body.isAuspicious) : existing.isAuspicious,
        sunrise: body.sunrise ?? existing.sunrise,
        sunset: body.sunset ?? existing.sunset,
        location: body.location ?? existing.location,
        source: body.source ?? 'MANUAL',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Panchang record updated.',
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server Error' },
      { status: 500 }
    );
  }
});

export const DELETE = withAdminAuth(async (req, { params }) => {
  try {
    const { id } = params;
    await prisma.panchangEntry.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Panchang entry deleted.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server Error' },
      { status: 500 }
    );
  }
});
