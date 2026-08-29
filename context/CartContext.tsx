'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface CartItem {
  id: string; // SKU or Product ID
  slug: string;
  name: string;
  price: number;
  image?: string;
  cutoff?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY_PREFIX = 'tapa_ritual_kits_cart_v1_';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated' && !!session?.user;
  const userId = isAuthenticated ? ((session?.user as any)?.id || session?.user?.email) : null;

  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage when authenticated user changes
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setItems([]);
      setIsLoaded(true);
      return;
    }

    try {
      const storageKey = `${CART_STORAGE_KEY_PREFIX}${userId}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        } else {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage', err);
      setItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, [isAuthenticated, userId]);

  // Save cart to localStorage whenever items change for authenticated user
  useEffect(() => {
    if (!isLoaded || !isAuthenticated || !userId) return;
    try {
      const storageKey = `${CART_STORAGE_KEY_PREFIX}${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [items, isLoaded, isAuthenticated, userId]);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    if (!isAuthenticated) return;
    const qtyToAdd = item.quantity && item.quantity > 0 ? item.quantity : 1;
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qtyToAdd,
        };
        return updated;
      }
      return [...prevItems, { ...item, quantity: qtyToAdd }];
    });
  };

  const removeItem = (id: string) => {
    if (!isAuthenticated) return;
    setItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  const increaseQuantity = (id: string) => {
    if (!isAuthenticated) return;
    setItems((prevItems) =>
      prevItems.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decreaseQuantity = (id: string) => {
    if (!isAuthenticated) return;
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = isAuthenticated ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const subtotal = isAuthenticated ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        items: isAuthenticated ? items : [],
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

