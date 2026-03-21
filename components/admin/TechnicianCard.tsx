import { cn } from "@/lib/utils";

type Tech = {
  id: string;
  isAvailable: boolean;
  serviceArea: string | null;
  vehicleName: string | null;
  user: { name: string; email: string };
  assignments: { id: string }[];
};

export function TechnicianCard({ technician }: { technician: Tech }) {
  const initials = technician.user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white",
          technician.isAvailable ? "bg-teal-700" : "bg-zinc-400",
        )}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-zinc-900">{technician.user.name}</p>
        <p className="truncate text-sm text-zinc-500">{technician.user.email}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-600">
          {technician.vehicleName && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5">{technician.vehicleName}</span>
          )}
          {technician.serviceArea && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5">{technician.serviceArea}</span>
          )}
          <span className="rounded-full bg-zinc-100 px-2 py-0.5">
            {technician.assignments.length} active jobs
          </span>
        </div>
      </div>
    </div>
  );
}
