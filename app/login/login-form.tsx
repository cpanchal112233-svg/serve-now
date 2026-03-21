"use client";

import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const explicitCallback = searchParams.get("callbackUrl");
  const resetOk = searchParams.get("reset") === "1";
  const [dismissReset, setDismissReset] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    const session = await getSession();
    let dest = explicitCallback;
    if (!dest) {
      const role = session?.user?.role;
      if (role === "ADMIN") dest = "/admin/dashboard";
      else if (role === "TECHNICIAN") dest = "/technician/dashboard";
      else dest = "/account/dashboard";
    }
    router.push(dest);
    router.refresh();
  }

  return (
    <>
      <h1 className="text-center text-2xl font-bold text-zinc-900">Sign in</h1>
      <p className="mt-2 text-center text-sm text-zinc-600">
        Customers, technicians, and admins use the same login. You&apos;ll be routed by role.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        {resetOk && !dismissReset && (
          <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900">
            Password updated. Sign in with your new password.
            <button
              type="button"
              className="ml-2 text-teal-700 underline"
              onClick={() => setDismissReset(true)}
            >
              Dismiss
            </button>
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        )}
        <label className="block text-sm">
          <span className="font-medium text-zinc-700">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-zinc-700">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-teal-700 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-600">
        <Link href="/forgot-password" className="font-medium text-zinc-700 hover:underline">
          Forgot password?
        </Link>
        <span className="mx-2 text-zinc-300">·</span>
        New customer?{" "}
        <Link href="/signup" className="font-semibold text-teal-800 hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
