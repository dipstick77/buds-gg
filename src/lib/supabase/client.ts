import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./env";

let browserClient: SupabaseClient | null = null;

/**
 * Browser Supabase client. Returns null when env keys are not set —
 * the Discover shell runs entirely on seed data without Supabase.
 */
export function createBrowserSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (browserClient) return browserClient;

  const url = getSupabaseUrl()!;
  const key = getSupabaseAnonKey()!;
  browserClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return browserClient;
}
