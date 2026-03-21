import { auth } from "@/lib/auth";
import { AssignedJobCard } from "@/components/technician/AssignedJobCard";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TechnicianJobsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const profile = await prisma.technicianProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) {
    return <p className="text-zinc-600">No technician profile linked.</p>;
  }

  const assignments = await prisma.jobAssignment.findMany({
    where: { technicianId: profile.id },
    include: { booking: { include: { customer: true, service: true } } },
    orderBy: { booking: { scheduledDate: "desc" } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Assigned jobs</h1>
      <p className="mt-1 text-zinc-600">Every job currently routed to you.</p>
      <div className="mt-8 space-y-4">
        {assignments.map((a) => (
          <AssignedJobCard key={a.id} booking={a.booking} />
        ))}
        {assignments.length === 0 && <p className="text-sm text-zinc-600">No assignments yet.</p>}
      </div>
    </div>
  );
}
