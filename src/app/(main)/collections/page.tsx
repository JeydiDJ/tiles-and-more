import { collections } from "@/data/collections";
import { Container } from "@/components/layout/container";
import { CollectionsSection } from "@/components/sections/collections";

export default function CollectionsPage() {
  return (
    <Container className="py-20">
      <h1 className="text-4xl font-semibold">Collections</h1>
      <p className="mt-3 text-[var(--muted)]">A dedicated space for signature ranges and curated stories.</p>
      <CollectionsSection collections={collections} />
    </Container>
  );
}
