import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge-safe route protection: use JWT only (no Prisma / bcrypt).
 * Importing `auth` from `lib/auth` pulls the full Auth.js + Prisma bundle (~1MB+), which exceeds Vercel Edge limits.
 */
export async function middleware(req: NextRequest) {
  const secureCookie = req.nextUrl.protocol === "https:";

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie,
  });

  const path = req.nextUrl.pathname;
  const role = token?.role as string | undefined;

  if (path.startsWith("/admin")) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/", req.url));
  }

  if (path.startsWith("/technician")) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
    if (role !== "TECHNICIAN") return NextResponse.redirect(new URL("/", req.url));
  }

  if (path.startsWith("/account")) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
    if (role !== "CUSTOMER") return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/technician/:path*"],
};
