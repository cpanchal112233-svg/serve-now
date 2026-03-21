import Link from "next/link";
import { CreateInvoicePanel } from "@/components/admin/CreateInvoicePanel";
import { InvoiceStatusActions } from "@/components/admin/InvoiceStatusActions";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  const [invoices, unbilled] = await Promise.all([
    prisma.invoice.findMany({
      include: { booking: { include: { customer: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.booking.findMany({
      where: {
        status: "COMPLETED",
        invoices: { none: {} },
      },
      include: { customer: true, service: true },
      orderBy: { scheduledDate: "desc" },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Invoices</h1>
      <p className="mt-1 text-zinc-600">Create invoices from completed jobs and update payment status.</p>

      <div className="mt-8">
        <CreateInvoicePanel
          bookings={unbilled.map((b) => ({
            id: b.id,
            bookingNumber: b.bookingNumber,
            customerName: b.customer.name,
            serviceName: b.service.name,
            total: b.service.price.toString(),
          }))}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-zinc-700">Invoice</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Customer</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Total</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Status</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Created</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="px-4 py-3 font-mono text-sm">{inv.invoiceNumber}</td>
                <td className="px-4 py-3 text-zinc-800">{inv.booking.customer.name}</td>
                <td className="px-4 py-3">{formatCurrency(inv.total)}</td>
                <td className="px-4 py-3">
                  <InvoiceStatusActions invoiceId={inv.id} paymentStatus={inv.paymentStatus} />
                </td>
                <td className="px-4 py-3 text-zinc-600">{formatDate(inv.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link href={`/track/${inv.bookingId}`} className="text-teal-800 hover:underline">
                    Job
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-zinc-600">No invoices yet.</p>
        )}
      </div>
    </div>
  );
}
