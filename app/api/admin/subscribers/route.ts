import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';

const INITIAL_SUBSCRIBERS = [
  {
    id: 'sub-1',
    name: 'Test Subscriber Name',
    whatsappNumber: '9876543210',
    optInDate: new Date().toISOString(),
    consentGiven: true,
    status: 'Active',
  },
];

export const GET = withAdminAuth(async () => {
  try {
    if (process.env.DATABASE_URL) {
      let count = await prisma.subscriber.count();
      if (count === 0) {
        // Auto-seed initial subscribers if table is empty
        for (const sub of INITIAL_SUBSCRIBERS) {
          await prisma.subscriber.create({
            data: {
              id: sub.id,
              name: sub.name,
              whatsappNumber: sub.whatsappNumber,
              consentGiven: sub.consentGiven,
              status: sub.status,
            },
          });
        }
      }

      const subscribers = await prisma.subscriber.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ success: true, subscribers });
    }

    return NextResponse.json({ success: true, subscribers: INITIAL_SUBSCRIBERS });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
});

export const PATCH = withAdminAuth(async (req) => {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Subscriber ID is required' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      const updated = await prisma.subscriber.update({
        where: { id },
        data: { status: status || 'Active' },
      });

      return NextResponse.json({ success: true, subscriber: updated });
    }

    return NextResponse.json({ success: true, id, status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update subscriber status' },
      { status: 500 }
    );
  }
});
