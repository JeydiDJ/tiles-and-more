import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  return (
    <form className="bg-white px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
      <p className="page-kicker">Contact</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-tight">Start Your Inquiry</h2>
      <div className="mt-5 grid gap-4">
        <Input placeholder="Full name" />
        <Input type="email" placeholder="Email address" />
        <Textarea placeholder="Tell us about your project" />
        <Button type="submit" className="mt-2 w-full bg-[var(--brand)] px-6 py-4 hover:bg-[#c61d1f] sm:w-auto">
          Send Inquiry
        </Button>
      </div>
    </form>
  );
}
