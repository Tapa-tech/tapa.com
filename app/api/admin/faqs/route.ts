import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';

const INITIAL_FAQS = [
  {
    id: 'faq-1',
    question: 'How are Panchang Tithi timings calculated for different cities?',
    answer: 'Panchang timings are calculated using local sunrise and astronomical ephemeris algorithms for exact geographic coordinates.',
    category: 'Panchang & Dates',
    helpfulVotes: 142,
  },
  {
    id: 'faq-2',
    question: 'Can I perform Ghatasthapana if I miss the morning Abhijit Muhurta?',
    answer: 'If Abhijit Muhurta is missed, Pradosh Kaal or auspicious Choghadiya timings recommended in scripture can be utilized.',
    category: 'Rituals & Puja',
    helpfulVotes: 98,
  },
  {
    id: 'faq-3',
    question: 'What items are included in the Tapa Puja Kit?',
    answer: 'Each Puja Kit contains scripturally prescribed samagri including Kalash, Gangajal, Akshat, Haldi, Kumkum, and authentic herbs.',
    category: 'Accounts & Orders',
    helpfulVotes: 76,
  },
];

export const GET = withAdminAuth(async () => {
  try {
    if (process.env.DATABASE_URL) {
      let count = await prisma.faq.count();
      if (count === 0) {
        // Auto-seed initial FAQs if table is empty
        for (const f of INITIAL_FAQS) {
          await prisma.faq.create({ data: f });
        }
      }

      const faqs = await prisma.faq.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ success: true, faqs });
    }

    return NextResponse.json({ success: true, faqs: INITIAL_FAQS });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
});

export const POST = withAdminAuth(async (req) => {
  try {
    const body = await req.json();
    const { question, answer, category } = body;

    if (!question || !question.trim()) {
      return NextResponse.json({ success: false, error: 'Question is required' }, { status: 400 });
    }

    if (!answer || !answer.trim()) {
      return NextResponse.json({ success: false, error: 'Answer is required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      const newFaq = await prisma.faq.create({
        data: {
          question: question.trim(),
          answer: answer.trim(),
          category: category || 'General',
        },
      });

      return NextResponse.json({ success: true, faq: newFaq }, { status: 201 });
    }

    return NextResponse.json(
      {
        success: true,
        faq: {
          id: `faq-${Date.now()}`,
          question: question.trim(),
          answer: answer.trim(),
          category: category || 'General',
          helpfulVotes: 0,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create FAQ' },
      { status: 500 }
    );
  }
});

export const DELETE = withAdminAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'FAQ ID is required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      await prisma.faq.delete({ where: { id } });
      return NextResponse.json({ success: true, message: 'FAQ deleted successfully' });
    }

    return NextResponse.json({ success: true, message: 'FAQ deleted' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
});
