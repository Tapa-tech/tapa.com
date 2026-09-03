import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { prisma } from '@/lib/db';
import { IN_MEMORY_ORDERS_STORE } from '@/lib/products';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ success: false, error: 'Missing webhook signature' }, { status: 400 });
    }

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn('[Razorpay Webhook] Invalid signature received.');
      return NextResponse.json({ success: false, error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload?.event;
    const paymentEntity = payload?.payload?.payment?.entity;
    const orderEntity = payload?.payload?.order?.entity;

    const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
    const razorpayPaymentId = paymentEntity?.id;

    if ((event === 'payment.captured' || event === 'order.paid') && razorpayOrderId) {
      if (process.env.DATABASE_URL?.startsWith('postgres')) {
        try {
          const dbOrder = await prisma.order.findFirst({
            where: { razorpayOrderId },
          });

          if (dbOrder && dbOrder.paymentStatus !== 'PAID') {
            await prisma.order.update({
              where: { id: dbOrder.id },
              data: {
                paymentStatus: 'PAID',
                orderStatus: 'CONFIRMED',
                razorpayPaymentId: razorpayPaymentId || dbOrder.razorpayPaymentId,
              },
            });
          }
        } catch (dbErr: any) {
          console.error('[Razorpay Webhook] DB update error:', dbErr?.message || dbErr);
        }
      }

      const memOrder = IN_MEMORY_ORDERS_STORE.orders.get(razorpayOrderId);
      if (memOrder) {
        memOrder.paymentStatus = 'PAID';
        memOrder.orderStatus = 'CONFIRMED';
        if (razorpayPaymentId) memOrder.razorpayPaymentId = razorpayPaymentId;
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error: any) {
    console.error('[Razorpay Webhook Error]:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 });
  }
}
