import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-sm border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand)]",
        className,
      )}
      {...props}
    />
  );
}
