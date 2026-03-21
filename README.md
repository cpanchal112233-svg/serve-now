# ServeNow

Full-stack service operations app: public booking, customer tracking and invoices, admin dispatch and billing, technician status updates and completion reports.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Auth.js · Prisma · PostgreSQL · dotLottie hero (with SVG fallback).

## Prerequisites

- Node.js 20+
- PostgreSQL

## Setup

1. **Environment**

   ```bash
   cp .env.example .env
   ```

   Set:

   - `DATABASE_URL` — Postgres connection string (for [Neon](https://neon.tech), use the **pooled** / pooler host)
   - `DIRECT_URL` — Same DB over a **direct** (non-pooler) connection. For local Postgres, copy the same value as `DATABASE_URL`. For Neon, use the **unpooled** connection string (required so `prisma migrate` works with PgBouncer). See [Neon + Prisma](https://neon.tech/docs/guides/prisma).
   - `AUTH_SECRET` — e.g. `openssl rand -base64 32`
   - `AUTH_URL` — `http://localhost:3000` locally; your production URL on Vercel (used for password-reset links)

   **Security:** Never commit real passwords. Add `.env` / `.env.local` only on your machine and in Vercel **Environment Variables**. If a connection string was exposed, rotate the password in the Neon dashboard.

2. **Database**

   ```bash
   npm install
   npx prisma migrate dev
   ```

   Production / CI: `npx prisma migrate deploy`

3. **Seed demo data**

   ```bash
   npm run db:seed
   ```

4. **Hero animation (optional network)**

   ```bash
   node scripts/fetch-hero-lottie.mjs
   ```

   If this fails (firewall, offline), the homepage uses `public/hero/servenow-hero.svg`. You can also place any `.lottie` file at `public/animations/servenow-hologram.lottie`.

5. **Run**

   ```bash
   npm run dev
   ```

## Demo logins (password: `demo123`)

| Role        | Email                      |
|------------|----------------------------|
| Admin      | `admin@servenow.demo`      |
| Customer   | `customer@servenow.demo`   |
| Technician | `ali.raza@servenow.demo`   |

Also: `hassan.malik@servenow.demo`, `sara.khan@servenow.demo`

## Feature coverage (weeks 1–4)

- **Public:** Home, services, book (guest account creation), confirmation, track job, login, signup, forgot/reset password
- **Customer:** Dashboard, bookings, invoices, profile (name/phone), change password
- **Admin:** Dashboard metrics, dispatch board, jobs with status filter, technicians, create invoice from completed jobs, invoice payment status
- **Technician:** Dashboard, assigned jobs, quick status (en route / start work), completion report
- **API:** Bookings, status updates, dispatch, technicians, services, invoices (create + patch payment)

## Deploy (Vercel)

In the Vercel project, set `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, and `AUTH_URL` (your production site URL). Build: `npm run build`.

Route protection uses **Edge middleware** with `getToken` from Auth.js (JWT only) so the bundle stays under Vercel’s Edge size limit. Do **not** import `auth` from `lib/auth` in `middleware.ts` — that pulls Prisma and exceeds the limit ([Vercel Edge Function limits](https://vercel.com/docs/functions/runtimes/edge#limits)).

For Neon, paste the pooler URL into `DATABASE_URL` and the direct URL into `DIRECT_URL` (same names as in `.env.example`).

## Troubleshooting

**“Can’t reach database server at `localhost:5432`”** — Postgres is not running locally, or `.env` still points at localhost. Use your hosted DB (e.g. Neon) in `DATABASE_URL` / `DIRECT_URL`, or start Postgres locally, then run `npx prisma migrate deploy` and `npm run db:seed`. The homepage shows a yellow notice if the DB is unreachable instead of a hard error.

Password reset emails are not sent by default. In **development**, `POST /api/auth/forgot-password` returns `resetUrl` in the JSON for testing. In **production**, configure email or integrate your provider using the same token fields on `User`.
