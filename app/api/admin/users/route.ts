import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';

export const GET = withAdminAuth(async (req, { user }) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
    take: 20,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    success: true,
    message: 'Admin user management access granted.',
    adminUser: { id: user.id, role: user.role },
    users,
  });
});
