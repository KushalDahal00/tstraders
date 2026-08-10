'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
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
    <div className="space-y-6 bg-white p-6 border-[3px] border-brutal neo-shadow mb-8">
      {/* Top Search & Primary Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Box */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brutal stroke-[2.5]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search shoes by name, brand, SKU..."
            className="input-brutal pl-10 pr-10 font-bold"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brutal hover:text-brutal-red"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-3">
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="input-brutal uppercase font-bold tracking-wider cursor-pointer"
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
            className="input-brutal font-bold cursor-pointer"
          >
            <option value="all">Status: All</option>
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
            className="input-brutal font-bold cursor-pointer"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Size Selector Row */}
      <div className="pt-4 border-t-[2.5px] border-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
          <span className="text-xs uppercase tracking-widest text-brutal font-black mr-2 whitespace-nowrap font-mono">
            Size (EU):
          </span>
          <button
            onClick={() => onFilterChange({ ...filters, size: null })}
            className={`px-3 py-1 text-xs font-mono font-bold border-[2px] border-brutal transition-colors ${
              filters.size === null
                ? 'bg-brutal-yellow text-brutal shadow-brutal-sm'
                : 'bg-white text-brutal hover:bg-cream-2'
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
              className={`px-3 py-1 text-xs font-mono font-bold border-[2px] border-brutal transition-colors ${
                filters.size === sz
                  ? 'bg-brutal-yellow text-brutal shadow-brutal-sm'
                  : 'bg-white text-brutal hover:bg-cream-2'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>

        <div className="text-xs text-brutal font-mono font-bold text-right whitespace-nowrap bg-cream-2 px-3 py-1.5 border-[2px] border-brutal">
          Showing <span className="text-brutal-red font-black">{totalResults}</span> products
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="pt-3 border-t-[2px] border-brutal flex flex-wrap items-center gap-2">
          <span className="text-xs text-brutal font-mono font-black uppercase tracking-wider mr-1">Active:</span>

          {filters.search && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-brutal-yellow text-brutal text-xs font-bold border-[2px] border-brutal font-mono shadow-brutal-sm">
              <span>"{filters.search}"</span>
              <button onClick={() => onFilterChange({ ...filters, search: '' })} className="hover:text-brutal-red">
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </span>
          )}

          {filters.category && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-brutal-blue text-white text-xs font-bold border-[2px] border-brutal font-mono shadow-brutal-sm">
              <span>Cat: {activeCategoryObj?.name || filters.category}</span>
              <button onClick={() => onFilterChange({ ...filters, category: '' })} className="hover:text-brutal-yellow">
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </span>
          )}

          {filters.availability !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-brutal-green text-brutal text-xs font-bold border-[2px] border-brutal font-mono shadow-brutal-sm">
              <span>{filters.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}</span>
              <button onClick={() => onFilterChange({ ...filters, availability: 'all' })} className="hover:text-brutal-red">
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </span>
          )}

          {filters.size !== null && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-brutal-red text-white text-xs font-bold border-[2px] border-brutal font-mono shadow-brutal-sm">
              <span>Size {filters.size}</span>
              <button onClick={() => onFilterChange({ ...filters, size: null })} className="hover:text-brutal-yellow">
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </span>
          )}

          <button
            onClick={onClearFilters}
            className="text-xs text-brutal-red hover:underline font-black font-mono uppercase tracking-wider ml-2"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
