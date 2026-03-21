import { Suspense } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { PageShell } from "@/components/layout/PageShell";

type PageProps = { searchParams: Promise<{ service?: string }> };

export default async function BookPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const initialServiceId = searchParams.service;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-zinc-900">Book a service</h1>
        <p className="mt-2 text-zinc-600">
          Choose a service, pick a window, and confirm your details. Guests create a customer account as
          part of booking.
        </p>
        <div className="mt-10">
          <Suspense fallback={<p className="text-sm text-zinc-500">Loading booking…</p>}>
            <BookingForm initialServiceId={initialServiceId} />
          </Suspense>
        </div>
      </div>
    </PageShell>
  );
}
