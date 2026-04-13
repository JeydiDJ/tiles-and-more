import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="surface-card rounded-md p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">Tiles & More</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Hidden admin access</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">
            This route is intentionally not linked anywhere on the public storefront. Once signed in, you&apos;ll be able to manage products from the private dashboard.
          </p>

          <div className="mt-8 grid gap-4 text-sm text-[var(--muted)]">
            <div className="rounded-sm border border-[var(--border)] bg-white px-4 py-4">
              Supabase Auth protects access to the admin dashboard.
            </div>
            <div className="rounded-sm border border-[var(--border)] bg-white px-4 py-4">
              Product creation will insert directly into your `products` table.
            </div>
            <div className="rounded-sm border border-[var(--border)] bg-white px-4 py-4">
              The public site still won&apos;t surface this route anywhere in navigation.
            </div>
          </div>

          {!hasSupabaseEnv() ? (
            <p className="mt-6 rounded-sm border border-[#ed2325]/20 bg-[#fff5f5] px-4 py-3 text-sm text-[#8f1d1d]">
              Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` before signing in.
            </p>
          ) : null}
        </section>

        <div className="flex items-center justify-center">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
