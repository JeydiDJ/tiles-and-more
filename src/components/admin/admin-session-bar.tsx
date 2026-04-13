import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/(admin)/admin/actions";

type AdminSessionBarProps = {
  email?: string;
  compact?: boolean;
};

export function AdminSessionBar({ email, compact = false }: AdminSessionBarProps) {
  return (
    <div className={cn("border-t border-white/20 pt-5 text-sm text-white/78", compact && "text-center")}>
      {!compact ? <p className="text-xs uppercase tracking-[0.22em] text-white/58">Session</p> : null}
      <p className={cn("font-medium text-white", compact ? "text-xs uppercase tracking-[0.14em]" : "mt-2")}>
        {compact ? "User" : email ?? "Signed in"}
      </p>
      {!compact && email ? <p className="mt-1 truncate text-xs text-white/65">{email}</p> : null}
      <form action={logoutAction} className="mt-3">
        <button
          type="submit"
          className={cn(
            "inline-flex items-center justify-center text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:border-white hover:text-white",
            compact ? "rounded-full border border-white/22 px-3 py-2" : "border-b border-white/55 px-0 py-2",
          )}
        >
          {compact ? "Out" : "Sign Out"}
        </button>
      </form>
    </div>
  );
}
