import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Navratri Mahotsav 2026 Specials',
    message: 'Navratri Sthan & Ghatasthapana Shubh Muhurta details are live now. Access scriptural vidhi.',
    type: 'Header Banner',
    targetUrl: '/ritual-guides/navratri',
    isActive: true,
  },
  {
    id: 'ann-2',
    title: 'New Samagri Kits Delivery Region Expansion',
    message: 'Puja kits ordering is now active across Delhi-NCR and Mumbai metro areas.',
    type: 'In-App Alert',
    targetUrl: '/ritual-kits',
    isActive: true,
  },
  {
    id: 'ann-3',
    title: 'System Maintenance Completed',
    message: 'Panchang engine database migration and calculation updates are complete.',
    type: 'Modal Popup',
    targetUrl: '/panchang',
    isActive: false,
  },
];

export const GET = withAdminAuth(async () => {
  try {
    if (process.env.DATABASE_URL) {
      let count = await prisma.announcementBar.count();
      if (count === 0) {
        for (const ann of INITIAL_ANNOUNCEMENTS) {
          await prisma.announcementBar.create({ data: ann });
        }
      }

      const announcements = await prisma.announcementBar.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ success: true, announcements });
    }

    return NextResponse.json({ success: true, announcements: INITIAL_ANNOUNCEMENTS });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
});

export const POST = withAdminAuth(async (req) => {
  try {
    const body = await req.json();
    const { title, message, type, targetUrl, isActive } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      const newAnn = await prisma.announcementBar.create({
        data: {
          title: title.trim(),
          message: message.trim(),
          type: type || 'Header Banner',
          targetUrl: targetUrl ? targetUrl.trim() : null,
          isActive: isActive !== undefined ? Boolean(isActive) : true,
        },
      });

      return NextResponse.json({ success: true, announcement: newAnn }, { status: 201 });
    }

    return NextResponse.json(
      {
        success: true,
        announcement: {
          id: `ann-${Date.now()}`,
          title: title.trim(),
          message: message.trim(),
          type: type || 'Header Banner',
          targetUrl: targetUrl ? targetUrl.trim() : undefined,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create announcement' },
      { status: 500 }
    );
  }
});

export const PATCH = withAdminAuth(async (req) => {
  try {
    const body = await req.json();
    const { id, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Announcement ID is required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      const updated = await prisma.announcementBar.update({
        where: { id },
        data: { isActive: Boolean(isActive) },
      });

      return NextResponse.json({ success: true, announcement: updated });
    }

    return NextResponse.json({ success: true, id, isActive });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update announcement' },
      { status: 500 }
    );
  }
});

export const DELETE = withAdminAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Announcement ID is required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      await prisma.announcementBar.delete({ where: { id } });
      return NextResponse.json({ success: true, message: 'Announcement deleted successfully' });
    }

    return NextResponse.json({ success: true, message: 'Announcement deleted' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete announcement' },
      { status: 500 }
    );
  }
});
