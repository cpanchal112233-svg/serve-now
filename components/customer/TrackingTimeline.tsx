import { formatDate } from "@/lib/utils";

type Log = {
  id: string;
  status: string;
  note: string | null;
  createdAt: Date | string;
};

const labels: Record<string, string> = {
  BOOKED: "Booked",
  ASSIGNED: "Technician assigned",
  EN_ROUTE: "En route",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function TrackingTimeline({ logs }: { logs: Log[] }) {
  const sorted = [...logs].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <ol className="relative border-l border-zinc-200 pl-6">
      {sorted.map((log, i) => (
        <li key={log.id} className="mb-8 ml-1 last:mb-0">
          <span
            className={`absolute -left-[9px] mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
              i === sorted.length - 1 ? "bg-teal-600" : "bg-zinc-300"
            }`}
          />
          <p className="text-sm font-semibold text-zinc-900">{labels[log.status] ?? log.status}</p>
          <p className="text-xs text-zinc-500">{formatDate(log.createdAt)}</p>
          {log.note && <p className="mt-1 text-sm text-zinc-600">{log.note}</p>}
        </li>
      ))}
    </ol>
  );
}
