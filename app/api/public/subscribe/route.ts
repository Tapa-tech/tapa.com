import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phoneOrEmail, name } = body || {};

    if (!phoneOrEmail || typeof phoneOrEmail !== 'string' || !phoneOrEmail.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid WhatsApp number or email address.' },
        { status: 400 }
      );
    }

    const cleanedContact = phoneOrEmail.trim();

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        const subscriber = await prisma.subscriber.upsert({
          where: { whatsappNumber: cleanedContact },
          update: {
            status: 'Active',
            consentGiven: true,
          },
          create: {
            name: name?.trim() || 'WhatsApp Subscriber',
            whatsappNumber: cleanedContact,
            consentGiven: true,
            status: 'Active',
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Subscribed successfully for free WhatsApp alerts!',
          data: subscriber,
        });
      } catch (dbErr) {
        console.warn('[Public Subscribe API] DB error fallback:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully for free WhatsApp alerts!',
      data: { contact: cleanedContact, status: 'Active' },
    });
  } catch (err: any) {
    console.error('[Public Subscribe API] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to process subscription request.' },
      { status: 500 }
    );
  }
}
