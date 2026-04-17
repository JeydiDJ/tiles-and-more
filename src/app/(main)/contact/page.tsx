import { ContactForm } from "@/components/forms/contact-form";

export default function ContactPage() {
  return (
    <section className="page-section py-20 sm:py-24">
      <div className="mx-[-1.5rem] sm:mx-[-2rem] lg:mx-0">
        <ContactForm />
      </div>
    </section>
  );
}
