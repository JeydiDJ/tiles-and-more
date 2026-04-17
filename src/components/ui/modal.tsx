"use client";

type ModalProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  children?: React.ReactNode;
};

export function Modal({ open, title, description, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-8">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(17,14,15,0.55)] backdrop-blur-[2px]"
      />
      <div className="relative z-10 w-full max-w-md rounded-[1.25rem] border border-[#231f20]/10 bg-white p-6 shadow-[0_28px_80px_rgba(35,31,32,0.22)] sm:p-7">
        <h3 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  );
}
