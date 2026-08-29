import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MiniCart: React.FC<MiniCartProps> = ({ isOpen, onClose }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated' && !!session?.user;
  const { items, totalItems, subtotal, removeItem, increaseQuantity, decreaseQuantity } = useCart();

  if (!isOpen || !isAuthenticated) return null;

  return (
    <div className="cart" onMouseLeave={onClose}>
      <div className="cart-h">
        <span className="cart-t">Your cart</span>
        <span className="cart-c">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
      </div>
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.id} className="cart-i flex items-center justify-between gap-3">
            <div className="cart-th" style={{ background: 'linear-gradient(150deg,#7A4A12,#2A1408)' }}></div>
            <div className="flex-1 min-w-0">
              <div className="cart-n truncate">{item.name}</div>
              <div className="cart-m">{item.cutoff || 'In stock'}</div>
              <div className="flex items-center gap-2 mt-1 text-xs text-[var(--sub-text)]">
                <button
                  type="button"
                  className="px-1.5 py-0.5 bg-[var(--bg)] border border-[var(--border)] rounded font-bold cursor-pointer"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </button>
                <span>Qty: {item.quantity}</span>
                <button
                  type="button"
                  className="px-1.5 py-0.5 bg-[var(--bg)] border border-[var(--border)] rounded font-bold cursor-pointer"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>
                <button
                  type="button"
                  className="ml-auto text-[var(--pink)] underline text-[11px] cursor-pointer"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="cart-p font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
          </div>
        ))
      ) : (
        <div className="py-6 text-center text-xs text-[var(--sub-text)]">
          Your cart is currently empty.
        </div>
      )}
      <div className="cart-f">
        <div className="cart-row">
          <span>Subtotal</span>
          <b>₹{subtotal.toLocaleString('en-IN')}</b>
        </div>
        <Link href="/cart" onClick={onClose} className="block text-center text-xs font-bold text-[var(--pink)] hover:underline mb-2">
          View full cart ›
        </Link>
        <Link href="/checkout" onClick={onClose} className="cart-b block text-center">
          Checkout ›
        </Link>
        <p className="cart-note">Dated kits are prepaid. Free cancellation until dispatch.</p>
      </div>
    </div>
  );
};
