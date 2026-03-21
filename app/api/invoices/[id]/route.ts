import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { invoicePatchSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await req.json();
  const parsed = invoicePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const invoice = await prisma.invoice.update({
    where: { id },
    data: { paymentStatus: parsed.data.paymentStatus },
    include: { booking: { include: { customer: true, service: true } } },
  });

  return NextResponse.json(invoice);
}
