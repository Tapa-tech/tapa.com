import { NextResponse } from 'next/server';
import { withUserAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { IN_MEMORY_ORDERS_STORE } from '@/lib/products';
import { logSecurityEvent } from '@/lib/audit-logger';

export const POST = withUserAuth(async (req, { user, params }) => {
  const orderId = params?.orderId;

  if (!orderId) {
    return NextResponse.json({ success: false, error: 'Order ID is required.' }, { status: 400 });
  }

  const userEmail = user.email ? user.email.toLowerCase() : null;

  // 1. Database Order Cancellation
  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          OR: [{ id: orderId }, { orderNumber: orderId }],
        },
      });

      if (!order) {
        return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 });
      }

      // Anti-IDOR / Ownership Check
      const isOwner = order.userId === user.id || (userEmail && order.customerEmail.toLowerCase() === userEmail);
      if (!isOwner) {
        logSecurityEvent({
          event: 'FORBIDDEN_ROLE_ATTEMPT',
          userId: user.id,
          details: `User ${user.id} attempted to cancel order ${orderId} belonging to another user.`,
        });
        return NextResponse.json(
          { success: false, error: 'Forbidden: You can only cancel your own orders.' },
          { status: 403 }
        );
      }

      // Eligibility Check
      if (['DISPATCHED', 'DELIVERED', 'CANCELLED', 'CANCELLATION_REQUESTED'].includes(order.orderStatus)) {
        return NextResponse.json(
          { success: false, error: `Order cannot be cancelled in its current state (${order.orderStatus}).` },
          { status: 400 }
        );
      }

      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { orderStatus: 'CANCELLATION_REQUESTED' },
      });

      return NextResponse.json({
        success: true,
        message: 'Order cancellation request submitted successfully.',
        order: updatedOrder,
      });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e.message || 'Cancellation failed.' }, { status: 500 });
    }
  }

  // Dev fallback store cancellation
  const memOrder = IN_MEMORY_ORDERS_STORE.orders.get(orderId);
  if (!memOrder) {
    return NextResponse.json({ success: false, error: 'Order not found.' }, { status: 404 });
  }

  // Anti-IDOR Ownership check
  const isOwner = memOrder.userId === user.id || (userEmail && memOrder.customerEmail?.toLowerCase() === userEmail);
  if (!isOwner) {
    logSecurityEvent({
      event: 'FORBIDDEN_ROLE_ATTEMPT',
      userId: user.id,
      details: `User ${user.id} attempted to cancel order ${orderId} belonging to another user.`,
    });
    return NextResponse.json(
      { success: false, error: 'Forbidden: You can only cancel your own orders.' },
      { status: 403 }
    );
  }

  if (['DISPATCHED', 'DELIVERED', 'CANCELLED', 'CANCELLATION_REQUESTED'].includes(memOrder.orderStatus)) {
    return NextResponse.json(
      { success: false, error: `Order cannot be cancelled in its current state (${memOrder.orderStatus}).` },
      { status: 400 }
    );
  }

  memOrder.orderStatus = 'CANCELLATION_REQUESTED';
  IN_MEMORY_ORDERS_STORE.orders.set(orderId, memOrder);
  if (memOrder.orderNumber) {
    IN_MEMORY_ORDERS_STORE.orders.set(memOrder.orderNumber, memOrder);
  }

  return NextResponse.json({
    success: true,
    message: 'Order cancellation request submitted successfully.',
    order: memOrder,
  });
});
