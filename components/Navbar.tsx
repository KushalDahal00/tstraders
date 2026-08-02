'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

export function Navbar() {
  const pathname = usePathname();
  const { cart, setIsCartOpen, user, loginWithGoogle } = useCart();
  const [scrolled, setScrolled] = useState(false);

  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/90 shadow-2xl py-3'
          : 'bg-[#09090b]/75 backdrop-blur-sm border-b border-zinc-800/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-12">
          <div />

          {/* Centered Brand Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="flex items-center space-x-2.5 group transition-transform duration-300 transform active:scale-95"
            >
              <div className="w-8 h-8 bg-white text-zinc-950 flex items-center justify-center font-serif font-black text-sm tracking-tighter group-hover:bg-zinc-200 transition-colors shadow-md">
                TS
              </div>
              <span className="text-lg font-serif font-black tracking-widest uppercase text-white group-hover:text-zinc-300 transition-colors">
                T.S Traders
              </span>
            </Link>
          </div>

          {/* Right Action Icon (Cart) */}
          <div className="flex items-center space-x-3">
            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-zinc-900/90 border border-zinc-800 hover:border-zinc-600 text-white transition-all duration-300 hover:scale-105 active:scale-95 group flex items-center justify-center"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-zinc-950 text-[10px] font-bold font-mono w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#09090b] shadow-lg">
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


