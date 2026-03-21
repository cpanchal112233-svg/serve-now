import { formatCurrency, formatDate } from "@/lib/utils";

type Service = {
  name: string;
  durationMinutes: number;
  price: { toString(): string } | number;
};

export function BookingSummary({
  service,
  scheduledDate,
  scheduledTime,
  address,
}: {
  service: Service | null;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
}) {
  if (!service) return null;
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-zinc-900">Summary</h3>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Service</dt>
          <dd className="text-right font-medium text-zinc-900">{service.name}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Duration</dt>
          <dd className="text-right text-zinc-800">{service.durationMinutes} min</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Price</dt>
          <dd className="text-right font-semibold text-teal-800">{formatCurrency(service.price)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Date</dt>
          <dd className="text-right text-zinc-800">{formatDate(scheduledDate)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Time window</dt>
          <dd className="text-right text-zinc-800">{scheduledTime}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Address</dt>
          <dd className="max-w-[60%] text-right text-zinc-800">{address}</dd>
        </div>
      </dl>
    </div>
  );
}
