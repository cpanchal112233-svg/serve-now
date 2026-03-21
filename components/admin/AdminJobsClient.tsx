"use client";

import { useMemo, useState } from "react";
import { JobsTable } from "./JobsTable";

type Row = {
  id: string;
  bookingNumber: string;
  status: string;
  scheduledDate: Date | string;
  scheduledTime: string;
  customer: { name: string; email: string };
  service: { name: string; price: { toString(): string } | number };
};

const statuses = [
  "ALL",
  "BOOKED",
  "ASSIGNED",
  "EN_ROUTE",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

export function AdminJobsClient({ jobs }: { jobs: Row[] }) {
  const [filter, setFilter] = useState<(typeof statuses)[number]>("ALL");

  const filtered = useMemo(() => {
    if (filter === "ALL") return jobs;
    return jobs.filter((j) => j.status === filter);
  }, [jobs, filter]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-zinc-600">
          Status{" "}
          <select
            className="ml-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-900"
            value={filter}
            onChange={(e) => setFilter(e.target.value as (typeof statuses)[number])}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All statuses" : s.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <span className="text-sm text-zinc-500">
          Showing {filtered.length} of {jobs.length}
        </span>
      </div>
      <JobsTable jobs={filtered} />
    </div>
  );
}
