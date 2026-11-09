import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

/**
 * Admin / service-role Supabase client.
 * NEVER import this in client components or expose to the browser.
 * Use only in Server Actions, Route Handlers, and server-side logic.
 * Bypasses Row Level Security — use with caution.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Admin client cannot be created."
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
