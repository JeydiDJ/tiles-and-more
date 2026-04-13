"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/supabase/config";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  if (client) {
    return client;
  }

  const { url, anonKey } = getSupabaseConfig();
  client = createBrowserClient(url, anonKey);

  return client;
}
