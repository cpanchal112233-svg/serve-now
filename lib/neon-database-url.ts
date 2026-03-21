/**
 * Neon routes pooled connections through PgBouncer. Prisma must use
 * `pgbouncer=true` on the pooled URL or many queries fail at runtime.
 * @see https://www.prisma.io/docs/orm/overview/databases/neon
 */
export function normalizeNeonPooledDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    const isNeonPooler = host.includes("-pooler.") || host.includes(".pooler.");
    if (!isNeonPooler) return url;
    if (/[?&]pgbouncer=true/i.test(parsed.search)) return url;
    parsed.searchParams.set("pgbouncer", "true");
    return parsed.toString();
  } catch {
    return url;
  }
}
