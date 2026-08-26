import React from 'react';
import { MOCK_CART_ITEMS } from '@/lib/mock-data';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MiniCart: React.FC<MiniCartProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const total = MOCK_CART_ITEMS.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart" onMouseLeave={onClose}>
      <div className="cart-h">
        <span className="cart-t">Your cart</span>
        <span className="cart-c">{MOCK_CART_ITEMS.length} items</span>
      </div>
      {MOCK_CART_ITEMS.map((item) => (
        <div key={item.id} className="cart-i">
          <div className="cart-th" style={{ background: item.gradient }}></div>
          <div>
            <div className="cart-n">{item.name}</div>
            <div className="cart-m">{item.cutoff}</div>
          </div>
          <div className="cart-p">₹{item.price.toLocaleString('en-IN')}</div>
        </div>
      ))}
      <div className="cart-f">
        <div className="cart-row">
          <span>Subtotal</span>
          <b>₹{total.toLocaleString('en-IN')}</b>
        </div>
        <button className="cart-b" onClick={() => alert('Checkout is coming soon in Phase 2!')}>
          Checkout ›
        </button>
        <p className="cart-note">Dated kits are prepaid. Free cancellation until dispatch.</p>
      </div>
    </div>
  );
};
