import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth;
  const path = req.nextUrl.pathname;
  const role = session?.user?.role;

  if (path.startsWith("/admin")) {
    if (!session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/", req.url));
  }

  if (path.startsWith("/technician")) {
    if (!session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
    if (role !== "TECHNICIAN") return NextResponse.redirect(new URL("/", req.url));
  }

  if (path.startsWith("/account")) {
    if (!session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }
    if (role !== "CUSTOMER") return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/technician/:path*"],
};
