import { prisma } from '@/lib/db';
import OrderConfirmationClient, { OrderData } from '@/components/OrderConfirmation/OrderConfirmationClient';

interface PageProps {
  params: {
    orderId: string;
  };
}

async function getOrderServer(orderId: string): Promise<{ order: OrderData | null; error: string | null }> {
  if (!orderId) return { order: null, error: 'Order ID is required' };

  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    try {
      const dbOrder = await prisma.order.findFirst({
        where: {
          OR: [{ id: orderId }, { orderNumber: orderId }],
        },
        include: { items: true },
      });

      if (dbOrder) {
        return {
          order: {
            id: dbOrder.id,
            orderNumber: dbOrder.orderNumber,
            customerName: dbOrder.customerName,
            customerMobile: dbOrder.customerMobile,
            customerEmail: dbOrder.customerEmail,
            streetAddress: dbOrder.streetAddress,
            city: dbOrder.city,
            state: dbOrder.state,
            pincode: dbOrder.pincode,
            country: dbOrder.country,
            subtotal: dbOrder.subtotal,
            deliveryCharge: dbOrder.deliveryCharge,
            grandTotal: dbOrder.grandTotal,
            paymentMethod: dbOrder.paymentMethod,
            paymentStatus: dbOrder.paymentStatus,
            orderStatus: dbOrder.orderStatus,
            createdAt: dbOrder.createdAt.toISOString(),
            items: dbOrder.items.map((item) => ({
              id: item.id,
              productId: item.productId,
              productName: item.productName,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              lineTotal: item.lineTotal,
            })),
          },
          error: null,
        };
      }
    } catch (err: any) {
      console.warn('[Order Success Server] DB query fallback:', err?.message || err);
    }
  }

  return { order: null, error: 'Order not found.' };
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { order, error } = await getOrderServer(params.orderId);

  return <OrderConfirmationClient order={order} error={error} />;
}
