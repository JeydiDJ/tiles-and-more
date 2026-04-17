import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f2ed] px-6 py-12 sm:px-8 sm:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(237,35,37,0.14),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(35,31,32,0.1),transparent_20%),linear-gradient(180deg,#faf7f2_0%,#f2efea_100%)]" />
      <div className="absolute left-[-12rem] top-[-7rem] h-72 w-72 rounded-full border border-[#231f20]/8 bg-white/40 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-8rem] h-80 w-80 rounded-full bg-[rgba(35,31,32,0.08)] blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
        <section className="relative overflow-hidden rounded-[1.75rem] border border-[#231f20]/10 bg-[#231f20] px-6 py-8 text-white shadow-[0_32px_90px_rgba(35,31,32,0.2)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
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
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
              This private access point is reserved for internal catalog management. Sign in to maintain product
              records, update media, and manage the showroom content experience behind the public site.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.25rem] border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/58">Authentication</p>
                <p className="mt-3 text-sm leading-6 text-white/82">Protected through Supabase Auth before any admin action is allowed.</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/58">Catalog Flow</p>
                <p className="mt-3 text-sm leading-6 text-white/82">Product creation feeds the live catalog structure and media presentation.</p>
              </div>
              <div className="rounded-[1.25rem] border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/58">Visibility</p>
                <p className="mt-3 text-sm leading-6 text-white/82">This route stays hidden from the public storefront navigation.</p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6 text-sm text-white/72">
              <span className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-white/80" />
                Secure internal entry
              </span>
              <span className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand)]" />
                Product and media management
              </span>
            </div>

            {!hasSupabaseEnv() ? (
              <div className="mt-8 rounded-[1.1rem] border border-[#ed2325]/28 bg-[rgba(237,35,37,0.12)] px-5 py-4 text-sm text-white/88">
                Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` before attempting sign-in.
              </div>
            ) : null}
          </div>
        </section>

        <div className="flex items-center justify-center">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
