import { auth } from "@/lib/auth";
import { BookingCard } from "@/components/customer/BookingCard";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AccountBookingsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.user.id },
    orderBy: { scheduledDate: "desc" },
    include: { service: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Bookings</h1>
      <p className="mt-1 text-zinc-600">Every job you&apos;ve scheduled with ServeNow.</p>
      <div className="mt-8 space-y-4">
        {bookings.map((b) => (
          <BookingCard key={b.id} booking={b} />
        ))}
        {bookings.length === 0 && <p className="text-sm text-zinc-600">No bookings yet.</p>}
      </div>
    </div>
  );
}
