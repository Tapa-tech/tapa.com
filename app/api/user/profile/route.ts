import { NextResponse } from 'next/server';
import { withUserAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';

export const GET = withUserAuth(async (req, { user }) => {
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  if (!dbUser) {
    return NextResponse.json(
      { success: false, error: 'User record not found.' },
      { status: 444 }
    );
  }

  return NextResponse.json({
    success: true,
    profile: dbUser,
  });
});
