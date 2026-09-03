import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getRazorpayInstance } from '@/lib/razorpay';
import { getServerProduct, IN_MEMORY_ORDERS_STORE } from '@/lib/products';

export async function POST(req: Request) {
  try {
    // 1. Authenticate user server-side
    let session: any = null;
    try {
      session = await getServerSession(authOptions);
    } catch {
      session = null;
    }
    const authUserId = (session?.user as any)?.id || null;

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
      items,
    } = body;

    // 2. Validate customer & address inputs
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Customer full name is required (minimum 2 characters).' }, { status: 400 });
    }

    if (!customerMobile || typeof customerMobile !== 'string' || !/^[6-9]\d{9}$/.test(customerMobile.trim())) {
      return NextResponse.json({ success: false, error: 'Please enter a valid 10-digit Indian mobile number.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail || typeof customerEmail !== 'string' || !emailRegex.test(customerEmail.trim())) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!streetAddress || typeof streetAddress !== 'string' || !streetAddress.trim()) {
      return NextResponse.json({ success: false, error: 'Street address / House / Flat is required.' }, { status: 400 });
    }

    if (!city || typeof city !== 'string' || !city.trim()) {
      return NextResponse.json({ success: false, error: 'City is required.' }, { status: 400 });
    }

    if (!state || typeof state !== 'string' || !state.trim()) {
      return NextResponse.json({ success: false, error: 'State is required.' }, { status: 400 });
    }

    if (!pincode || typeof pincode !== 'string' || !/^\d{6}$/.test(pincode.trim())) {
      return NextResponse.json({ success: false, error: 'Please enter a valid 6-digit delivery pincode.' }, { status: 400 });
    }

    // 3. Cart items validation
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Your cart is empty. Please add items before checking out.' }, { status: 400 });
    }

    // 4. SERVER-SIDE PRICE & STOCK VERIFICATION
    let calculatedSubtotal = 0;
    const validatedOrderItems: Array<{
      id: string;
      productId: string;
      productName: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
    }> = [];

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
        console.warn('[Razorpay Order Create] Prisma batch product lookup warning:', dbErr);
      }
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const sku = item.id || item.slug;
      if (!sku || typeof sku !== 'string') {
        return NextResponse.json({ success: false, error: 'Invalid product in cart.' }, { status: 400 });
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
          { success: false, error: `The product "${name}" is currently unavailable.` },
          { status: 400 }
        );
      }

      const qty = parseInt(String(item.quantity), 10);
      if (isNaN(qty) || qty < 1) {
        return NextResponse.json({ success: false, error: `Invalid quantity for product "${name}".` }, { status: 400 });
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

    const deliveryCharge = 0;
    const calculatedGrandTotal = calculatedSubtotal + deliveryCharge;

    // Generate unique order numbers
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TAPA-ORD-${timestamp}-${randomSuffix}`;
    const orderId = `ord_${timestamp}_${randomSuffix}`;

    // 5. Initialize Razorpay Server SDK
    let razorpayOrder: any = null;
    const amountInPaise = Math.round(calculatedGrandTotal * 100);

    try {
      const razorpayInstance = getRazorpayInstance();
      razorpayOrder = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: orderNumber,
        notes: {
          customerEmail: customerEmail.trim(),
          customerMobile: customerMobile.trim(),
        },
      });
    } catch (rzpErr: any) {
      console.warn('[Razorpay API Warning - Using Test Fallback]:', rzpErr?.error?.description || rzpErr?.message || rzpErr);
      razorpayOrder = {
        id: `order_test_${timestamp}_${randomSuffix}`,
        amount: amountInPaise,
        currency: 'INR',
        receipt: orderNumber,
        isFallback: true,
      };
    }

    if (!razorpayOrder || !razorpayOrder.id) {
      return NextResponse.json(
        { success: false, error: 'Failed to create Razorpay payment order.' },
        { status: 500 }
      );
    }

    // 6. Create internal Order record
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
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'PENDING',
      orderStatus: 'PLACED',
      razorpayOrderId: razorpayOrder.id,
      userId: authUserId,
      createdAt: new Date().toISOString(),
      items: validatedOrderItems,
    };

    IN_MEMORY_ORDERS_STORE.orders.set(orderId, orderData);
    IN_MEMORY_ORDERS_STORE.orders.set(orderNumber, orderData);
    IN_MEMORY_ORDERS_STORE.orders.set(razorpayOrder.id, orderData);

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
            paymentMethod: 'RAZORPAY',
            paymentStatus: 'PENDING',
            orderStatus: 'PLACED',
            razorpayOrderId: razorpayOrder.id,
            userId: authUserId,
            items: {
              create: validatedOrderItems.map((it) => ({
                productId: it.productId,
                productName: it.productName,
                unitPrice: it.unitPrice,
                quantity: it.quantity,
                lineTotal: it.lineTotal,
              })),
            },
          },
        });
      } catch (dbErr: any) {
        console.error('[Razorpay Order Create] Prisma DB persistence error:', dbErr?.message || dbErr);
      }
    }

    const rawPub = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '';
    const publicKeyId = rawPub.replace(/^["']|["']$/g, '').trim();

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency || 'INR',
      keyId: publicKeyId,
      isFallback: !!razorpayOrder.isFallback,
    });
  } catch (error: any) {
    console.error('[Razorpay Order Create Exception]:', error?.message || error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error creating Razorpay order.' },
      { status: 500 }
    );
  }
}
