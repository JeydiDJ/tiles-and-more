import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  return (
    <form className="surface-card rounded-md p-6">
      <h2 className="text-2xl font-semibold">Contact Form</h2>
      <div className="mt-5 grid gap-4">
        <Input placeholder="Full name" />
        <Input type="email" placeholder="Email address" />
        <Textarea placeholder="Tell us about your project" />
        <Button type="submit">Send Inquiry</Button>
      </div>
    </form>
  );
}
