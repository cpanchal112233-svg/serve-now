import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const createInvoiceSchema = z.object({
  bookingId: z.string().min(1),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, role } = session.user;

  if (role === "ADMIN") {
    const invoices = await prisma.invoice.findMany({
      include: { booking: { include: { customer: true, service: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(invoices);
  }

  if (role === "CUSTOMER") {
    const invoices = await prisma.invoice.findMany({
      where: { booking: { customerId: id } },
      include: { booking: { include: { service: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(invoices);
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: parsed.data.bookingId },
    include: { service: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.status !== "COMPLETED") {
    return NextResponse.json({ error: "Only completed jobs can be invoiced." }, { status: 400 });
  }

  const existing = await prisma.invoice.findUnique({ where: { bookingId: booking.id } });
  if (existing) {
    return NextResponse.json(existing);
  }

  const subtotal = booking.service.price;
  const total = subtotal;
  const year = new Date().getFullYear();
  const count = await prisma.invoice.count({ where: { invoiceNumber: { startsWith: `INV-${year}-` } } });
  const invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, "0")}`;

  const invoice = await prisma.invoice.create({
    data: {
      bookingId: booking.id,
      invoiceNumber,
      subtotal,
      total,
      paymentStatus: "PENDING",
    },
    include: { booking: { include: { customer: true, service: true } } },
  });

  return NextResponse.json(invoice);
}
