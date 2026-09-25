'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bell, X, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface NewOrderNotification {
  id: string;
  customer_name: string;
  total_amount: number;
  city: string;
  created_at: string;
  seen: boolean;
}

export function OrderNotificationBell() {
  const [notifications, setNotifications] = useState<NewOrderNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const unseenCount = notifications.filter((n) => !n.seen).length;

  // Play a subtle notification chime
  const playNotificationSound = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Two-tone chime: high then slightly lower
      [880, 660].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.35);
      });
    } catch {
      // Audio not available — silently skip
    }
  };

  // Load initial recent pending orders (last 10 minutes) on mount
  useEffect(() => {
    async function loadRecentOrders() {
      const supabase = createClient();
      if (!supabase) return;

      const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from('orders')
        .select('id, customer_name, total_amount, city, created_at')
        .eq('status', 'pending')
        .gte('created_at', tenMinAgo)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data && data.length > 0) {
        setNotifications(data.map((o: any) => ({ ...o, seen: false })));
      }
    }
    loadRecentOrders();
  }, []);

  // Subscribe to Supabase Realtime for new orders
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase
      .channel('admin-order-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const order = payload.new as any;
          const newNotif: NewOrderNotification = {
            id: order.id,
            customer_name: order.customer_name,
            total_amount: order.total_amount,
            city: order.city,
            created_at: order.created_at,
            seen: false,
          };
          setNotifications((prev) => [newNotif, ...prev].slice(0, 10));
          playNotificationSound();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllSeen = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  const timeAgo = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) markAllSeen();
        }}
        className="relative w-9 h-9 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors"
        title="Order Notifications"
      >
        <Bell className={`w-4 h-4 ${unseenCount > 0 ? 'animate-[bell_0.4s_ease-in-out]' : ''}`} />
        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-amber-500 text-[10px] font-black text-white rounded-full flex items-center justify-center px-1 leading-none border border-zinc-950 animate-pulse">
            {unseenCount > 9 ? '9+' : unseenCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#0e0e11] border border-zinc-700 shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                New Orders
              </span>
              {notifications.length > 0 && (
                <span className="text-[10px] text-zinc-500 font-mono">
                  ({notifications.length})
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono uppercase tracking-wider"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notification list */}
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
              <p className="text-xs text-zinc-500 font-mono">No new orders</p>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/60">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 transition-colors ${
                    notif.seen ? 'bg-transparent' : 'bg-amber-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {notif.customer_name}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        Rs. {notif.total_amount.toLocaleString()} · {notif.city}
                      </p>
                      <p className="text-[10px] text-zinc-600 font-mono mt-0.5">
                        {notif.id} · {timeAgo(notif.created_at)}
                      </p>
                    </div>
                    {!notif.seen && (
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer link */}
          <div className="border-t border-zinc-800 px-4 py-2.5">
            <Link
              href="/admin/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between text-[11px] font-mono font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
