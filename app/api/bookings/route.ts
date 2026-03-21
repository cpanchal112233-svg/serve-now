import { auth } from "@/lib/auth";
import { generateNextBookingNumber } from "@/lib/booking-number";
import { prisma } from "@/lib/db";
import { bookingCreateSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, role } = session.user;

  if (role === "CUSTOMER") {
    const bookings = await prisma.booking.findMany({
      where: { customerId: id },
      include: {
        service: true,
        assignments: { include: { technician: { include: { user: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  }

  if (role === "ADMIN") {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        service: true,
        assignments: { include: { technician: { include: { user: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  }

  if (role === "TECHNICIAN") {
    const profile = await prisma.technicianProfile.findUnique({ where: { userId: id } });
    if (!profile) return NextResponse.json([]);
    const assignments = await prisma.jobAssignment.findMany({
      where: { technicianId: profile.id },
      include: {
        booking: { include: { service: true, customer: true } },
      },
      orderBy: { assignedAt: "desc" },
    });
    return NextResponse.json(assignments.map((a) => a.booking));
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user.role && session.user.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Please use a customer account to book services." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = bookingCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  let customerId: string | null =
    session?.user.role === "CUSTOMER" ? session.user.id : null;

  if (!customerId) {
    const { customerEmail, customerName, customerPhone, customerPassword } = parsed.data;
    if (!customerEmail || !customerName || !customerPassword) {
      return NextResponse.json(
        {
          error:
            "Sign in, or provide your full name, email, and a password so we can create your customer account with this booking.",
        },
        { status: 400 },
      );
    }
    const email = customerEmail.toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Sign in to continue." },
        { status: 409 },
      );
    }
    const passwordHash = await bcrypt.hash(customerPassword, 12);
    const user = await prisma.user.create({
      data: {
        name: customerName,
        email,
        phone: customerPhone ?? null,
        passwordHash,
        role: "CUSTOMER",
      },
    });
    customerId = user.id;
  }

  const { serviceId, scheduledDate, scheduledTime, address, notes } = parsed.data;
  const service = await prisma.service.findFirst({ where: { id: serviceId, isActive: true } });
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 400 });
  }

  const bookingNumber = await generateNextBookingNumber();
  const scheduled = new Date(scheduledDate);
  if (Number.isNaN(scheduled.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: {
      bookingNumber,
      customerId: customerId!,
      serviceId,
      scheduledDate: scheduled,
      scheduledTime,
      address,
      notes: notes ?? null,
      status: "BOOKED",
      statusLogs: {
        create: { status: "BOOKED", note: "Booking received" },
      },
    },
    include: { service: true },
  });

  return NextResponse.json(booking);
}
