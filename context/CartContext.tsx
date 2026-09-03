'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';

export interface CartItem {
  id: string;
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
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const USER_CART_PREFIX = 'tapa_ritual_kits_cart_v1_';
const GUEST_CART_KEY = 'tapa_ritual_kits_cart_guest_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated' && !!session?.user;
  const userId = isAuthenticated ? ((session?.user as any)?.id || session?.user?.email) : null;

  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = useCallback(() => setIsCartOpen(true), []);

  useEffect(() => {
    try {
      if (isAuthenticated && userId) {
        const userStorageKey = `${USER_CART_PREFIX}${userId}`;
        const userStored = localStorage.getItem(userStorageKey);
        const guestStored = localStorage.getItem(GUEST_CART_KEY);

        let userItems: CartItem[] = userStored ? JSON.parse(userStored) : [];
        if (!Array.isArray(userItems)) userItems = [];

        // Merge guest cart items into user cart upon login
        if (guestStored) {
          try {
            const guestItems: CartItem[] = JSON.parse(guestStored);
            if (Array.isArray(guestItems) && guestItems.length > 0) {
              guestItems.forEach((gItem) => {
                const existingIdx = userItems.findIndex((i) => i.id === gItem.id);
                if (existingIdx > -1) {
                  userItems[existingIdx].quantity += gItem.quantity;
                } else {
                  userItems.push(gItem);
                }
              });
              localStorage.removeItem(GUEST_CART_KEY);
            }
          } catch (e) { }
        }

        setItems(userItems);
      } else {
        const guestStored = localStorage.getItem(GUEST_CART_KEY);
        if (guestStored) {
          const parsed = JSON.parse(guestStored);
          setItems(Array.isArray(parsed) ? parsed : []);
        } else {
          setItems([]);
        }
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage', err);
      setItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (isAuthenticated && userId) {
        const userStorageKey = `${USER_CART_PREFIX}${userId}`;
        localStorage.setItem(userStorageKey, JSON.stringify(items));
      } else {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
      }
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [items, isLoaded, isAuthenticated, userId]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
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
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id));
  }, []);

  const increaseQuantity = useCallback((id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      if (isAuthenticated && userId) {
        localStorage.removeItem(`${USER_CART_PREFIX}${userId}`);
      } else {
        localStorage.removeItem(GUEST_CART_KEY);
      }
    } catch (e) { }
  }, [isAuthenticated, userId]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      totalItems,
      subtotal,
      isCartOpen,
      setIsCartOpen,
      openCart,
    }),
    [
      items,
      addItem,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      totalItems,
      subtotal,
      isCartOpen,
      openCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
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
