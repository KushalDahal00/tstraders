'use client';

import React, { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  ClipboardList,
  Phone,
  MapPin,
  Mail,
  Package,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';

interface OrderItem {
  product_id: string;
  product_name: string;
  product_sku: string;
  product_image: string;
  size: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface DBOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  notes?: string;
  payment_method: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  created_at: string;
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-amber-950 text-amber-400 border-amber-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-950 text-blue-400 border-blue-800', icon: CheckCircle2 },
  delivered: { label: 'Delivered', color: 'bg-emerald-950 text-emerald-400 border-emerald-800', icon: Truck },
  cancelled: { label: 'Cancelled', color: 'bg-rose-950 text-rose-400 border-rose-800', icon: XCircle },
};

/** Admin-authenticated fetch helper — sends the secret header to the API route */
async function adminFetch(input: RequestInfo, init: RequestInit = {}) {
  return fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': 'ts-admin-authenticated',
      ...(init.headers ?? {}),
    },
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/orders');
      const json = await res.json();
      if (res.ok && json.orders) {
        setOrders(json.orders as DBOrder[]);
      } else {
        console.error('Failed to load orders:', json.error);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    }
    setLoading(false);
  }

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (orderId: string, newStatus: DBOrder['status']) => {
    setUpdatingId(orderId);
    try {
      const res = await adminFetch('/api/admin/orders', {
        method: 'PATCH',
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        const json = await res.json();
        console.error('Failed to update status:', json.error);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
    setUpdatingId(null);
  };

  const filtered = statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-NP', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 space-y-8 pb-16">
      <AdminHeader
        title="Orders Management"
        subtitle="View and manage all customer orders placed via Cash on Delivery"
      />

      <div className="px-8 space-y-6">

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141417] p-4 border border-zinc-800">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Filter:</span>
            {(['all', 'pending', 'confirmed', 'delivered', 'cancelled'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                  statusFilter === s
                    ? 'bg-white text-zinc-950 border-white'
                    : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={loadOrders}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['pending', 'confirmed', 'delivered', 'cancelled'] as const).map((s) => {
            const cfg = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            const count = orders.filter((o) => o.status === s).length;
            return (
              <div key={s} className="bg-[#141417] border border-zinc-800 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">{cfg.label}</span>
                  <Icon className="w-4 h-4 text-zinc-500" />
                </div>
                <p className="text-2xl font-serif font-black text-white">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-[#141417] border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#141417] border border-zinc-800 p-16 text-center space-y-3">
            <ClipboardList className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-sm">No orders found.</p>
            <p className="text-zinc-600 text-xs font-mono">Orders will appear here when customers checkout.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const cfg = STATUS_CONFIG[order.status];
              const StatusIcon = cfg.icon;
              const isExpanded = expandedOrder === order.id;

              return (
                <div key={order.id} className="bg-[#141417] border border-zinc-800 hover:border-zinc-600 transition-colors">
                  {/* Order Header Row */}
                  <div
                    className="flex flex-col md:flex-row md:items-center justify-between p-5 cursor-pointer gap-3"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-start md:items-center gap-4 flex-wrap">
                      <div>
                        <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Order ID</p>
                        <p className="text-sm font-bold text-white font-mono">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Customer</p>
                        <p className="text-sm font-semibold text-white">{order.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">City</p>
                        <p className="text-sm text-zinc-300">{order.city}</p>
                      </div>
                      <div>
                        <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Total</p>
                        <p className="text-sm font-bold text-white font-mono">Rs. {order.total_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Date</p>
                        <p className="text-xs text-zinc-300 font-mono">{formatDate(order.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border flex items-center space-x-1 ${cfg.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{cfg.label}</span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-zinc-800 p-5 space-y-6">
                      {/* Customer Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center space-x-1">
                            <Mail className="w-3 h-3" /><span>Email</span>
                          </p>
                          <p className="text-sm text-zinc-200">{order.customer_email}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center space-x-1">
                            <Phone className="w-3 h-3" /><span>Phone</span>
                          </p>
                          <p className="text-sm text-zinc-200">{order.customer_phone}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center space-x-1">
                            <MapPin className="w-3 h-3" /><span>Delivery Address</span>
                          </p>
                          <p className="text-sm text-zinc-200">{order.delivery_address}, {order.city}</p>
                        </div>
                      </div>
                      {order.notes && (
                        <div className="bg-zinc-900/60 border border-zinc-800 p-3">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Customer Notes</p>
                          <p className="text-sm text-zinc-300">{order.notes}</p>
                        </div>
                      )}

                      {/* Order Items */}
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-3 flex items-center space-x-1">
                          <Package className="w-3 h-3" /><span>Items Ordered</span>
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800 px-4 py-3">
                              <div className="flex items-center space-x-3">
                                {item.product_image && (
                                  <img src={item.product_image} alt={item.product_name} className="w-10 h-10 object-cover bg-zinc-800" />
                                )}
                                <div>
                                  <p className="text-sm font-semibold text-white">{item.product_name}</p>
                                  <p className="text-[10px] text-zinc-500 font-mono">SKU: {item.product_sku} · Size: {item.size} · Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-white font-mono">Rs. {item.subtotal.toLocaleString()}</p>
                                <p className="text-[10px] text-zinc-500 font-mono">@ Rs. {item.unit_price.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total + Status Update */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-zinc-800">
                        <div>
                          <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Order Total (COD)</p>
                          <p className="text-2xl font-serif font-black text-white">Rs. {order.total_amount.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-zinc-400 font-mono uppercase">Update Status:</span>
                          {(['pending', 'confirmed', 'delivered', 'cancelled'] as const).map((s) => (
                            <button
                              key={s}
                              disabled={order.status === s || updatingId === order.id}
                              onClick={() => updateStatus(order.id, s)}
                              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-colors disabled:opacity-40 ${
                                order.status === s
                                  ? STATUS_CONFIG[s].color + ' opacity-100'
                                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
