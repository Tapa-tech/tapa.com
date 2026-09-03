import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { IN_MEMORY_ORDERS_STORE } from '@/lib/products';

function getDateBounds(range?: string | null, customStart?: string | null, customEnd?: string | null) {
  if (!range || range === 'all') return null;

  const now = new Date();
  let startDate: Date;
  let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  switch (range) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      break;
    case 'yesterday': {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      startDate = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 0, 0, 0, 0);
      endDate = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59, 999);
      break;
    }
    case '7d': {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      break;
    }
    case '90d': {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 89);
      startDate.setHours(0, 0, 0, 0);
      break;
    }
    case 'this_month': {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      break;
    }
    case 'last_month': {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;
    }
    case 'this_year': {
      startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      break;
    }
    case 'custom': {
      if (customStart) startDate = new Date(customStart);
      else {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);
      }
      if (customEnd) {
        endDate = new Date(customEnd);
        endDate.setHours(23, 59, 59, 999);
      }
      break;
    }
    case '30d':
    default: {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);
      break;
    }
  }

  return { startDate, endDate };
}

function escapeCsvField(field: any): string {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

// GET /api/admin/orders/export — CSV Export of filtered orders
export const GET = withAdminAuth(async (req, { user }) => {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search')?.trim() || '';
    const paymentMethod = searchParams.get('paymentMethod')?.trim() || 'ALL';
    const paymentStatus = searchParams.get('paymentStatus')?.trim() || 'ALL';
    const orderStatus = searchParams.get('orderStatus')?.trim() || 'ALL';
    const range = searchParams.get('range')?.trim() || 'all';
    const customStart = searchParams.get('startDate');
    const customEnd = searchParams.get('endDate');

    let orders: any[] = [];

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      const whereClause: any = {};

      if (paymentMethod !== 'ALL') whereClause.paymentMethod = paymentMethod;
      if (paymentStatus !== 'ALL') whereClause.paymentStatus = paymentStatus;
      if (orderStatus !== 'ALL') whereClause.orderStatus = orderStatus;

      const dateBounds = getDateBounds(range, customStart, customEnd);
      if (dateBounds) {
        whereClause.createdAt = {
          gte: dateBounds.startDate,
          lte: dateBounds.endDate,
        };
      }

      if (search) {
        whereClause.OR = [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { customerName: { contains: search, mode: 'insensitive' } },
          { customerEmail: { contains: search, mode: 'insensitive' } },
          { customerMobile: { contains: search, mode: 'insensitive' } },
        ];
      }

      orders = await prisma.order.findMany({
        where: whereClause,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        take: 2500, // Safe ceiling for export
      });
    } else {
      IN_MEMORY_ORDERS_STORE.orders.forEach((val) => {
        if (!orders.some((o) => o.id === val.id)) orders.push(val);
      });
      if (paymentMethod !== 'ALL') orders = orders.filter((o) => o.paymentMethod === paymentMethod);
      if (paymentStatus !== 'ALL') orders = orders.filter((o) => o.paymentStatus === paymentStatus);
      if (orderStatus !== 'ALL') orders = orders.filter((o) => o.orderStatus === orderStatus);
      if (search) {
        const q = search.toLowerCase();
        orders = orders.filter(
          (o) =>
            o.orderNumber?.toLowerCase().includes(q) ||
            o.customerName?.toLowerCase().includes(q) ||
            o.customerEmail?.toLowerCase().includes(q) ||
            o.customerMobile?.toLowerCase().includes(q)
        );
      }
    }

    const headers = [
      'Order Number',
      'Customer Name',
      'Mobile',
      'Email',
      'Address',
      'City',
      'State',
      'Pincode',
      'Subtotal (INR)',
      'Delivery Charge (INR)',
      'Grand Total (INR)',
      'Payment Method',
      'Payment Status',
      'Order Status',
      'Items Count',
      'Razorpay Order ID',
      'Razorpay Payment ID',
      'Created At',
    ];

    const rows = orders.map((o) => {
      const addressFull = `${o.streetAddress || ''}, ${o.city || ''}, ${o.state || ''} ${o.pincode || ''}`.trim();
      const itemsCount = Array.isArray(o.items) ? o.items.reduce((acc: number, it: any) => acc + (it.quantity || 1), 0) : 0;
      return [
        escapeCsvField(o.orderNumber),
        escapeCsvField(o.customerName),
        escapeCsvField(o.customerMobile),
        escapeCsvField(o.customerEmail),
        escapeCsvField(addressFull),
        escapeCsvField(o.city),
        escapeCsvField(o.state),
        escapeCsvField(o.pincode),
        o.subtotal || 0,
        o.deliveryCharge || 0,
        o.grandTotal || 0,
        escapeCsvField(o.paymentMethod),
        escapeCsvField(o.paymentStatus),
        escapeCsvField(o.orderStatus),
        itemsCount,
        escapeCsvField(o.razorpayOrderId || ''),
        escapeCsvField(o.razorpayPaymentId || ''),
        escapeCsvField(o.createdAt ? new Date(o.createdAt).toISOString() : ''),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const dateTag = new Date().toISOString().split('T')[0];

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="tapa_orders_export_${dateTag}.csv"`,
      },
    });
  } catch (err: any) {
    console.error('Error generating orders CSV export:', err);
    return NextResponse.json({ success: false, error: 'Failed to export orders CSV' }, { status: 500 });
  }
});
