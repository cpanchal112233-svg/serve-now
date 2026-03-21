import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalJobs, pendingDispatch, activeTechs, paid] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: { in: ["BOOKED", "ASSIGNED"] } } }),
    prisma.technicianProfile.count({ where: { isAvailable: true } }),
    prisma.invoice.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
  ]);

  const revenue = paid._sum.total ? Number(paid._sum.total) : 0;

  const cards = [
    { label: "Total jobs", value: String(totalJobs) },
    { label: "Pending dispatch", value: String(pendingDispatch) },
    { label: "Active technicians", value: String(activeTechs) },
    { label: "Revenue (paid)", value: formatCurrency(revenue) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Operations overview</h1>
      <p className="mt-1 text-zinc-600">Volume, dispatch queue, field capacity, and collected revenue.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-zinc-500">{c.label}</p>
            <p className="mt-2 text-2xl font-bold text-zinc-900">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
