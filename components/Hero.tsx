'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, ArrowDownRight } from 'lucide-react';
import { getStoreSettings, StoreSettings, DEFAULT_SETTINGS } from '@/lib/store';

export function Hero() {
  const [settings, setSettings] = useState<StoreSettings>({ ...DEFAULT_SETTINGS });

  useEffect(() => {
    setSettings(getStoreSettings());

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<StoreSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      }
    };
    window.addEventListener('ts_settings_updated', handler);
    return () => window.removeEventListener('ts_settings_updated', handler);
  }, []);

  const taglineParts = settings.heroTagline ? settings.heroTagline.split(' ') : ['PREMIUM', 'FOOTWEAR'];
  const taglineMain = taglineParts.slice(0, -1).join(' ');
  const taglineLast = taglineParts[taglineParts.length - 1];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#09090b] border-b border-zinc-800/60">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800/40 via-[#09090b] to-[#09090b]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-7 text-left z-10 will-change-transform"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 border border-zinc-800 bg-zinc-900/80 text-xs text-zinc-300 font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>Official Retailer &amp; Footwear Specialist</span>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 block">
                {settings.storeName || 'T.S TRADERS'}
              </span>
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif font-black tracking-tight text-white leading-[1.08]">
                {taglineMain && (
                  <>
                    {taglineMain} <br />
                  </>
                )}
                <span className="text-gradient">{taglineLast}</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-zinc-400 font-light max-w-xl leading-relaxed">
              {settings.heroSubtitle || 'Discover timeless silhouettes, luxury leather craftsmanship, and high-performance footwear engineered for everyday comfort.'}
            </p>

            <div className="pt-3">
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center px-9 py-4 bg-white text-zinc-950 font-serif font-black uppercase tracking-[0.25em] text-xs transition-transform duration-200 ease-out transform active:scale-95 shadow-xl hover:bg-zinc-100 will-change-transform"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-1.5" />
                </span>
              </Link>
            </div>

            {/* Micro Trust Specs */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-4 text-xs font-mono text-zinc-400">
              <div>
                <span className="block text-white font-bold text-sm">100% Genuine</span>
                <span className="text-[10px] text-zinc-500">Verified Quality</span>
              </div>
              <div>
                <span className="block text-white font-bold text-sm">Cash on Delivery</span>
                <span className="text-[10px] text-zinc-500">Nationwide Delivery</span>
              </div>
              <div>
                <span className="block text-white font-bold text-sm">Easy Sizing</span>
                <span className="text-[10px] text-zinc-500">Accurate EU Fit</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Product Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative will-change-transform"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none aspect-[4/5] bg-zinc-950 overflow-hidden border border-zinc-800 shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85"
                alt="Featured Footwear"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-70" />

              {/* Floating Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#121215]/90 backdrop-blur-md border border-zinc-800 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono block">
                    Featured Edition
                  </span>
                  <span className="text-sm font-serif font-bold text-white block mt-0.5">
                    Nike Air Max 270 Supreme
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-white block">Rs. 14,999</span>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-mono">In Stock</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

