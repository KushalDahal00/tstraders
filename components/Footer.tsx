'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-[#09090b] border-t border-zinc-800/80 text-zinc-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 bg-white text-zinc-950 flex items-center justify-center font-serif font-black text-xs tracking-tighter">
                TS
              </div>
              <h3 className="text-xl font-serif font-black uppercase text-white tracking-widest">
                T.S Traders
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md font-light">
              Premium shoe retailer. Crafted silhouettes, guaranteed authenticity, and simple Cash on Delivery shopping.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-200">
              Catalog
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop All Shoes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sneakers" className="hover:text-white transition-colors">
                  Sneakers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=formal" className="hover:text-white transition-colors">
                  Formal Leather
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-200">
              Service
            </h4>
            <ul className="space-y-2 text-xs font-mono text-zinc-400">
              <li>Cash on Delivery</li>
              <li>Hand-Inspected Quality</li>
              <li>Support: support@tstraders.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] font-mono text-zinc-500">
          <p>© {new Date().getFullYear()} T.S Traders. All rights reserved.</p>
          <p className="mt-2 md:mt-0 uppercase tracking-widest text-zinc-400">
            Premium Shoes. Simple Shopping.
          </p>
        </div>
      </div>
    </footer>
  );
}

