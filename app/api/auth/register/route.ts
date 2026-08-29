import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { logSecurityEvent } from '@/lib/audit-logger';
import { IN_MEMORY_CUSTOMER_USERS } from '@/lib/products';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // 1. Input Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Full name must be at least 2 characters long.' },
        { status: 400 }
      );
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
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

    // 2. Duplicate Email Check & Server DB Creation
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

      // Hash password securely (PBKDF2 SHA-512)
      const hashedPassword = hashPassword(password);

      // ALWAYS HARDCODE ROLE TO 'CUSTOMER'
      const newUser = await prisma.user.create({
        data: {
          name: cleanName,
          email: cleanEmail,
          password: hashedPassword,
          role: 'CUSTOMER', // Strict server-side role assignment
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      logSecurityEvent({
        event: 'AUTH_LOGIN_SUCCESS',
        userId: newUser.id,
        details: `Customer account registered for ${cleanEmail}`,
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Account created successfully! You can now log in.',
          user: newUser,
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
      passwordHash: hashedPassword,
      role: 'CUSTOMER',
    };

    IN_MEMORY_CUSTOMER_USERS.users.set(cleanEmail, userPayload);

    return NextResponse.json(
      {
        success: true,
        message: 'Customer account created successfully!',
        user: { id: userId, name: cleanName, email: cleanEmail, role: 'CUSTOMER' },
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
