type BadgeProps = {
  children: React.ReactNode;
};

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex rounded-sm bg-[rgba(159,106,61,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-dark)]">
      {children}
    </span>
  );
}
