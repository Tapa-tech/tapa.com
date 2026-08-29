import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { syncPanchangEntriesForYear, syncNextNDays } from '@/lib/panchang-calculator';

export const GET = withAdminAuth(async (req, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get('year') || '2026';
    const year = parseInt(yearParam, 10) || 2026;
    const search = searchParams.get('search') || '';
    const pakshaFilter = searchParams.get('paksha') || 'ALL';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '366', 10);

    // Check count of entries for requested year
    let count = 0;
    try {
      count = await prisma.panchangEntry.count({
        where: { year },
      });

      // Auto-generate full year entries if count is 0
      if (count === 0) {
        await syncPanchangEntriesForYear(year);
        count = await prisma.panchangEntry.count({
          where: { year },
        });
      }
    } catch (dbErr: any) {
      console.warn('[API Admin Panchang GET] DB count warning:', dbErr?.message || dbErr);
    }

    // Build filter query
    const where: any = { year };

    if (search.trim()) {
      where.OR = [
        { tithiName: { contains: search } },
        { nakshatra: { contains: search } },
        { date: { contains: search } },
      ];
    }

    if (pakshaFilter !== 'ALL') {
      where.paksha = pakshaFilter;
    }

    let entries: any[] = [];
    try {
      entries = await prisma.panchangEntry.findMany({
        where,
        orderBy: { dateObj: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      });
    } catch (dbErr: any) {
      console.warn('[API Admin Panchang GET] DB findMany warning:', dbErr?.message || dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Panchang entries retrieved successfully.',
      adminUser: { id: user.id, role: user.role },
      year,
      total: count,
      filteredTotal: entries.length,
      page,
      limit,
      data: entries,
    });
  } catch (err: any) {
    console.error('[API Admin Panchang GET] Error:', err);
    return NextResponse.json(
      { success: true, total: 0, filteredTotal: 0, data: [], error: err?.message || 'Database error' },
      { status: 200 }
    );
  }
});

export const POST = withAdminAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const { action, year = 2026, days = 45 } = body || {};

    if (action === 'sync-year') {
      const syncedCount = await syncPanchangEntriesForYear(parseInt(year, 10) || 2026);
      return NextResponse.json({
        success: true,
        message: `Successfully calculated and persisted ${syncedCount} daily Panchang entries for year ${year}.`,
        syncedCount,
      });
    }

    if (action === 'sync-45-days') {
      const syncedCount = await syncNextNDays(parseInt(days, 10) || 45);
      return NextResponse.json({
        success: true,
        message: `Successfully calculated and persisted ${syncedCount} days Panchang entries.`,
        syncedCount,
      });
    }

    // Manual single entry creation
    const {
      date,
      tithiName,
      tithiDetail,
      paksha,
      pakshaDetail,
      nakshatra,
      isAuspicious,
      sunrise,
      sunset,
      location = 'New Delhi, India',
    } = body;

    if (!date || !tithiName || !nakshatra) {
      return NextResponse.json(
        { success: false, error: 'Validation Error: Date, Tithi, and Nakshatra are required.' },
        { status: 400 }
      );
    }

    const parts = date.split('/');
    let dateObj: Date;
    let yearNum = 2026;

    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      yearNum = y;
      dateObj = new Date(Date.UTC(y, m, d));
    } else {
      dateObj = new Date(date);
      yearNum = dateObj.getUTCFullYear();
    }

    const todayStr = new Date().toLocaleDateString('en-GB');

    const created = await prisma.panchangEntry.upsert({
      where: { dateObj },
      update: {
        date,
        year: yearNum,
        tithiName,
        tithiDetail: tithiDetail || 'Custom day',
        paksha: paksha || 'Shukla',
        pakshaDetail: pakshaDetail || 'Waxing moon',
        nakshatra,
        isAuspicious: Boolean(isAuspicious),
        sunrise: sunrise || '6:30',
        sunset: sunset || '18:30',
        location,
        source: 'MANUAL',
        lastSynced: todayStr,
      },
      create: {
        date,
        dateObj,
        year: yearNum,
        tithiName,
        tithiDetail: tithiDetail || 'Custom day',
        paksha: paksha || 'Shukla',
        pakshaDetail: pakshaDetail || 'Waxing moon',
        nakshatra,
        isAuspicious: Boolean(isAuspicious),
        sunrise: sunrise || '6:30',
        sunset: sunset || '18:30',
        location,
        source: 'MANUAL',
        lastSynced: todayStr,
        status: 'PUBLISHED',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Panchang entry saved successfully.',
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server Error' },
      { status: 500 }
    );
  }
});
