import { Container } from "@/components/layout/container";

const trustPoints = [
  "A curated destination for tiles, stone, quartz, flooring, sanitary fixtures, and furniture pieces.",
  "Support for both walk-in homeowners and larger project requirements with design and estimation guidance.",
  "A strong Pampanga presence that can be positioned as accessible expertise rather than small-scale limitation.",
];

export function Testimonials() {
  return (
    <section className="py-16">
      <Container>
        <div className="mb-8 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--brand-dark)]">Why Choose Us</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">Trust signals that belong on the homepage</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {trustPoints.map((quote) => (
            <blockquote key={quote} className="surface-card rounded-md p-6 text-sm leading-7 text-[var(--muted)]">
              "{quote}"
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
