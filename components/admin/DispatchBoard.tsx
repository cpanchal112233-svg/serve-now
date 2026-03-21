"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDate } from "@/lib/utils";

type Booking = {
  id: string;
  bookingNumber: string;
  status: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  customer: { name: string };
  service: { name: string };
};

type Technician = {
  id: string;
  user: { name: string };
  vehicleName: string | null;
};

export function DispatchBoard({
  pending,
  technicians,
}: {
  pending: Booking[];
  technicians: Technician[];
}) {
  const router = useRouter();
  const [assigning, setAssigning] = useState<string | null>(null);
  const [techChoice, setTechChoice] = useState<Record<string, string>>({});

  async function assign(bookingId: string) {
    const technicianProfileId = techChoice[bookingId];
    if (!technicianProfileId) return;
    setAssigning(bookingId);
    await fetch("/api/dispatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, technicianProfileId }),
    });
    setAssigning(null);
    router.refresh();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {pending.map((b) => (
        <div key={b.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-teal-800">{b.bookingNumber}</p>
              <p className="mt-1 font-medium text-zinc-900">{b.service.name}</p>
              <p className="text-sm text-zinc-600">{b.customer.name}</p>
            </div>
            <p className="text-sm text-zinc-500">{formatDate(b.scheduledDate)}</p>
          </div>
          <p className="mt-3 text-sm text-zinc-600">{b.address}</p>
          <p className="mt-1 text-xs text-zinc-500">{b.scheduledTime}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm">
              <span className="text-zinc-600">Assign technician</span>
              <select
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2"
                value={techChoice[b.id] ?? ""}
                onChange={(e) => setTechChoice((m) => ({ ...m, [b.id]: e.target.value }))}
              >
                <option value="">Select…</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.user.name}
                    {t.vehicleName ? ` (${t.vehicleName})` : ""}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={!techChoice[b.id] || assigning === b.id}
              onClick={() => void assign(b.id)}
              className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {assigning === b.id ? "Saving…" : "Confirm"}
            </button>
          </div>
        </div>
      ))}
      {pending.length === 0 && (
        <p className="col-span-full rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-12 text-center text-sm text-zinc-600">
          No jobs waiting for dispatch. Great work.
        </p>
      )}
    </div>
  );
}
