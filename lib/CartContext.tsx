'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, CustomerOrderDetails } from './types';
import { getCurrentUser, signInWithGoogle, signOutUser } from './supabase/client';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: number, quantity?: number) => void;
  removeFromCart: (productId: string, size: number) => void;
  updateQuantity: (productId: string, size: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  user: any;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  placeOrder: (details: CustomerOrderDetails) => Promise<Order>;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LS_CART_KEY = 'ts_traders_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Load user & cart on mount
  useEffect(() => {
    setUser(getCurrentUser());

    if (typeof window !== 'undefined') {
      const rawCart = localStorage.getItem(LS_CART_KEY);
      if (rawCart) {
        try {
          setCart(JSON.parse(rawCart));
        } catch {
          setCart([]);
        }
      }

      const userHandler = () => setUser(getCurrentUser());
      window.addEventListener('ts_user_auth_changed', userHandler);
      return () => window.removeEventListener('ts_user_auth_changed', userHandler);
    }
  }, []);

  // Save cart changes
  const updateCartState = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LS_CART_KEY, JSON.stringify(newCart));
    }
  };

  const addToCart = (product: Product, size: number, quantity: number = 1) => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.size === size
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...cart, { product, size, quantity }];
    }
    updateCartState(updated);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: number) => {
    const updated = cart.filter(
      (item) => !(item.product.id === productId && item.size === size)
    );
    updateCartState(updated);
  };

  const updateQuantity = (productId: string, size: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    const updated = cart.map((item) =>
      item.product.id === productId && item.size === size
        ? { ...item, quantity }
        : item
    );
    updateCartState(updated);
  };

  const clearCart = () => {
    updateCartState([]);
  };

  const loginWithGoogle = async () => {
    await signInWithGoogle();
    setUser(getCurrentUser());
  };

  const logout = () => {
    signOutUser();
    setUser(null);
  };

  const totalAmount = cart.reduce((sum, item) => {
    const itemPrice = item.product.discount_price ?? item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const placeOrder = async (details: CustomerOrderDetails): Promise<Order> => {
    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    const newOrder: Order = {
      id: orderId,
      userEmail: user?.email || details.email,
      customerDetails: details,
      items: [...cart],
      totalAmount,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    // Save order to Supabase
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      if (supabase) {
        await supabase.from('orders').insert({
          id: orderId,
          customer_name: details.fullName,
          customer_email: details.email,
          customer_phone: details.phone,
          delivery_address: details.deliveryAddress,
          city: details.city,
          notes: details.notes || null,
          payment_method: details.paymentMethod,
          items: cart.map((item) => ({
            product_id: item.product.id,
            product_name: item.product.name,
            product_sku: item.product.sku,
            product_image: item.product.main_image,
            size: item.size,
            quantity: item.quantity,
            unit_price: item.product.discount_price ?? item.product.price,
            subtotal: (item.product.discount_price ?? item.product.price) * item.quantity,
          })),
          total_amount: totalAmount,
          status: 'pending',
        });
      }
    } catch (err) {
      console.error('Failed to save order to Supabase, saving locally:', err);
    }

    // Always also save to localStorage as backup
    if (typeof window !== 'undefined') {
      const existingOrdersRaw = localStorage.getItem('ts_orders');
      const existingOrders: Order[] = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
      existingOrders.unshift(newOrder);
      localStorage.setItem('ts_orders', JSON.stringify(existingOrders));
    }

    clearCart();
    return newOrder;
  };


  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        user,
        loginWithGoogle,
        logout,
        placeOrder,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
