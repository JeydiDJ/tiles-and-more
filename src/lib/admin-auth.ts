import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminUser() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase env vars are missing.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAdminUser(message = "Unauthorized") {
  const user = await getAdminUser();

  if (!user) {
    throw new Error(message);
  }

  return user;
}

export async function requireAdminApiUser(message = "Unauthorized") {
  try {
    const user = await getAdminUser();

    if (!user) {
      return {
        error: NextResponse.json({ error: message }, { status: 401 }),
        user: null,
      };
    }

    return {
      error: null,
      user,
    };
  } catch (error) {
    const fallbackMessage = error instanceof Error ? error.message : "Unauthorized";

    return {
      error: NextResponse.json({ error: fallbackMessage }, { status: 500 }),
      user: null,
    };
  }
}
