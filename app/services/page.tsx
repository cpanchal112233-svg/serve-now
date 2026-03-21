import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { getActiveServices } from "@/lib/get-services";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const { services, dbUnavailable } = await getActiveServices();

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-zinc-900">Services</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">
          Choose a service to book. Duration and pricing are shown up front.
        </p>
        {dbUnavailable && (
          <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <p className="font-semibold">Database not connected</p>
            <p className="mt-1">
              Update <code className="rounded bg-amber-100 px-1">DATABASE_URL</code> and{" "}
              <code className="rounded bg-amber-100 px-1">DIRECT_URL</code> in <code className="rounded bg-amber-100 px-1">.env</code>, run{" "}
              <code className="rounded bg-amber-100 px-1">npx prisma migrate deploy</code> and{" "}
              <code className="rounded bg-amber-100 px-1">npm run db:seed</code>.
            </p>
          </div>
        )}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-zinc-900">{s.name}</h2>
              <p className="mt-2 flex-1 text-sm text-zinc-600">{s.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-zinc-500">{s.durationMinutes} minutes</span>
                <span className="font-semibold text-teal-800">{formatCurrency(s.price)}</span>
              </div>
              <Link
                href={`/book?service=${s.id}`}
                className="mt-5 inline-flex justify-center rounded-xl bg-teal-700 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
              >
                Book
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
