"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminRoute } from "@/lib/admin-path";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export type AdminAuthState = {
  error: string | null;
};

export async function loginAction(_: AdminAuthState, formData: FormData): Promise<AdminAuthState> {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase env vars are missing. Add them before using admin login." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(getAdminRoute());
}

export async function logoutAction() {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect(getAdminRoute("/login"));
}
