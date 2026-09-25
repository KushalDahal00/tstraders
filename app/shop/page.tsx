'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/store';
import { Product, Category, FilterState } from '@/lib/types';
import { Filters } from '@/components/Filters';
import { ProductGrid } from '@/components/ProductGrid';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

function ShopContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryParam = searchParams.get('category') || '';

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: categoryParam,
    availability: 'all',
    size: null,
    sortBy: 'featured',
  });

  useEffect(() => {
    async function loadShopData() {
      setLoading(true);
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    }
    loadShopData();
  }, []);

  // Sync URL ?category= param into filter state whenever it changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryParam,
    }));
  }, [categoryParam]);

  // Dynamically extract all available unique shoe sizes across products
  const availableSizes = useMemo(() => {
    const sizeSet = new Set<number>();
    products.forEach((p) => {
      p.sizes?.forEach((s) => {
        if (s.stock_quantity > 0) {
          sizeSet.add(s.size);
        }
      });
    });
    if (sizeSet.size === 0) {
      return [37, 38, 39, 40, 41, 42, 43, 44, 45];
    }
    return Array.from(sizeSet).sort((a, b) => a - b);
  }, [products]);

  // Combined Multi-Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search Query Match (Product Name, Brand, Category Name, SKU)
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const nameMatch = p.name.toLowerCase().includes(q);
        const brandMatch = p.brand.toLowerCase().includes(q);
        const categoryMatch = (p.category_name || '').toLowerCase().includes(q);
        const skuMatch = p.sku.toLowerCase().includes(q);
        if (!nameMatch && !brandMatch && !categoryMatch && !skuMatch) {
          return false;
        }
      }

      // 2. Category Match
      if (filters.category) {
        const matchedCategory = categories.find(
          (c) => c.slug === filters.category || c.id === filters.category
        );
        const categoryIdToMatch = matchedCategory ? matchedCategory.id : filters.category;
        if (p.category_id !== categoryIdToMatch) {
          return false;
        }
      }

      // 3. Availability Filter
      if (filters.availability === 'in_stock') {
        if (p.stock_status === 'Out of Stock') return false;
      } else if (filters.availability === 'out_of_stock') {
        if (p.stock_status !== 'Out of Stock') return false;
      }

      // 4. Size Filter
      if (filters.size !== null) {
        const sizeEntry = p.sizes?.find((s) => s.size === filters.size);
        if (!sizeEntry || sizeEntry.stock_quantity <= 0) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sort Logic
      if (filters.sortBy === 'price_low') {
        const priceA = a.discount_price ?? a.price;
        const priceB = b.discount_price ?? b.price;
        return priceA - priceB;
      }
      if (filters.sortBy === 'price_high') {
        const priceA = a.discount_price ?? a.price;
        const priceB = b.discount_price ?? b.price;
        return priceB - priceA;
      }
      if (filters.sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // Default: Featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, categories, filters]);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      availability: 'all',
      size: null,
      sortBy: 'featured',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8"
    >
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6">
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">Catalog</span>
        <h1 className="text-4xl sm:text-5xl font-serif font-black text-white tracking-tight mt-1">
          Shop All Shoes
        </h1>
        <p className="text-sm text-zinc-400 mt-2 font-light">
          Filter through our full collection of sneakers, formal leather oxfords, running trainers, and casual footwear.
        </p>
      </div>

      {/* Multi-Filter Bar */}
      <Filters
        filters={filters}
        categories={categories}
        availableSizes={availableSizes}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
        totalResults={filteredProducts.length}
      />

      {/* Product Grid */}
      <ProductGrid
        products={filteredProducts}
        isLoading={loading}
        onClearFilters={handleClearFilters}
      />
    </motion.div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-zinc-400 text-sm">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
