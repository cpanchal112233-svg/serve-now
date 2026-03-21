"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

type Row = {
  id: string;
  bookingNumber: string;
  customerName: string;
  serviceName: string;
  total: string;
};

export function CreateInvoicePanel({ bookings }: { bookings: Row[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function create(bookingId: string) {
    setLoading(bookingId);
    await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });
    setLoading(null);
    router.refresh();
  }

  if (bookings.length === 0) return null;

  return (
    <div className="mb-10 rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-950">
        Create invoice from completed job
      </h2>
      <p className="mt-1 text-sm text-amber-900/90">
        Completed bookings without an invoice yet. One invoice per booking.
      </p>
      <ul className="mt-4 space-y-3">
        {bookings.map((b) => (
          <li
            key={b.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200/80 bg-white px-4 py-3"
          >
            <div>
              <p className="font-mono text-sm font-semibold text-zinc-900">{b.bookingNumber}</p>
              <p className="text-sm text-zinc-700">
                {b.customerName} · {b.serviceName}
              </p>
              <p className="text-xs text-zinc-500">{formatCurrency(b.total)}</p>
            </div>
            <button
              type="button"
              disabled={loading === b.id}
              onClick={() => void create(b.id)}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {loading === b.id ? "Creating…" : "Create invoice"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
