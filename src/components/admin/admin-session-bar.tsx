import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/(admin)/admin/actions";

type AdminSessionBarProps = {
  email?: string;
  compact?: boolean;
};

export function AdminSessionBar({ email, compact = false }: AdminSessionBarProps) {
  return (
    <div className={cn("text-sm text-[#6f6a75]", compact && "text-center")}>
      {!compact ? <p className="text-xs uppercase tracking-[0.22em] text-[#9793a0]">Session</p> : null}
      <p className={cn("font-medium text-[#17141a]", compact ? "text-xs uppercase tracking-[0.14em]" : "mt-2")}>
        {compact ? "User" : email ?? "Signed in"}
      </p>
      {!compact && email ? <p className="mt-1 truncate text-xs text-[#6f6a75]">{email}</p> : null}
      <form action={logoutAction} className="mt-3">
        <button
          type="submit"
          className={cn(
            "inline-flex cursor-pointer items-center justify-center text-xs font-medium uppercase tracking-[0.14em] text-[#17141a] transition hover:text-[var(--brand)]",
            compact ? "rounded-full border border-[#e7e9f2] px-3 py-2 hover:border-[#cfd5e2]" : "border-b border-[#17141a]/25 px-0 py-2 hover:border-[var(--brand)]",
          )}
        >
          {compact ? "Out" : "Sign Out"}
        </button>
      </form>
    </div>
  );
}
