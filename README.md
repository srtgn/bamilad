# SERENIQ — Full-Stack Skincare Store

A launch-ready e-commerce storefront (a clone of the SERENIQ beauty theme) built with
Next.js 16, Prisma 7 + PostgreSQL, Auth.js v5, and Stripe — deployable to Railway.

> **Rebranding:** every brand string lives in [`lib/site-config.ts`](lib/site-config.ts).
> Change `name` there to rename the whole store (e.g. "Bamilad").

## Features

- **Storefront** — home (hero, category carousel, marquee, trending), Shop with a Shop
  mega-menu, category & product pages, About, Blogs (list + article), Contact, cookie consent.
- **Cart** — guest cart via httpOnly cookie, quantity/remove, free-shipping threshold.
- **Auth & accounts** — email/password (Auth.js v5, JWT), required email verification,
  password reset, account area (profile, orders, addresses), `CUSTOMER`/`ADMIN` roles.
- **Checkout** — Stripe Checkout + webhook fulfillment (mark paid, decrement stock, email).
- **Admin** (`/admin`, admin-only) — dashboard metrics, full CRUD for products, categories,
  orders (status), users (role), and blog posts.
- **Launch-ready** — legal pages, SEO (sitemap, robots, Product JSON-LD, Open Graph),
  transactional emails (Resend), 404 + error boundaries.

## Tech stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · Prisma 7 + `@prisma/adapter-pg`
· PostgreSQL · Auth.js v5 · Stripe · Resend · Cloudinary · TypeScript · Zod.

## Local development

**Prerequisites:** Node 20+, Docker (for local Postgres).

```bash
npm install
cp .env.example .env          # then set AUTH_SECRET (openssl rand -base64 32)
docker compose up -d --wait   # local Postgres on host port 5433
npm run db:migrate            # apply migrations
npm run db:seed               # categories, products, blog posts, admin + customer
npm run dev                   # http://localhost:3000
```

**Seeded logins** (from `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env`):

- Admin: `admin@sereniq.test` / `ChangeMe123!`
- Customer: `customer@sereniq.test` / `Password123!`

**Dev conveniences (no third-party keys required):**

- **Email** — without a real `RESEND_API_KEY`, verification/reset links are printed to the
  server console instead of sent.
- **Payments** — without a real `STRIPE_SECRET_KEY`, checkout *simulates* a successful payment
  so the full order flow works locally. Add real keys to switch to live Stripe Checkout.
- **Product images** — left empty in the seed and shown as on-brand placeholders; upload real
  images via the admin (paste Cloudinary URLs).

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | ✅ | Postgres connection string (Railway injects this) |
| `AUTH_SECRET` | ✅ | `openssl rand -base64 32` |
| `AUTH_URL` / `NEXT_PUBLIC_APP_URL` | ✅ | Public base URL (e.g. your Railway domain) |
| `STRIPE_SECRET_KEY` | prod | `sk_test_…` / `sk_live_…` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | prod | `pk_…` |
| `STRIPE_WEBHOOK_SECRET` | prod | `whsec_…` from the webhook endpoint |
| `RESEND_API_KEY` | prod | transactional email |
| `EMAIL_FROM` | prod | verified sender, e.g. `SERENIQ <hello@yourdomain.com>` |
| `CLOUDINARY_URL` | optional | image hosting |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | seed | the seeded admin account |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | optional | reserved for Google OAuth |

## Deploying to Railway

1. **Push to GitHub** (the repo connected to your Railway project).
2. In Railway: **New Project → Deploy from GitHub repo** → select this repo.
3. **Add a PostgreSQL** service (New → Database → PostgreSQL). Railway injects `DATABASE_URL`
   into the app when the services are linked.
4. Set the app **environment variables** from the table above (`AUTH_SECRET`, `AUTH_URL` =
   your Railway URL, Stripe/Resend/Cloudinary keys, `ADMIN_EMAIL`/`ADMIN_PASSWORD`).
5. The included [`railway.json`](railway.json) runs **`npx prisma migrate deploy`** as a
   pre-deploy step (also configurable under Settings → Deploy → Pre-deploy Command).
6. After the first deploy, **seed once** (Railway shell): `npm run db:seed`.
7. **Stripe webhook:** add an endpoint at `https://<your-app>/api/webhooks/stripe` for the
   `checkout.session.completed` event, then put its signing secret in `STRIPE_WEBHOOK_SECRET`.

### Go-live checklist

- [ ] Switch Stripe to **live** keys; webhook points at the production URL.
- [ ] Verify a sending domain in Resend; set `EMAIL_FROM` to it.
- [ ] Set `AUTH_URL` / `NEXT_PUBLIC_APP_URL` to the final domain.
- [ ] Change the seeded admin password.
- [ ] Replace placeholder product imagery and review the legal pages with counsel.

## Useful scripts

```bash
npm run dev          # dev server
npm run build        # prisma generate + production build
npm run db:migrate   # create/apply a migration (dev)
npm run db:deploy    # apply migrations (prod)
npm run db:seed      # seed demo data
npm run db:studio    # Prisma Studio
```
