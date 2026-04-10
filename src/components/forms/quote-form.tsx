import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function QuoteForm() {
  return (
    <form className="grid gap-0 border-y border-[var(--border)] lg:grid-cols-[0.8fr_1.2fr]">
      <div className="editorial-band px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <p className="page-kicker text-white/70">Quote</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Request a Quote</h2>
        <p className="mt-5 max-w-sm text-white/74">
          Share project type, approximate quantity, and timeline so we can prepare a tailored recommendation.
        </p>
      </div>
      <div className="bg-white px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-4">
          <Input placeholder="Project name" />
          <Select defaultValue="residential">
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </Select>
          <Input placeholder="Estimated square footage" />
          <Textarea placeholder="Share tile styles, quantities, and delivery timeline" />
          <Button type="submit" className="mt-2 w-full bg-[var(--brand)] px-6 py-4 hover:bg-[#c61d1f] sm:w-auto">
            Submit Quote Request
          </Button>
        </div>
      </div>
    </form>
  );
}
