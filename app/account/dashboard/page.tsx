import Link from "next/link";
import { auth } from "@/lib/auth";
import { BookingCard } from "@/components/customer/BookingCard";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountDashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [nextBooking, recent] = await Promise.all([
    prisma.booking.findFirst({
      where: { customerId: session.user.id, status: { notIn: ["COMPLETED", "CANCELLED"] } },
      orderBy: { scheduledDate: "asc" },
      include: { service: true },
    }),
    prisma.booking.findMany({
      where: { customerId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { service: true },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Welcome back, {session.user.name}</h1>
      <p className="mt-1 text-zinc-600">Your service hub — bookings, tracking, and profile.</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Next booking</h2>
          {nextBooking ? (
            <div className="mt-3">
              <p className="font-semibold text-zinc-900">{nextBooking.service.name}</p>
              <p className="text-sm text-zinc-600">
                {formatDate(nextBooking.scheduledDate)} · {nextBooking.scheduledTime}
              </p>
              <p className="mt-2 text-sm text-zinc-600">{nextBooking.address}</p>
              <Link
                href={`/track/${nextBooking.id}`}
                className="mt-4 inline-flex text-sm font-semibold text-teal-800 hover:underline"
              >
                Track status →
              </Link>
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-600">No upcoming jobs. Book your next visit.</p>
          )}
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Quick actions</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/book" className="font-medium text-teal-800 hover:underline">
                Book a service
              </Link>
            </li>
            <li>
              <Link href="/account/bookings" className="font-medium text-teal-800 hover:underline">
                View all bookings
              </Link>
            </li>
            <li>
              <Link href="/account/invoices" className="font-medium text-teal-800 hover:underline">
                Invoices
              </Link>
            </li>
            <li>
              <Link href="/services" className="font-medium text-teal-800 hover:underline">
                Browse services
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-900">Recent</h2>
        <div className="mt-4 space-y-4">
          {recent.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
          {recent.length === 0 && <p className="text-sm text-zinc-600">No bookings yet.</p>}
        </div>
      </div>
    </div>
  );
}
