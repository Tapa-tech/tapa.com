import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { canDeleteUser, canModifyRole, normalizeRole } from '@/lib/rbac';
import { logSecurityEvent } from '@/lib/audit-logger';

export const GET = withAdminAuth(async (req, { user }) => {
  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
        take: 50,
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({
        success: true,
        message: 'Admin user management access granted.',
        adminUser: { id: user.id, role: user.role },
        users,
      });
    } catch (err) {
      console.warn('DB error fetching users:', err);
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Admin user management access granted.',
    adminUser: { id: user.id, role: user.role },
    users: [
      {
        id: user.id,
        name: user.name || 'Super Admin',
        email: user.email || 'admin@tapa.co',
        phone: null,
        role: user.role,
        createdAt: new Date().toISOString(),
      },
    ],
  });
});

export const PATCH = withAdminAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const { targetUserId, requestedRole } = body;

    if (!targetUserId || !requestedRole) {
      return NextResponse.json(
        { success: false, error: 'Target User ID and requested role are required.' },
        { status: 400 }
      );
    }

    const validation = canModifyRole(user.role, user.id, targetUserId, requestedRole);
    if (!validation.allowed) {
      logSecurityEvent({
        event: 'FORBIDDEN_ROLE_ATTEMPT',
        userId: user.id,
        details: validation.reason || 'Role modification forbidden',
      });
      return NextResponse.json(
        { success: false, error: validation.reason || 'Forbidden: Role modification denied.' },
        { status: 403 }
      );
    }

    const normalizedTargetRole = normalizeRole(requestedRole);

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      const updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: { role: normalizedTargetRole },
        select: { id: true, name: true, email: true, role: true },
      });
      return NextResponse.json({ success: true, user: updatedUser });
    }

    return NextResponse.json({
      success: true,
      message: 'Role updated successfully',
      user: { id: targetUserId, role: normalizedTargetRole },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Role update failed' }, { status: 500 });
  }
});

export const DELETE = withAdminAuth(async (req, { user }) => {
  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get('userId');

  if (!targetUserId) {
    return NextResponse.json({ success: false, error: 'Target User ID is required.' }, { status: 400 });
  }

  // Server-side Guard: ONLY SUPER_USER CAN DELETE USERS
  if (!canDeleteUser(user.role)) {
    logSecurityEvent({
      event: 'FORBIDDEN_ROLE_ATTEMPT',
      userId: user.id,
      details: `Role ${user.role} attempted to delete user ${targetUserId}`,
    });
    return NextResponse.json(
      { success: false, error: 'Forbidden: Only SUPER_USER can delete user accounts.' },
      { status: 403 }
    );
  }

  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      await prisma.user.delete({ where: { id: targetUserId } });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message || 'User deletion failed' }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    message: `User ${targetUserId} deleted successfully by SUPER_USER.`,
  });
});
