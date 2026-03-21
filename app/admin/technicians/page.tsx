import { TechnicianCard } from "@/components/admin/TechnicianCard";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminTechniciansPage() {
  const technicians = await prisma.technicianProfile.findMany({
    include: {
      user: true,
      assignments: { where: { status: { not: "COMPLETED" } } },
    },
    orderBy: { user: { name: "asc" } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Technicians</h1>
      <p className="mt-1 text-zinc-600">Availability, service areas, and active workload.</p>
      <p className="mt-2 text-sm text-zinc-500">
        New technicians are created via seed or the technicians API (admin-only).
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {technicians.map((t) => (
          <TechnicianCard key={t.id} technician={t} />
        ))}
      </div>
    </div>
  );
}
