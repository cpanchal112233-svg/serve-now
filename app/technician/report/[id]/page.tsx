import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { CompletionForm } from "@/components/technician/CompletionForm";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function TechnicianReportPage(props: PageProps) {
  const { id } = await props.params;
  const session = await auth();
  if (!session?.user) return null;

  const profile = await prisma.technicianProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) notFound();

  const assignment = await prisma.jobAssignment.findFirst({
    where: { bookingId: id, technicianId: profile.id },
    include: { booking: { include: { customer: true, service: true } } },
  });
  if (!assignment) notFound();

  const { booking } = assignment;

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Completion report</h1>
      <p className="mt-1 text-zinc-600">
        {booking.bookingNumber} · {booking.service.name}
      </p>
      <p className="mt-2 text-sm text-zinc-600">
        {booking.customer.name} · {formatDate(booking.scheduledDate)} · {booking.scheduledTime}
      </p>
      <p className="mt-2 text-sm text-zinc-700">{booking.address}</p>

      <div className="mt-10">
        <CompletionForm bookingId={booking.id} />
      </div>
    </div>
  );
}
