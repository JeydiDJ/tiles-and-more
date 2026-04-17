import Link from "next/link";
import { getAdminRoute } from "@/lib/admin-path";
import { getCategories } from "@/services/category.service";
import { getProducts } from "@/services/product.service";

function MetricLink({
  label,
  value,
  note,
  href,
  cta,
}: {
  label: string;
  value: string;
  note: string;
  href: string;
  cta: string;
}) {
  return (
    <Link href={href} className="block border-b border-[var(--border)] pb-5 transition hover:text-[var(--brand)]">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[#231f20]">{value}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{note}</p>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">{cta}</p>
    </Link>
  );
}

function ActionList({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; href: string; meta: string }>;
}) {
  return (
    <section>
      <h2 className="text-sm uppercase tracking-[0.2em] text-[var(--brand)]">{title}</h2>
      <div className="mt-4 grid gap-0">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="grid gap-1 border-b border-[var(--border)] py-4 transition hover:pl-2"
          >
            <span className="font-medium text-[#231f20]">{item.label}</span>
            <span className="text-sm text-[var(--muted)]">{item.meta}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function AdminDashboardPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const recentProducts = products.slice(0, 5);

  return (
    <div className="grid gap-10">
      <section className="border-b border-[var(--border)] pb-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--brand)]">Dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#231f20] sm:text-5xl">Admin Overview</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Start here to manage catalog content, move between sections, and review what has already been added.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={getAdminRoute("/products/new")}
              className="inline-flex items-center justify-center rounded-sm bg-[var(--brand)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[#c81a1d]"
            >
              Add Product
            </Link>
            <Link
              href={getAdminRoute("/products")}
              className="inline-flex items-center justify-center rounded-sm border border-[var(--border)] bg-white px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-[#231f20] transition hover:border-[#ed2325]/30 hover:text-[var(--brand)]"
            >
              Manage Products
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <MetricLink
          label="Products"
          value={String(products.length)}
          note={products.length > 0 ? "Catalog entries available." : "No products added yet."}
          href={getAdminRoute("/products")}
          cta="Open products"
        />
        <MetricLink
          label="Categories"
          value={String(categories.length)}
          note="Configured category structure."
          href={getAdminRoute("/categories")}
          cta="Open categories"
        />
      </section>

      <section className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-10">
          <section>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-sm uppercase tracking-[0.2em] text-[var(--brand)]">Recent Products</h2>
              <Link href={getAdminRoute("/products")} className="text-sm font-medium text-[var(--brand)]">
                View all
              </Link>
            </div>

            {recentProducts.length > 0 ? (
              <div className="mt-4 grid gap-0">
                {recentProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={getAdminRoute(`/products/${product.id}`)}
                    className="grid gap-1 border-b border-[var(--border)] py-4 transition hover:pl-2"
                  >
                    <span className="font-medium text-[#231f20]">{product.name}</span>
                    <span className="text-sm text-[var(--muted)]">
                      {product.productCode} · {product.brandName} · {product.category}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-4 border-b border-[var(--border)] py-4 text-sm text-[var(--muted)]">No products added yet.</div>
            )}
          </section>

          <ActionList
            title="Catalog Workflow"
            items={[
              {
                label: "Create new product",
                href: getAdminRoute("/products/new"),
                meta: "Add a catalog item with brand, category, family, and image URL.",
              },
              {
                label: "Review category structure",
                href: getAdminRoute("/categories"),
                meta: "Check the categories that control family selection in the form.",
              },
            ]}
          />
        </div>

        <div className="grid gap-10">
          <ActionList
            title="Quick Navigation"
            items={[
              {
                label: "Products",
                href: getAdminRoute("/products"),
                meta: "Manage product entries and catalog content.",
              },
              {
                label: "Inquiries",
                href: getAdminRoute("/inquiries"),
                meta: "Open lead and quote management.",
              },
            ]}
          />

          <ActionList
            title="Next Steps"
            items={[
              {
                label: "Enable product editing",
                href: getAdminRoute("/products"),
                meta: "Complete the edit flow after content entry begins.",
              },
              {
                label: "Expand live admin data",
                href: getAdminRoute("/categories"),
                meta: "Continue wiring more admin sections to live Supabase data.",
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
