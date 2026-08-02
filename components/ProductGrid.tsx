'use client';

import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/types';
import { PackageSearch, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onClearFilters: () => void;
}

export function ProductGrid({ products, isLoading, onClearFilters }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#141417] border border-zinc-800/80 p-4 space-y-4 animate-pulse"
          >
            <div className="aspect-[4/4] bg-zinc-800/60 rounded-none" />
            <div className="h-4 bg-zinc-800/80 w-3/4 rounded-none" />
            <div className="h-3 bg-zinc-800/60 w-1/2 rounded-none" />
            <div className="h-5 bg-zinc-800/80 w-1/3 rounded-none" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="my-16 py-16 px-6 bg-[#141417] border border-zinc-800/80 text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto shadow-2xl"
      >
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400">
          <PackageSearch className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
          No shoes found
        </h3>
        <p className="text-sm text-zinc-400 max-w-sm">
          We couldn't find any shoes matching your search and filter criteria. Try adjusting your filters.
        </p>
        <button
          onClick={onClearFilters}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-white text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      <AnimatePresence mode="popLayout">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{
              duration: 0.4,
              delay: idx * 0.05,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
