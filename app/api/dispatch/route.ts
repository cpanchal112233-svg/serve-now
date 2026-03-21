import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { dispatchSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [pending, technicians] = await Promise.all([
    prisma.booking.findMany({
      where: { status: { in: ["BOOKED", "ASSIGNED"] } },
      include: { customer: true, service: true, assignments: true },
      orderBy: { scheduledDate: "asc" },
    }),
    prisma.technicianProfile.findMany({
      where: { isAvailable: true },
      include: { user: true, assignments: { where: { status: { not: "COMPLETED" } } } },
    }),
  ]);

  return NextResponse.json({ pending, technicians });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = dispatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { bookingId, technicianProfileId, eta } = parsed.data;
  const etaDate = eta ? new Date(eta) : null;

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const tech = await prisma.technicianProfile.findUnique({ where: { id: technicianProfileId } });
  if (!tech) {
    return NextResponse.json({ error: "Technician not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.jobAssignment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        technicianId: technicianProfileId,
        eta: etaDate,
        status: "ASSIGNED",
      },
      update: {
        technicianId: technicianProfileId,
        eta: etaDate,
        status: "ASSIGNED",
        assignedAt: new Date(),
      },
    }),
    prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "ASSIGNED",
        statusLogs: {
          create: {
            status: "ASSIGNED",
            note: `Assigned to ${tech.vehicleName ?? "technician"}`,
          },
        },
      },
    }),
  ]);

  const updated = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { assignments: { include: { technician: { include: { user: true } } } }, service: true, customer: true },
  });

  return NextResponse.json(updated);
}
