import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';

const INITIAL_FEATURES = [
  {
    id: 'feat-1',
    key: 'ai-panchang-finder',
    title: 'AI Panchang Muhurta Finder',
    category: 'Panchang Engine',
    status: 'In Development',
    targetRelease: 'Q4 2026',
    description: 'Personalized auspicious timing calculations based on city location, Lagna, and Tithi for home pujas.',
    priority: 'High',
    requests: 248,
  },
  {
    id: 'feat-2',
    key: 'whatsapp-order-bot',
    title: 'WhatsApp Samagri Order Bot',
    category: 'Ecommerce',
    status: 'Beta Testing',
    targetRelease: 'Q3 2026',
    description: 'Direct 1-click Samagri kit order placement and delivery tracking via WhatsApp automation.',
    priority: 'High',
    requests: 184,
  },
  {
    id: 'feat-3',
    key: 'audio-chanting-mode',
    title: 'Audio Chanting & Shloka Practice Mode',
    category: 'Ritual Engine',
    status: 'In Planning',
    targetRelease: 'Q1 2027',
    description: 'Interactive audio player with syllable-by-syllable Sanskrit pronunciation guide for ritual mantras.',
    priority: 'Medium',
    requests: 112,
  },
  {
    id: 'feat-4',
    key: 'offline-vrat-pdf',
    title: 'Offline Vrat Calendar PDF Generator',
    category: 'Content & Media',
    status: 'Released',
    targetRelease: 'Q3 2026',
    description: 'Downloadable high-resolution printable PDF calendar for daily Vrat observances.',
    priority: 'High',
    requests: 310,
  },
];

export const GET = withAdminAuth(async () => {
  try {
    if (process.env.DATABASE_URL) {
      let count = await prisma.upcomingFeature.count();
      if (count === 0) {
        // Auto-seed initial features if table is empty
        for (const feat of INITIAL_FEATURES) {
          await prisma.upcomingFeature.create({ data: feat });
        }
      }

      const features = await prisma.upcomingFeature.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ success: true, features });
    }

    return NextResponse.json({ success: true, features: INITIAL_FEATURES });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch upcoming features' },
      { status: 500 }
    );
  }
});

export const POST = withAdminAuth(async (req) => {
  try {
    const body = await req.json();
    const { title, category, status, targetRelease, description, priority } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Feature title is required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      const newFeature = await prisma.upcomingFeature.create({
        data: {
          title: title.trim(),
          category: category || 'Ritual Engine',
          status: status || 'In Planning',
          targetRelease: targetRelease ? targetRelease.trim() : 'Q4 2026',
          description: description ? description.trim() : null,
          priority: priority || 'Medium',
          requests: 1,
        },
      });

      return NextResponse.json({ success: true, feature: newFeature }, { status: 201 });
    }

    return NextResponse.json(
      {
        success: true,
        feature: {
          id: `feat-${Date.now()}`,
          title: title.trim(),
          category: category || 'Ritual Engine',
          status: status || 'In Planning',
          targetRelease: targetRelease ? targetRelease.trim() : 'Q4 2026',
          description: description ? description.trim() : '',
          priority: priority || 'Medium',
          requests: 1,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create upcoming feature' },
      { status: 500 }
    );
  }
});

export const DELETE = withAdminAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Feature ID is required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      await prisma.upcomingFeature.delete({ where: { id } });
      return NextResponse.json({ success: true, message: 'Feature deleted successfully' });
    }

    return NextResponse.json({ success: true, message: 'Feature deleted' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete feature' },
      { status: 500 }
    );
  }
});
