'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  Settings,
  LogOut,
  Store,
  ShieldCheck,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ts_admin_authenticated');
    }
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Add Product', href: '/admin/products/new', icon: PlusCircle },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0e0e11] border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-800 flex items-center space-x-3">
        <div className="p-2 bg-zinc-800 rounded-lg text-white">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-serif">
            T.S Traders Admin
          </h2>
          <span className="text-[11px] text-zinc-400 font-mono">Control Panel v1.0</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors rounded-none ${
                isActive
                  ? 'bg-white text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Store Link / Logout */}
      <div className="p-4 border-t border-zinc-800 space-y-2">
        <Link
          href="/shop"
          target="_blank"
          className="flex items-center space-x-2 w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium uppercase tracking-wider transition-colors"
        >
          <Store className="w-4 h-4 text-zinc-400" />
          <span>View Customer Site</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full px-4 py-2.5 bg-rose-950/40 border border-rose-900/50 text-rose-300 hover:bg-rose-900/60 text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
