import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <Suspense fallback={<p className="text-center text-sm text-zinc-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </PageShell>
  );
}
