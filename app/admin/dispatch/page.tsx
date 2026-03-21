import { DispatchBoard } from "@/components/admin/DispatchBoard";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDispatchPage() {
  const [pending, technicians] = await Promise.all([
    prisma.booking.findMany({
      where: { status: { in: ["BOOKED", "ASSIGNED"] } },
      include: { customer: true, service: true },
      orderBy: { scheduledDate: "asc" },
    }),
    prisma.technicianProfile.findMany({
      where: { isAvailable: true },
      include: { user: true },
      orderBy: { user: { name: "asc" } },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Dispatch board</h1>
      <p className="mt-1 text-zinc-600">Assign technicians and move jobs from booked to field-ready.</p>
      <div className="mt-8">
        <DispatchBoard
          pending={pending.map((b) => ({
            ...b,
            scheduledDate: b.scheduledDate.toISOString(),
          }))}
          technicians={technicians}
        />
      </div>
    </div>
  );
}
