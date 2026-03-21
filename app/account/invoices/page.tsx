import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountInvoicesPage() {
  const session = await auth();
  if (!session?.user) return null;

  const invoices = await prisma.invoice.findMany({
    where: { booking: { customerId: session.user.id } },
    include: { booking: { include: { service: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Invoices</h1>
      <p className="mt-1 text-zinc-600">Payment status and totals for your completed work.</p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-zinc-700">Invoice</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Service</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Total</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Status</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="px-4 py-3 font-mono">{inv.invoiceNumber}</td>
                <td className="px-4 py-3 text-zinc-800">{inv.booking.service.name}</td>
                <td className="px-4 py-3">{formatCurrency(inv.total)}</td>
                <td className="px-4 py-3">{inv.paymentStatus}</td>
                <td className="px-4 py-3 text-zinc-600">{formatDate(inv.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-zinc-600">No invoices yet.</p>
        )}
      </div>
      <p className="mt-6 text-sm text-zinc-600">
        Questions?{" "}
        <Link href="/account/bookings" className="font-medium text-teal-800 hover:underline">
          View your bookings
        </Link>
      </p>
    </div>
  );
}
