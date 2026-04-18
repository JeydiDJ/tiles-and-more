"use client";

export function AnimatedPresence({
  open,
  children,
  spaced = false,
}: {
  open: boolean;
  children: React.ReactNode;
  spaced?: boolean;
}) {
  return (
    <div className={`crm-form-presence ${spaced ? "is-spaced" : ""}`.trim()} data-open={open ? "true" : "false"}>
      <div className="crm-form-presence-inner">{children}</div>
    </div>
  );
}
