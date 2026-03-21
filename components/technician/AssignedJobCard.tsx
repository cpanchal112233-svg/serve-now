import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { TechnicianJobActions } from "./TechnicianJobActions";

type Booking = {
  id: string;
  bookingNumber: string;
  status:
    | "BOOKED"
    | "ASSIGNED"
    | "EN_ROUTE"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
  scheduledDate: Date | string;
  scheduledTime: string;
  address: string;
  customer: { name: string; phone: string | null };
  service: { name: string };
};

const statusLabel: Record<string, string> = {
  BOOKED: "Booked",
  ASSIGNED: "Assigned",
  EN_ROUTE: "En route",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function AssignedJobCard({ booking }: { booking: Booking }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-teal-800">{booking.bookingNumber}</p>
          <p className="mt-1 text-lg font-semibold text-zinc-900">{booking.service.name}</p>
          <p className="text-sm text-zinc-600">{booking.customer.name}</p>
          {booking.customer.phone && (
            <p className="text-sm text-zinc-500">{booking.customer.phone}</p>
          )}
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800">
          {statusLabel[booking.status] ?? booking.status}
        </span>
      </div>
      <p className="mt-3 text-sm text-zinc-700">{booking.address}</p>
      <p className="mt-1 text-sm text-zinc-500">
        {formatDate(booking.scheduledDate)} · {booking.scheduledTime}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/technician/report/${booking.id}`}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
        >
          Open report
        </Link>
      </div>
      <TechnicianJobActions bookingId={booking.id} status={booking.status} />
    </div>
  );
}
