import type { NextConfig } from "next";

/**
 * next-auth/react embeds NEXTAUTH_URL / NEXTAUTH_SECRET at build time.
 * Auth.js also reads AUTH_URL / AUTH_SECRET — Vercel users often set only the AUTH_* names.
 * Forwarding keeps client-side signIn/getSession and CSRF aligned with the server.
 */
const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

const nextConfig: NextConfig = {
  env: {
    ...(authUrl ? { NEXTAUTH_URL: authUrl } : {}),
    ...(authSecret ? { NEXTAUTH_SECRET: authSecret } : {}),
  },
};

export default nextConfig;
