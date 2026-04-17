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
    <form
      action={formAction}
      className="w-full max-w-md rounded-[1.75rem] border border-[#231f20]/10 bg-[rgba(255,255,255,0.92)] p-6 shadow-[0_28px_80px_rgba(35,31,32,0.14)] backdrop-blur-xl sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--brand)]">Private Access</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">Admin sign in</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Use your Supabase Auth credentials to enter the private Tiles & More management workspace.
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#231f20]/8 bg-[#f7f4ef] text-[var(--foreground)]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.7">
            <path d="M12 3.75 5.25 6.75v5.7c0 4.28 2.89 8.18 6.75 9.8 3.86-1.62 6.75-5.52 6.75-9.8v-5.7L12 3.75Z" />
            <path d="m9.75 12 1.5 1.5 3-3.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <Input name="email" type="email" placeholder="Email address" autoComplete="email" required />
        <Input name="password" type="password" placeholder="Password" autoComplete="current-password" required />
      </div>

      {state.error ? (
        <p className="mt-4 rounded-[1rem] border border-[#ed2325]/20 bg-[#fff5f5] px-4 py-3 text-sm text-[#8f1d1d]">
          {state.error}
        </p>
      ) : null}

      <div className="mt-6 rounded-[1rem] border border-[#231f20]/8 bg-[#f7f4ef] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
        Authorized personnel only
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 inline-flex w-full items-center justify-center rounded-[1rem] bg-[var(--brand)] px-5 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_18px_34px_rgba(237,35,37,0.18)] transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
