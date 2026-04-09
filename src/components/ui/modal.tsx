type ModalProps = {
  title: string;
  description: string;
};

export function Modal({ title, description }: ModalProps) {
  return (
    <div className="surface-card rounded-md p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}
