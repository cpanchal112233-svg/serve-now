import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

type Row = {
  id: string;
  bookingNumber: string;
  status: string;
  scheduledDate: Date | string;
  scheduledTime: string;
  customer: { name: string; email: string };
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

export function JobsTable({ jobs }: { jobs: Row[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
        <thead className="bg-zinc-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-zinc-700">Job</th>
            <th className="px-4 py-3 font-semibold text-zinc-700">Customer</th>
            <th className="px-4 py-3 font-semibold text-zinc-700">Service</th>
            <th className="px-4 py-3 font-semibold text-zinc-700">When</th>
            <th className="px-4 py-3 font-semibold text-zinc-700">Status</th>
            <th className="px-4 py-3 font-semibold text-zinc-700">Price</th>
            <th className="px-4 py-3 font-semibold text-zinc-700" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {jobs.map((j) => (
            <tr key={j.id} className="hover:bg-zinc-50/80">
              <td className="px-4 py-3 font-medium text-zinc-900">{j.bookingNumber}</td>
              <td className="px-4 py-3 text-zinc-700">
                <div>{j.customer.name}</div>
                <div className="text-xs text-zinc-500">{j.customer.email}</div>
              </td>
              <td className="px-4 py-3 text-zinc-700">{j.service.name}</td>
              <td className="px-4 py-3 text-zinc-700">
                {formatDate(j.scheduledDate)}
                <div className="text-xs text-zinc-500">{j.scheduledTime}</div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-800">
                  {statusLabel[j.status] ?? j.status}
                </span>
              </td>
              <td className="px-4 py-3 text-zinc-800">{formatCurrency(j.service.price)}</td>
              <td className="px-4 py-3">
                <Link href={`/track/${j.id}`} className="text-teal-800 hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
