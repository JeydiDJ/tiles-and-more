"use client";

import { useAdminTheme } from "@/components/admin/admin-theme-provider";
import { Button } from "@/components/ui/button";

function ThemeCard({
  title,
  description,
  active,
  onClick,
  previewClassName,
}: {
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
  previewClassName: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid gap-4 rounded-[1.5rem] border p-5 text-left transition ${
        active
          ? "border-[var(--brand)] bg-[rgba(237,35,37,0.06)] shadow-[0_16px_30px_rgba(237,35,37,0.12)]"
          : "border-[#e3e7f0] bg-white hover:border-[#d6dbe7] hover:shadow-[0_14px_28px_rgba(35,31,32,0.06)]"
      }`}
    >
      <div className={`h-36 overflow-hidden rounded-[1.2rem] border ${previewClassName}`}>
        <div className="flex h-full">
          <div className="w-[30%] border-r border-inherit bg-inherit p-3">
            <div className="h-4 w-14 rounded-full bg-current/15" />
            <div className="mt-4 h-9 rounded-xl bg-current/10" />
            <div className="mt-3 h-9 rounded-xl bg-current/10" />
            <div className="mt-3 h-9 rounded-xl bg-current/10" />
          </div>
          <div className="flex-1 p-3">
            <div className="h-4 w-28 rounded-full bg-current/15" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="h-16 rounded-2xl bg-current/10" />
              <div className="h-16 rounded-2xl bg-current/10" />
            </div>
            <div className="mt-3 h-12 rounded-2xl bg-current/10" />
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-[#17141a]">{title}</h2>
          {active ? <span className="rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-white">Active</span> : null}
        </div>
        <p className="mt-2 text-sm leading-6 text-[#6f6a75]">{description}</p>
      </div>
    </button>
  );
}

export function AdminPreferencesPanel() {
  const { theme, setTheme } = useAdminTheme();

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-[#e3e7f0] bg-white shadow-[0_14px_30px_rgba(35,31,32,0.04)]">
        <div className="border-b border-[#edf0f6] bg-[#fafbfe] px-5 py-5 sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#9793a0]">Preferences</p>
          <h1 className="mt-2 text-[1.75rem] font-semibold tracking-tight text-[#17141a] sm:text-[2rem]">Admin Workspace Theme</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f6a75]">Choose the visual theme that feels best for daily admin work. This preference is saved on this browser.</p>
        </div>

        <div className="grid gap-5 px-5 py-5 sm:px-6 xl:grid-cols-2">
          <ThemeCard
            title="Dark"
            description="Lower glare with darker surfaces for longer CRM, accounting, and admin sessions."
            active={theme === "dark"}
            onClick={() => setTheme("dark")}
            previewClassName="border-[#222834] bg-[#0f131a] text-[#eef2f8]"
          />
          <ThemeCard
            title="Light"
            description="Keep the current brighter workspace with clean white surfaces and lighter contrast."
            active={theme === "light"}
            onClick={() => setTheme("light")}
            previewClassName="border-[#e3e7f0] bg-[#ffffff] text-[#17141a]"
          />
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-[#e3e7f0] bg-white p-5 shadow-[0_12px_26px_rgba(35,31,32,0.04)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9793a0]">Current Setting</p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-[#17141a]">{theme === "dark" ? "Dark theme enabled" : "Light theme enabled"}</p>
          </div>
          <div className="flex gap-3">
            <Button variant={theme === "dark" ? "primary" : "secondary"} className="rounded-xl px-4 py-2.5 normal-case tracking-normal" onClick={() => setTheme("dark")}>
              Use Dark
            </Button>
            <Button variant={theme === "light" ? "primary" : "secondary"} className="rounded-xl px-4 py-2.5 normal-case tracking-normal" onClick={() => setTheme("light")}>
              Use Light
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
