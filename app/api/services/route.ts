import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(services);
}
