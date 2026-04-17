type FormVisualPanelProps = {
  kicker: string;
  title: string;
  description: string;
  imagePath: string;
  footerLabel: string;
};

export function FormVisualPanel({
  kicker,
  title,
  description,
  imagePath,
  footerLabel,
}: FormVisualPanelProps) {
  return (
    <div className="relative isolate min-h-[320px] overflow-hidden bg-[#1f1a1b] sm:min-h-[420px] lg:min-h-full">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: `url(${imagePath})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,17,0.2),rgba(20,16,17,0.76)),linear-gradient(135deg,rgba(237,35,37,0.18),transparent_42%,rgba(255,255,255,0.08))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:36px_36px] opacity-25" />
      <div className="relative flex h-full flex-col justify-end px-6 py-10 text-white sm:px-8 sm:py-12 lg:px-10 lg:py-14">
        <span className="inline-flex w-fit items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/88 backdrop-blur">
          {kicker}
        </span>
        <div className="mt-5 max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 text-sm leading-6 text-white/76 sm:text-base">{description}</p>
        </div>
        <div className="mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-white/18 bg-black/18 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand)]" />
          {footerLabel}
        </div>
      </div>
    </div>
  );
}
