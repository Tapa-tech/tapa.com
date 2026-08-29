import { NextResponse } from 'next/server';
import { withUserAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { IN_MEMORY_ORDERS_STORE } from '@/lib/products';

export const GET = withUserAuth(async (req, { user }) => {
  const userEmail = user.email ? user.email.toLowerCase() : null;

  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      const orders = await prisma.order.findMany({
        where: {
          OR: [
            { userId: user.id },
            ...(userEmail ? [{ customerEmail: userEmail }] : []),
          ],
        },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ success: true, orders });
    } catch (e) {
      console.warn('Error fetching customer orders from DB:', e);
    }
  }

  // Dev fallback store matching customer email / userId
  const matchingOrders: any[] = [];
  IN_MEMORY_ORDERS_STORE.orders.forEach((order) => {
    if (order.userId === user.id || (userEmail && order.customerEmail?.toLowerCase() === userEmail)) {
      if (!matchingOrders.some((o) => o.orderNumber === order.orderNumber)) {
        matchingOrders.push(order);
      }
    }
  });

  return NextResponse.json({ success: true, orders: matchingOrders });
});
