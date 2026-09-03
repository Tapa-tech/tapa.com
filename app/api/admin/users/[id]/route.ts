import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { canDeleteUser, canModifyRole, normalizeRole } from '@/lib/rbac';
import { logSecurityEvent } from '@/lib/audit-logger';
import { hashPassword } from '@/lib/password';

export const GET = withAdminAuth(async (req, { user, params }) => {
  const userId = params?.id;

  if (!userId) {
    return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
  }

  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          image: true,
          activeSessionId: true,
          createdAt: true,
          updatedAt: true,
          accounts: {
            select: { provider: true, createdAt: true },
          },
          orders: {
            select: {
              id: true,
              orderNumber: true,
              grandTotal: true,
              paymentMethod: true,
              paymentStatus: true,
              orderStatus: true,
              createdAt: true,
              items: {
                select: {
                  id: true,
                  productName: true,
                  quantity: true,
                  unitPrice: true,
                  lineTotal: true,
                },
              },
            },
            take: 20,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              orders: true,
              dharmicConcepts: true,
            },
          },
        },
      });

      if (!targetUser) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      const activityEvents: Array<{ title: string; detail: string; timestamp: string; type: string }> = [
        {
          title: 'Account Registered',
          detail: `User account created via ${targetUser.accounts.length > 0 ? targetUser.accounts[0].provider : targetUser.phone ? 'Phone OTP' : 'Credentials'}`,
          timestamp: targetUser.createdAt.toISOString(),
          type: 'account',
        },
      ];

      if (targetUser.updatedAt > targetUser.createdAt) {
        activityEvents.push({
          title: 'Profile Updated',
          detail: `Account information updated`,
          timestamp: targetUser.updatedAt.toISOString(),
          type: 'profile',
        });
      }

      targetUser.orders.forEach((o) => {
        activityEvents.push({
          title: `Order Placed (${o.orderNumber})`,
          detail: `Amount: ₹${o.grandTotal.toLocaleString('en-IN')} · Method: ${o.paymentMethod} · Status: ${o.orderStatus}`,
          timestamp: o.createdAt.toISOString(),
          type: 'order',
        });
      });

      activityEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return NextResponse.json({
        success: true,
        user: {
          id: targetUser.id,
          name: targetUser.name,
          email: targetUser.email,
          phone: targetUser.phone,
          role: targetUser.role,
          image: targetUser.image,
          activeSessionId: targetUser.activeSessionId,
          provider: targetUser.accounts.length > 0 ? targetUser.accounts[0].provider : targetUser.phone ? 'phone' : 'credentials',
          ordersCount: targetUser._count.orders,
          orders: targetUser.orders.map((o) => ({
            ...o,
            createdAt: o.createdAt.toISOString(),
          })),
          activityEvents,
          createdAt: targetUser.createdAt.toISOString(),
          updatedAt: targetUser.updatedAt.toISOString(),
        },
      });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message || 'Error fetching user' }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    user: {
      id: userId,
      name: 'Super Admin',
      email: 'admin@tapa.co',
      phone: null,
      role: 'SUPER_USER',
      image: null,
      activeSessionId: 'active',
      provider: 'credentials',
      ordersCount: 0,
      orders: [],
      activityEvents: [
        {
          title: 'Account Registered',
          detail: 'Super Admin account created',
          timestamp: new Date().toISOString(),
          type: 'account',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });
});

export const PATCH = withAdminAuth(async (req, { user, params }) => {
  const targetUserId = params?.id;

  if (!targetUserId) {
    return NextResponse.json({ success: false, error: 'Target User ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, role, password, activeSessionId } = body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name ? name.trim() : null;
    if (email !== undefined) updateData.email = email ? email.trim().toLowerCase() : null;
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;

    if (activeSessionId !== undefined) {
      updateData.activeSessionId = activeSessionId;
      logSecurityEvent({
        event: 'USER_ACTIVATION_TOGGLED',
        userId: user.id,
        details: `Admin ${user.id} toggled activeSessionId to ${activeSessionId} for user ${targetUserId}`,
      });
    }

    if (password) {
      updateData.password = hashPassword(password);
    }

    if (role) {
      const validation = canModifyRole(user.role, user.id, targetUserId, role);
      if (!validation.allowed) {
        return NextResponse.json(
          { success: false, error: validation.reason || 'Forbidden: Role change denied.' },
          { status: 403 }
        );
      }

      const prismaRole = normalizeRole(role) as UserRole;

      if (process.env.DATABASE_URL?.startsWith('postgres')) {
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
      }

      updateData.role = prismaRole;
    }

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      const updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          activeSessionId: true,
          updatedAt: true,
        },
      });

      logSecurityEvent({
        event: 'USER_PROFILE_UPDATED_BY_ADMIN',
        userId: user.id,
        details: `Admin ${user.id} updated user ${targetUserId}`,
      });

      return NextResponse.json({ success: true, user: updatedUser });
    }

    return NextResponse.json({
      success: true,
      user: { id: targetUserId, ...updateData },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'User update failed' }, { status: 500 });
  }
});

export const DELETE = withAdminAuth(async (req, { user, params }) => {
  const targetUserId = params?.id;

  if (!targetUserId) {
    return NextResponse.json({ success: false, error: 'Target User ID is required' }, { status: 400 });
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
        details: `SUPER_USER ${user.id} deleted user ${targetUserId}`,
      });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message || 'User deletion failed' }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    message: `User ${targetUserId} deleted successfully.`,
  });
});
