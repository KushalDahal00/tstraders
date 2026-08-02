'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getProductBySlugOrId } from '@/lib/store';
import { Product, ProductSize } from '@/lib/types';
import { ProductGallery } from '@/components/ProductGallery';
import { useCart } from '@/lib/CartContext';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const data = await getProductBySlugOrId(slug);
      setProduct(data);
      if (data && data.sizes && data.sizes.length > 0) {
        const firstAvailable = data.sizes.find((s) => s.stock_quantity > 0);
        if (firstAvailable) {
          setSelectedSize(firstAvailable.size);
        }
      }
      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-zinc-800" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-zinc-800" />
          <div className="space-y-6">
            <div className="h-10 bg-zinc-800 w-3/4" />
            <div className="h-6 bg-zinc-800 w-1/4" />
            <div className="h-24 bg-zinc-800 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <h1 className="text-3xl font-serif font-bold text-white">Shoe Not Found</h1>
        <p className="text-zinc-400 text-sm">The product you are looking for does not exist or has been removed.</p>
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-zinc-950 text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back To Catalog</span>
        </Link>
      </div>
    );
  }

  const selectedSizeStock = product.sizes?.find((s) => s.size === selectedSize)?.stock_quantity ?? 0;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, 1);
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb Navigation */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back To All Shoes</span>
        </Link>

        {addedToast && (
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Added to Cart!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images || [product.main_image]} name={product.name} />
        </div>

        {/* Right Column: Product Overview & Buy Matrix */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                {product.brand}
              </span>
              <span className="text-zinc-700">•</span>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="mt-4 flex items-baseline space-x-3">
              {product.discount_price ? (
                <>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                    Rs. {product.discount_price.toLocaleString()}
                  </span>
                  <span className="text-base font-mono text-zinc-500 line-through">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-800 px-2 py-0.5">
                    Save Rs. {(product.price - product.discount_price).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Availability Status */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-[11px] font-mono uppercase tracking-wider">
            <span
              className={`w-2 h-2 rounded-full ${
                product.stock_status === 'In Stock'
                  ? 'bg-emerald-400'
                  : product.stock_status === 'Limited Availability'
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-zinc-300">{product.stock_status}</span>
          </div>

          {/* Size Selector */}
          <div className="space-y-3 pt-4 border-t border-zinc-800/80">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold uppercase tracking-widest text-zinc-200">
                Select EU Size:
              </span>
              {selectedSize && (
                <span className="text-zinc-400">
                  Size {selectedSize}:{' '}
                  {selectedSizeStock > 0 ? (
                    <span className="text-emerald-400 font-semibold">{selectedSizeStock} remaining</span>
                  ) : (
                    <span className="text-rose-400 font-semibold">Out of Stock</span>
                  )}
                </span>
              )}
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.sizes?.map((item: ProductSize) => {
                const isAvailable = item.stock_quantity > 0;
                const isSelected = selectedSize === item.size;

                return (
                  <button
                    key={item.size}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(item.size)}
                    className={`py-3 text-xs font-mono font-bold transition-all border ${
                      !isAvailable
                        ? 'opacity-25 border-zinc-800 bg-zinc-950 text-zinc-600 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-white text-zinc-950 border-white shadow-xl scale-[1.02]'
                        : 'bg-zinc-900 text-zinc-200 border-zinc-800 hover:border-zinc-500'
                    }`}
                  >
                    {item.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-zinc-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                disabled={!selectedSize || selectedSizeStock <= 0}
                onClick={handleAddToCart}
                className="w-full py-4 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Cart</span>
              </button>

              <button
                disabled={!selectedSize || selectedSizeStock <= 0}
                onClick={handleBuyNow}
                className="w-full py-4 bg-white text-zinc-950 hover:bg-zinc-200 font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-xl disabled:opacity-40"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now (COD)</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-4 border-t border-zinc-800/80">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">
              Product Overview
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          <div className="bg-[#141417] p-5 border border-zinc-800/80 space-y-2.5 text-xs font-mono text-zinc-400">
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Category</span>
              <span className="text-zinc-200">{product.category_name || 'Footwear'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Brand</span>
              <span className="text-zinc-200">{product.brand}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Payment</span>
              <span className="text-emerald-400 font-bold">Cash on Delivery</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">SKU Code</span>
              <span className="text-zinc-200">{product.sku}</span>
            </div>
          </div>

          {/* Service Features */}
          <div className="grid grid-cols-3 gap-3 pt-4 text-center border-t border-zinc-800/80 text-[10px] font-mono text-zinc-400">
            <div className="flex flex-col items-center space-y-1 p-2 bg-zinc-900/60 border border-zinc-800">
              <ShieldCheck className="w-4 h-4 text-zinc-300" />
              <span>100% Genuine</span>
            </div>
            <div className="flex flex-col items-center space-y-1 p-2 bg-zinc-900/60 border border-zinc-800">
              <Truck className="w-4 h-4 text-zinc-300" />
              <span>Cash on Delivery</span>
            </div>
            <div className="flex flex-col items-center space-y-1 p-2 bg-zinc-900/60 border border-zinc-800">
              <RotateCcw className="w-4 h-4 text-zinc-300" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
