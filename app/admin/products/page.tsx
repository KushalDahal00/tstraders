'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getProducts, deleteProduct } from '@/lib/store';
import { Product } from '@/lib/types';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  AlertCircle,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Delete Confirmation Modal State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    await deleteProduct(deletingProduct.id);
    await loadData();
    setIsDeleting(false);
    showToast(`Deleted "${deletingProduct.name}" successfully.`);
    setDeletingProduct(null);
  };

  const filteredProducts = products.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchSKU = p.sku.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchSKU) return false;
    }
    if (statusFilter !== 'all') {
      if (p.status !== statusFilter) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 space-y-8 pb-16">
      <AdminHeader
        title="Product Inventory Management"
        subtitle="Manage shoe catalog, pricing, sizes, stock levels, and store availability"
      />

      <div className="px-8 space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xl">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141417] p-4 border border-zinc-800">
          <div className="flex flex-1 items-center space-x-3 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name, brand, SKU..."
                className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-white text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-[#141417] border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 text-zinc-400 font-mono uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">Image</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Brand</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={8} className="py-4 px-4 bg-zinc-900/30" />
                    </tr>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-500">
                      No products found. Add your first shoe product!
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const totalStock = p.total_stock ?? 0;
                    const stockDot =
                      p.stock_status === 'In Stock'
                        ? 'bg-emerald-500'
                        : p.stock_status === 'Limited Availability'
                        ? 'bg-amber-500'
                        : 'bg-rose-500';

                    return (
                      <tr key={p.id} className="hover:bg-zinc-900/50 transition-colors">
                        {/* Image */}
                        <td className="py-3 px-4">
                          <div className="relative w-12 h-12 bg-zinc-900 border border-zinc-800 overflow-hidden">
                            <Image
                              src={p.main_image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        </td>

                        {/* Name & SKU */}
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white truncate max-w-xs">{p.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">SKU: {p.sku}</p>
                        </td>

                        {/* Brand */}
                        <td className="py-3 px-4 text-zinc-300 font-medium">{p.brand}</td>

                        {/* Category */}
                        <td className="py-3 px-4 text-zinc-400">{p.category_name || 'Footwear'}</td>

                        {/* Price */}
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {p.discount_price ? (
                            <div className="flex flex-col">
                              <span>Rs. {p.discount_price.toLocaleString()}</span>
                              <span className="text-[10px] text-zinc-500 line-through">
                                Rs. {p.price.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span>Rs. {p.price.toLocaleString()}</span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4 font-mono">
                          <div className="flex items-center space-x-1.5">
                            <span className={`w-2 h-2 rounded-full ${stockDot}`} />
                            <span className="text-zinc-200">{totalStock} pairs</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              p.status === 'published'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center space-x-2">
                            <Link
                              href={`/product/${p.slug || p.id}`}
                              target="_blank"
                              title="View Customer Page"
                              className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              title="Edit Product"
                              className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => setDeletingProduct(p)}
                              title="Delete Product"
                              className="p-1.5 bg-rose-950/40 border border-rose-900/50 text-rose-400 hover:bg-rose-900/60 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141417] border border-zinc-800 p-6 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2 bg-rose-950/80 border border-rose-800 rounded-full">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider">
                Confirm Deletion
              </h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{deletingProduct.name}"</strong>?
              This action cannot be undone and will immediately remove the product from the customer storefront.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-semibold uppercase tracking-wider hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-500 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
