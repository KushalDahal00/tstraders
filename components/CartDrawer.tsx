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
      <div className="fixed inset-0 z-50 overflow-hidden bg-brutal/70 backdrop-blur-xs flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          className="w-full max-w-md bg-cream border-l-[4px] border-brutal h-full flex flex-col shadow-brutal-lg"
        >
          {/* Drawer Header */}
          <div className="p-5 bg-brutal-yellow border-b-[3.5px] border-brutal flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-brutal stroke-[2.5]" />
              <h2 className="text-sm font-black uppercase tracking-widest text-brutal">
                {step === 'cart' && `Shopping Bag (${cart.reduce((a, b) => a + b.quantity, 0)})`}
                {step === 'checkout' && 'Checkout & Delivery'}
                {step === 'success' && 'Order Confirmed'}
              </h2>
            </div>
            <button
              onClick={closeAndReset}
              className="w-8 h-8 bg-white border-[2px] border-brutal neo-press flex items-center justify-center text-brutal"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* STEP 1: CART LIST */}
            {step === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="py-20 text-center space-y-4 text-brutal-muted">
                    <ShoppingBag className="w-12 h-12 mx-auto stroke-[2]" />
                    <p className="text-sm font-mono font-bold uppercase">Your shopping bag is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={`${item.product.id}-${item.size}`} className="p-3 bg-white border-[2.5px] border-brutal neo-shadow-sm flex space-x-3.5">
                        <div className="relative w-16 h-16 bg-cream-2 border-[2px] border-brutal flex-shrink-0">
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
                            <h4 className="text-xs font-black uppercase text-brutal truncate max-w-[170px]">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.size)}
                              className="text-brutal hover:text-brutal-red transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </div>
                          <p className="text-[11px] text-brutal-muted font-mono font-bold">
                            Size: <span className="text-brutal-red font-black">{item.size}</span>
                          </p>
                          <div className="flex justify-between items-center pt-1">
                            <div className="flex items-center space-x-2 border-[2px] border-brutal bg-cream px-2 py-0.5 font-mono">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                className="text-brutal hover:text-brutal-red font-black"
                              >
                                <Minus className="w-3 h-3 stroke-[3]" />
                              </button>
                              <span className="text-xs font-black text-brutal px-1">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                className="text-brutal hover:text-brutal-green font-black"
                              >
                                <Plus className="w-3 h-3 stroke-[3]" />
                              </button>
                            </div>
                            <span className="text-xs font-mono font-black text-brutal">
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
                  <p className="p-3 bg-brutal-red text-white border-[2.5px] border-brutal font-mono text-xs font-bold">
                    ⚠️ {formError}
                  </p>
                )}

                <div>
                  <label className="block text-xs font-mono font-black uppercase tracking-wider text-brutal mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="input-brutal font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-black uppercase tracking-wider text-brutal mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@gmail.com"
                    className="input-brutal font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-black uppercase tracking-wider text-brutal mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className="input-brutal font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-black uppercase tracking-wider text-brutal mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street Address, Area, Ward No."
                    className="input-brutal font-bold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-black uppercase tracking-wider text-brutal mb-1">
                    City / Region
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-brutal font-bold"
                  />
                </div>

                {/* Cash on Delivery Box */}
                <div className="pt-2">
                  <div className="p-3 bg-brutal-yellow border-[2.5px] border-brutal neo-shadow-sm flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-5 h-5 text-brutal stroke-[2.5]" />
                      <span className="font-mono font-black text-brutal uppercase text-xs">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                    <span className="text-[10px] bg-brutal text-brutal-yellow px-2 py-0.5 font-mono font-black uppercase">
                      Active
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-brutal-muted font-bold font-mono">
                    Pay with cash when your shoes arrive at your doorstep.
                  </p>
                </div>
              </form>
            )}

            {/* STEP 3: ORDER SUCCESS */}
            {step === 'success' && lastOrder && (
              <div className="py-6 text-center space-y-5">
                <div className="w-14 h-14 bg-brutal-green border-[3px] border-brutal text-brutal flex items-center justify-center mx-auto neo-shadow">
                  <CheckCircle2 className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-black uppercase text-brutal">
                    Order Received!
                  </h3>
                  <p className="text-xs text-brutal font-mono font-bold">
                    Order ID: <span className="bg-brutal-yellow px-1.5 py-0.5 border-[1.5px] border-brutal">{lastOrder.id}</span>
                  </p>
                  <p className="text-xs text-brutal-muted font-medium">
                    We will call <span className="font-bold font-mono text-brutal">{lastOrder.customerDetails.phone}</span> prior to dispatch.
                  </p>
                </div>

                <div className="p-4 bg-white border-[2.5px] border-brutal text-left text-xs space-y-2 font-mono neo-shadow-sm">
                  <div className="flex justify-between text-brutal">
                    <span>Payment Method:</span>
                    <span className="text-brutal-green font-black">Cash on Delivery</span>
                  </div>
                  <div className="flex justify-between text-brutal">
                    <span>Total Amount:</span>
                    <span className="text-brutal font-black">Rs. {lastOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brutal">
                    <span>Address:</span>
                    <span className="font-bold truncate max-w-[170px]">{lastOrder.customerDetails.deliveryAddress}</span>
                  </div>
                </div>

                <button
                  onClick={closeAndReset}
                  className="w-full btn-brutal"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer Summary & Actions */}
          {step !== 'success' && cart.length > 0 && (
            <div className="p-5 border-t-[3.5px] border-brutal space-y-4 bg-white">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs text-brutal font-black uppercase tracking-widest">Subtotal</span>
                <span className="text-xl font-black text-brutal bg-brutal-yellow px-2 py-0.5 border-[2px] border-brutal">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={handleCheckoutClick}
                  className="w-full btn-brutal flex items-center justify-center space-x-2"
                >
                  <span>Proceed To Checkout</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="flex-1 btn-brutal-ghost text-xs flex items-center justify-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[3]" />
                    <span>Cart</span>
                  </button>
                  <button
                    type="submit"
                    form="orderForm"
                    disabled={ordering}
                    className="flex-[2] btn-brutal text-xs disabled:opacity-50"
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
