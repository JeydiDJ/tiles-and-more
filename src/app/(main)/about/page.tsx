import { Container } from "@/components/layout/container";

export default function AboutPage() {
  return (
    <Container className="py-20">
      <div className="surface-card rounded-[2rem] p-8">
        <h1 className="text-4xl font-semibold">About Tiles & More</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          This page is ready for your showroom story, sourcing philosophy, and installation expertise.
        </p>
      </div>
    </Container>
  );
}
