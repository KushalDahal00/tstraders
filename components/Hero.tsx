'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Footprints, ShieldCheck, Zap } from 'lucide-react';
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
    <section className="relative bg-cream border-b-[3.5px] border-brutal overflow-hidden py-12 sm:py-20">
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#0A0A0A_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-brutal-yellow text-brutal border-[2.5px] border-brutal font-mono font-bold text-xs uppercase shadow-brutal-sm">
              <Zap className="w-4 h-4 fill-brutal" />
              <span>Official Retailer & Footwear Specialist</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brutal-muted block">
                // {settings.storeName || 'T.S TRADERS'}
              </span>
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-brutal uppercase leading-[0.95]">
                {taglineMain && (
                  <>
                    {taglineMain} <br />
                  </>
                )}
                <span className="bg-brutal-yellow px-2 py-0.5 border-[3px] border-brutal inline-block rotate-[-1deg] shadow-brutal-sm">
                  {taglineLast}
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-brutal-muted font-medium max-w-xl leading-relaxed border-l-4 border-brutal pl-4 py-1">
              {settings.heroSubtitle || 'Discover timeless silhouettes, luxury leather craftsmanship, and high-performance footwear engineered for everyday comfort.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="relative overflow-hidden text-sm flex items-center space-x-3 group px-7 py-3.5 font-black uppercase tracking-widest text-white"
                style={{
                  background: 'linear-gradient(135deg, #FF4D00 0%, #FF0080 50%, #7B2FFF 100%)',
                  border: '2.5px solid #0A0A0A',
                  boxShadow: '4px 4px 0px #0A0A0A, 0 0 24px rgba(255, 77, 0, 0.5)',
                  transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translate(2px, 2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '2px 2px 0px #0A0A0A, 0 0 32px rgba(255, 0, 128, 0.6)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = '';
                  (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0px #0A0A0A, 0 0 24px rgba(255, 77, 0, 0.5)';
                }}
              >
                {/* Shimmer sweep */}
                <span
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                  }}
                />
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-sm animate-ping opacity-20"
                  style={{ background: 'linear-gradient(135deg, #FF4D00, #FF0080)' }}
                />
                <span className="relative z-10">Shop Catalog Now</span>
                <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-100 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Micro Specs */}
            <div className="pt-6 border-t-[2.5px] border-brutal grid grid-cols-3 gap-4 font-mono text-brutal">
              <div className="bg-white p-3 border-[2px] border-brutal shadow-brutal-sm">
                <span className="block font-black text-sm uppercase">100% Genuine</span>
                <span className="text-[11px] text-brutal-muted font-medium">Verified Quality</span>
              </div>
              <div className="bg-white p-3 border-[2px] border-brutal shadow-brutal-sm">
                <span className="block font-black text-sm uppercase">Cash On Delivery</span>
                <span className="text-[11px] text-brutal-muted font-medium">Nationwide</span>
              </div>
              <div className="bg-white p-3 border-[2px] border-brutal shadow-brutal-sm">
                <span className="block font-black text-sm uppercase">Easy Sizing</span>
                <span className="text-[11px] text-brutal-muted font-medium">Accurate EU Fit</span>
              </div>
            </div>
          </div>

          {/* Right Hero Product Feature */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none aspect-[4/5] bg-white border-[3.5px] border-brutal shadow-brutal-lg overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85"
                alt="Featured Footwear"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
              />

              {/* Top Banner Tag */}
              <div className="absolute top-4 left-4 bg-brutal-red text-white font-mono font-bold text-xs uppercase px-3 py-1 border-[2px] border-brutal shadow-brutal-sm rotate-[-2deg]">
                HOT ITEM // BESTSELLER
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-white border-[3px] border-brutal shadow-brutal flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-brutal-muted font-mono font-bold block">
                    Featured Release
                  </span>
                  <span className="text-base font-black text-brutal uppercase block mt-0.5">
                    Nike Air Max 270
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-black text-brutal bg-brutal-yellow px-2 py-1 border-[1.5px] border-brutal block">
                    Rs. 14,999
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
