import { Container } from "@/components/layout/container";
import { QuoteForm } from "@/components/forms/quote-form";

export default function QuotePage() {
  return (
    <Container className="py-20">
      <QuoteForm />
    </Container>
  );
}
