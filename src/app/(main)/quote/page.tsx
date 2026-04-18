import { QuoteForm } from "@/components/forms/quote-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Request Quote",
  description:
    "Request a quote from Tiles & More for tile, surface, and sanitary requirements for residential or commercial spaces.",
  path: "/quote",
  keywords: ["request tile quote", "surface quote pampanga", "sanitary quote"],
});

export default function QuotePage() {
  return (
    <section className="page-section py-20 sm:py-24">
      <div className="mx-[-1.5rem] sm:mx-[-2rem] lg:mx-0">
        <QuoteForm />
      </div>
    </section>
  );
}
