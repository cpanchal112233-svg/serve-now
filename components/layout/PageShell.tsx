import { cn } from "@/lib/utils";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-zinc-50 text-zinc-900", className)}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
