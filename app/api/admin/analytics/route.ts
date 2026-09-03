import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';
import { IN_MEMORY_ORDERS_STORE } from '@/lib/products';

// Helper to calculate start & end dates based on range string
function getDateRangeBounds(range: string, customStart?: string | null, customEnd?: string | null) {
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
      if (customStart) {
        startDate = new Date(customStart);
      } else {
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

// GET /api/admin/analytics
export const GET = withAdminAuth(async (req, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '30d';
    const customStart = searchParams.get('startDate');
    const customEnd = searchParams.get('endDate');

    const { startDate, endDate } = getDateRangeBounds(range, customStart, customEnd);

    const isPostgres = process.env.DATABASE_URL?.startsWith('postgres');

    if (isPostgres) {
      // Execute parallel queries for max performance
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      
      const weekStart = new Date(now);
      const day = weekStart.getDay();
      const diffToMonday = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diffToMonday);
      weekStart.setHours(0, 0, 0, 0);

      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      const yearStart = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);

      const [
        totalOrdersAllTime,
        totalOrdersToday,
        totalOrdersWeek,
        totalOrdersMonth,
        totalOrdersYear,
        totalOrdersInRange,
        paidRevenueAllTime,
        paidRevenueToday,
        paidRevenueWeek,
        paidRevenueMonth,
        paidRevenueYear,
        paidOrdersInRange,
        pendingPaymentsAgg,
        failedPaymentsAgg,
        refundedPaymentsAgg,
        codStatsAgg,
        razorpayStatsAgg,
        ordersInRange,
        orderItemsInRange,
        totalUsersCount,
        usersWithOrdersCount,
        newUsersInRangeCount,
        recentOrders,
      ] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
        prisma.order.count({ where: { createdAt: { gte: weekStart } } }),
        prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
        prisma.order.count({ where: { createdAt: { gte: yearStart } } }),
        prisma.order.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
        
        prisma.order.aggregate({
          where: { paymentStatus: 'PAID' },
          _sum: { grandTotal: true },
        }),
        prisma.order.aggregate({
          where: { paymentStatus: 'PAID', createdAt: { gte: todayStart } },
          _sum: { grandTotal: true },
        }),
        prisma.order.aggregate({
          where: { paymentStatus: 'PAID', createdAt: { gte: weekStart } },
          _sum: { grandTotal: true },
        }),
        prisma.order.aggregate({
          where: { paymentStatus: 'PAID', createdAt: { gte: monthStart } },
          _sum: { grandTotal: true },
        }),
        prisma.order.aggregate({
          where: { paymentStatus: 'PAID', createdAt: { gte: yearStart } },
          _sum: { grandTotal: true },
        }),

        prisma.order.aggregate({
          where: { paymentStatus: 'PAID', createdAt: { gte: startDate, lte: endDate } },
          _sum: { grandTotal: true },
          _count: { id: true },
        }),

        prisma.order.aggregate({
          where: { paymentStatus: 'PENDING' },
          _sum: { grandTotal: true },
          _count: { id: true },
        }),

        prisma.order.aggregate({
          where: { paymentStatus: 'FAILED' },
          _sum: { grandTotal: true },
          _count: { id: true },
        }),

        prisma.order.aggregate({
          where: { paymentStatus: 'REFUNDED' },
          _sum: { grandTotal: true },
          _count: { id: true },
        }),

        prisma.order.aggregate({
          where: { paymentMethod: 'COD' },
          _sum: { grandTotal: true },
          _count: { id: true },
        }),

        prisma.order.groupBy({
          by: ['paymentStatus'],
          where: { paymentMethod: 'RAZORPAY' },
          _sum: { grandTotal: true },
          _count: { id: true },
        }),

        prisma.order.findMany({
          where: { createdAt: { gte: startDate, lte: endDate } },
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            customerEmail: true,
            customerMobile: true,
            grandTotal: true,
            paymentMethod: true,
            paymentStatus: true,
            orderStatus: true,
            createdAt: true,
            userId: true,
          },
          orderBy: { createdAt: 'asc' },
        }),

        prisma.orderItem.findMany({
          where: {
            order: {
              createdAt: { gte: startDate, lte: endDate },
              paymentStatus: { in: ['PAID', 'PENDING'] },
            },
          },
          select: {
            productId: true,
            productName: true,
            quantity: true,
            lineTotal: true,
            orderId: true,
          },
        }),

        prisma.user.count(),
        prisma.user.count({ where: { orders: { some: {} } } }),
        prisma.user.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),

        prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { items: true },
        }),
      ]);

      // Calculate AOV
      const paidOrdersCountInRange = paidOrdersInRange._count.id || 0;
      const paidRevenueSumInRange = paidOrdersInRange._sum.grandTotal || 0;
      const averageOrderValue = paidOrdersCountInRange > 0
        ? Math.round(paidRevenueSumInRange / paidOrdersCountInRange)
        : 0;

      // Razorpay breakdown stats
      let razorpayTotalCount = 0;
      let razorpayPaidRevenue = 0;
      let razorpayPendingAmount = 0;
      let razorpayFailedAmount = 0;
      let razorpayRefundedAmount = 0;

      razorpayStatsAgg.forEach((grp) => {
        razorpayTotalCount += grp._count.id;
        const sum = grp._sum.grandTotal || 0;
        if (grp.paymentStatus === 'PAID') razorpayPaidRevenue += sum;
        else if (grp.paymentStatus === 'PENDING') razorpayPendingAmount += sum;
        else if (grp.paymentStatus === 'FAILED') razorpayFailedAmount += sum;
        else if (grp.paymentStatus === 'REFUNDED') razorpayRefundedAmount += sum;
      });

      // Payment Health percentages
      const totalAll = totalOrdersAllTime || 1;
      const paidCountAll = await prisma.order.count({ where: { paymentStatus: 'PAID' } });
      const pendingCountAll = pendingPaymentsAgg._count.id || 0;
      const failedCountAll = failedPaymentsAgg._count.id || 0;
      const refundedCountAll = refundedPaymentsAgg._count.id || 0;

      const health = {
        successRate: parseFloat(((paidCountAll / totalAll) * 100).toFixed(1)),
        pendingRate: parseFloat(((pendingCountAll / totalAll) * 100).toFixed(1)),
        failureRate: parseFloat(((failedCountAll / totalAll) * 100).toFixed(1)),
        refundRate: parseFloat(((refundedCountAll / totalAll) * 100).toFixed(1)),
      };

      // Order Status Breakdown
      const statusCounts = await prisma.order.groupBy({
        by: ['orderStatus'],
        _count: { id: true },
        _sum: { grandTotal: true },
      });

      const allStatuses = [
        'PLACED',
        'CONFIRMED',
        'PROCESSING',
        'DISPATCHED',
        'DELIVERED',
        'CANCELLATION_REQUESTED',
        'CANCELLED',
      ];

      const orderStatusMap = new Map(statusCounts.map((s) => [s.orderStatus, s]));

      const orderStatusBreakdown = allStatuses.map((st) => {
        const item = orderStatusMap.get(st as any);
        const count = item ? item._count.id : 0;
        const amount = item ? item._sum.grandTotal || 0 : 0;
        const percentage = totalOrdersAllTime > 0 ? parseFloat(((count / totalOrdersAllTime) * 100).toFixed(1)) : 0;
        return {
          status: st,
          count,
          percentage,
          amount,
        };
      });

      // Build Revenue & Orders Daily Chart Data
      const dailyMap = new Map<string, { date: string; revenue: number; ordersCount: number }>();
      
      // Initialize days in range
      const curr = new Date(startDate);
      while (curr <= endDate) {
        const dStr = curr.toISOString().split('T')[0];
        dailyMap.set(dStr, { date: dStr, revenue: 0, ordersCount: 0 });
        curr.setDate(curr.getDate() + 1);
      }

      ordersInRange.forEach((ord) => {
        const dStr = new Date(ord.createdAt).toISOString().split('T')[0];
        const existing = dailyMap.get(dStr);
        if (existing) {
          existing.ordersCount += 1;
          if (ord.paymentStatus === 'PAID') {
            existing.revenue += ord.grandTotal;
          }
        }
      });

      const chartData = Array.from(dailyMap.values());

      // Top Products Aggregation
      const productMap = new Map<string, { id: string; name: string; unitsSold: number; ordersCount: Set<string>; revenue: number }>();

      orderItemsInRange.forEach((it) => {
        const pKey = it.productId || it.productName;
        if (!productMap.has(pKey)) {
          productMap.set(pKey, {
            id: it.productId,
            name: it.productName,
            unitsSold: 0,
            ordersCount: new Set(),
            revenue: 0,
          });
        }
        const pEntry = productMap.get(pKey)!;
        pEntry.unitsSold += it.quantity;
        pEntry.ordersCount.add(it.orderId);
        pEntry.revenue += it.lineTotal;
      });

      const topProducts = Array.from(productMap.values())
        .map((p) => ({
          id: p.id,
          name: p.name,
          unitsSold: p.unitsSold,
          orderCount: p.ordersCount.size,
          revenue: p.revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Repeat customers count & top customers
      const userOrdersAgg = await prisma.order.groupBy({
        by: ['userId'],
        where: { userId: { not: null } },
        _count: { id: true },
        _sum: { grandTotal: true },
      });

      const repeatCustomersCount = userOrdersAgg.filter((u) => u._count.id > 1).length;
      
      const topCustomerUserIds = userOrdersAgg
        .filter((u) => u.userId)
        .sort((a, b) => (b._sum.grandTotal || 0) - (a._sum.grandTotal || 0))
        .slice(0, 5);

      const topUserProfiles = await prisma.user.findMany({
        where: { id: { in: topCustomerUserIds.map((u) => u.userId as string) } },
        select: { id: true, name: true, email: true, phone: true },
      });
      const topUserMap = new Map(topUserProfiles.map((u) => [u.id, u]));

      const topCustomers = topCustomerUserIds.map((u) => {
        const profile = topUserMap.get(u.userId as string);
        return {
          id: u.userId,
          name: profile?.name || 'Customer',
          email: profile?.email || profile?.phone || 'N/A',
          totalSpent: u._sum.grandTotal || 0,
          ordersCount: u._count.id,
        };
      });

      return NextResponse.json({
        success: true,
        dateRange: { range, startDate: startDate.toISOString(), endDate: endDate.toISOString() },
        overview: {
          totalOrdersAllTime,
          totalOrdersToday,
          totalOrdersWeek,
          totalOrdersMonth,
          totalOrdersYear,
          totalOrdersInRange,
          paidRevenueAllTime: paidRevenueAllTime._sum.grandTotal || 0,
          paidRevenueToday: paidRevenueToday._sum.grandTotal || 0,
          paidRevenueWeek: paidRevenueWeek._sum.grandTotal || 0,
          paidRevenueMonth: paidRevenueMonth._sum.grandTotal || 0,
          paidRevenueYear: paidRevenueYear._sum.grandTotal || 0,
          paidRevenueInRange: paidRevenueSumInRange,
          averageOrderValue,
          pendingPayments: {
            count: pendingPaymentsAgg._count.id || 0,
            amount: pendingPaymentsAgg._sum.grandTotal || 0,
          },
          failedPayments: {
            count: failedPaymentsAgg._count.id || 0,
            amount: failedPaymentsAgg._sum.grandTotal || 0,
          },
          refundedPayments: {
            count: refundedPaymentsAgg._count.id || 0,
            amount: refundedPaymentsAgg._sum.grandTotal || 0,
          },
          codStats: {
            count: codStatsAgg._count.id || 0,
            amount: codStatsAgg._sum.grandTotal || 0,
          },
          razorpayStats: {
            count: razorpayTotalCount,
            paidRevenue: razorpayPaidRevenue,
            pendingAmount: razorpayPendingAmount,
            failedAmount: razorpayFailedAmount,
            refundedAmount: razorpayRefundedAmount,
          },
        },
        paymentHealth: health,
        paymentSummary: {
          paid: { count: paidCountAll, amount: paidRevenueAllTime._sum.grandTotal || 0 },
          pending: { count: pendingPaymentsAgg._count.id || 0, amount: pendingPaymentsAgg._sum.grandTotal || 0 },
          failed: { count: failedPaymentsAgg._count.id || 0, amount: failedPaymentsAgg._sum.grandTotal || 0 },
          refunded: { count: refundedPaymentsAgg._count.id || 0, amount: refundedPaymentsAgg._sum.grandTotal || 0 },
          razorpay: { count: razorpayTotalCount, amount: razorpayPaidRevenue + razorpayPendingAmount },
          cod: { count: codStatsAgg._count.id || 0, amount: codStatsAgg._sum.grandTotal || 0 },
        },
        orderStatusBreakdown,
        chartData,
        topProducts,
        customerAnalytics: {
          totalUsers: totalUsersCount,
          usersWithOrders: usersWithOrdersCount,
          newUsersInRange: newUsersInRangeCount,
          repeatCustomers: repeatCustomersCount,
          topCustomers,
        },
        recentOrders,
      });
    }

    // In-memory fallback if no DB connection
    const ordersList: any[] = [];
    IN_MEMORY_ORDERS_STORE.orders.forEach((val) => {
      if (!ordersList.some((o) => o.id === val.id)) ordersList.push(val);
    });

    const totalOrdersAllTime = ordersList.length;
    const paidOrders = ordersList.filter((o) => o.paymentStatus === 'PAID');
    const paidRevenueAllTime = paidOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const averageOrderValue = paidOrders.length > 0 ? Math.round(paidRevenueAllTime / paidOrders.length) : 0;

    const pendingOrders = ordersList.filter((o) => o.paymentStatus === 'PENDING');
    const failedOrders = ordersList.filter((o) => o.paymentStatus === 'FAILED');
    const refundedOrders = ordersList.filter((o) => o.paymentStatus === 'REFUNDED');
    const codOrders = ordersList.filter((o) => o.paymentMethod === 'COD');
    const razorpayOrders = ordersList.filter((o) => o.paymentMethod === 'RAZORPAY');

    return NextResponse.json({
      success: true,
      dateRange: { range, startDate: startDate.toISOString(), endDate: endDate.toISOString() },
      overview: {
        totalOrdersAllTime,
        totalOrdersToday: 0,
        totalOrdersWeek: 0,
        totalOrdersMonth: 0,
        totalOrdersYear: totalOrdersAllTime,
        totalOrdersInRange: totalOrdersAllTime,
        paidRevenueAllTime,
        paidRevenueToday: 0,
        paidRevenueWeek: 0,
        paidRevenueMonth: 0,
        paidRevenueYear: paidRevenueAllTime,
        paidRevenueInRange: paidRevenueAllTime,
        averageOrderValue,
        pendingPayments: {
          count: pendingOrders.length,
          amount: pendingOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0),
        },
        failedPayments: {
          count: failedOrders.length,
          amount: failedOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0),
        },
        refundedPayments: {
          count: refundedOrders.length,
          amount: refundedOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0),
        },
        codStats: {
          count: codOrders.length,
          amount: codOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0),
        },
        razorpayStats: {
          count: razorpayOrders.length,
          paidRevenue: razorpayOrders.filter((o) => o.paymentStatus === 'PAID').reduce((sum, o) => sum + (o.grandTotal || 0), 0),
          pendingAmount: razorpayOrders.filter((o) => o.paymentStatus === 'PENDING').reduce((sum, o) => sum + (o.grandTotal || 0), 0),
          failedAmount: razorpayOrders.filter((o) => o.paymentStatus === 'FAILED').reduce((sum, o) => sum + (o.grandTotal || 0), 0),
          refundedAmount: razorpayOrders.filter((o) => o.paymentStatus === 'REFUNDED').reduce((sum, o) => sum + (o.grandTotal || 0), 0),
        },
      },
      paymentHealth: {
        successRate: totalOrdersAllTime > 0 ? parseFloat(((paidOrders.length / totalOrdersAllTime) * 100).toFixed(1)) : 0,
        pendingRate: totalOrdersAllTime > 0 ? parseFloat(((pendingOrders.length / totalOrdersAllTime) * 100).toFixed(1)) : 0,
        failureRate: totalOrdersAllTime > 0 ? parseFloat(((failedOrders.length / totalOrdersAllTime) * 100).toFixed(1)) : 0,
        refundRate: totalOrdersAllTime > 0 ? parseFloat(((refundedOrders.length / totalOrdersAllTime) * 100).toFixed(1)) : 0,
      },
      paymentSummary: {
        paid: { count: paidOrders.length, amount: paidRevenueAllTime },
        pending: { count: pendingOrders.length, amount: pendingOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0) },
        failed: { count: failedOrders.length, amount: failedOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0) },
        refunded: { count: refundedOrders.length, amount: refundedOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0) },
        razorpay: { count: razorpayOrders.length, amount: razorpayOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0) },
        cod: { count: codOrders.length, amount: codOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0) },
      },
      orderStatusBreakdown: [
        'PLACED', 'CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLATION_REQUESTED', 'CANCELLED'
      ].map((st) => {
        const count = ordersList.filter((o) => o.orderStatus === st).length;
        const amt = ordersList.filter((o) => o.orderStatus === st).reduce((sum, o) => sum + (o.grandTotal || 0), 0);
        return {
          status: st,
          count,
          percentage: totalOrdersAllTime > 0 ? parseFloat(((count / totalOrdersAllTime) * 100).toFixed(1)) : 0,
          amount: amt,
        };
      }),
      chartData: [],
      topProducts: [],
      customerAnalytics: {
        totalUsers: 0,
        usersWithOrders: 0,
        newUsersInRange: 0,
        repeatCustomers: 0,
        topCustomers: [],
      },
      recentOrders: ordersList.slice(0, 10),
    });
  } catch (err: any) {
    console.error('Error fetching admin business analytics:', err);
    return NextResponse.json({ success: false, error: 'Failed to compute business analytics' }, { status: 500 });
  }
});
