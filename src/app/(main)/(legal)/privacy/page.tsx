import { Container } from "@/components/layout/container";

export default function PrivacyPage() {
  return (
    <Container className="py-20">
      <div className="surface-card rounded-[2rem] p-8">
        <h1 className="text-4xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 text-[var(--muted)]">
          Add your data handling, cookies, and inquiry retention policy here.
        </p>
      </div>
    </Container>
  );
}
