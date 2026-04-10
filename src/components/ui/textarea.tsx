import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand)]",
        className,
      )}
      {...props}
    />
  );
}
