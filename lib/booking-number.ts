import { prisma } from "./db";

export async function generateNextBookingNumber() {
  const year = new Date().getFullYear();
  const prefix = `SN-${year}-`;
  const latest = await prisma.booking.findFirst({
    where: { bookingNumber: { startsWith: prefix } },
    orderBy: { bookingNumber: "desc" },
  });
  let next = 1;
  if (latest) {
    const match = latest.bookingNumber.match(/SN-\d{4}-(\d+)/);
    if (match) next = Number(match[1]) + 1;
  }
  return `${prefix}${String(next).padStart(3, "0")}`;
}
