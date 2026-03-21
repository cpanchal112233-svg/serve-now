import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

type Booking = {
  id: string;
  bookingNumber: string;
  scheduledDate: Date | string;
  scheduledTime: string;
  address: string;
  status: string;
  service: { name: string; price: { toString(): string } | number };
};

const statusLabel: Record<string, string> = {
  BOOKED: "Booked",
  ASSIGNED: "Assigned",
  EN_ROUTE: "En route",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-teal-800">{booking.bookingNumber}</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900">{booking.service.name}</p>
          <p className="mt-1 text-sm text-zinc-600">
            {formatDate(booking.scheduledDate)} · {booking.scheduledTime}
          </p>
          <p className="mt-2 text-sm text-zinc-600">{booking.address}</p>
        </div>
        <div className="text-right">
          <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800">
            {statusLabel[booking.status] ?? booking.status}
          </span>
          <p className="mt-2 text-sm font-semibold text-zinc-900">{formatCurrency(booking.service.price)}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/track/${booking.id}`}
          className="text-sm font-medium text-teal-800 hover:underline"
        >
          Track job
        </Link>
      </div>
    </div>
  );
}
