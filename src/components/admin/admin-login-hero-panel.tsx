import { hasSupabaseEnv } from "@/lib/supabase/config";
import { AdminInstallPrompt } from "@/components/admin/admin-install-prompt";

const adminSignals = [
  {
    label: "Catalog",
    value: "Products, categories, and media control",
  },
  {
    label: "CRM",
    value: "Accounts, deals, and quotation watchlists",
  },
  {
    label: "Ops",
    value: "Calendar, accounting, and admin preferences",
  },
];

export function AdminLoginHeroPanel() {
  return (
    <section className="relative overflow-hidden border-b border-[#e7e9f2] bg-[#fafbfe] px-6 py-8 sm:px-8 sm:py-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(237,35,37,0.08),transparent_28%),radial-gradient(circle_at_78%_20%,rgba(23,20,26,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.85)_0%,rgba(250,251,254,0.96)_100%)]" />
      <div className="absolute right-[-3rem] top-10 h-40 w-40 rounded-full bg-[rgba(237,35,37,0.08)] blur-3xl" />
      <div className="absolute bottom-[-4rem] left-[-2rem] h-36 w-36 rounded-full bg-[rgba(23,20,26,0.06)] blur-3xl" />

      <div className="relative">
        <div className="inline-flex items-center gap-3 rounded-full border border-[#e4e7ef] bg-white px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#6f6a75] shadow-[0_10px_24px_rgba(35,31,32,0.04)]">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand)]" />
          TILES & MORE Admin
        </div>

        <h1 className="mt-7 max-w-[12ch] text-4xl font-semibold leading-none tracking-tight text-[#17141a] sm:text-5xl lg:text-[3.65rem]">
          One workspace for the whole operating floor.
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-[#6f6a75] sm:text-base">
          Sign in to manage product publishing, sales pipeline activity, scheduling, and accounting from the same
          admin environment your team already uses.
        </p>

        <div className="mt-8 grid gap-3">
          {adminSignals.map((item) => (
            <div
              key={item.label}
              className="rounded-[1.2rem] border border-[#e3e7f0] bg-white/90 px-4 py-4 shadow-[0_10px_24px_rgba(35,31,32,0.04)] backdrop-blur"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">{item.label}</p>
              <p className="mt-2 text-sm leading-6 text-[#17141a]">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <AdminInstallPrompt />
        </div>

        {!hasSupabaseEnv() ? (
          <div className="mt-6 rounded-[1.2rem] border border-[#f3c2c7] bg-[#fff7f7] px-5 py-4 text-sm leading-6 text-[#8f1d1d]">
            Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` before attempting sign-in.
          </div>
        ) : null}
      </div>
    </section>
  );
}
