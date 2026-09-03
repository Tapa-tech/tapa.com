import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { IN_MEMORY_ORDERS_STORE } from '@/lib/products';
import { logSecurityEvent } from '@/lib/audit-logger';

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

// GET /api/admin/orders — Server-paginated, filtered, searched & sorted orders
export const GET = withAdminAuth(async (req, { user }) => {
  try {
    const { searchParams } = new URL(req.url);

    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    const rawSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const pageSize = [20, 50, 100].includes(rawSize) ? rawSize : 20;

    const search = searchParams.get('search')?.trim() || '';
    const paymentMethod = searchParams.get('paymentMethod')?.trim() || 'ALL';
    const paymentStatus = searchParams.get('paymentStatus')?.trim() || 'ALL';
    const orderStatus = searchParams.get('orderStatus')?.trim() || 'ALL';
    const range = searchParams.get('range')?.trim() || 'all';
    const customStart = searchParams.get('startDate');
    const customEnd = searchParams.get('endDate');

    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    const skip = (page - 1) * pageSize;

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      const whereClause: any = {};

      if (paymentMethod !== 'ALL') {
        whereClause.paymentMethod = paymentMethod;
      }

      if (paymentStatus !== 'ALL') {
        whereClause.paymentStatus = paymentStatus;
      }

      if (orderStatus !== 'ALL') {
        whereClause.orderStatus = orderStatus;
      }

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

      const orderByObj: any = {};
      if (['createdAt', 'grandTotal', 'paymentStatus', 'orderStatus'].includes(sortBy)) {
        orderByObj[sortBy] = sortOrder;
      } else {
        orderByObj.createdAt = 'desc';
      }

      const [totalCount, orders] = await Promise.all([
        prisma.order.count({ where: whereClause }),
        prisma.order.findMany({
          where: whereClause,
          include: { items: true },
          orderBy: orderByObj,
          skip,
          take: pageSize,
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize) || 1;

      return NextResponse.json({
        success: true,
        orders,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      });
    }

    // In-memory fallback
    let ordersList: any[] = [];
    IN_MEMORY_ORDERS_STORE.orders.forEach((val) => {
      if (!ordersList.some((o) => o.id === val.id)) {
        ordersList.push(val);
      }
    });

    if (paymentMethod !== 'ALL') {
      ordersList = ordersList.filter((o) => o.paymentMethod === paymentMethod);
    }
    if (paymentStatus !== 'ALL') {
      ordersList = ordersList.filter((o) => o.paymentStatus === paymentStatus);
    }
    if (orderStatus !== 'ALL') {
      ordersList = ordersList.filter((o) => o.orderStatus === orderStatus);
    }

    if (search) {
      const q = search.toLowerCase();
      ordersList = ordersList.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.customerEmail?.toLowerCase().includes(q) ||
          o.customerMobile?.toLowerCase().includes(q)
      );
    }

    ordersList.sort((a, b) => {
      const valA = a[sortBy] || a.createdAt;
      const valB = b[sortBy] || b.createdAt;
      if (sortOrder === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    const totalCount = ordersList.length;
    const paginatedOrders = ordersList.slice(skip, skip + pageSize);
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return NextResponse.json({
      success: true,
      orders: paginatedOrders,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (err: any) {
    console.error('Error fetching admin orders:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
});

// PATCH /api/admin/orders — Update Order Status & Payment Status
export const PATCH = withAdminAuth(async (req, { user }) => {
  try {
    const body = await req.json();
    const { orderId, orderStatus, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    let updatedOrder: any = null;

    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      const updateData: any = {};
      if (orderStatus) updateData.orderStatus = orderStatus;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;

      updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
        include: { items: true },
      });
    }

    if (IN_MEMORY_ORDERS_STORE.orders.has(orderId)) {
      const existing = IN_MEMORY_ORDERS_STORE.orders.get(orderId);
      if (orderStatus) existing.orderStatus = orderStatus;
      if (paymentStatus) existing.paymentStatus = paymentStatus;
      IN_MEMORY_ORDERS_STORE.orders.set(orderId, existing);
      if (!updatedOrder) updatedOrder = existing;
    }

    logSecurityEvent({
      event: 'USER_PROFILE_UPDATED_BY_ADMIN',
      userId: user.id,
      details: `Admin ${user.email} updated order ${orderId} status to ${orderStatus || paymentStatus}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder,
    });
  } catch (err: any) {
    console.error('Error updating order status:', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to update order status' }, { status: 500 });
  }
});
