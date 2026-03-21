import { AdminJobsClient } from "@/components/admin/AdminJobsClient";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const jobs = await prisma.booking.findMany({
    orderBy: { scheduledDate: "desc" },
    include: { customer: true, service: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">All jobs</h1>
      <p className="mt-1 text-zinc-600">Filter by status and open customer jobs.</p>
      <div className="mt-8">
        <AdminJobsClient jobs={jobs} />
      </div>
    </div>
  );
}
