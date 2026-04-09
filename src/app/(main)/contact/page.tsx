import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/forms/contact-form";
import { InquiryCart } from "@/components/forms/inquiry-cart";

export default function ContactPage() {
  return (
    <Container className="grid gap-8 py-20 lg:grid-cols-[1fr_360px]">
      <ContactForm />
      <InquiryCart />
    </Container>
  );
}
