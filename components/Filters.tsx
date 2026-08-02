'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Category, FilterState } from '@/lib/types';

interface FiltersProps {
  filters: FilterState;
  categories: Category[];
  availableSizes: number[];
  onFilterChange: (newFilters: FilterState) => void;
  onClearFilters: () => void;
  totalResults: number;
}

export function Filters({
  filters,
  categories,
  availableSizes,
  onFilterChange,
  onClearFilters,
  totalResults,
}: FiltersProps) {
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.category) ||
    filters.availability !== 'all' ||
    filters.size !== null;

  const activeCategoryObj = categories.find((c) => c.slug === filters.category || c.id === filters.category);

  return (
    <div className="space-y-6 bg-[#141417] p-6 border border-zinc-800/80 mb-8">
      {/* Top Search & Primary Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Box */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search shoes by name, brand, category, SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-3">
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full py-2.5 px-3 bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors uppercase tracking-wider"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <div className="md:col-span-2">
          <select
            value={filters.availability}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                availability: e.target.value as FilterState['availability'],
              })
            }
            className="w-full py-2.5 px-3 bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
          >
            <option value="all">Availability: All</option>
            <option value="in_stock">In Stock Only</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="md:col-span-2">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as FilterState['sortBy'],
              })
            }
            className="w-full py-2.5 px-3 bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Size Selector Row */}
      <div className="pt-4 border-t border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mr-2 whitespace-nowrap">
            Size (EU):
          </span>
          <button
            onClick={() => onFilterChange({ ...filters, size: null })}
            className={`px-3 py-1 text-xs font-mono transition-colors ${
              filters.size === null
                ? 'bg-white text-zinc-950 font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            All
          </button>
          {availableSizes.map((sz) => (
            <button
              key={sz}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  size: filters.size === sz ? null : sz,
                })
              }
              className={`px-3 py-1 text-xs font-mono transition-colors ${
                filters.size === sz
                  ? 'bg-white text-zinc-950 font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>

        <div className="text-xs text-zinc-400 font-mono text-right whitespace-nowrap">
          Showing <span className="text-white font-bold">{totalResults}</span> products
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="pt-3 border-t border-zinc-800/60 flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-400 uppercase tracking-widest mr-1">Active:</span>

          {filters.search && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-zinc-800 text-zinc-200 text-xs rounded-none border border-zinc-700">
              <span>Query: "{filters.search}"</span>
              <button onClick={() => onFilterChange({ ...filters, search: '' })} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.category && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-zinc-800 text-zinc-200 text-xs rounded-none border border-zinc-700">
              <span>Category: {activeCategoryObj?.name || filters.category}</span>
              <button onClick={() => onFilterChange({ ...filters, category: '' })} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.availability !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-zinc-800 text-zinc-200 text-xs rounded-none border border-zinc-700">
              <span>
                {filters.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}
              </span>
              <button
                onClick={() => onFilterChange({ ...filters, availability: 'all' })}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.size !== null && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-zinc-800 text-zinc-200 text-xs rounded-none border border-zinc-700 font-mono">
              <span>Size {filters.size}</span>
              <button onClick={() => onFilterChange({ ...filters, size: null })} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={onClearFilters}
            className="text-xs text-rose-400 hover:text-rose-300 underline font-medium ml-2 uppercase tracking-wider"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
