'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, totalItems, subtotal, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useCart();

  const shippingCharge = subtotal > 0 ? 0 : 0; // Free delivery included
  const grandTotal = subtotal + shippingCharge;

  return (
    <div className="w-full bg-[var(--bg,#F2EDE4)] min-h-[70vh] py-8">
      {/* BREADCRUMB */}
      <div className="bcrumb bg-[var(--card,#FFFFFF)] border-b border-[var(--border,#E8E0D0)] px-4 md:px-10 py-2.5 mb-6">
        <div className="max-w-[1280px] mx-auto text-xs text-[var(--sub-text,#8A7A68)]">
          <Link href="/" className="hover:text-[var(--pink,#FD066D)]">Home</Link> ›{' '}
          <Link href="/ritual-kits" className="hover:text-[var(--pink,#FD066D)]">Ritual Kits</Link> ›{' '}
          <b className="text-[var(--body-text,#2C2010)]">Shopping Cart</b>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="flex items-center justify-between gap-4 mb-6 border-b border-[var(--border,#E8E0D0)] pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--dark,#1C1712)]">
            Shopping Cart {totalItems > 0 && <span className="text-sm font-normal text-[var(--sub-text)]">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>}
          </h1>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-[var(--sub-text)] hover:text-[var(--pink)] underline"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* CART ITEMS LIST */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div
                      className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
                      style={{ background: 'linear-gradient(150deg, #7A4A12, #2A1408)' }}
                    >
                      🛕
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/ritual-kits/${item.slug}`}
                        className="font-bold text-[16px] text-[var(--dark,#1C1712)] hover:text-[var(--pink,#FD066D)] transition-colors truncate block"
                      >
                        {item.name}
                      </Link>
                      {item.cutoff && (
                        <p className="text-xs text-[var(--gold,#A07800)] font-medium mt-0.5">
                          {item.cutoff}
                        </p>
                      )}
                      <p className="text-xs text-[var(--sub-text,#8A7A68)] mt-1">
                        Price: ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--border-light,#F0E8D8)]">
                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center border border-[var(--border,#E8E0D0)] rounded-lg overflow-hidden bg-[var(--bg,#F2EDE4)]">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-3 py-1 font-bold text-sm text-[var(--body-text)] hover:bg-[var(--card)] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-sm font-semibold text-[var(--dark)] bg-[var(--card)] min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        className="px-3 py-1 font-bold text-sm text-[var(--body-text)] hover:bg-[var(--card)] transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* LINE TOTAL */}
                    <div className="text-right min-w-[80px]">
                      <div className="text-base font-bold text-[var(--dark,#1C1712)]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* REMOVE BUTTON */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[var(--sub-text)] hover:text-[var(--pink,#FD066D)] p-1 text-lg cursor-pointer"
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  href="/ritual-kits/all"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[var(--pink,#FD066D)] hover:underline"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-6 space-y-4 shadow-sm sticky top-28">
              <h2 className="text-lg font-bold text-[var(--dark,#1C1712)] border-b border-[var(--border,#E8E0D0)] pb-3">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-sm text-[var(--body-text,#2C2010)]">
                <div className="flex justify-between">
                  <span className="text-[var(--sub-text)]">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--sub-text)]">Delivery / Shipping</span>
                  <span className="font-semibold text-emerald-700">FREE</span>
                </div>
                <div className="border-t border-[var(--border-light,#F0E8D8)] pt-3 flex justify-between text-base font-bold text-[var(--dark,#1C1712)]">
                  <span>Grand Total</span>
                  <span className="text-[var(--pink,#FD066D)]">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <Link
                  href="/checkout"
                  className="w-full bg-[var(--pink,#FD066D)] hover:opacity-90 text-white font-bold py-3.5 px-4 rounded-xl transition-all text-center block text-sm cursor-pointer"
                >
                  Proceed to Checkout ›
                </Link>
                <p className="text-[11px] text-[var(--sub-text,#8A7A68)] text-center">
                  Scripture-sourced kits · Free cancellation until dispatch
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* EMPTY CART STATE */
          <div className="bg-[var(--card,#FFFFFF)] border border-[var(--border,#E8E0D0)] rounded-2xl p-12 text-center max-w-lg mx-auto my-8 shadow-sm">
            <div className="text-4xl mb-3">🛕</div>
            <h2 className="text-xl font-bold text-[var(--dark,#1C1712)] mb-2">Your Cart is Empty</h2>
            <p className="text-sm text-[var(--sub-text,#8A7A68)] mb-6">
              You haven't added any Ritual Kits to your cart yet. Explore our authentic scripture-sourced samagri kits.
            </p>
            <Link
              href="/ritual-kits/all"
              className="inline-block bg-[var(--pink,#FD066D)] hover:opacity-90 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all"
            >
              Continue Shopping ›
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
