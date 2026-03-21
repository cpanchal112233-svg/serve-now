"use client";

import Link from "next/link";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setResetUrl(null);
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data.message ?? "Check your email for next steps.");
    if (data.resetUrl) setResetUrl(data.resetUrl);
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="text-center text-2xl font-bold text-zinc-900">Forgot password</h1>
        <p className="mt-2 text-center text-sm text-zinc-600">
          Enter your email. In development, the reset link is returned in the response for testing.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <label className="block text-sm">
            <span className="font-medium text-zinc-700">Email</span>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal-700 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
        {message && (
          <div className="mt-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
            {message}
          </div>
        )}
        {resetUrl && (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs break-all text-zinc-800">
            <span className="font-semibold">Dev reset URL:</span> {resetUrl}
          </div>
        )}
        <p className="mt-8 text-center text-sm text-zinc-600">
          <Link href="/login" className="font-semibold text-teal-800 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
