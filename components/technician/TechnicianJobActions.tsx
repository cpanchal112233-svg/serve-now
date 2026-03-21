"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BookingStatus =
  | "BOOKED"
  | "ASSIGNED"
  | "EN_ROUTE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export function TechnicianJobActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: BookingStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function patch(next: BookingStatus, note?: string) {
    setError(null);
    setLoading(true);
    const res = await fetch(`/api/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next, note }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Update failed.");
      return;
    }
    router.refresh();
  }

  if (status === "COMPLETED" || status === "CANCELLED") {
    return null;
  }

  return (
    <div className="mt-4 space-y-2 border-t border-zinc-100 pt-4">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Quick status</p>
      <div className="flex flex-wrap gap-2">
        {status === "ASSIGNED" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => void patch("EN_ROUTE", "Technician en route")}
            className="rounded-lg border border-teal-600 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-900 hover:bg-teal-100 disabled:opacity-50"
          >
            En route
          </button>
        )}
        {status === "EN_ROUTE" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => void patch("IN_PROGRESS", "Work started on site")}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
          >
            Start work
          </button>
        )}
        {status === "IN_PROGRESS" && (
          <Link
            href={`/technician/report/${bookingId}`}
            className="inline-flex rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
          >
            Complete & report
          </Link>
        )}
      </div>
    </div>
  );
}
