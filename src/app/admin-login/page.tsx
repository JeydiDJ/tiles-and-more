import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { createPageMetadata } from "@/lib/seo";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Login",
  description: "Private admin login for Tiles & More.",
  path: "/admin-login",
  noIndex: true,
});

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f2ed] px-6 py-12 sm:px-8 sm:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(237,35,37,0.14),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(35,31,32,0.1),transparent_20%),linear-gradient(180deg,#faf7f2_0%,#f2efea_100%)]" />
      <div className="absolute left-[-12rem] top-[-7rem] h-72 w-72 rounded-full border border-[#231f20]/8 bg-white/40 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-[rgba(35,31,32,0.08)] blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-[#231f20]/10 bg-[rgba(255,255,255,0.72)] shadow-[0_32px_90px_rgba(35,31,32,0.18)] backdrop-blur-xl">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative overflow-hidden bg-[#231f20] px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.1)_0%,transparent_28%,transparent_62%,rgba(237,35,37,0.18)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
            <div className="absolute right-[-3rem] top-10 h-40 w-40 rounded-full border border-white/12 bg-white/6 blur-2xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/16 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.26em] text-white/76 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
                Tiles & More Admin
              </div>

              <h1 className="mt-7 max-w-[12ch] text-4xl font-semibold leading-none tracking-tight sm:text-5xl lg:text-[3.8rem]">
                Refined control for catalog operations.
              </h1>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/72 sm:text-base">
                Private access for managing products, media, and storefront content.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6 text-sm text-white/72">
                <span className="inline-flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/80" />
                  Secure internal entry
                </span>
                <span className="inline-flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand)]" />
                  Supabase Auth protected
                </span>
              </div>

              {!hasSupabaseEnv() ? (
                <div className="mt-8 rounded-[1.1rem] border border-[#ed2325]/28 bg-[rgba(237,35,37,0.12)] px-5 py-4 text-sm text-white/88">
                  Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` before attempting sign-in.
                </div>
              ) : null}
            </div>
          </section>

          <div className="relative border-t border-[#231f20]/8 bg-[rgba(255,255,255,0.82)] px-6 py-8 sm:px-8 sm:py-10 lg:border-l lg:border-t-0 lg:px-10 lg:py-12">
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
