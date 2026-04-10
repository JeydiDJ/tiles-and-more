# Tiles & More

Tiles & More is a Next.js 16 showroom and catalog site for surfacing products, sanitary products, and related brands. The repository currently includes a public-facing marketing/catalog experience, a lightweight admin area, mock API routes, and a Supabase-ready data direction that is not fully wired into the app yet.

## Current Status

- Public storefront pages are in place for home, catalog, collections, gallery, about, contact, quote, privacy, and terms.
- Admin pages exist for categories, collections, gallery, inquiries, and products.
- The homepage hero includes brand-led slides, including the latest `Geo Tiles` slide wired to assets in `public/logo/brand-logos` and `public/hero-images`.
- Featured collection cards have a hover lift interaction and white card titles for better contrast.
- The footer is now a solid dark grey block.
- The app still uses local mock data in `src/data` and service placeholders in `src/services`.
- Supabase schema planning is underway, but the frontend is not yet reading from Supabase.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Embla Carousel
- ESLint

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

Current env file:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`src/lib/db.ts` is still a placeholder and does not yet return a live Supabase client.

## Project Structure

```text
src/
  app/
    (main)/        Public storefront routes
    (admin)/       Admin routes and admin layout
    api/           Mock API endpoints for products, inquiries, and uploads
  components/
    admin/         Admin UI pieces
    catalog/       Catalog/category UI
    forms/         Contact, quote, inquiry cart
    layout/        Navbar, footer, shared layout components
    product/       Product grid, gallery, filters, specs
    sections/      Homepage sections
    ui/            Shared primitives
  config/          Site and navigation config
  data/            Temporary mock data source
  lib/             Utilities, validation, DB placeholder
  services/        Data access layer, currently reading from mock data
  store/           Client-side filter/cart state
  styles/          Extra CSS animations
  types/           Shared TypeScript types
public/
  hero-images/
  logo/brand-logos/
```

## Data Layer Today

The current app is still backed by static arrays:

- [products.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/data/products.ts)
- [categories.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/data/categories.ts)
- [collections.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/data/collections.ts)
- [gallery.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/data/gallery.ts)

Services currently proxy those local datasets:

- [product.service.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/services/product.service.ts)
- [category.service.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/services/category.service.ts)
- [inquiry.service.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/services/inquiry.service.ts)
- [db.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/lib/db.ts)

This means:

- product and category data are mock-only
- inquiries are in-memory only
- uploads are placeholder-only
- restarts reset non-file-backed data

## Finalized Catalog Taxonomy

The agreed top-level categories are:

- `tiles`
- `quartz-slabs`
- `decorative-surfaces`
- `specialty-flooring`
- `sanitary`
- `lifestyle-accessories`

Product families under them:

- `tiles`
  - `porcelain-tiles`
  - `ceramic-tiles`
  - `large-format-tiles`
  - `outdoor-tiles`
- `quartz-slabs`
  - `quartz-slabs`
- `decorative-surfaces`
  - `mosaics`
  - `feature-panels`
  - `textured-surfaces`
- `specialty-flooring`
  - `laminate-flooring`
  - `spc-flooring`
  - `lvt-flooring`
  - `carpet-tiles`
- `sanitary`
  - `sinks`
  - `water-closets`
  - `faucets`
  - `showers`
  - `bidets`
  - `accessories`
- `lifestyle-accessories`
  - `mugs`
  - `coasters`

This taxonomy supports two key browse modes:

- by brand, regardless of category
- by category or family, regardless of brand

## Finalized Product Schema Direction

Target product shape:

```ts
type Product = {
  id: string;
  productCode: string;
  name: string;
  slug: string;
  brandId: string;
  category: string;
  productFamily: string;
  applications?: string[];
  material?: string;
  finish?: string;
  image: string;
  summary: string;
};
```

Notes:

- `applications` is for installation/use contexts like `floor`, `wall`, `bathroom`, or `outdoor`
- `applications` can be omitted or empty for non-installation products like mugs or coasters
- `productCode` is required because the client confirmed every product has one
- `dimensions` was intentionally removed from the agreed schema

## Supabase Direction

Current intended tables:

- `brands`
- `categories`
- `product_families`
- `products`

Current database shape already created in Supabase:

- `brands`
- `categories`
- `product_families`
- `products`

Current known brands:

- Geo Tiles
- RAK
- Roca
- Sonite
- Tajima
- Quickstep
- Aica
- Sangetsu
- American Standard
- HCG

Recommended next integration steps:

1. Seed categories, product families, and brands in Supabase.
2. Add public read policies if using Supabase directly from the frontend.
3. Replace `src/data/*` with Supabase-backed service functions.
4. Update product/category types to match the finalized schema.
5. Migrate admin forms and API routes to create and update real Supabase records.

## API Routes

Current routes:

- `GET /api/products`
- `GET /api/inquiries`
- `POST /api/inquiries`
- `POST /api/upload`

These are currently mock-oriented and should be treated as temporary scaffolding.

## Important Repo Notes

- The public site and admin area are presentationally ahead of the data layer.
- There may be duplicate or transitional route structure in `src/app/(admin)` while the admin area is being shaped.
- The repo has already been verified to build successfully with:

```bash
npm run build
```

## Priority Next Steps

1. Replace placeholder DB access with a real Supabase client.
2. Align `src/types/product.ts` and `src/types/category.ts` with the finalized taxonomy.
3. Normalize mock data to use `brandId`, `category`, `productFamily`, and `productCode`.
4. Wire admin product creation/editing to Supabase.
5. Add brand-based and family-based filtering to the storefront catalog UI.

## Maintainer Notes

When adding new products:

- always assign a `brandId`
- always assign one strict top-level `category`
- always assign one strict `productFamily`
- include `productCode`
- use `applications` only when the product has a real installation/use context

When adding new brand hero slides:

- place logos in `public/logo/brand-logos`
- place backgrounds in `public/hero-images`
- update [hero.tsx](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/components/sections/hero.tsx)
