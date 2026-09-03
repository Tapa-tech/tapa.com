import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { canDeleteUser, canModifyRole, normalizeRole } from '@/lib/rbac';
import { logSecurityEvent } from '@/lib/audit-logger';
import { hashPassword } from '@/lib/password';

export const GET = withAdminAuth(async (req, { user }) => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query')?.trim().toLowerCase() || '';
  const roleFilter = searchParams.get('role')?.toUpperCase() || 'ALL';

  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      const whereClause: any = {};

      if (roleFilter !== 'ALL') {
        whereClause.role = roleFilter as UserRole;
      }

      if (query) {
        whereClause.OR = [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ];
      }

      const users = await prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          image: true,
          activeSessionId: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          accounts: {
            select: { provider: true },
          },
          _count: {
            select: { orders: true },
          },
        },
        take: 100,
        orderBy: { createdAt: 'desc' },
      });

      const formattedUsers = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        image: u.image,
        activeSessionId: u.activeSessionId,
        emailVerified: u.emailVerified ? u.emailVerified.toISOString() : null,

        provider: u.accounts.length > 0 ? u.accounts[0].provider : u.phone ? 'phone' : 'credentials',
        ordersCount: u._count.orders,
        createdAt: u.createdAt.toISOString(),
      }));

      return NextResponse.json({
        success: true,
        message: 'Admin user management access granted.',
        adminUser: { id: user.id, role: user.role },
        users: formattedUsers,
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
        image: null,
        activeSessionId: 'active',
        provider: 'credentials',
        ordersCount: 0,
        createdAt: new Date().toISOString(),
      },
    ],
  });
});

export const POST = withAdminAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const { name, email, phone, role, password } = body;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { success: false, error: 'Name and either Email or Phone are required.' },
        { status: 400 }
      );
    }

    const normalizedTargetRole = normalizeRole(role || 'CUSTOMER');
    const validation = canModifyRole(user.role, user.id, 'new-user', normalizedTargetRole);
    if (!validation.allowed) {
      return NextResponse.json(
        { success: false, error: validation.reason || 'Forbidden: Cannot assign requested role.' },
        { status: 403 }
      );
    }

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      if (email) {
        const existingEmail = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
        if (existingEmail) {
          return NextResponse.json({ success: false, error: 'A user with this email already exists.' }, { status: 400 });
        }
      }

      if (phone) {
        const existingPhone = await prisma.user.findUnique({ where: { phone: phone.trim() } });
        if (existingPhone) {
          return NextResponse.json({ success: false, error: 'A user with this phone number already exists.' }, { status: 400 });
        }
      }

      const passwordHash = password ? hashPassword(password) : null;

      const newUser = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email ? email.trim().toLowerCase() : null,
          phone: phone ? phone.trim() : null,
          password: passwordHash,
          role: normalizedTargetRole as UserRole,
        },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      });

      logSecurityEvent({
        event: 'USER_CREATED_BY_ADMIN',
        userId: user.id,
        details: `Admin ${user.email || user.id} created new user ${newUser.id} (${newUser.email || newUser.phone}) with role ${newUser.role}`,
      });

      return NextResponse.json({ success: true, user: newUser });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email || null,
        phone: phone || null,
        role: normalizedTargetRole,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'User creation failed' }, { status: 500 });
  }
});

export const PATCH = withAdminAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const targetUserId = body.targetUserId || body.userId;
    const requestedRole = body.requestedRole || body.role;

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
    const prismaRole: UserRole = normalizedTargetRole as UserRole;

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      // Check last SUPER_USER demotion protection
      const currentTargetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { role: true },
      });

      if (currentTargetUser?.role === 'SUPER_USER' && prismaRole !== 'SUPER_USER') {
        const superUserCount = await prisma.user.count({ where: { role: 'SUPER_USER' } });
        if (superUserCount <= 1) {
          return NextResponse.json(
            { success: false, error: 'Forbidden: Cannot demote the last remaining SUPER_USER account in the system.' },
            { status: 403 }
          );
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: { role: prismaRole },
        select: { id: true, name: true, email: true, role: true },
      });

      logSecurityEvent({
        event: 'USER_ROLE_CHANGED_BY_ADMIN',
        userId: user.id,
        details: `Admin ${user.id} updated user ${targetUserId} role to ${prismaRole}`,
      });

      return NextResponse.json({ success: true, user: updatedUser });
    }

    return NextResponse.json({
      success: true,
      message: 'Role updated successfully',
      user: { id: targetUserId, role: prismaRole },
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

  // Prevent self deletion
  if (user.id === targetUserId) {
    return NextResponse.json(
      { success: false, error: 'Forbidden: You cannot delete your own active SUPER_USER account.' },
      { status: 403 }
    );
  }

  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { role: true, email: true, phone: true },
      });

      if (targetUser?.role === 'SUPER_USER') {
        const superUserCount = await prisma.user.count({ where: { role: 'SUPER_USER' } });
        if (superUserCount <= 1) {
          return NextResponse.json(
            { success: false, error: 'Forbidden: Cannot delete the last remaining SUPER_USER account in the system.' },
            { status: 403 }
          );
        }
      }

      await prisma.user.delete({ where: { id: targetUserId } });

      logSecurityEvent({
        event: 'USER_DELETED_BY_ADMIN',
        userId: user.id,
        details: `SUPER_USER ${user.id} deleted user ${targetUserId} (${targetUser?.email || targetUser?.phone})`,
      });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message || 'User deletion failed' }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    message: `User ${targetUserId} deleted successfully by SUPER_USER.`,
  });
});