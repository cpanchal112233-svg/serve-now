import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function BookingConfirmationPage(props: PageProps) {
  const { id } = await props.params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { service: true },
  });
  if (!booking) notFound();

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Confirmed</p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900">You&apos;re on the schedule</h1>
        <p className="mt-3 text-zinc-600">
          Booking <span className="font-mono font-semibold text-zinc-900">{booking.bookingNumber}</span>{" "}
          for {booking.service.name}.
        </p>
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-sm">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Date</dt>
              <dd className="font-medium text-zinc-900">{formatDate(booking.scheduledDate)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Window</dt>
              <dd className="font-medium text-zinc-900">{booking.scheduledTime}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Status</dt>
              <dd className="font-medium text-zinc-900">{booking.status.replace("_", " ")}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Address</dt>
              <dd className="mt-1 font-medium text-zinc-900">{booking.address}</dd>
            </div>
          </dl>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={`/track/${booking.id}`}
            className="inline-flex rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Track this job
          </Link>
          <Link
            href="/account/bookings"
            className="inline-flex rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            My bookings
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
