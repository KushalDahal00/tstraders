import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export async function signInWithGoogle() {
  const supabase = createClient();
  if (supabase) {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  } else {
    // Fallback demo Google Login for local/demo mode
    const mockUser = {
      id: 'demo-google-user-123',
      email: 'user@gmail.com',
      user_metadata: {
        full_name: 'Demo Google User',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
    };
    localStorage.setItem('ts_user_auth', JSON.stringify(mockUser));
    window.dispatchEvent(new Event('ts_user_auth_changed'));
  }
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('ts_user_auth');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function signOutUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ts_user_auth');
  window.dispatchEvent(new Event('ts_user_auth_changed'));
}
