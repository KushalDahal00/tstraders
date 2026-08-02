'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getStoreSettings, saveStoreSettings, StoreSettings, DEFAULT_SETTINGS } from '@/lib/store';
import {
  ShieldCheck,
  Database,
  Globe,
  Save,
  CheckCircle2,
  X,
  RefreshCw,
  Type,
  Mail,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({ ...DEFAULT_SETTINGS });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getStoreSettings();
    setSettings(s);
    setLoading(false);
  }, []);

  const handleChange = (field: keyof StoreSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoreSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const handleReset = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    saveStoreSettings({ ...DEFAULT_SETTINGS });
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 text-zinc-400 text-xs font-mono uppercase tracking-widest animate-pulse">
        Loading Settings...
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 pb-16">
      <AdminHeader
        title="Store Settings"
        subtitle="Manage store configuration, hero content, and notification settings"
      />

      <div className="px-8 space-y-6 max-w-3xl">
        {/* Success Toast */}
        {saved && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xl animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Settings saved successfully — changes are live on the website!</span>
            </div>
            <button onClick={() => setSaved(false)}>
              <X className="w-4 h-4 hover:text-white" />
            </button>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Store Information */}
          <div className="bg-[#141417] p-6 border border-zinc-800 space-y-4">
            <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
              <Globe className="w-4 h-4 text-zinc-300" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif">
                Store Information
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                />
                <p className="mt-1 text-[10px] text-zinc-500">Displayed in the browser tab and header.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Currency
                </label>
                <input
                  type="text"
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  <Mail className="inline w-3 h-3 mr-1" />
                  Contact / Admin Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Hero / Storefront Content */}
          <div className="bg-[#141417] p-6 border border-zinc-800 space-y-4">
            <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
              <Type className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif">
                Homepage Hero Content
              </h3>
              <span className="ml-auto text-[10px] text-emerald-400 font-mono font-bold px-2 py-0.5 border border-emerald-800 bg-emerald-950/50">
                LIVE ON WEBSITE
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              These values are displayed on the homepage hero section visible to all customers.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Hero Tagline (Main Heading)
                </label>
                <input
                  type="text"
                  value={settings.heroTagline}
                  onChange={(e) => handleChange('heroTagline', e.target.value)}
                  placeholder="Step Into Your Style."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                />
                <p className="mt-1 text-[10px] text-zinc-500">The large bold headline shown in the hero section.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Hero Subtitle
                </label>
                <textarea
                  rows={2}
                  value={settings.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                  placeholder="Quality footwear. Timeless style. Everyday comfort."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors leading-relaxed"
                />
                <p className="mt-1 text-[10px] text-zinc-500">Subtitle text shown below the hero heading.</p>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-[#141417] p-6 border border-zinc-800 space-y-4">
            <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif">
                Security & Authentication
              </h3>
            </div>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
                <span>Authentication Provider</span>
                <span className="text-emerald-400 font-mono font-bold">Supabase Auth</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
                <span>Row Level Security (RLS)</span>
                <span className="text-emerald-400 font-mono font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Admin Role Check</span>
                <span className="text-emerald-400 font-mono font-bold">Active</span>
              </div>
            </div>
          </div>

          {/* Database */}
          <div className="bg-[#141417] p-6 border border-zinc-800 space-y-4">
            <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
              <Database className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif">
                Supabase Configuration
              </h3>
            </div>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
                <span>Database</span>
                <span className="text-zinc-200 font-mono">PostgreSQL (Supabase)</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
                <span>Storage</span>
                <span className="text-zinc-200 font-mono">product-images bucket</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
                <span>Data Persistence</span>
                <span className="text-emerald-400 font-mono font-bold">localStorage + Supabase</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Project URL</span>
                <span className="text-zinc-200 font-mono truncate ml-4">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-zinc-900 border border-zinc-700 text-xs text-zinc-400 font-semibold uppercase tracking-wider hover:text-white hover:border-zinc-500 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-8 py-2.5 bg-white text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
