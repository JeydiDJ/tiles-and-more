import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand)]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
