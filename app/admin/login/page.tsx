'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const DEMO_EMAIL = 'admin@tstraders.com';
  const DEMO_PASSWORD = 'adminpassword123';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    let supabaseSuccess = false;

    // 1. Try Supabase Auth first if configured
    if (supabase) {
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!authError && data?.session) {
          supabaseSuccess = true;
        }
        // If Supabase fails, we fall through to demo credential check below
      } catch {
        // Supabase unavailable — fall through to demo mode
      }
    }

    // 2. If Supabase didn't succeed, check demo credentials
    if (!supabaseSuccess) {
      const isDemoLogin =
        email === DEMO_EMAIL && password === DEMO_PASSWORD;

      if (!isDemoLogin) {
        setError(
          'Invalid credentials. For demo access use: admin@tstraders.com / adminpassword123'
        );
        setLoading(false);
        return;
      }
    }

    // 3. Grant access (via Supabase session or demo localStorage session)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ts_admin_authenticated', 'true');
      localStorage.setItem('ts_admin_email', email || DEMO_EMAIL);
    }

    router.push('/admin/dashboard');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@tstraders.com');
    setPassword('adminpassword123');
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141417] border border-zinc-800 p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-zinc-900 border border-zinc-800 rounded-full text-white mb-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
            T.S Traders Admin
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in to access inventory control & store management
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tstraders.com"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-zinc-950 font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In To Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Trigger */}
        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <p className="text-center text-xs text-zinc-500 uppercase tracking-widest font-mono">
            Demo Access Credentials
          </p>
          <div className="bg-zinc-900/80 border border-zinc-800 p-3 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-zinc-500">Email:</span>
              <span className="text-zinc-200">admin@tstraders.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Password:</span>
              <span className="text-zinc-200">adminpassword123</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail('admin@tstraders.com');
              setPassword('adminpassword123');
            }}
            className="w-full inline-flex items-center justify-center space-x-1.5 py-2 bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 hover:text-white hover:border-zinc-500 font-mono transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Auto-Fill Demo Credentials</span>
          </button>
        </div>

      </div>
    </div>
  );
}
