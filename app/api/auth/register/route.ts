import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { logSecurityEvent } from '@/lib/audit-logger';
import { recordUserConsent } from '@/lib/consent';
import { IN_MEMORY_CUSTOMER_USERS } from '@/lib/products';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, consent } = body;

    // 1. Server-Side Input & Consent Validation
    if (!consent) {
      return NextResponse.json(
        { success: false, error: 'You must agree to the Terms & Privacy Policy to create an account.' },
        { status: 400 }
      );
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Full name must be at least 2 characters long.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone ? phone.trim() : null;

    if (cleanPhone && !/^[+0-9\s-]{10,15}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid phone number format.' },
        { status: 400 }
      );
    }

    // 2. Duplicate Account Check & Database Creation
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      const existingUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      if (existingUser) {
        logSecurityEvent({
          event: 'AUTH_LOGIN_FAILURE',
          details: `Registration attempted for existing email: ${cleanEmail}`,
        });
        return NextResponse.json(
          { success: false, error: 'An account with this email address already exists.' },
          { status: 400 }
        );
      }

      if (cleanPhone) {
        const existingPhone = await prisma.user.findUnique({
          where: { phone: cleanPhone },
        });
        if (existingPhone) {
          return NextResponse.json(
            { success: false, error: 'An account with this phone number already exists.' },
            { status: 400 }
          );
        }
      }

      // Hash password securely (PBKDF2 SHA-512)
      const hashedPassword = hashPassword(password);

      // Create user with emailVerified = null (unverified/pending state)
      const newUser = await prisma.user.create({
        data: {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password: hashedPassword,
          role: 'CUSTOMER',
          emailVerified: null, // Pending verification
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          emailVerified: true,
          createdAt: true,
        },
      });

      // Generate cryptographically secure verification token (24-hour expiry)
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Upsert verification token in Prisma VerificationToken table
      await prisma.verificationToken.upsert({
        where: { token },
        update: { expires },
        create: {
          identifier: cleanEmail,
          token,
          expires,
        },
      });

      // Record consent
      recordUserConsent({
        userId: newUser.id,
        email: cleanEmail,
        phone: cleanPhone || undefined,
        consentGiven: true,
        version: 'v1.0',
      });

      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      const devVerificationUrl = `${baseUrl}/verify-email?token=${token}`;


      console.log('==================================================');
      console.log(`[EMAIL VERIFICATION LINK FOR ${cleanEmail}]:`);
      console.log(devVerificationUrl);
      console.log('==================================================');

      logSecurityEvent({
        event: 'AUTH_LOGIN_SUCCESS',
        userId: newUser.id,
        details: `Unverified customer account registered for ${cleanEmail}. Verification token issued: ${token}`,
      });

      // Return safe response JSON
      return NextResponse.json(
        {
          success: true,
          message: 'Account created! Please verify your email address to complete your registration.',
          email: cleanEmail,
          user: newUser,
          devVerificationUrl: process.env.NODE_ENV !== 'production' ? `/verify-email?token=${token}` : undefined,
        },
        { status: 201 }
      );
    }


    // Dev mode fallback
    if (IN_MEMORY_CUSTOMER_USERS.users.has(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);
    const userId = `usr_cust_${Date.now()}`;
    const userPayload = {
      id: userId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash: hashedPassword,
      role: 'CUSTOMER',
      emailVerified: null,
    };

    IN_MEMORY_CUSTOMER_USERS.users.set(cleanEmail, userPayload);

    recordUserConsent({
      userId,
      email: cleanEmail,
      phone: cleanPhone || undefined,
      consentGiven: true,
      version: 'v1.0',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Account created! Please verify your email address to complete your registration.',
        email: cleanEmail,
        user: { id: userId, name: cleanName, email: cleanEmail, phone: cleanPhone, role: 'CUSTOMER', emailVerified: null },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Registration failed.' },
      { status: 500 }
    );
  }
}
