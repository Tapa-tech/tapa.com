import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerProduct, IN_MEMORY_ORDERS_STORE } from '@/lib/products';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
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
    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      return NextResponse.json({ error: 'Customer full name is required' }, { status: 400 });
    }

    if (!customerMobile || typeof customerMobile !== 'string' || !/^[6-9]\d{9}$/.test(customerMobile.trim())) {
      return NextResponse.json({ error: 'Valid 10-digit mobile number is required' }, { status: 400 });
    }

    if (!customerEmail || typeof customerEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    // 2. Validate delivery address fields
    if (!streetAddress || typeof streetAddress !== 'string' || !streetAddress.trim()) {
      return NextResponse.json({ error: 'Street address is required' }, { status: 400 });
    }

    if (!city || typeof city !== 'string' || !city.trim()) {
      return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    if (!state || typeof state !== 'string' || !state.trim()) {
      return NextResponse.json({ error: 'State is required' }, { status: 400 });
    }

    if (!pincode || typeof pincode !== 'string' || !/^\d{6}$/.test(pincode.trim())) {
      return NextResponse.json({ error: 'Valid 6-digit pincode is required' }, { status: 400 });
    }

    // 3. Strict Payment Method check (COD only)
    if (paymentMethod !== 'COD') {
      return NextResponse.json({ error: 'Only Cash on Delivery (COD) is supported' }, { status: 400 });
    }

    // 4. Cart items validation
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart cannot be empty' }, { status: 400 });
    }

    // 5. SERVER-SIDE PRICE & SKU VALIDATION (Never trust browser totals)
    let calculatedSubtotal = 0;
    const validatedOrderItems: Array<{
      id: string;
      productId: string;
      productName: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }> = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const sku = item.id || item.slug;
      if (!sku || typeof sku !== 'string') {
        return NextResponse.json({ error: 'Invalid product SKU in cart' }, { status: 400 });
      }

      const serverProd = getServerProduct(sku);
      if (!serverProd) {
        return NextResponse.json({ error: `Product SKU "${sku}" is invalid or unavailable` }, { status: 400 });
      }

      const qty = parseInt(String(item.quantity), 10);
      if (isNaN(qty) || qty < 1) {
        return NextResponse.json({ error: `Invalid quantity for product "${serverProd.name}"` }, { status: 400 });
      }

      const lineTotal = serverProd.price * qty;
      calculatedSubtotal += lineTotal;

      validatedOrderItems.push({
        id: `item-${Date.now()}-${i}`,
        productId: serverProd.slug,
        productName: serverProd.name,
        unitPrice: serverProd.price,
        quantity: qty,
        lineTotal: lineTotal,
      });
    }

    const deliveryCharge = 0; // Free delivery
    const calculatedGrandTotal = calculatedSubtotal + deliveryCharge;

    // Generate unique order number (e.g. TAPA-ORD-1725000000-1234)
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TAPA-ORD-${timestamp}-${randomSuffix}`;
    const orderId = `ord_${timestamp}_${randomSuffix}`;

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
        message: 'COD order created successfully',
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
