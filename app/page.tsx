'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { getProducts, getCategories } from '@/lib/store';
import { Product, Category } from '@/lib/types';
import { ArrowRight, ShieldCheck, Sparkles, Footprints, Truck, RotateCcw } from 'lucide-react';

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

  return (
    <div className="space-y-20 pb-20 bg-[#09090b]">
      {/* Editorial Hero Component */}
      <Hero />

      {/* Categories Spotlight Section */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-end justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-mono">
                Explore Collections
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight mt-1">
                Shop By Category
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white flex items-center space-x-1"
            >
              <span>All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative aspect-[4/3] bg-zinc-900 border border-zinc-800/80 overflow-hidden flex flex-col justify-end p-5 hover:border-zinc-500 transition-all duration-300 shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-90 group-hover:opacity-80 transition-opacity" />
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
                  />
                ) : (
                  <div className="absolute inset-0 bg-zinc-900 group-hover:bg-zinc-800 transition-colors" />
                )}
                <div className="relative z-20 space-y-1">
                  <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider group-hover:text-zinc-200">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest flex items-center space-x-1 group-hover:text-white">
                    <span>Explore Pair</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between space-y-3 md:space-y-0 pb-4 border-b border-zinc-800/80">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-mono">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight mt-1">
              Featured Footwear
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-zinc-300 hover:text-white group transition-colors"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#141417] aspect-[3/4] animate-pulse border border-zinc-800" />
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
        <div className="relative bg-[#121215] border border-zinc-800 p-8 sm:p-14 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-5">
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">
              The T.S Traders Distinction
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-white leading-[1.1]">
              Engineered For Comfort. Designed For Elegance.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              Every shoe in our collection undergoes rigorous sizing checks, leather inspection, and welt construction verification to ensure lasting durability.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80"
              alt="Sole detail"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Philosophy / Brand Values Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-10 border-y border-zinc-800/80">
          <div className="space-y-2 p-4 text-center md:text-left">
            <div className="inline-flex p-2.5 bg-[#141417] border border-zinc-800 text-white mb-2 shadow-sm">
              <Footprints className="w-4 h-4 text-zinc-300" />
            </div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Master Craftsmanship
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Built with durable welt stitching and ergonomic cushioned soles.
            </p>
          </div>

          <div className="space-y-2 p-4 text-center md:text-left">
            <div className="inline-flex p-2.5 bg-[#141417] border border-zinc-800 text-white mb-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-zinc-300" />
            </div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Timeless Design
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Clean silhouettes tailored to elevate both casual and formal attire.
            </p>
          </div>

          <div className="space-y-2 p-4 text-center md:text-left">
            <div className="inline-flex p-2.5 bg-[#141417] border border-zinc-800 text-white mb-2 shadow-sm">
              <Truck className="w-4 h-4 text-zinc-300" />
            </div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Cash On Delivery
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Pay with cash conveniently when your order arrives at your door.
            </p>
          </div>

          <div className="space-y-2 p-4 text-center md:text-left">
            <div className="inline-flex p-2.5 bg-[#141417] border border-zinc-800 text-white mb-2 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-zinc-300" />
            </div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              100% Genuine
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Direct verification from authorized master shoemakers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

