import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { technicianCreateSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "ADMIN") {
    const technicians = await prisma.technicianProfile.findMany({
      include: {
        user: true,
        assignments: { include: { booking: true } },
      },
      orderBy: { user: { name: "asc" } },
    });
    return NextResponse.json(technicians);
  }

  if (session.user.role === "TECHNICIAN") {
    const self = await prisma.technicianProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: true,
        assignments: { include: { booking: true } },
      },
    });
    return NextResponse.json(self ? [self] : []);
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = technicianCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, password, phone, serviceArea, vehicleName } = parsed.data;
  const normalized = email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    return NextResponse.json({ error: "User with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email: normalized,
      phone: phone ?? null,
      passwordHash,
      role: "TECHNICIAN",
      technicianProfile: {
        create: {
          isAvailable: true,
          serviceArea: serviceArea ?? null,
          vehicleName: vehicleName ?? null,
        },
      },
    },
    include: { technicianProfile: true },
  });

  return NextResponse.json(user);
}
