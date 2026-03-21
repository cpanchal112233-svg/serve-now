import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { bookingStatusSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: bookingId } = await context.params;
  const body = await req.json();
  const parsed = bookingStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { status, note } = parsed.data;
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const role = session.user.role;

  if (role === "ADMIN") {
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        statusLogs: { create: { status, note: note ?? null } },
      },
    });
    return NextResponse.json(updated);
  }

  if (role === "TECHNICIAN") {
    const profile = await prisma.technicianProfile.findUnique({ where: { userId: session.user.id } });
    if (!profile) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const assigned = await prisma.jobAssignment.findFirst({
      where: { bookingId, technicianId: profile.id },
    });
    if (!assigned) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allowed: typeof status[] = ["EN_ROUTE", "IN_PROGRESS", "COMPLETED"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Technicians can only move jobs forward to en-route, in-progress, or completed." }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const bookingRow = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status,
          statusLogs: { create: { status, note: note ?? null } },
        },
      });
      await tx.jobAssignment.updateMany({
        where: { bookingId, technicianId: profile.id },
        data: {
          status:
            status === "EN_ROUTE"
              ? "EN_ROUTE"
              : status === "IN_PROGRESS"
                ? "IN_PROGRESS"
                : "COMPLETED",
        },
      });
      return bookingRow;
    });

    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
