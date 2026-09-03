'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Breadcrumb } from '@/components/common/Breadcrumb';

import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, totalItems, subtotal, clearCart } = useCart();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('RAZORPAY');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [pendingOrderData, setPendingOrderData] = useState<{ orderId: string; razorpayOrderId: string; amount: number } | null>(null);

  const handleSimulatePayment = async (targetOrderId: string, targetRazorpayOrderId: string) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const verifyRes = await fetch('/api/orders/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: targetOrderId,
          razorpay_order_id: targetRazorpayOrderId,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: 'dummy_test_sig',
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Simulated payment verification failed.');
      }

      clearCart();
      router.push(`/ritual-kits/order-success/${verifyData.orderId || targetOrderId}`);
    } catch (err: any) {
      setApiError(err?.message || 'Simulated payment failed.');
      setIsSubmitting(false);
    }
  };

  // Auto-prefill customer info if logged in
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !fullName) setFullName(session.user.name);
      if (session.user.email && !email) setEmail(session.user.email);
      const userPhone = (session.user as any).phone;
      if (userPhone && !mobile) setMobile(userPhone);
    }
  }, [session]);

  const shippingCharge = subtotal > 0 ? 0 : 0;
  const grandTotal = subtotal + shippingCharge;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';

    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!address.trim()) newErrors.address = 'Street address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';

    if (!pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(pincode.trim())) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setApiError('Your cart is empty. Please add a Ritual Kit to proceed.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    if (paymentMethod === 'COD') {
      try {
        const res = await fetch('/api/orders/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: (session?.user as any)?.id || session?.user?.email || undefined,
            customerName: fullName,
            customerMobile: mobile,
            customerEmail: email,
            streetAddress: address,
            city,
            state,
            pincode,
            country,
            paymentMethod: 'COD',
            items,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to place COD order.');
        }

        clearCart();
        router.push(`/ritual-kits/order-success/${data.orderId}`);
      } catch (err: unknown) {
        setApiError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
        setIsSubmitting(false);
      }
    } else {
      // RAZORPAY ONLINE PAYMENT FLOW
      try {
        const res = await fetch('/api/orders/razorpay/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName: fullName,
            customerMobile: mobile,
            customerEmail: email,
            streetAddress: address,
            city,
            state,
            pincode,
            country,
            items,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to initialize Razorpay payment order.');
        }

        if (data.isFallback) {
          setPendingOrderData({
            orderId: data.orderId,
            razorpayOrderId: data.razorpayOrderId,
            amount: data.amount,
          });
          setApiError('Razorpay Test Mode Notice: Placeholder / test key is active on server. Real Razorpay API order creation was bypassed. Use the Sandbox Simulator button below to complete your test checkout.');
          setIsSubmitting(false);
          return;
        }

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
        }

        const options = {
          key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency || 'INR',
          name: 'The Tapa Company',
          description: 'Ritual Kit Payment',
          order_id: data.razorpayOrderId,
          prefill: {
            name: fullName,
            email: email,
            contact: mobile,
          },
          theme: {
            color: '#DE1B59',
          },
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            try {
              setIsSubmitting(true);
              const verifyRes = await fetch('/api/orders/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: data.orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok || !verifyData.success) {
                throw new Error(verifyData.error || 'Payment verification failed.');
              }

              clearCart();
              router.push(`/ritual-kits/order-success/${verifyData.orderId || data.orderId}`);
            } catch (vErr: any) {
              setApiError(vErr?.message || 'Payment verification failed. Please contact support.');
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
              setApiError('Payment window closed before completion. You can try paying again.');
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setIsSubmitting(false);
          const desc = resp.error?.description || 'Payment failed or key unauthorized.';
          setPendingOrderData({
            orderId: data.orderId,
            razorpayOrderId: data.razorpayOrderId,
            amount: data.amount,
          });
          setApiError(`Razorpay API Note: ${desc} (Your test key ID is inactive or blocked by browser shields. Use the simulator button below to complete the test flow)`);
        });
        rzp.open();
      } catch (err: unknown) {
        setApiError(err instanceof Error ? err.message : 'Failed to process online payment. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full bg-[var(--bg,#F2EDE4)] min-h-[75vh] py-8">
      {/* BREADCRUMB */}
      <Breadcrumb items={[{ label: 'Ritual Kits', href: '/ritual-kits' }, { label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--dark,#1C1712)] mb-6 border-b border-[var(--border,#E8E0D0)] pb-4">
          Checkout &amp; Delivery Details
        </h1>

        {items.length === 0 ? (
          <div className="bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-10 text-center max-w-md mx-auto my-8 shadow-sm">
            <h2 className="text-lg font-bold text-[var(--dark)] mb-2">Your Cart is Empty</h2>
            <p className="text-xs text-[var(--sub-text)] mb-4">Please add items to your cart before proceeding to checkout.</p>
            <Link
              href="/ritual-kits/all"
              className="inline-block bg-[var(--pink,#FD066D)] text-white font-bold text-xs px-5 py-2.5 rounded-xl"
            >
              Explore Ritual Kits ›
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              {apiError && (
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl font-medium">
                    {apiError}
                  </div>
                  {pendingOrderData && (
                    <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                      <div className="text-xs text-amber-900">
                        <span className="font-bold text-amber-950 block text-sm mb-0.5">🛠️ Test Sandbox Simulation Mode</span>
                        Your Razorpay Key ID is inactive/unauthorized on Razorpay&apos;s API server. Click below to complete the full test payment flow (Verification &amp; Order Success).
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSimulatePayment(pendingOrderData.orderId, pendingOrderData.razorpayOrderId)}
                        className="bg-[#DE1B59] hover:opacity-90 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex-shrink-0 shadow-sm cursor-pointer"
                      >
                        Complete Test Payment ›
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-bold text-[var(--dark,#1C1712)] border-b border-[var(--border-light,#F0E8D8)] pb-3 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--pink,#FD066D)] text-white text-xs flex items-center justify-center font-bold">1</span>
                  Customer Information
                </h2>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[var(--body-text)] mb-1">
                      Full Name <span className="text-[var(--pink)]">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full p-3 border rounded-xl outline-none text-sm bg-[var(--bg,#F2EDE4)] text-[var(--dark)] ${
                        errors.fullName ? 'border-red-500' : 'border-[var(--border,#E8E0D0)] focus:border-[var(--pink)]'
                      }`}
                      placeholder="e.g. Rajesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    {errors.fullName && <p className="text-red-500 text-[11px] mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[var(--body-text)] mb-1">
                        Mobile Number <span className="text-[var(--pink)]">*</span>
                      </label>
                      <input
                        type="tel"
                        className={`w-full p-3 border rounded-xl outline-none text-sm bg-[var(--bg,#F2EDE4)] text-[var(--dark)] ${
                          errors.mobile ? 'border-red-500' : 'border-[var(--border,#E8E0D0)] focus:border-[var(--pink)]'
                        }`}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      />
                      {errors.mobile && <p className="text-red-500 text-[11px] mt-1">{errors.mobile}</p>}
                    </div>

                    <div>
                      <label className="block font-semibold text-[var(--body-text)] mb-1">
                        Email Address <span className="text-[var(--pink)]">*</span>
                      </label>
                      <input
                        type="email"
                        className={`w-full p-3 border rounded-xl outline-none text-sm bg-[var(--bg,#F2EDE4)] text-[var(--dark)] ${
                          errors.email ? 'border-red-500' : 'border-[var(--border,#E8E0D0)] focus:border-[var(--pink)]'
                        }`}
                        placeholder="e.g. rajesh@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. DELIVERY ADDRESS */}
              <div className="bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-bold text-[var(--dark,#1C1712)] border-b border-[var(--border-light,#F0E8D8)] pb-3 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--pink,#FD066D)] text-white text-xs flex items-center justify-center font-bold">2</span>
                  Delivery Address
                </h2>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[var(--body-text)] mb-1">
                      Street Address / House No. / Flat <span className="text-[var(--pink)]">*</span>
                    </label>
                    <textarea
                      rows={2}
                      className={`w-full p-3 border rounded-xl outline-none text-sm bg-[var(--bg,#F2EDE4)] text-[var(--dark)] resize-none ${
                        errors.address ? 'border-red-500' : 'border-[var(--border,#E8E0D0)] focus:border-[var(--pink)]'
                      }`}
                      placeholder="Flat, House No., Building, Street, Landmark"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && <p className="text-red-500 text-[11px] mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-[var(--body-text)] mb-1">
                        City <span className="text-[var(--pink)]">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full p-3 border rounded-xl outline-none text-sm bg-[var(--bg,#F2EDE4)] text-[var(--dark)] ${
                          errors.city ? 'border-red-500' : 'border-[var(--border,#E8E0D0)] focus:border-[var(--pink)]'
                        }`}
                        placeholder="e.g. New Delhi"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                      {errors.city && <p className="text-red-500 text-[11px] mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block font-semibold text-[var(--body-text)] mb-1">
                        State <span className="text-[var(--pink)]">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full p-3 border rounded-xl outline-none text-sm bg-[var(--bg,#F2EDE4)] text-[var(--dark)] ${
                          errors.state ? 'border-red-500' : 'border-[var(--border,#E8E0D0)] focus:border-[var(--pink)]'
                        }`}
                        placeholder="e.g. Delhi"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                      {errors.state && <p className="text-red-500 text-[11px] mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block font-semibold text-[var(--body-text)] mb-1">
                        Pincode <span className="text-[var(--pink)]">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full p-3 border rounded-xl outline-none text-sm bg-[var(--bg,#F2EDE4)] text-[var(--dark)] ${
                          errors.pincode ? 'border-red-500' : 'border-[var(--border,#E8E0D0)] focus:border-[var(--pink)]'
                        }`}
                        placeholder="6-digit pincode"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      />
                      {errors.pincode && <p className="text-red-500 text-[11px] mt-1">{errors.pincode}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[var(--body-text)] mb-1">Country</label>
                    <input
                      type="text"
                      disabled
                      className="w-full p-3 border border-[var(--border,#E8E0D0)] rounded-xl text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                      value={country}
                    />
                  </div>
                </div>
              </div>

              {/* 3. PAYMENT METHOD (UPI, CARD, COD) */}
              <div className="bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-bold text-[var(--dark,#1C1712)] border-b border-[var(--border-light,#F0E8D8)] pb-3 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--pink,#FD066D)] text-white text-xs flex items-center justify-center font-bold">3</span>
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {/* OPTION 1: UPI / QR */}
                  <div
                    onClick={() => setPaymentMethod('RAZORPAY')}
                    className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'RAZORPAY' ? 'border-[var(--pink,#FD066D)] bg-[#FFF0F5] shadow-sm' : 'border-[var(--border,#E8E0D0)] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="upi"
                        name="payment"
                        checked={paymentMethod === 'RAZORPAY'}
                        onChange={() => setPaymentMethod('RAZORPAY')}
                        className="accent-[var(--pink,#FD066D)] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <label htmlFor="upi" className="text-sm font-bold text-[var(--dark)] cursor-pointer flex items-center gap-1.5">
                          📱 UPI / QR Code (GPay, PhonePe, Paytm, BHIM)
                        </label>
                        <span className="text-[11px] text-[var(--sub-text,#8A7A68)]">Instant payment via Razorpay · QR code &amp; App support</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex-shrink-0">⚡ Fastest</span>
                  </div>

                  {/* OPTION 2: CARDS & NETBANKING */}
                  <div
                    onClick={() => setPaymentMethod('RAZORPAY')}
                    className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'RAZORPAY' ? 'border-[var(--pink,#FD066D)] bg-[#FFF0F5]' : 'border-[var(--border,#E8E0D0)] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="cards"
                        name="payment"
                        checked={paymentMethod === 'RAZORPAY'}
                        onChange={() => setPaymentMethod('RAZORPAY')}
                        className="accent-[var(--pink,#FD066D)] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <label htmlFor="cards" className="text-sm font-bold text-[var(--dark)] cursor-pointer flex items-center gap-1.5">
                          💳 Credit / Debit Cards &amp; Netbanking
                        </label>
                        <span className="text-[11px] text-[var(--sub-text,#8A7A68)]">Visa, Mastercard, RuPay, 50+ Banks &amp; Wallets</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded flex-shrink-0">Secure SSL</span>
                  </div>

                  {/* OPTION 3: COD */}
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'COD' ? 'border-[var(--pink,#FD066D)] bg-[#FFF0F5]' : 'border-[var(--border,#E8E0D0)] bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="cod"
                        name="payment"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="accent-[var(--pink,#FD066D)] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <label htmlFor="cod" className="text-sm font-bold text-[var(--dark)] cursor-pointer flex items-center gap-1.5">
                          💵 Cash on Delivery (COD)
                        </label>
                        <span className="text-[11px] text-[var(--sub-text,#8A7A68)]">Pay cash or UPI directly to delivery agent upon arrival</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[var(--gold,#A07800)] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex-shrink-0">Pay on Delivery</span>
                  </div>
                </div>
              </div>

              {/* 4. COMPACT ORDER SUMMARY */}
              <div className="bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-[var(--dark,#1C1712)] border-b border-[var(--border-light,#F0E8D8)] pb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--pink,#FD066D)] text-white text-xs flex items-center justify-center font-bold">4</span>
                    Order Summary
                  </span>
                  <span className="text-xs font-semibold text-[var(--sub-text,#8A7A68)]">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </span>
                </h2>

                {/* LINE ITEMS */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-xs border-b border-[var(--border-light,#F0E8D8)] pb-3 last:border-b-0 last:pb-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-[var(--border-light)]" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-sm font-bold shadow-sm" style={{ background: 'linear-gradient(150deg, #7A4A12, #2A1408)' }}>
                          🛕
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-[var(--dark)] truncate">{item.name}</div>
                        <div className="text-[var(--sub-text)] text-[11px] mt-0.5">
                          Quantity: <span className="font-semibold text-[var(--dark)]">{item.quantity}</span> × ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="font-bold text-sm text-[var(--dark)]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* TOTALS */}
                <div className="space-y-2 text-xs text-[var(--body-text,#2C2010)] pt-2 border-t border-[var(--border-light,#F0E8D8)]">
                  <div className="flex justify-between">
                    <span className="text-[var(--sub-text)]">Item Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--sub-text)]">Delivery Charge</span>
                    <span className="font-semibold text-emerald-700">FREE</span>
                  </div>
                  <div className="border-t border-[var(--border,#E8E0D0)] pt-3 flex justify-between text-base font-bold text-[var(--dark,#1C1712)]">
                    <span>Payable Amount</span>
                    <span className="text-[var(--pink,#FD066D)]">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* 5. FINAL CHECKOUT CTA ACTION */}
              <div className="bg-[var(--card,#FFFFFF)] border border-[var(--pink,#FD066D)] rounded-2xl p-5 md:p-6 shadow-md space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--pink,#FD066D)] hover:opacity-90 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl transition-all text-center block text-base cursor-pointer shadow-md"
                >
                  {isSubmitting
                    ? paymentMethod === 'RAZORPAY' ? 'Initializing Payment...' : 'Placing Order...'
                    : paymentMethod === 'RAZORPAY' ? `Pay Now — ₹${grandTotal.toLocaleString('en-IN')} ›` : `Place Order (COD) — ₹${grandTotal.toLocaleString('en-IN')} ›`}
                </button>

                <p className="text-[11px] text-[var(--sub-text,#8A7A68)] text-center font-medium">
                  {paymentMethod === 'RAZORPAY'
                    ? '🔒 256-bit SSL Encrypted Payment via Razorpay'
                    : '🔒 Safe Cash on Delivery (COD) · Pay upon arrival'}
                </p>
              </div>
            </div>

            {/* RIGHT SUMMARY COLUMN (DESKTOP STICKY SIDEBAR) */}
            <div className="hidden lg:block lg:col-span-5 bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-5 md:p-6 shadow-sm sticky top-28 space-y-4">
              <h2 className="text-base font-bold text-[var(--dark,#1C1712)] border-b border-[var(--border,#E8E0D0)] pb-3">
                Order Summary ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </h2>

              {/* PRODUCT LINE ITEMS */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs border-b border-[var(--border-light,#F0E8D8)] pb-2.5">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-[var(--border-light)]" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(150deg, #7A4A12, #2A1408)' }}>
                        🛕
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[var(--dark)] truncate">{item.name}</div>
                      <div className="text-[var(--sub-text)]">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="font-bold text-[var(--dark)]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* PRICE BREAKDOWN */}
              <div className="space-y-2 text-xs text-[var(--body-text,#2C2010)] pt-2">
                <div className="flex justify-between">
                  <span className="text-[var(--sub-text)]">Item Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--sub-text)]">Delivery / Shipping</span>
                  <span className="font-semibold text-emerald-700">FREE</span>
                </div>
                <div className="border-t border-[var(--border,#E8E0D0)] pt-3 flex justify-between text-base font-bold text-[var(--dark,#1C1712)]">
                  <span>Payable Amount</span>
                  <span className="text-[var(--pink,#FD066D)]">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* PLACE ORDER BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--pink,#FD066D)] hover:opacity-90 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl transition-all text-center block text-sm cursor-pointer shadow-md"
                >
                  {isSubmitting
                    ? paymentMethod === 'RAZORPAY' ? 'Initializing Payment...' : 'Placing Order...'
                    : paymentMethod === 'RAZORPAY' ? `Pay Now — ₹${grandTotal.toLocaleString('en-IN')} ›` : `Place Order (COD) — ₹${grandTotal.toLocaleString('en-IN')} ›`}
                </button>

                <p className="text-[11px] text-[var(--sub-text,#8A7A68)] text-center mt-2">
                  {paymentMethod === 'RAZORPAY'
                    ? 'Instant payment via UPI, Cards, Netbanking'
                    : 'Confirm Cash on Delivery payment upon arrival'}
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
