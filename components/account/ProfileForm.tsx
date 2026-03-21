"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initialName: string;
  initialPhone: string | null;
  initialEmail: string;
};

export function ProfileForm({ initialName, initialPhone, initialEmail }: Props) {
  const router = useRouter();
  const { update } = useSession();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Update failed.");
      return;
    }
    setName(data.name);
    setPhone(data.phone ?? "");
    setMessage("Profile updated.");
    await update({ name: data.name });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      {message && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>
      )}
      <label className="block text-sm">
        <span className="font-medium text-zinc-700">Email</span>
        <input
          type="email"
          disabled
          className="mt-1 w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-600"
          value={initialEmail}
        />
        <span className="mt-1 block text-xs text-zinc-500">Email cannot be changed here.</span>
      </label>
      <label className="block text-sm">
        <span className="font-medium text-zinc-700">Full name</span>
        <input
          required
          className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-zinc-700">Phone</span>
        <input
          className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 …"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-teal-700 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
