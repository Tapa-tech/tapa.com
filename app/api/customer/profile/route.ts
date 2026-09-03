import { NextResponse } from 'next/server';
import { withUserAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { IN_MEMORY_CUSTOMER_USERS } from '@/lib/products';

export const GET = withUserAuth(async (req, { user }) => {
  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      });
      if (dbUser) {
        return NextResponse.json({ success: true, user: dbUser });
      }
    } catch (e) {
      console.warn('Error fetching customer profile:', e);
    }
  }

  // Fallback dev response
  const inMem = user.email ? IN_MEMORY_CUSTOMER_USERS.users.get(user.email) : null;
  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: inMem?.name || user.name || 'Valued Devotee',
      email: user.email || null,
      phone: null,
      role: user.role,
      createdAt: new Date().toISOString(),
    },
  });
});

export const PATCH = withUserAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const { name, phone, email } = body || {};
    const updateData: { name?: string; phone?: string; email?: string } = {};
    if (name && typeof name === 'string') updateData.name = name.trim();
    if (phone && typeof phone === 'string') updateData.phone = phone.trim();
    if (email && typeof email === 'string') updateData.email = email.trim().toLowerCase();

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
        select: { id: true, name: true, email: true, phone: true, role: true },
      });
      return NextResponse.json({ success: true, message: 'Profile updated successfully', user: updated });
    }

    if (user.email && IN_MEMORY_CUSTOMER_USERS.users.has(user.email)) {
      const existing = IN_MEMORY_CUSTOMER_USERS.users.get(user.email)!;
      if (updateData.name) existing.name = updateData.name;
      IN_MEMORY_CUSTOMER_USERS.users.set(user.email, existing);
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: { id: user.id, name: updateData.name || user.name, email: user.email, role: user.role },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Profile update failed' }, { status: 500 });
  }
});
