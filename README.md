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

   - `DATABASE_URL` — Postgres connection string
   - `AUTH_SECRET` — e.g. `openssl rand -base64 32`
   - `AUTH_URL` — `http://localhost:3000` locally; your production URL on Vercel (used for password-reset links)

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

Set `DATABASE_URL`, `AUTH_SECRET`, and `AUTH_URL`. Build: `npm run build`.

Password reset emails are not sent by default. In **development**, `POST /api/auth/forgot-password` returns `resetUrl` in the JSON for testing. In **production**, configure email or integrate your provider using the same token fields on `User`.
