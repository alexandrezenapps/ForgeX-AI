import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL;
const getSupabaseAnonKey = () => import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;
let isConfigured = false;

export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    if (!supabaseInstance) {
      const url = getSupabaseUrl();
      const key = getSupabaseAnonKey();

      if (!url || !key || url === '' || key === '' || !url.startsWith('http')) {
        console.warn('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables to enable authentication and data persistence.');
        isConfigured = false;
        // Create a dummy client using a non-existent but valid-looking URL
        // We use a domain that is less likely to cause a fatal DNS error in some environments
        // but the key is that we'll intercept calls below.
        supabaseInstance = createClient(
          'https://example.com',
          'placeholder',
          { auth: { persistSession: false } }
        );
      } else {
        isConfigured = true;
        supabaseInstance = createClient(url, key);
      }
    }
    
    // If not configured, intercept common data/auth calls to prevent network requests
    if (!isConfigured) {
      if (prop === 'auth') {
        return {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
          signUp: () => Promise.reject(new Error('Supabase not configured')),
          signInWithOtp: () => Promise.reject(new Error('Supabase not configured')),
          signInWithOAuth: () => Promise.reject(new Error('Supabase not configured')),
          signOut: () => Promise.resolve({ error: null }),
        };
      }
      if (prop === 'from' || prop === 'rpc') {
        return () => ({
          select: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }) }),
          insert: () => Promise.resolve({ data: null, error: null }),
          update: () => Promise.resolve({ data: null, error: null }),
          upsert: () => Promise.resolve({ data: null, error: null }),
          delete: () => Promise.resolve({ data: null, error: null }),
        });
      }
    }

    const value = (supabaseInstance as any)[prop];
    if (typeof value === 'function') {
      return value.bind(supabaseInstance);
    }
    return value;
  }
});
