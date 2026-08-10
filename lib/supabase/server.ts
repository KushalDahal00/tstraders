import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const FALLBACK_SUPABASE_URL = 'https://bkeucaiumkujexcsnmtm.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrZXVjYWl1bWt1amV4Y3NubXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0ODIyNDgsImV4cCI6MjEwMTA1ODI0OH0.dPGUqDYrYOYHHSjobNcXa_wkloW_KUWfRASrd2nZ1Pw';

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
        }
      },
    },
  });
}
