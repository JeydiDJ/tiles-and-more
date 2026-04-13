import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-sm border border-[var(--border)] bg-white px-4 py-3 text-[15px] text-[var(--foreground)] outline-none shadow-[0_1px_2px_rgba(35,31,32,0.03)] transition placeholder:text-[#9a9690] hover:border-[#bdbabd] focus:border-[var(--brand)] focus:ring-4 focus:ring-[rgba(237,35,37,0.08)] disabled:cursor-not-allowed disabled:bg-[#f3f3f3] disabled:text-[#8f8b85]",
        className,
      )}
      {...props}
    />
  );
}
