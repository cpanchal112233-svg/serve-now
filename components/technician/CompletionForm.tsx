"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CompletionForm({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    setLoading(true);
    const res = await fetch(`/api/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "COMPLETED", note: notes }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Could not complete job.");
      setLoading(false);
      return;
    }
    router.push("/technician/jobs");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Completion notes</span>
        <textarea
          className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2"
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What was done, parts used, follow-up recommendations…"
        />
      </label>
      <button
        type="button"
        disabled={!notes.trim() || loading}
        onClick={() => void submit()}
        className="w-full rounded-xl bg-teal-700 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Mark job completed"}
      </button>
    </div>
  );
}
