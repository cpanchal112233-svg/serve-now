import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

const nav = [
  { href: "/account/dashboard", label: "Dashboard" },
  { href: "/account/bookings", label: "Bookings" },
  { href: "/account/invoices", label: "Invoices" },
  { href: "/account/profile", label: "Profile" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageShell>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row lg:px-8">
        <aside className="shrink-0 lg:w-56">
          <nav className="flex flex-row gap-1 overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm lg:flex-col">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 lg:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </PageShell>
  );
}
