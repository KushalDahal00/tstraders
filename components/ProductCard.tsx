'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const stockDotColor =
    product.stock_status === 'In Stock'
      ? 'bg-emerald-400'
      : product.stock_status === 'Limited Availability'
      ? 'bg-amber-400'
      : 'bg-rose-500';

  const availableSizesText =
    product.sizes && product.sizes.length > 0
      ? product.sizes.filter((s) => s.stock_quantity > 0).map((s) => s.size).sort((a, b) => a - b).join(' · ')
      : 'Out of stock';

  const href = `/product/${product.slug || product.id}`;

  return (
    <div className="group relative flex flex-col bg-[#121215] border border-zinc-800/80 hover:border-zinc-500 transition-colors duration-200 hover:shadow-2xl hover:shadow-black/70">
      {/* Product Image Container */}
      <Link href={href} className="relative aspect-square w-full overflow-hidden bg-zinc-950 block">
        <Image
          src={product.main_image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105 will-change-transform"
        />

        {/* Dynamic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.featured && (
            <span className="bg-white text-zinc-950 text-[9px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 shadow-md">
              Featured
            </span>
          )}
          {product.discount_price && (
            <span className="bg-rose-600 text-white text-[9px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 shadow-md">
              Sale
            </span>
          )}
        </div>

        {/* Hover Quick Action overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-4">
          <span className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white text-zinc-950 text-[11px] font-bold uppercase tracking-widest transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 shadow-2xl">
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
            <span className="text-zinc-300 font-semibold">{product.brand}</span>
            <span className="text-zinc-500 truncate max-w-[90px] text-right">{product.category_name || 'Footwear'}</span>
          </div>

          <Link href={href} className="block">
            <h3 className="text-xs font-semibold text-white group-hover:text-zinc-300 transition-colors truncate tracking-tight">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Stock Section */}
        <div className="pt-2.5 border-t border-zinc-800/80 flex items-end justify-between">
          <div className="flex flex-col">
            {product.discount_price ? (
              <div className="flex items-baseline space-x-1.5">
                <span className="text-sm font-bold text-white font-mono">
                  Rs. {product.discount_price.toLocaleString()}
                </span>
                <span className="text-[11px] text-zinc-500 line-through font-mono">
                  Rs. {product.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold text-white font-mono">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
            <span className="text-[9px] text-zinc-500 font-mono tracking-tight mt-0.5 truncate max-w-[130px]">
              {availableSizesText}
            </span>
          </div>

          <div className="flex items-center space-x-1 pb-0.5" title={product.stock_status}>
            <span className={`w-1.5 h-1.5 rounded-full ${stockDotColor}`} />
            <span className="text-[9px] text-zinc-400 font-mono uppercase hidden sm:inline">{product.stock_status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

