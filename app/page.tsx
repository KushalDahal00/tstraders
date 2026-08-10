'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { getProducts, getCategories } from '@/lib/store';
import { Product, Category } from '@/lib/types';
import { ArrowRight, ShieldCheck, Sparkles, Footprints, Truck } from 'lucide-react';

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      const featured = prods.filter((p) => p.featured && p.status === 'published');
      setFeaturedProducts(featured.length >= 4 ? featured.slice(0, 4) : prods.slice(0, 4));
      setCategories(cats);
      setLoading(false);
    }
    loadData();
  }, []);

  const categoryColors = [
    'bg-brutal-yellow text-brutal',
    'bg-brutal-blue text-white',
    'bg-brutal-red text-white',
    'bg-brutal-green text-brutal',
    'bg-cream-2 text-brutal',
    'bg-white text-brutal',
  ];

  return (
    <div className="space-y-16 pb-20 bg-cream">
      {/* Editorial Hero Component */}
      <Hero />

      {/* Categories Spotlight Section */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-end justify-between border-b-[3px] border-brutal pb-4">
            <div>
              <span className="text-xs uppercase font-mono font-black text-brutal-muted">
                // Explore Collections
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-brutal tracking-tight uppercase mt-0.5">
                Shop By Category
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-mono font-black uppercase tracking-wider text-brutal hover:bg-brutal-yellow px-3 py-1.5 border-[2px] border-brutal flex items-center space-x-1.5 neo-press"
            >
              <span>All Categories</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map((cat, idx) => {
              const bgClass = categoryColors[idx % categoryColors.length];
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className={`group relative aspect-[4/3] border-[3px] border-brutal neo-shadow neo-press overflow-hidden flex flex-col justify-end p-5 ${bgClass}`}
                >
                  {cat.image_url && (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-40 mix-blend-multiply"
                    />
                  )}
                  <div className="relative z-10 space-y-1">
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-wider bg-white text-brutal px-2 py-0.5 border-[2px] border-brutal inline-block neo-shadow-sm">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] font-mono font-bold uppercase tracking-widest flex items-center space-x-1 mt-1 text-brutal">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3] transition-transform group-hover:translate-x-1" />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Featured Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between space-y-3 md:space-y-0 pb-4 border-b-[3px] border-brutal">
          <div>
            <span className="text-xs uppercase font-mono font-black text-brutal-muted">
              // Curated Selection
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-brutal tracking-tight uppercase mt-0.5">
              Featured Footwear
            </h2>
          </div>
          <Link
            href="/shop"
            className="btn-brutal text-xs inline-flex items-center space-x-2"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white aspect-[3/4] animate-pulse border-[3px] border-brutal neo-shadow" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Editorial Banner Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-brutal-yellow border-[4px] border-brutal p-8 sm:p-12 neo-shadow-lg overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-mono font-black uppercase tracking-[0.25em] bg-brutal text-cream px-3 py-1 border-[2px] border-brutal inline-block">
              The T.S Traders Promise
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-brutal leading-[1.0] uppercase">
              Engineered For Comfort. Built To Last.
            </h2>
            <p className="text-sm font-medium text-brutal leading-relaxed bg-white p-4 border-[2.5px] border-brutal neo-shadow-sm">
              Every shoe in our collection undergoes rigorous sizing checks, leather inspection, and welt construction verification to ensure lasting durability.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy / Brand Values Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-8 border-y-[3.5px] border-brutal">
          <div className="bg-white p-5 border-[2.5px] border-brutal neo-shadow-sm space-y-2">
            <div className="inline-flex p-2 bg-brutal-yellow border-[2px] border-brutal text-brutal mb-1">
              <Footprints className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-brutal">
              Master Craftsmanship
            </h3>
            <p className="text-xs font-medium text-brutal-muted leading-relaxed">
              Durable welt stitching and ergonomic cushioned soles.
            </p>
          </div>

          <div className="bg-white p-5 border-[2.5px] border-brutal neo-shadow-sm space-y-2">
            <div className="inline-flex p-2 bg-brutal-blue border-[2px] border-brutal text-white mb-1">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-brutal">
              Timeless Design
            </h3>
            <p className="text-xs font-medium text-brutal-muted leading-relaxed">
              Clean silhouettes tailored to elevate both casual and formal attire.
            </p>
          </div>

          <div className="bg-white p-5 border-[2.5px] border-brutal neo-shadow-sm space-y-2">
            <div className="inline-flex p-2 bg-brutal-green border-[2px] border-brutal text-brutal mb-1">
              <Truck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-brutal">
              Cash On Delivery
            </h3>
            <p className="text-xs font-medium text-brutal-muted leading-relaxed">
              Pay with cash conveniently when your order arrives at your door.
            </p>
          </div>

          <div className="bg-white p-5 border-[2.5px] border-brutal neo-shadow-sm space-y-2">
            <div className="inline-flex p-2 bg-brutal-red border-[2px] border-brutal text-white mb-1">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-brutal">
              100% Genuine
            </h3>
            <p className="text-xs font-medium text-brutal-muted leading-relaxed">
              Direct verification from authorized master shoemakers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
