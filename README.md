# TILES & MORE

TILES & MORE is a production Next.js 16 application that combines a public-facing showroom website with a private admin workspace for catalog operations, CRM, reporting, and accounting.

Live site: [https://tiles-and-more.vercel.app/](https://tiles-and-more.vercel.app/)

## What This Project Is

The codebase supports two connected experiences:

- A public brand and product website for browsing categories, products, collections, projects, and contact paths.
- A protected admin workspace for managing products, CRM accounts and contacts, opportunities, reports, accounting periods, and workspace preferences.

The current app is not just a storefront anymore. It now behaves like an operational platform for Tiles & More, with Supabase-backed catalog and CRM services, protected admin routes, reporting views, and accounting support.

## Current Product Surface

### Public website

- Homepage with branded hero media and guided catalog entry
- About page
- Catalog page with search and multi-filter browsing
- Category pages at `/catalog/[category]`
- Product detail pages at `/products/[slug]`
- Collections page
- Projects showcase page
- Gallery page
- Contact page
- Quote request page
- Privacy and terms pages

### Admin workspace

- Hidden admin route controlled by `ADMIN_SECRET_PATH`
- Supabase-authenticated admin shell
- Dashboard with catalog and CRM health snapshots
- Reports workspace spanning catalog, CRM, accounting, and leads
- Product management
- Category management
- CRM workspace for accounts, contacts, and opportunities
- Global contacts search inside CRM
- CRM opportunity detail pages with activity and attachments
- Accounting workspace
- CRM calendar view
- Preferences panel

## Key Behaviors In The Current Build

### Catalog and storefront

- Homepage hero directs users into pre-filtered catalog experiences
- Catalog supports free-text search plus brand, category, material, finish, and application filters
- Product cards are fully clickable and lead into detailed product pages
- Product pages support media galleries and spec presentation
- Projects page showcases completed work
- Contact and quote forms are production-facing and use EmailJS

### CRM and operations

- Accounts and opportunities are managed in a dedicated CRM workspace
- Contacts are modeled separately from accounts and can carry multiple phone numbers and multiple emails
- CRM now includes a global `Contacts` tab so admin can search all contacts regardless of account or opportunity context
- Opportunities support stage tracking, quotation status, notes, activity logs, and file attachments
- The admin dashboard summarizes open pipeline value, quotation bottlenecks, stalled opportunities, catalog coverage, and recent CRM activity

### Reporting and accounting

- Reports aggregate product, CRM, inquiry, project lead, and accounting data
- Accounting periods are managed in the admin accounting workspace
- CRM calendar view visualizes opportunity activity timing from the current opportunity dataset

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

```text
src/
  app/
    (main)/        Public site routes
    (admin)/       Private admin workspace
    api/           API handlers for products, inquiries, and uploads
  components/
    admin/         Admin shell, CRM, reports, accounting, product tools
    catalog/       Catalog category browsing UI
    forms/         Contact and quote forms
    layout/        Shared public layout
    product/       Product cards, gallery, filters, specs
    sections/      Homepage and editorial sections
    ui/            Shared UI primitives
  config/          Navigation and site metadata
  data/            Local fallback content used by some services
  lib/             Auth, SEO, utils, validations, Supabase helpers
  services/        Data access for catalog, CRM, accounting, inquiries, leads
  store/           Client-side catalog filter store
  styles/          Additional animation styles
  types/           Shared TypeScript models
public/
  favicon/
  hero-images/
  hero-videos/
  logo/
```

## Route Map

### Public routes

- `/`
- `/about`
- `/catalog`
- `/catalog/[category]`
- `/products/[slug]`
- `/collections`
- `/projects`
- `/gallery`
- `/contact`
- `/quote`
- `/privacy`
- `/terms`

### Admin routes

- `/{ADMIN_SECRET_PATH}`
- `/{ADMIN_SECRET_PATH}/reports`
- `/{ADMIN_SECRET_PATH}/products`
- `/{ADMIN_SECRET_PATH}/products/new`
- `/{ADMIN_SECRET_PATH}/products/[id]`
- `/{ADMIN_SECRET_PATH}/categories`
- `/{ADMIN_SECRET_PATH}/crm`
- `/{ADMIN_SECRET_PATH}/crm/new`
- `/{ADMIN_SECRET_PATH}/crm/[id]`
- `/{ADMIN_SECRET_PATH}/crm/opportunities/[id]`
- `/{ADMIN_SECRET_PATH}/accounting`
- `/{ADMIN_SECRET_PATH}/calendar`
- `/{ADMIN_SECRET_PATH}/preferences`
- `/admin-login`

Notes:

- The old inquiries route currently redirects into the CRM workspace.
- The admin shell nav is driven by `src/config/nav.ts`.

## Data Layer And Integrations

### Supabase

Supabase is the primary backend for the operational parts of the application.

Current Supabase-backed domains include:

- Catalog products and product media
- CRM accounts
- CRM contacts
- CRM contact phone numbers
- CRM contact emails
- CRM opportunities
- CRM opportunity activity logs
- CRM opportunity attachments
- Accounting periods
- Project leads
- Project lead activity logs
- Project lead attachments
- Supabase Auth for admin access control

Fallback behavior:

- Several services still return local fallback arrays when Supabase is unavailable
- This keeps local development possible, but the intended production mode is Supabase-backed

Relevant services:

- `src/services/product.service.ts`
- `src/services/crm.service.ts`
- `src/services/accounting.service.ts`
- `src/services/project-lead.service.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/config.ts`

### EmailJS

EmailJS is used for public-facing form delivery.

Implemented flows:

- Contact inquiry submission
- Quote request submission

Relevant file:

- `src/lib/emailjs.ts`

### Vercel

The app is deployed on Vercel and uses the same Next.js codebase for local and production environments.

## CRM Snapshot

The CRM currently has three main business entities:

- `crm_accounts`
- `crm_contacts`
- `crm_opportunities`

The contact model is richer than a single phone and email field:

- `crm_contacts` stores the person and account relationship
- `crm_contact_phone_numbers` stores one-to-many phone entries
- `crm_contact_emails` stores one-to-many email entries

The admin CRM workspace now exposes:

- Overview tab
- Accounts tab
- Contacts tab with global cross-account search
- Opportunities tab
- Reports tab

See the full schema reference in [docs/supabase-erd-documentation.md](./docs/supabase-erd-documentation.md).

## Environment Variables

Typical local values:

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

- `ADMIN_SECRET_PATH` controls the hidden admin route prefix.
- Missing Supabase variables will disable database-backed behavior and may trigger local fallback behavior in some services.
- Missing EmailJS variables will break public form submission.

## Local Development

### Install

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Production build

```bash
npm run build
npm run start
```

## Important Files

### Core config

- `package.json`
- `next.config.ts`
- `src/config/site.ts`
- `src/config/nav.ts`

### Public experience

- `src/components/sections/hero.tsx`
- `src/components/sections/project-showcase-grid.tsx`
- `src/components/product/catalog-search.tsx`
- `src/components/product/product-card.tsx`
- `src/components/product/product-gallery.tsx`
- `src/components/forms/contact-form.tsx`
- `src/components/forms/quote-form.tsx`

### Admin experience

- `src/components/admin/admin-shell.tsx`
- `src/components/admin/crm-table.tsx`
- `src/components/admin/crm-account-detail.tsx`
- `src/components/admin/crm-opportunity-detail.tsx`
- `src/components/admin/reports-workspace.tsx`
- `src/components/admin/accounting-workspace.tsx`

### Service layer

- `src/services/product.service.ts`
- `src/services/crm.service.ts`
- `src/services/accounting.service.ts`
- `src/services/project-lead.service.ts`
- `src/services/inquiry.service.ts`

## Documentation Notes

If you update the website or workspace again, keep these two docs in sync first:

- `README.md`
- `docs/supabase-erd-documentation.md`

The most important things to keep current are:

- route coverage
- admin workspace scope
- CRM workflow changes
- schema additions
- environment variable expectations
