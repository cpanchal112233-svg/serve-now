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
   - `DATABASE_URL_UNPOOLED` — Same database **without** the pooler (direct host). For local Postgres, use the **same** value as `DATABASE_URL`. For Neon, use the **unpooled** URL (required for `prisma migrate` with PgBouncer). See [Neon + Prisma](https://neon.tech/docs/guides/prisma).
   - `AUTH_SECRET` — e.g. `openssl rand -base64 32`
   - `AUTH_URL` — `http://localhost:3000` locally; your production URL on Vercel (used for password-reset links)

   **Security:** Never commit real passwords. Add `.env` / `.env.local` only on your machine and in Vercel **Environment Variables**. If a connection string was exposed, rotate the password in the Neon dashboard.

   **Sync Neon vars from Vercel (optional):** If the project is linked to Vercel and env vars are already set there, you can pull them for local dev (Prisma still reads `DATABASE_URL` / `DATABASE_URL_UNPOOLED`; you do **not** need `@neondatabase/serverless` unless you add raw SQL alongside Prisma):

   ```bash
   npx vercel link
   npx vercel env pull .env.development.local
   ```

   `.env*` is gitignored (including `.env.development.local`). Merge or copy values into `.env` if you prefer a single file.

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

**Required for this app**

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Pooled Neon URL (Prisma Client) |
| `DATABASE_URL_UNPOOLED` | Direct Neon URL (migrations) — matches Neon’s Vercel integration name |
| `AUTH_SECRET` | Auth.js session encryption — **add manually** if not set (`openssl rand -base64 32`) |
| `AUTH_URL` | Your site URL, e.g. `https://your-project.vercel.app` (password-reset links) |

Build: `npm run build`.

Neon’s integration may also add `POSTGRES_*`, `PGHOST`, `NEON_*`, etc. **ServeNow does not read those** — only `DATABASE_URL` and `DATABASE_URL_UNPOOLED` are used by Prisma (as in `prisma/schema.prisma`).

**Sign-in / sign-up on Vercel:** Neon does **not** add `AUTH_SECRET` or `AUTH_URL`. You must set both. Use your exact production origin for `AUTH_URL` (e.g. `https://your-app.vercel.app`, no trailing slash). The project’s `next.config.ts` forwards `AUTH_*` to `NEXTAUTH_*` so the Auth.js client bundle matches the server.

Route protection uses **Edge middleware** with `getToken` from Auth.js (JWT only) so the bundle stays under Vercel’s Edge size limit. Do **not** import `auth` from `lib/auth` in `middleware.ts` — that pulls Prisma and exceeds the limit ([Vercel Edge Function limits](https://vercel.com/docs/functions/runtimes/edge#limits)).

## Troubleshooting

**Login works locally but not on the deployment** — Add `AUTH_SECRET` (`openssl rand -base64 32`) and `AUTH_URL` (production site URL) in the Vercel project. Redeploy. Run `npx prisma migrate deploy` against Neon so tables exist; otherwise sign-up returns 500.

**“Can’t reach database server at `localhost:5432`”** — Postgres is not running locally, or `.env` still points at localhost. Use your hosted DB (e.g. Neon) in `DATABASE_URL` / `DATABASE_URL_UNPOOLED`, or start Postgres locally, then run `npx prisma migrate deploy` and `npm run db:seed`. The homepage shows a yellow notice if the DB is unreachable instead of a hard error.

Password reset emails are not sent by default. In **development**, `POST /api/auth/forgot-password` returns `resetUrl` in the JSON for testing. In **production**, configure email or integrate your provider using the same token fields on `User`.
