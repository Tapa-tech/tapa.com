import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerProduct, IN_MEMORY_ORDERS_STORE } from '@/lib/products';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      customerName,
      customerMobile,
      customerEmail,
      streetAddress,
      city,
      state,
      pincode,
      country = 'India',
      paymentMethod = 'COD',
      items,
    } = body;

    // 1. Validate required customer fields
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json({ error: 'Customer full name is required (minimum 2 characters).' }, { status: 400 });
    }

    if (!customerMobile || typeof customerMobile !== 'string' || !/^[6-9]\d{9}$/.test(customerMobile.trim())) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit Indian mobile number.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail || typeof customerEmail !== 'string' || !emailRegex.test(customerEmail.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // 2. Validate delivery address fields
    if (!streetAddress || typeof streetAddress !== 'string' || !streetAddress.trim()) {
      return NextResponse.json({ error: 'Street address / House / Flat is required.' }, { status: 400 });
    }

    if (!city || typeof city !== 'string' || !city.trim()) {
      return NextResponse.json({ error: 'City is required.' }, { status: 400 });
    }

    if (!state || typeof state !== 'string' || !state.trim()) {
      return NextResponse.json({ error: 'State is required.' }, { status: 400 });
    }

    if (!pincode || typeof pincode !== 'string' || !/^\d{6}$/.test(pincode.trim())) {
      return NextResponse.json({ error: 'Please enter a valid 6-digit delivery pincode.' }, { status: 400 });
    }

    // 3. Strict Payment Method check (COD only for this route)
    if (paymentMethod !== 'COD') {
      return NextResponse.json({ error: 'Only Cash on Delivery (COD) is supported for this checkout.' }, { status: 400 });
    }

    // 4. Cart items validation
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty. Please add items before checking out.' }, { status: 400 });
    }

    // 5. SERVER-SIDE PRICE & AVAILABILITY VERIFICATION (Never trust client prices)
    let calculatedSubtotal = 0;
    const validatedOrderItems: Array<{
      id: string;
      productId: string;
      productName: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }> = [];

    // Pre-fetch DB products in a single batch query to eliminate N+1 queries
    const skus = items.map((it: any) => it?.id || it?.slug).filter((s: any): s is string => typeof s === 'string' && s.length > 0);
    const dbProductsMap = new Map<string, any>();
    if (process.env.DATABASE_URL?.startsWith('postgres') && skus.length > 0) {
      try {
        const dbProds = await prisma.product.findMany({
          where: {
            OR: [
              { id: { in: skus } },
              { slug: { in: skus } },
            ],
          },
        });
        dbProds.forEach((p) => {
          dbProductsMap.set(p.id, p);
          dbProductsMap.set(p.slug, p);
        });
      } catch (dbErr) {
        console.warn('Prisma batch product lookup warning:', dbErr);
      }
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const sku = item.id || item.slug;
      if (!sku || typeof sku !== 'string') {
        return NextResponse.json({ error: 'Invalid product SKU in cart.' }, { status: 400 });
      }

      let price = 0;
      let name = item.name || sku;
      let isAvailable = true;

      const dbProd = dbProductsMap.get(sku);

      if (dbProd) {
        if (dbProd.status === 'INACTIVE') {
          isAvailable = false;
        }
        price = dbProd.price;
        name = dbProd.name;
      } else {
        const fallback = getServerProduct(sku);
        if (fallback) {
          price = fallback.price;
          name = fallback.name;
        } else {
          isAvailable = false;
        }
      }

      if (!isAvailable) {
        return NextResponse.json(
          { error: `The product "${name}" is currently unavailable.` },
          { status: 400 }
        );
      }

      const qty = parseInt(String(item.quantity), 10);
      if (isNaN(qty) || qty < 1) {
        return NextResponse.json({ error: `Invalid quantity for product "${name}".` }, { status: 400 });
      }

      const lineTotal = price * qty;
      calculatedSubtotal += lineTotal;

      validatedOrderItems.push({
        id: `item-${Date.now()}-${i}`,
        productId: sku,
        productName: name,
        unitPrice: price,
        quantity: qty,
        lineTotal: lineTotal,
      });
    }

    const deliveryCharge = 0; // Free shipping
    const calculatedGrandTotal = calculatedSubtotal + deliveryCharge;

    // Generate unique order number (e.g. TAPA-ORD-1725000000-1234)
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TAPA-ORD-${timestamp}-${randomSuffix}`;
    const orderId = `ord_${timestamp}_${randomSuffix}`;

    const cleanUserId = userId && typeof userId === 'string' ? userId : null;

    const orderData = {
      id: orderId,
      orderNumber,
      customerName: customerName.trim(),
      customerMobile: customerMobile.trim(),
      customerEmail: customerEmail.trim(),
      streetAddress: streetAddress.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      country: country || 'India',
      subtotal: calculatedSubtotal,
      deliveryCharge,
      grandTotal: calculatedGrandTotal,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'PLACED',
      userId: cleanUserId,
      createdAt: new Date().toISOString(),
      items: validatedOrderItems,
    };

    // Save into in-memory store fallback
    IN_MEMORY_ORDERS_STORE.orders.set(orderId, orderData);
    IN_MEMORY_ORDERS_STORE.orders.set(orderNumber, orderData);

    // Try DB persistence if PostgreSQL database URL is configured
    if (process.env.DATABASE_URL?.startsWith('postgres')) {
      try {
        await prisma.order.create({
          data: {
            id: orderId,
            orderNumber,
            customerName: customerName.trim(),
            customerMobile: customerMobile.trim(),
            customerEmail: customerEmail.trim(),
            streetAddress: streetAddress.trim(),
            city: city.trim(),
            state: state.trim(),
            pincode: pincode.trim(),
            country: country || 'India',
            subtotal: calculatedSubtotal,
            deliveryCharge,
            grandTotal: calculatedGrandTotal,
            paymentMethod: 'COD',
            paymentStatus: 'PENDING',
            orderStatus: 'PLACED',
            userId: cleanUserId,
            items: {
              create: validatedOrderItems.map(({ id, ...rest }) => rest),
            },
          },
        });
      } catch (dbErr) {
        console.warn('Prisma DB order create fallback used:', dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        orderId: orderData.id,
        orderNumber: orderData.orderNumber,
        grandTotal: orderData.grandTotal,
        customerName: orderData.customerName,
        message: 'COD order placed successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred while placing your order.' },
      { status: 500 }
    );
  }
}
