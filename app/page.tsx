import Link from "next/link";
import { ServeNowHeroAnimation } from "@/components/hero/ServeNowHeroAnimation";
import { PageShell } from "@/components/layout/PageShell";
import { getActiveServices } from "@/lib/get-services";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { services, dbUnavailable } = await getActiveServices({ take: 4 });

  return (
    <PageShell>
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-900 text-white">
        <ServeNowHeroAnimation />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:flex lg:items-center lg:gap-12 lg:px-8 lg:py-28">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-wider text-teal-300/90">
              Service operations
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Fast service booking, clear status updates, and smarter field operations.
            </h1>
            <p className="mt-5 text-lg text-zinc-300">
              ServeNow helps service businesses manage bookings, dispatch technicians, track jobs, and
              keep customers informed through one connected platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-xl bg-teal-500 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-lg hover:bg-teal-400"
              >
                Book a Service
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Explore Platform
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Trusted workflow</p>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-zinc-600">
            Built for cleaning crews, HVAC, plumbing, electrical, pest control, and maintenance teams
            who need a believable end-to-end job lifecycle.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {dbUnavailable && (
            <div className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <p className="font-semibold">Database not connected</p>
              <p className="mt-1 text-amber-900/90">
                Set <code className="rounded bg-amber-100 px-1">DATABASE_URL</code> and{" "}
                <code className="rounded bg-amber-100 px-1">DIRECT_URL</code> in <code className="rounded bg-amber-100 px-1">.env</code>{" "}
                (e.g. Neon), then run{" "}
                <code className="rounded bg-amber-100 px-1">npx prisma migrate deploy</code> and{" "}
                <code className="rounded bg-amber-100 px-1">npm run db:seed</code>. Or start Postgres on{" "}
                <code className="rounded bg-amber-100 px-1">localhost:5432</code>.
              </p>
            </div>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">Services preview</h2>
              <p className="mt-1 text-zinc-600">Transparent duration and pricing.</p>
            </div>
            <Link href="/services" className="text-sm font-semibold text-teal-800 hover:underline">
              View all services →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.length === 0 && !dbUnavailable && (
              <p className="col-span-full text-sm text-zinc-600">No services yet.</p>
            )}
            {services.map((s) => (
              <div
                key={s.id}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-semibold text-zinc-900">{s.name}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-zinc-600">{s.description}</p>
                <div className="mt-4 flex items-baseline justify-between text-sm">
                  <span className="text-zinc-500">{s.durationMinutes} min</span>
                  <span className="font-semibold text-teal-800">{formatCurrency(s.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-zinc-900">How it works</h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              "Browse services and pick a time window.",
              "Receive confirmation with booking number.",
              "Admin dispatches a technician to the job.",
              "Track status through completion and invoice.",
            ].map((text, i) => (
              <li key={text} className="relative rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="mt-4 text-sm leading-relaxed text-zinc-700">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-zinc-900">Customer benefits</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Clear status",
                body: "Timeline updates from booked to completed — no guesswork.",
              },
              {
                title: "Faster dispatch",
                body: "Technicians see assignments, ETAs, and job context in one place.",
              },
              {
                title: "Professional invoicing",
                body: "Generate invoices tied to completed work with payment tracking.",
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-zinc-900">{c.title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Ready to run service operations in one app?</h2>
          <p className="mx-auto mt-3 max-w-xl text-teal-100">
            Start with a booking, follow the confirmation link, and watch the full lifecycle in the
            demo environment.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-teal-900 hover:bg-teal-50"
            >
              Book a Service
            </Link>
            <Link
              href="/login"
              className="inline-flex rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold hover:bg-white/10"
            >
              Team login
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
