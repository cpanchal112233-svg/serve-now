import type { Service } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function getActiveServices(options?: { take?: number }): Promise<{
  services: Service[];
  dbUnavailable: boolean;
}> {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      ...(options?.take != null ? { take: options.take } : {}),
    });
    return { services, dbUnavailable: false };
  } catch {
    return { services: [], dbUnavailable: true };
  }
}
