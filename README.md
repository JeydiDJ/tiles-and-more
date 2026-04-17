# TILES & MORE

TILES & MORE is a production Next.js showroom and catalog website for tile, surface, flooring, and sanitary products. It is already deployed through Vercel and serves as both a public-facing brand site and a lightweight private admin workspace for managing catalog content.

Live site: [https://tiles-and-more.vercel.app/](https://tiles-and-more.vercel.app/)

## Overview

The site is built around two main experiences:

- A public marketing and catalog site for browsing brands, categories, products, collections, gallery content, and inquiry forms.
- A protected admin area for authenticated product management backed by Supabase.

The frontend is built with Next.js App Router, TypeScript, Tailwind CSS 4, and React 19. Product data can be read from Supabase when environment variables are present, with local data fallbacks still available in parts of the codebase as a safety net during development.

## What The Site Includes

### Public site

- Homepage with fullscreen branded hero slideshow
- Brand-specific hero captions and catalog deep links
- Catalog page with search, brand filtering, category filtering, material filtering, finish filtering, and application filtering
- Category catalog pages with product image cards
- Product detail pages with gallery and product specs
- Collections page
- Gallery page
- About page
- Contact page with EmailJS-powered inquiry form
- Quote page with EmailJS-powered quote request form
- Privacy policy and terms pages
- Floating return-to-top button on the home and catalog pages

### Admin site

- Hidden admin entry path controlled by `ADMIN_SECRET_PATH`
- Supabase Auth login flow
- Admin dashboard
- Product listing
- New product creation
- Product editing
- Product deletion
- Category, collection, gallery, and inquiry admin sections

### Content and interaction work already implemented

- Homepage hero slideshow with RAK, Roca, Geo Tiles, and Sonite slides
- Brand-specific `Browse` CTA buttons that pre-filter the catalog
- Catalog redirect behavior that scrolls users directly into the filters/results section
- Product cards that are fully clickable, image-led, and hover-reactive
- Category browsing section on the main catalog page
- Contact and quote forms with finalized left-panel copy instead of placeholder text

## Tech Stack

- Next.js 16.2.3
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- Supabase
- EmailJS
- Vercel
- ESLint

## Architecture Summary

### App structure

```text
src/
  app/
    (main)/        Public storefront routes
    (admin)/       Admin routes and admin layout
    api/           API endpoints for products, inquiries, and uploads
  components/
    admin/         Admin UI
    catalog/       Category browsing UI
    forms/         Contact and quote form UI
    layout/        Navbar, footer, scroll-to-top, intro shell
    product/       Product grid, cards, gallery, filters, specs
    sections/      Homepage sections
    ui/            Shared primitives
  config/          Site metadata and nav config
  data/            Local fallback/mock content
  lib/             Utilities, EmailJS, Supabase helpers, validation
  services/        Data access layer
  store/           Client-side catalog filters
  styles/          Additional animation styles
  types/           Shared TypeScript types
public/
  hero-images/
  hero-videos/
  logo/
  favicon/
```

### Route map

#### Public routes

- `/`
- `/about`
- `/catalog`
- `/catalog/[category]`
- `/products/[slug]`
- `/collections`
- `/gallery`
- `/contact`
- `/quote`
- `/privacy`
- `/terms`

#### Admin routes

- `/{ADMIN_SECRET_PATH}`
- `/{ADMIN_SECRET_PATH}/products`
- `/{ADMIN_SECRET_PATH}/products/new`
- `/{ADMIN_SECRET_PATH}/products/[id]`
- `/{ADMIN_SECRET_PATH}/categories`
- `/{ADMIN_SECRET_PATH}/collections`
- `/{ADMIN_SECRET_PATH}/gallery`
- `/{ADMIN_SECRET_PATH}/inquiries`
- `/admin-login`

## Data and Integrations

### Supabase

The project is already wired to read product data from Supabase when the required environment variables are present.

Current live-facing Supabase usage includes:

- Reading products from the `products` table
- Joining related `brands`, `categories`, and `product_families`
- Reading `product_media` for product detail galleries
- Using Supabase Auth to protect admin actions
- Creating products from the admin interface
- Uploading product imagery and saving image URLs for catalog display

Fallback behavior:

- If Supabase environment variables are missing, some services fall back to local data in `src/data`
- This helps local development continue even when the database is unavailable

Relevant files:

- [product.service.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/services/product.service.ts)
- [server.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/lib/supabase/server.ts)
- [config.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/lib/supabase/config.ts)
- [actions.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/app/%28admin%29/admin/products/actions.ts)

## Database Schema (ERD)

The Supabase database structure for this project is documented separately for clarity and maintainability.

It includes:

- Full entity relationship diagram (ERD)
- Table structures and fields
- Relationships between catalog, CRM, and project lead modules
- Notes on constraints and design decisions

View the full documentation here:

https://github.com/JeydiDJ/tiles-and-more/docs/supabase-erd-documentation.md


### EmailJS

The contact and quote forms send email through EmailJS on the client side.

Implemented flows:

- Contact inquiry submission
- Quote request submission

Relevant file:

- [emailjs.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/lib/emailjs.ts)

Expected template params:

- Contact template:
  `form_type`, `name`, `email`, `phone`, `message`
- Quote template:
  `form_type`, `full_name`, `email`, `phone`, `project_name`, `project_type`, `square_footage`, `message`

### Vercel

The site is already deployed through Vercel and is currently accessible at:

- [https://tiles-and-more.vercel.app/](https://tiles-and-more.vercel.app/)

The codebase is structured so local development and production deployment use the same Next.js app.

## Catalog Behavior

The catalog experience currently supports:

- Free-text search
- Brand filtering
- Category filtering
- Material filtering
- Finish filtering
- Application filtering
- Brand-directed entry from homepage hero slides
- Deep-link navigation into the results section via `#catalog-results`

Product cards now include:

- Main product image
- Product name
- Brand name
- Product summary
- Product code
- Full-card click behavior linking to the product detail page
- Hover motion and image zoom treatment

## Homepage Behavior

The homepage includes a large branded slideshow with dedicated content for:

- RAK Ceramics
- Roca
- Geo Tiles
- Sonite

Each slide includes:

- Brand logo
- Personalized fine print
- `Browse` CTA
- Redirect to the catalog page with the correct brand filter already applied

## Environment Variables

Typical local environment values:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID=your_contact_template_id
NEXT_PUBLIC_EMAILJS_QUOTE_TEMPLATE_ID=your_quote_template_id

ADMIN_SECRET_PATH=your-hidden-admin-segment
```

Notes:

- `ADMIN_SECRET_PATH` controls the hidden public-facing admin route segment.
- If Supabase vars are missing, product reads may fall back to local data.
- If EmailJS vars are missing, contact and quote form submission will fail.

## Local Development

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

### Production build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Important Files

### Core config

- [package.json](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/package.json)
- [next.config.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/next.config.ts)
- [site.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/config/site.ts)

### Public UI

- [hero.tsx](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/components/sections/hero.tsx)
- [catalog-search.tsx](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/components/product/catalog-search.tsx)
- [product-card.tsx](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/components/product/product-card.tsx)
- [scroll-to-top-button.tsx](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/components/layout/scroll-to-top-button.tsx)

### Forms

- [contact-form.tsx](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/components/forms/contact-form.tsx)
- [quote-form.tsx](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/components/forms/quote-form.tsx)
- [form-visual-panel.tsx](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/components/forms/form-visual-panel.tsx)

### Admin

- [admin-login\page.tsx](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/app/admin-login/page.tsx)
- [admin-path.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/lib/admin-path.ts)
- [actions.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/app/%28admin%29/admin/products/actions.ts)

## Current State

The site is no longer just a static concept build. It already has:

- A deployed public storefront
- Live production domain
- Supabase-aware product services
- Supabase Auth-protected admin product creation flow
- Supabase-hosted product imagery
- EmailJS-powered public inquiry forms
- Updated brand-led homepage interactions
- Catalog image cards and improved product browsing behavior

Some parts of the repo still show an in-progress transition pattern:

- Local fallback datasets still exist in `src/data`
- Some API endpoints are scaffold-like and may not be central to the current production flow
- Some admin sections are present structurally before being fully operationalized

## Recommended Next Documentation Additions

If this README keeps evolving, the next useful additions would be:

1. A Supabase schema section listing exact tables and columns in production
2. A deployment section with Vercel project/environment guidance
3. A content operations guide for adding brands, products, and images
4. A troubleshooting section for common issues like missing env vars, image host config, or EmailJS failures

## Maintainer Notes

When updating homepage slides:

- Store logos in `public/logo/brand-logos`
- Store hero backgrounds in `public/hero-images` or `public/hero-videos`
- Update [hero.tsx](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/src/components/sections/hero.tsx)

When updating product imagery:

- Product card images and product detail galleries can use Supabase-hosted media
- Remote image hosts must remain allowed in [next.config.ts](/D:/Passion%20Projects/TILESANDMORE/tiles-and-more/next.config.ts)

When updating forms:

- Keep EmailJS template variables aligned with `src/lib/emailjs.ts`
- Keep left-panel form copy final and client-facing, not placeholder guidance
