import { NextResponse } from 'next/server';
import { requestPhoneOtp } from '@/lib/otp';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone } = body || {};

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Valid phone number is required.' },
        { status: 400 }
      );
    }

    const result = await requestPhoneOtp(phone);
    if (!result.success) {
      return NextResponse.json(result, { status: 429 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('[OTP API] Error sending OTP:', err);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
