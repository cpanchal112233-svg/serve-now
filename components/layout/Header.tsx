"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book" },
];

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const role = session?.user?.role;

  const accountHref =
    role === "ADMIN"
      ? "/admin/dashboard"
      : role === "TECHNICIAN"
        ? "/technician/dashboard"
        : "/account/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="ServeNow" width={112} height={28} priority />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium text-zinc-600 transition hover:text-teal-800",
                pathname === l.href && "text-teal-800",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {status === "loading" ? (
            <span className="h-9 w-20 animate-pulse rounded-lg bg-zinc-100" />
          ) : session ? (
            <>
              <Link
                href={accountHref}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg border border-zinc-200 p-2 md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">Toggle menu</span>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-2 py-2 text-sm font-medium text-zinc-700"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href={accountHref} className="rounded-lg px-2 py-2 text-sm font-medium" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="rounded-lg px-2 py-2 text-left text-sm font-medium"
                  onClick={() => {
                    setOpen(false);
                    void signOut({ callbackUrl: "/" });
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-2 py-2 text-sm font-medium" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" className="rounded-lg px-2 py-2 text-sm font-medium text-teal-800" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
