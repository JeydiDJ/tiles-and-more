"use client";

import { useActionState } from "react";
import { loginAction, type AdminAuthState } from "@/app/(admin)/admin/actions";
import { Input } from "@/components/ui/input";

const initialState: AdminAuthState = {
  error: null,
};

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="surface-card w-full max-w-md rounded-md p-6">
      <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Private Access</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Admin sign in</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Use your Supabase Auth email and password to access the hidden catalog dashboard.
      </p>

      <div className="mt-6 grid gap-4">
        <Input name="email" type="email" placeholder="Email address" autoComplete="email" required />
        <Input name="password" type="password" placeholder="Password" autoComplete="current-password" required />
      </div>

      {state.error ? (
        <p className="mt-4 rounded-sm border border-[#ed2325]/20 bg-[#fff5f5] px-4 py-3 text-sm text-[#8f1d1d]">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex w-full items-center justify-center rounded-sm bg-[var(--brand)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
