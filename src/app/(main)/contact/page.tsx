import { ContactForm } from "@/components/forms/contact-form";
import { InquiryCart } from "@/components/forms/inquiry-cart";

export default function ContactPage() {
  return (
    <section className="page-section py-20 sm:py-24">
      <div className="grid gap-0 border-y border-[var(--border)] lg:grid-cols-[1.15fr_0.85fr]">
        <ContactForm />
        <InquiryCart />
      </div>
    </section>
  );
}
