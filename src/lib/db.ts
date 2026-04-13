import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getDbClient() {
  if (!hasSupabaseEnv()) {
    return {
      provider: "supabase",
      ready: false,
      client: null,
    };
  }

  return {
    provider: "supabase",
    ready: true,
    client: await createSupabaseServerClient(),
  };
}
