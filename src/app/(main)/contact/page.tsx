import { ContactForm } from "@/components/forms/contact-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Tiles & More for showroom inquiries, product guidance, and project support in Central Luzon.",
  path: "/contact",
  keywords: ["contact tiles and more", "tile showroom pampanga", "project inquiry"],
});

export default function ContactPage() {
  return (
    <section className="page-section py-20 sm:py-24">
      <div className="mx-[-1.5rem] sm:mx-[-2rem] lg:mx-0">
        <ContactForm />
      </div>
    </section>
  );
}
