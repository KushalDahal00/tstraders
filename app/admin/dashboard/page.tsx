'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getDashboardStats, getActivityLogs } from '@/lib/store';
import { DashboardStats, AdminActivityLog } from '@/lib/types';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  FolderTree,
  Plus,
  ArrowUpRight,
  History,
  Activity,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [s, l] = await Promise.all([getDashboardStats(), getActivityLogs()]);
      setStats(s);
      setLogs(l);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="flex-1 space-y-8 pb-16">
      <AdminHeader
        title="Dashboard Overview"
        subtitle="Real-time performance metrics, inventory stats, and store activity"
      />

      <div className="px-8 space-y-8">
        {/* Quick Action Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-[#141417] border border-zinc-800 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-lg font-serif font-bold text-white uppercase tracking-wider">
              Store Control Center
            </h2>
            <p className="text-xs text-zinc-400">
              Manage inventory, update shoe pricing, add new releases, and track stock levels.
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Shoe</span>
            </Link>
          </div>
        </div>

        {/* Statistics Metric Cards Grid */}
        {loading || !stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-[#141417] border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Products */}
            <div className="p-6 bg-[#141417] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Products</span>
                <Package className="w-4 h-4 text-zinc-300" />
              </div>
              <p className="text-3xl font-bold font-mono text-white">{stats.totalProducts}</p>
              <p className="text-[11px] text-zinc-500 font-mono">Catalog inventory items</p>
            </div>

            {/* In Stock */}
            <div className="p-6 bg-[#141417] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold uppercase tracking-wider">In Stock</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold font-mono text-emerald-400">{stats.inStockProducts}</p>
              <p className="text-[11px] text-zinc-500 font-mono">Ready for dispatch</p>
            </div>

            {/* Out of Stock */}
            <div className="p-6 bg-[#141417] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Out of Stock</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-3xl font-bold font-mono text-rose-400">{stats.outOfStockProducts}</p>
              <p className="text-[11px] text-zinc-500 font-mono">Requires inventory restock</p>
            </div>

            {/* Categories */}
            <div className="p-6 bg-[#141417] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Categories</span>
                <FolderTree className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-bold font-mono text-white">{stats.totalCategories}</p>
              <p className="text-[11px] text-zinc-500 font-mono">Active product lines</p>
            </div>
          </div>
        )}

        {/* Audit Log / Recent Admin Activity Table */}
        <div className="bg-[#141417] border border-zinc-800 space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif">
                Recent Admin Activity Logs
              </h3>
            </div>
            <span className="text-xs text-zinc-400 font-mono">Audit Log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 font-mono uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Product / Details</th>
                  <th className="py-3 px-4">Admin Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono text-zinc-300">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-zinc-500">
                      No admin activity logged yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-900/40">
                      <td className="py-3 px-4 text-zinc-400">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-none">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white">{log.product_name}</span>{' '}
                        <span className="text-zinc-400 text-[11px]">— {log.details}</span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400">{log.admin_email}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
