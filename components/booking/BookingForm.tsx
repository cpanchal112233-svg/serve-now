"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BookingSteps } from "./BookingSteps";
import { BookingSummary } from "./BookingSummary";

type Service = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: string;
};

export function BookingForm({ initialServiceId }: { initialServiceId?: string }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState(initialServiceId ?? "");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("Morning (8am–12pm)");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then(setServices)
      .catch(() => setError("Could not load services."));
  }, []);

  const selected = services.find((s) => s.id === serviceId) ?? null;

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      const body: Record<string, string | undefined> = {
        serviceId,
        scheduledDate,
        scheduledTime,
        address,
        notes: notes || undefined,
      };
      if (status !== "authenticated" || session?.user.role !== "CUSTOMER") {
        body.customerName = customerName;
        body.customerEmail = customerEmail;
        body.customerPhone = customerPhone || undefined;
        body.customerPassword = customerPassword;
      }
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Booking failed.");
        setLoading(false);
        return;
      }
      router.push(`/booking-confirmation/${data.id}`);
    } catch {
      setError("Something went wrong.");
    }
    setLoading(false);
  }

  const guestFields =
    status !== "authenticated" || session?.user.role !== "CUSTOMER";

  return (
    <div className="mx-auto max-w-3xl">
      <BookingSteps step={step} />

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900">Choose a service</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setServiceId(s.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  serviceId === s.id
                    ? "border-teal-600 bg-teal-50 ring-2 ring-teal-600"
                    : "border-zinc-200 bg-white hover:border-zinc-300"
                }`}
              >
                <p className="font-semibold text-zinc-900">{s.name}</p>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{s.description}</p>
                <p className="mt-3 text-sm font-medium text-teal-800">${s.price}</p>
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!serviceId}
            onClick={() => setStep(2)}
            className="mt-4 w-full rounded-xl bg-teal-700 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900">Schedule</h2>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Date</span>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Preferred window</span>
            <select
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            >
              <option>Morning (8am–12pm)</option>
              <option>Afternoon (12pm–5pm)</option>
              <option>Evening (5pm–8pm)</option>
            </select>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-medium"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!scheduledDate}
              onClick={() => setStep(3)}
              className="rounded-xl bg-teal-700 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900">Details</h2>
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Service address</span>
              <textarea
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, unit, city"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Notes (optional)</span>
              <textarea
                className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Access instructions, pets, parking…"
              />
            </label>

            {guestFields && (
              <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
                <p className="text-sm font-medium text-amber-950">Create your customer account</p>
                <input
                  className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
                  placeholder="Full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <input
                  className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
                  placeholder="Email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
                <input
                  className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
                  placeholder="Phone (optional)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
                <input
                  className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
                  placeholder="Password (min 6 characters)"
                  type="password"
                  value={customerPassword}
                  onChange={(e) => setCustomerPassword(e.target.value)}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-medium"
              >
                Back
              </button>
              <button
                type="button"
                disabled={
                  !address.trim() ||
                  loading ||
                  (guestFields &&
                    (!customerName.trim() || !customerEmail.trim() || customerPassword.length < 6))
                }
                onClick={() => void submit()}
                className="rounded-xl bg-teal-700 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
              >
                {loading ? "Submitting…" : "Confirm booking"}
              </button>
            </div>
          </div>
          <BookingSummary
            service={selected}
            scheduledDate={scheduledDate}
            scheduledTime={scheduledTime}
            address={address}
          />
        </div>
      )}
    </div>
  );
}
