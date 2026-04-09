import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function QuoteForm() {
  return (
    <form className="surface-card rounded-md p-6">
      <h2 className="text-2xl font-semibold">Request a Quote</h2>
      <div className="mt-5 grid gap-4">
        <Input placeholder="Project name" />
        <Select defaultValue="residential">
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
        </Select>
        <Input placeholder="Estimated square footage" />
        <Textarea placeholder="Share tile styles, quantities, and delivery timeline" />
        <Button type="submit">Submit Quote Request</Button>
      </div>
    </form>
  );
}
