'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, subtotal, clearCart } = useCart();

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country] = useState('India');
  const [paymentMethod] = useState('COD'); // Cash on Delivery only

  // UI / Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const shippingCharge = subtotal > 0 ? 0 : 0;
  const grandTotal = subtotal + shippingCharge;

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

    try {
      const res = await fetch('/api/orders/create', {
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
          paymentMethod: 'COD',
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      // 1. Clear cart ONLY AFTER successful order creation
      clearCart();

      // 2. Navigate to Order Confirmation page
      router.push(`/ritual-kits/order-success/${data.orderId}`);
    } catch (err: any) {
      setApiError(err.message || 'Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[var(--bg,#F2EDE4)] min-h-[75vh] py-8">
      {/* BREADCRUMB */}
      <div className="bcrumb bg-[var(--card,#FFFFFF)] border-b border-[var(--border,#E8E0D0)] px-4 md:px-10 py-2.5 mb-6">
        <div className="max-w-[1280px] mx-auto text-xs text-[var(--sub-text,#8A7A68)]">
          <Link href="/" className="hover:text-[var(--pink,#FD066D)]">Home</Link> ›{' '}
          <Link href="/ritual-kits" className="hover:text-[var(--pink,#FD066D)]">Ritual Kits</Link> ›{' '}
          <Link href="/cart" className="hover:text-[var(--pink,#FD066D)]">Cart</Link> ›{' '}
          <b className="text-[var(--body-text,#2C2010)]">Checkout</b>
        </div>
      </div>

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
            {/* LEFT FORM COLUMN */}
            <div className="lg:col-span-7 space-y-6">
              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl font-medium">
                  {apiError}
                </div>
              )}

              {/* 1. CUSTOMER INFORMATION */}
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

              {/* 3. PAYMENT METHOD (COD ONLY) */}
              <div className="bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-bold text-[var(--dark,#1C1712)] border-b border-[var(--border-light,#F0E8D8)] pb-3 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--pink,#FD066D)] text-white text-xs flex items-center justify-center font-bold">3</span>
                  Payment Method
                </h2>

                <div className="border border-[var(--pink,#FD066D)] bg-[#FFF0F5] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      readOnly
                      className="accent-[var(--pink,#FD066D)] w-4 h-4"
                    />
                    <label htmlFor="cod" className="text-sm font-bold text-[var(--dark)] cursor-pointer">
                      Cash on Delivery (COD)
                    </label>
                  </div>
                  <span className="text-xs font-semibold text-[var(--gold,#A07800)]">Pay upon delivery</span>
                </div>
                <p className="text-[11px] text-[var(--sub-text,#8A7A68)] mt-2">
                  Pay cash or UPI directly to the delivery executive when your samagri kit arrives.
                </p>
              </div>
            </div>

            {/* RIGHT SUMMARY COLUMN */}
            <div className="lg:col-span-5 bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-5 md:p-6 shadow-sm sticky top-28 space-y-4">
              <h2 className="text-base font-bold text-[var(--dark,#1C1712)] border-b border-[var(--border,#E8E0D0)] pb-3">
                Order Summary ({totalItems} {totalItems === 1 ? 'item' : 'items'})
              </h2>

              {/* PRODUCT LINE ITEMS */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs border-b border-[var(--border-light,#F0E8D8)] pb-2.5">
                    <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(150deg, #7A4A12, #2A1408)' }}>
                      🛕
                    </div>
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
                  {isSubmitting ? 'Processing Order...' : `Place Order — ₹${grandTotal.toLocaleString('en-IN')} ›`}
                </button>
                <p className="text-[11px] text-[var(--sub-text,#8A7A68)] text-center mt-2">
                  By placing this order, you confirm Cash on Delivery payment upon arrival.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
