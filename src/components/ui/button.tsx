import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] transition",
        variant === "primary"
          ? "bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)]"
          : "border border-[var(--border)] bg-[var(--surface)] hover:bg-white",
        className,
      )}
      {...props}
    />
  );
}
