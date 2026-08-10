'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    async function checkAdminAuth() {
      if (isLoginPage) {
        setLoading(false);
        return;
      }

      const supabase = createClient();

      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setAuthorized(true);
          setLoading(false);
          return;
        }
      }

      // Unauthorized -> redirect to login page
      setAuthorized(false);
      setLoading(false);
      router.push('/admin/login');
    }

    checkAdminAuth();
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white text-xs uppercase tracking-widest font-mono">
        Verifying Administrator Session...
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">{children}</div>
    </div>
  );
}
