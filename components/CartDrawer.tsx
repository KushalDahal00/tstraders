'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/CartContext';
import { CustomerOrderDetails } from '@/lib/types';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Truck,
  ShieldCheck,
  UserCheck,
  LogOut,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    user,
    loginWithGoogle,
    logout,
    placeOrder,
    totalAmount,
  } = useCart();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [ordering, setOrdering] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  // Form State
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Kathmandu');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleCheckoutClick = () => {
    setStep('checkout');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError('Full name is required');
      return;
    }
    if (!email.trim()) {
      setFormError('Email address is required');
      return;
    }
    if (!phone.trim()) {
      setFormError('Phone number is required');
      return;
    }
    if (!address.trim()) {
      setFormError('Delivery address is required');
      return;
    }

    setOrdering(true);
    const details: CustomerOrderDetails = {
      fullName,
      email,
      phone,
      deliveryAddress: address,
      city,
      notes,
      paymentMethod: 'Cash on Delivery',
    };

    const order = await placeOrder(details);
    setLastOrder(order);
    setOrdering(false);
    setStep('success');
  };

  const closeAndReset = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setStep('cart');
      setLastOrder(null);
    }, 300);
  };

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="w-full max-w-md bg-[#121215] border-l border-zinc-800 h-full flex flex-col shadow-2xl"
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-4 h-4 text-white" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
                {step === 'cart' && `Shopping Bag (${cart.reduce((a, b) => a + b.quantity, 0)})`}
                {step === 'checkout' && 'Checkout & Delivery'}
                {step === 'success' && 'Order Placed'}
              </h2>
            </div>
            <button
              onClick={closeAndReset}
              className="text-zinc-400 hover:text-white p-1 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* STEP 1: CART LIST */}
            {step === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="py-20 text-center space-y-4 text-zinc-500">
                    <ShoppingBag className="w-10 h-10 mx-auto stroke-1" />
                    <p className="text-xs font-mono">Your shopping bag is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-4 divide-y divide-zinc-800/80">
                    {cart.map((item) => (
                      <div key={`${item.product.id}-${item.size}`} className="pt-4 first:pt-0 flex space-x-3.5">
                        <div className="relative w-16 h-16 bg-zinc-950 border border-zinc-800 flex-shrink-0">
                          <Image
                            src={item.product.main_image}
                            alt={item.product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-semibold text-white truncate max-w-[170px]">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.size)}
                              className="text-zinc-500 hover:text-rose-400 p-0.5 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[10px] text-zinc-400 font-mono">
                            EU Size: <span className="text-white font-bold">{item.size}</span>
                          </p>
                          <div className="flex justify-between items-center pt-1">
                            <div className="flex items-center space-x-2 border border-zinc-800 bg-zinc-950 px-2 py-0.5">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                className="text-zinc-400 hover:text-white"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-mono font-bold text-white px-1">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                className="text-zinc-400 hover:text-white"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-xs font-mono font-bold text-white">
                              Rs. {((item.product.discount_price ?? item.product.price) * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 2: CHECKOUT FORM */}
            {step === 'checkout' && (
              <form id="orderForm" onSubmit={handlePlaceOrder} className="space-y-4">
                {formError && (
                  <p className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs">
                    {formError}
                  </p>
                )}

                <div>
                  <label className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@gmail.com"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street Address, Area, Ward No."
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    City / Region
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500 font-sans"
                  />
                </div>

                {/* Cash on Delivery Box */}
                <div className="pt-2">
                  <label className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Payment Method
                  </label>
                  <div className="p-3 bg-zinc-900 border border-zinc-700 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-emerald-400" />
                      <span className="font-mono font-bold text-white uppercase tracking-wider text-[11px]">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                    <span className="text-[9px] text-emerald-400 font-mono uppercase font-bold">
                      Available
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-zinc-500">
                    Pay upon physical inspection and delivery of your shoes.
                  </p>
                </div>
              </form>
            )}

            {/* STEP 3: ORDER SUCCESS */}
            {step === 'success' && lastOrder && (
              <div className="py-6 text-center space-y-5">
                <div className="w-12 h-12 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider">
                    Order Received
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Order ID: <span className="text-white font-bold">{lastOrder.id}</span>
                  </p>
                  <p className="text-xs text-zinc-400">
                    We will phone <span className="text-white font-mono">{lastOrder.customerDetails.phone}</span> prior to dispatch.
                  </p>
                </div>

                <div className="p-4 bg-zinc-900 border border-zinc-800 text-left text-xs space-y-2 font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Method:</span>
                    <span className="text-emerald-400 font-bold">Cash on Delivery</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Total Amount:</span>
                    <span className="text-white font-bold">Rs. {lastOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Address:</span>
                    <span className="text-zinc-200 truncate max-w-[170px]">{lastOrder.customerDetails.deliveryAddress}</span>
                  </div>
                </div>

                <button
                  onClick={closeAndReset}
                  className="w-full py-3 bg-white text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer Summary & Actions */}
          {step !== 'success' && cart.length > 0 && (
            <div className="p-5 border-t border-zinc-800 space-y-4 bg-zinc-950">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs text-zinc-400 uppercase tracking-widest">Subtotal</span>
                <span className="text-lg font-bold text-white">Rs. {totalAmount.toLocaleString()}</span>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 bg-white text-zinc-950 font-bold font-mono uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Proceed To Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="flex-1 py-3 bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-mono uppercase tracking-wider hover:bg-zinc-800 flex items-center justify-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Cart</span>
                  </button>
                  <button
                    type="submit"
                    form="orderForm"
                    disabled={ordering}
                    className="flex-[2] py-3 bg-white text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {ordering ? 'Processing...' : 'Confirm Order (COD)'}
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

