import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProductForm() {
  return (
    <form className="surface-card rounded-md p-6">
      <h2 className="text-2xl font-semibold">Product Form</h2>
      <div className="mt-5 grid gap-4">
        <Input placeholder="Product name" />
        <Input placeholder="Slug" />
        <Textarea placeholder="Product summary" />
        <Button type="submit">Save Product</Button>
      </div>
    </form>
  );
}
