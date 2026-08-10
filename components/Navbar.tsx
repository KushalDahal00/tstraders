'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

export function Navbar() {
  const pathname = usePathname();
  const { cart, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminRoute) return null;

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-cream border-b-[3px] border-brutal transition-all duration-150 ${
        scrolled ? 'shadow-brutal-sm' : ''
      }`}
    >
      {/* Announcement Ticker */}
      <div className="bg-brutal text-cream overflow-hidden py-1.5">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex items-center font-mono text-[11px] tracking-widest uppercase">
              <span className="mx-6 text-brutal-yellow font-bold">★</span>
              Cash On Delivery Available Nationwide
              <span className="mx-6 text-brutal-yellow font-bold">★</span>
              100% Genuine Footwear
              <span className="mx-6 text-brutal-yellow font-bold">★</span>
              Free Size Exchange
              <span className="mx-6 text-brutal-yellow font-bold">★</span>
              Hand-Inspected Quality
              <span className="mx-6 text-brutal-yellow font-bold">★</span>
              New Arrivals Every Week
              <span className="mx-6 text-brutal-yellow font-bold">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Left — Shop Link */}
          <nav className="hidden sm:flex items-center space-x-1">
            <Link
              href="/shop"
              className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-brutal hover:bg-brutal hover:text-cream transition-colors duration-100 border-[2px] border-transparent hover:border-brutal"
            >
              Shop
            </Link>
          </nav>

          {/* Center — Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="group flex items-center space-x-2.5"
            >
              <div
                className="w-10 h-10 bg-brutal-yellow flex items-center justify-center font-mono font-black text-sm text-brutal border-[2.5px] border-brutal neo-shadow-sm transition-all duration-100 group-hover:translate-x-[1px] group-hover:translate-y-[1px]"
                style={{ boxShadow: '2px 2px 0 #0A0A0A' }}
              >
                TS
              </div>
              <span className="text-xl font-black tracking-tight uppercase text-brutal group-hover:text-brutal-muted transition-colors">
                T.S Traders
              </span>
            </Link>
          </div>

          {/* Right — Cart */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View Cart"
              className="relative flex items-center space-x-2 px-4 py-2.5 bg-brutal text-cream font-bold uppercase tracking-wider text-xs border-[2.5px] border-brutal neo-press"
              style={{ boxShadow: '4px 4px 0 #FFE600' }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-brutal-yellow text-brutal text-[10px] font-black font-mono flex items-center justify-center border-[2px] border-brutal">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
