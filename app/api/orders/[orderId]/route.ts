import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { IN_MEMORY_ORDERS_STORE } from '@/lib/products';

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // 1. Check PostgreSQL Database if configured
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });

        if (order) {
          return NextResponse.json({ success: true, order });
        }

        const orderNumberMatch = await prisma.order.findUnique({
          where: { orderNumber: orderId },
          include: { items: true },
        });

        if (orderNumberMatch) {
          return NextResponse.json({ success: true, order: orderNumberMatch });
        }
      } catch (dbErr) {
        console.warn('Prisma DB lookup fallback used:', dbErr);
      }
    }

    // 2. Fallback to in-memory store
    if (IN_MEMORY_ORDERS_STORE.orders && IN_MEMORY_ORDERS_STORE.orders.has(orderId)) {
      return NextResponse.json({ success: true, order: IN_MEMORY_ORDERS_STORE.orders.get(orderId) });
    }

    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  } catch (err: any) {
    console.error('Error fetching order:', err);
    return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 });
  }
}
