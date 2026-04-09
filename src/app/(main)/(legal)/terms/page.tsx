import { Container } from "@/components/layout/container";

export default function TermsPage() {
  return (
    <Container className="py-20">
      <div className="surface-card rounded-[2rem] p-8">
        <h1 className="text-4xl font-semibold">Terms & Conditions</h1>
        <p className="mt-4 text-[var(--muted)]">
          Add your ordering terms, delivery conditions, and showroom policies here.
        </p>
      </div>
    </Container>
  );
}
