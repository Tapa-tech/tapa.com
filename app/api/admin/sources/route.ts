import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';

const INITIAL_SOURCES = [
  {
    id: 'src-1',
    title: 'Devi Mahatmya (Durga Saptashati)',
    sanskritTitle: 'देवीमाहात्म्यम् (दुर्गासप्तशती)',
    category: 'Purana',
    citationsCount: 14,
    isVerified: true,
    notes: 'Primary scriptural reference for Navratri, Chandi Path, and Devi Pujas.',
  },
  {
    id: 'src-2',
    title: 'Shukla Yajurveda Samhita',
    sanskritTitle: 'शुक्लयजुर्वेदसंहिता',
    category: 'Veda',
    citationsCount: 8,
    isVerified: true,
    notes: 'Reference for Vedic Swasti Vachan, Rudrabhishekam, and Havanam mantras.',
  },
  {
    id: 'src-3',
    title: 'Garuda Purana (Preta Khanda)',
    sanskritTitle: 'गरुडपुराणम्',
    category: 'Purana',
    citationsCount: 5,
    isVerified: true,
    notes: 'Canonical source for Pitru Paksha and Shraddha rituals.',
  },
  {
    id: 'src-4',
    title: 'Nirnaya Sindhu (Kamalakara Bhatta)',
    sanskritTitle: 'निर्णयसिन्धुः',
    category: 'Smriti',
    citationsCount: 22,
    isVerified: true,
    notes: 'Authoritative digest for astronomical Tithi determination and Vrat timing rules.',
  },
];

export const GET = withAdminAuth(async () => {
  try {
    if (process.env.DATABASE_URL) {
      let count = await prisma.source.count();
      if (count === 0) {
        // Auto-seed initial sources if table is empty
        for (const src of INITIAL_SOURCES) {
          await prisma.source.create({ data: src });
        }
      }

      const sources = await prisma.source.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ success: true, sources });
    }

    return NextResponse.json({ success: true, sources: INITIAL_SOURCES });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch scriptural sources' },
      { status: 500 }
    );
  }
});

export const POST = withAdminAuth(async (req) => {
  try {
    const body = await req.json();
    const { title, sanskritTitle, category, notes, isVerified } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Source title is required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      const newSource = await prisma.source.create({
        data: {
          title: title.trim(),
          sanskritTitle: sanskritTitle ? sanskritTitle.trim() : null,
          category: category || 'Purana',
          notes: notes ? notes.trim() : null,
          isVerified: isVerified !== undefined ? Boolean(isVerified) : true,
        },
      });

      return NextResponse.json({ success: true, source: newSource }, { status: 201 });
    }

    return NextResponse.json(
      {
        success: true,
        source: {
          id: `src-${Date.now()}`,
          title: title.trim(),
          sanskritTitle: sanskritTitle ? sanskritTitle.trim() : '',
          category: category || 'Purana',
          citationsCount: 0,
          isVerified: true,
          notes: notes ? notes.trim() : '',
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create source' },
      { status: 500 }
    );
  }
});

export const DELETE = withAdminAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Source ID is required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      await prisma.source.delete({ where: { id } });
      return NextResponse.json({ success: true, message: 'Source deleted successfully' });
    }

    return NextResponse.json({ success: true, message: 'Source deleted' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete source' },
      { status: 500 }
    );
  }
});
