import Link from "next/link";
import { auth } from "@/lib/auth";
import { AssignedJobCard } from "@/components/technician/AssignedJobCard";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TechnicianDashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const profile = await prisma.technicianProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return <p className="text-zinc-600">No technician profile is linked to your account.</p>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const assignments = await prisma.jobAssignment.findMany({
    where: {
      technicianId: profile.id,
      booking: {
        scheduledDate: { gte: today, lt: tomorrow },
        status: { notIn: ["COMPLETED", "CANCELLED"] },
      },
    },
    include: { booking: { include: { customer: true, service: true } } },
    orderBy: { booking: { scheduledDate: "asc" } },
  });

  const nextJob = assignments[0];

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Today</h1>
      <p className="mt-1 text-zinc-600">Hello, {session.user.name} — here&apos;s your run for the day.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Next job</h2>
          {nextJob ? (
            <div className="mt-3">
              <p className="font-semibold text-zinc-900">{nextJob.booking.service.name}</p>
              <p className="text-sm text-zinc-600">
                {formatDate(nextJob.booking.scheduledDate)} · {nextJob.booking.scheduledTime}
              </p>
              <p className="mt-2 text-sm text-zinc-700">{nextJob.booking.address}</p>
              <Link
                href={`/technician/report/${nextJob.booking.id}`}
                className="mt-4 inline-flex rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
              >
                Open report
              </Link>
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-600">No jobs scheduled for today.</p>
          )}
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Quick status</h2>
          <p className="mt-3 text-sm text-zinc-600">
            Update job status from the jobs list or the completion report when work is done.
          </p>
          <Link
            href="/technician/jobs"
            className="mt-4 inline-flex text-sm font-semibold text-teal-800 hover:underline"
          >
            View assigned jobs →
          </Link>
        </div>
      </div>

      {assignments.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900">Today&apos;s route</h2>
          <div className="mt-4 space-y-4">
            {assignments.map((a) => (
              <AssignedJobCard key={a.id} booking={a.booking} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
