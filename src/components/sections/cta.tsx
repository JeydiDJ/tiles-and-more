import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-md bg-[var(--brand-dark)] px-8 py-12 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Visit Or Inquire</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">Invite visitors to begin the conversation with confidence.</h2>
          <p className="mt-4 max-w-2xl text-white/75">
            The close of the page should feel polished and service-led: showroom visit, product inquiry, or quote request, with clear location and contact details.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/contact">
              <Button className="bg-white text-[var(--brand-dark)] hover:bg-[#f8f1ea]">
                Visit the Showroom
              </Button>
            </Link>
            <Link href="/quote">
              <Button variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
