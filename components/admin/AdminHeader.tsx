'use client';

import React from 'react';
import { User, Bell, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header className="bg-[#0e0e11] border-b border-zinc-800 px-8 py-5 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-bold text-white uppercase tracking-wider font-serif">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-4">
        <Link
          href="/shop"
          target="_blank"
          className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 font-mono transition-colors"
        >
          <span>Live Storefront</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        <div className="flex items-center space-x-3 border-l border-zinc-800 pl-4">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white border border-zinc-700">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-white">Administrator</p>
            <p className="text-[10px] text-zinc-400 font-mono">admin@tstraders.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
