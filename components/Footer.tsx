'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-brutal text-cream border-t-[4px] border-brutal py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-brutal-yellow text-brutal flex items-center justify-center font-mono font-black text-sm border-[2px] border-cream">
                TS
              </div>
              <h3 className="text-2xl font-black uppercase text-cream tracking-tight">
                T.S Traders
              </h3>
            </div>
            <p className="text-sm text-cream-2 leading-relaxed max-w-md font-medium">
              Premium shoe retailer. Crafted silhouettes, guaranteed authenticity, and simple Cash on Delivery shopping.
            </p>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-black uppercase tracking-widest text-brutal-yellow">
              // Catalog
            </h4>
            <ul className="space-y-2 text-xs font-mono font-bold">
              <li>
                <Link href="/shop" className="hover:text-brutal-yellow transition-colors">
                  Shop All Shoes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sneakers" className="hover:text-brutal-yellow transition-colors">
                  Sneakers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=formal" className="hover:text-brutal-yellow transition-colors">
                  Formal Leather
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-black uppercase tracking-widest text-brutal-yellow">
              // Service
            </h4>
            <ul className="space-y-2 text-xs font-mono text-cream-2 font-medium">
              <li>✓ Cash on Delivery</li>
              <li>✓ Hand-Inspected Quality</li>
              <li>✓ Support: support@tstraders.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t-[2px] border-brutal-muted pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-cream-2">
          <p>© {new Date().getFullYear()} T.S Traders. All rights reserved.</p>
          <p className="mt-2 md:mt-0 uppercase tracking-widest text-brutal-yellow font-bold">
            ★ Premium Shoes. Simple Shopping. ★
          </p>
        </div>
      </div>
    </footer>
  );
}
