import { NextResponse } from 'next/server';
import { verifyPhoneOtp } from '@/lib/otp';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, otp } = body || {};

    if (!phone || typeof phone !== 'string' || !otp || typeof otp !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Phone number and verification code are required.' },
        { status: 400 }
      );
    }

    const result = await verifyPhoneOtp(phone, otp);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Phone number verified successfully.',
        user: {
          id: result.user?.id,
          phone: result.user?.phone,
          role: result.user?.role,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[OTP API] Error verifying OTP:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
