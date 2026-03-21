"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Status = "PENDING" | "PAID" | "OVERDUE";

export function InvoiceStatusActions({
  invoiceId,
  paymentStatus,
}: {
  invoiceId: string;
  paymentStatus: Status;
}) {
  const router = useRouter();
  const [value, setValue] = useState<Status>(paymentStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(paymentStatus);
  }, [paymentStatus]);

  async function save() {
    if (value === paymentStatus) return;
    setLoading(true);
    await fetch(`/api/invoices/${invoiceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: value }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="rounded-lg border border-zinc-200 px-2 py-1 text-sm"
        value={value}
        onChange={(e) => setValue(e.target.value as Status)}
      >
        <option value="PENDING">PENDING</option>
        <option value="PAID">PAID</option>
        <option value="OVERDUE">OVERDUE</option>
      </select>
      <button
        type="button"
        disabled={loading || value === paymentStatus}
        onClick={() => void save()}
        className="rounded-lg border border-zinc-200 px-2 py-1 text-xs font-medium hover:bg-zinc-50 disabled:opacity-40"
      >
        {loading ? "…" : "Save"}
      </button>
    </div>
  );
}
