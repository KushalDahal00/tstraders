'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const stockBadgeColor =
    product.stock_status === 'In Stock'
      ? 'bg-brutal-green text-brutal'
      : product.stock_status === 'Limited Availability'
      ? 'bg-brutal-yellow text-brutal'
      : 'bg-brutal-red text-white';

  const availableSizesText =
    product.sizes && product.sizes.length > 0
      ? product.sizes.filter((s) => s.stock_quantity > 0).map((s) => s.size).sort((a, b) => a - b).join(' · ')
      : 'Out of stock';

  const href = `/product/${product.slug || product.id}`;

  return (
    <div className="group relative flex flex-col bg-white border-[3px] border-brutal neo-shadow neo-press transition-all duration-100">
      {/* Product Image Container */}
      <Link href={href} className="relative aspect-square w-full overflow-hidden bg-cream-2 border-b-[3px] border-brutal block">
        <Image
          src={product.main_image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-200 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="bg-brutal-yellow text-brutal text-[10px] font-black font-mono uppercase tracking-widest px-2 py-1 border-[2px] border-brutal shadow-brutal-sm">
              Featured
            </span>
          )}
          {product.discount_price && (
            <span className="bg-brutal-red text-white text-[10px] font-black font-mono uppercase tracking-widest px-2 py-1 border-[2px] border-brutal shadow-brutal-sm">
              Sale
            </span>
          )}
        </div>

        {/* Hover Quick Action */}
        <div className="absolute inset-0 bg-brutal/30 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center p-4">
          <span className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brutal-yellow text-brutal text-xs font-black uppercase tracking-wider border-[2.5px] border-brutal shadow-brutal-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-150">
            <span>View Shoe</span>
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-brutal-muted font-mono uppercase font-bold">
            <span className="text-brutal">{product.brand}</span>
            <span className="truncate max-w-[100px] text-right">{product.category_name || 'Footwear'}</span>
          </div>

          <Link href={href} className="block">
            <h3 className="text-sm font-black text-brutal group-hover:underline uppercase tracking-tight line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Stock Section */}
        <div className="pt-2.5 border-t-[2px] border-brutal flex items-end justify-between">
          <div className="flex flex-col">
            {product.discount_price ? (
              <div className="flex items-baseline space-x-1.5">
                <span className="text-base font-black text-brutal font-mono">
                  Rs. {product.discount_price.toLocaleString()}
                </span>
                <span className="text-[11px] text-brutal-muted line-through font-mono">
                  Rs. {product.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-base font-black text-brutal font-mono">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
            <span className="text-[10px] text-brutal-muted font-mono font-bold tracking-tight mt-0.5 truncate max-w-[130px]">
              EU: {availableSizesText}
            </span>
          </div>

          <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 border-[1.5px] border-brutal ${stockBadgeColor}`}>
            {product.stock_status}
          </span>
        </div>
      </div>
    </div>
  );
}
