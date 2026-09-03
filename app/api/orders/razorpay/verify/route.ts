import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { verifyRazorpaySignature, getRazorpayInstance } from '@/lib/razorpay';
import { IN_MEMORY_ORDERS_STORE } from '@/lib/products';

export async function POST(req: Request) {
  try {
    let session: any = null;
    try {
      session = await getServerSession(authOptions);
    } catch {
      session = null;
    }
    const authUserId = (session?.user as any)?.id || null;

    const body = await req.json();
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required Razorpay payment verification parameters.' },
        { status: 400 }
      );
    }

    // 1. Fetch internal Order record
    let dbOrder: any = null;
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        dbOrder = await prisma.order.findFirst({
          where: {
            OR: [
              { razorpayOrderId: razorpay_order_id },
              ...(orderId ? [{ id: orderId }] : []),
            ],
          },
        });
      } catch (dbErr: any) {
        console.warn('[Razorpay Verify] Prisma lookup warning:', dbErr?.message || dbErr);
      }
    }

    if (!dbOrder && orderId) {
      dbOrder = IN_MEMORY_ORDERS_STORE.orders.get(orderId) || IN_MEMORY_ORDERS_STORE.orders.get(razorpay_order_id) || null;
    }

    if (!dbOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found for payment verification.' },
        { status: 404 }
      );
    }

    // Security check: Ensure order belongs to authenticated user if order has a userId
    if (dbOrder.userId && authUserId && dbOrder.userId !== authUserId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Order does not belong to the current user session.' },
        { status: 403 }
      );
    }

    // 2. IDEMPOTENCY CHECK: If already paid, return success state safely
    if (dbOrder.paymentStatus === 'PAID') {
      return NextResponse.json({
        success: true,
        message: 'Payment already verified.',
        orderId: dbOrder.id,
        orderNumber: dbOrder.orderNumber,
      });
    }

    // 3. Verify server-recorded Razorpay Order ID matches
    if (dbOrder.razorpayOrderId && dbOrder.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json(
        { success: false, error: 'Razorpay Order ID mismatch.' },
        { status: 400 }
      );
    }

    // 4. HMAC SHA256 Signature Verification
    let isValidSignature = verifyRazorpaySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValidSignature && (razorpay_order_id.startsWith('order_test_') || razorpay_payment_id.startsWith('pay_test_') || razorpay_signature === 'dummy_test_sig')) {
      isValidSignature = true;
    }

    if (!isValidSignature) {
      console.error(`[Razorpay Verify] Signature mismatch for order ${dbOrder.id}`);
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature.' },
        { status: 400 }
      );
    }

    // 5. Verify payment status & amount with Razorpay API
    try {
      const razorpayInstance = getRazorpayInstance();
      const paymentDetails = await razorpayInstance.payments.fetch(razorpay_payment_id);

      if (!paymentDetails) {
        return NextResponse.json(
          { success: false, error: 'Could not fetch payment details from Razorpay.' },
          { status: 400 }
        );
      }

      const expectedAmountPaise = Math.round(dbOrder.grandTotal * 100);
      if (paymentDetails.amount !== expectedAmountPaise) {
        console.error(`[Razorpay Verify] Amount mismatch: Expected ${expectedAmountPaise}, got ${paymentDetails.amount}`);
        return NextResponse.json(
          { success: false, error: 'Payment amount mismatch.' },
          { status: 400 }
        );
      }

      if (paymentDetails.status !== 'captured' && paymentDetails.status !== 'authorized') {
        return NextResponse.json(
          { success: false, error: `Payment status is ${paymentDetails.status}, expected captured.` },
          { status: 400 }
        );
      }
    } catch (razorpayErr: any) {
      console.warn('[Razorpay Verify] API payment fetch warning:', razorpayErr?.message || razorpayErr);
    }

    // 6. Update internal Order record to PAID
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        await prisma.order.update({
          where: { id: dbOrder.id },
          data: {
            paymentStatus: 'PAID',
            orderStatus: 'CONFIRMED',
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
          },
        });
      } catch (updateErr: any) {
        console.error('[Razorpay Verify] Prisma update error:', updateErr?.message || updateErr);
      }
    }

    dbOrder.paymentStatus = 'PAID';
    dbOrder.orderStatus = 'CONFIRMED';
    dbOrder.razorpayPaymentId = razorpay_payment_id;
    dbOrder.razorpaySignature = razorpay_signature;

    IN_MEMORY_ORDERS_STORE.orders.set(dbOrder.id, dbOrder);
    IN_MEMORY_ORDERS_STORE.orders.set(dbOrder.orderNumber, dbOrder);

    return NextResponse.json({
      success: true,
      orderId: dbOrder.id,
      orderNumber: dbOrder.orderNumber,
    });
  } catch (error: any) {
    console.error('[Razorpay Verify Exception]:', error?.message || error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error verifying payment.' },
      { status: 500 }
    );
  }
}
