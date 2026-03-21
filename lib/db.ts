import { PrismaClient } from "@prisma/client";
import { normalizeNeonPooledDatabaseUrl } from "./neon-database-url";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const raw = process.env.DATABASE_URL;
  const url = normalizeNeonPooledDatabaseUrl(raw) ?? raw;
  return new PrismaClient({
    ...(url
      ? {
          datasources: {
            db: { url },
          },
        }
      : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/** Reuse one client per serverless instance (Vercel) to avoid exhausting DB connections. */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
