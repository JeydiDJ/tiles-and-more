import { QuoteForm } from "@/components/forms/quote-form";

export default function QuotePage() {
  return (
    <section className="page-section py-20 sm:py-24">
      <div className="mx-[-1.5rem] sm:mx-[-2rem] lg:mx-0">
        <QuoteForm />
      </div>
    </section>
  );
}
