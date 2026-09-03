import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logSecurityEvent } from '@/lib/audit-logger';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token')?.trim();

  if (!token) {
    return NextResponse.json(
      { success: false, status: 'INVALID_TOKEN', error: 'Verification token is required.' },
      { status: 400 }
    );
  }

  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      const record = await prisma.verificationToken.findUnique({
        where: { token },
      });

      if (!record) {
        return NextResponse.json(
          { success: false, status: 'INVALID_TOKEN', error: 'Invalid verification link.' },
          { status: 400 }
        );
      }

      // Check token expiration
      if (new Date() > record.expires) {
        await prisma.verificationToken.delete({ where: { token } });
        return NextResponse.json(
          { success: false, status: 'EXPIRED_TOKEN', error: 'Verification link expired.' },
          { status: 400 }
        );
      }

      // Find user by identifier (email)
      const user = await prisma.user.findUnique({
        where: { email: record.identifier },
        select: { id: true, email: true, emailVerified: true },
      });

      if (!user) {
        await prisma.verificationToken.delete({ where: { token } });
        return NextResponse.json(
          { success: false, status: 'INVALID_TOKEN', error: 'Associated user account not found.' },
          { status: 404 }
        );
      }

      // Check if already verified
      if (user.emailVerified) {
        await prisma.verificationToken.delete({ where: { token } });
        return NextResponse.json({
          success: true,
          status: 'ALREADY_VERIFIED',
          message: 'Email address is already verified.',
          email: user.email,
        });
      }

      // Mark user as email verified
      const now = new Date();
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: now },
      });

      // Single-use token cleanup: delete token after successful verification
      await prisma.verificationToken.delete({ where: { token } });

      logSecurityEvent({
        event: 'AUTH_LOGIN_SUCCESS',
        userId: user.id,
        details: `Email address ${user.email} verified successfully at ${now.toISOString()}`,
      });

      return NextResponse.json({
        success: true,
        status: 'SUCCESS',
        message: 'Email verified successfully.',
        email: user.email,
      });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, status: 'INVALID_TOKEN', error: err.message || 'Verification error' },
        { status: 500 }
      );
    }
  }

  // Dev fallback
  return NextResponse.json({
    success: true,
    status: 'SUCCESS',
    message: 'Email verified successfully.',
    email: 'dev@example.com',
  });
}
