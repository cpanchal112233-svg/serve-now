import { notFound } from "next/navigation";
import { TrackingTimeline } from "@/components/customer/TrackingTimeline";
import { PageShell } from "@/components/layout/PageShell";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function TrackPage(props: PageProps) {
  const { id } = await props.params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      statusLogs: { orderBy: { createdAt: "asc" } },
      assignments: { include: { technician: { include: { user: true } } } },
    },
  });
  if (!booking) notFound();

  const tech = booking.assignments[0]?.technician;

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-teal-800">{booking.bookingNumber}</p>
        <h1 className="mt-1 text-3xl font-bold text-zinc-900">{booking.service.name}</h1>
        <p className="mt-2 text-zinc-600">
          {formatDate(booking.scheduledDate)} · {booking.scheduledTime}
        </p>
        <p className="mt-4 text-sm text-zinc-700">{booking.address}</p>

        {tech && (
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Technician</h2>
            <p className="mt-2 font-medium text-zinc-900">{tech.user.name}</p>
            {tech.vehicleName && <p className="text-sm text-zinc-600">{tech.vehicleName}</p>}
            {booking.assignments[0]?.eta && (
              <p className="mt-2 text-sm text-zinc-600">
                ETA: {formatDate(booking.assignments[0].eta)}
              </p>
            )}
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900">Status timeline</h2>
          <div className="mt-4">
            <TrackingTimeline logs={booking.statusLogs} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
