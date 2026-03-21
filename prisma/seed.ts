import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.statusLog.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.jobAssignment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.technicianProfile.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("demo123", 10);

  await prisma.user.create({
    data: {
      name: "ServeNow Admin",
      email: "admin@servenow.demo",
      passwordHash,
      role: "ADMIN",
      phone: "+1 555 0100",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Demo Customer",
      email: "customer@servenow.demo",
      passwordHash,
      role: "CUSTOMER",
      phone: "+1 555 0101",
    },
  });

  const tech1User = await prisma.user.create({
    data: {
      name: "Ali Raza",
      email: "ali.raza@servenow.demo",
      passwordHash,
      role: "TECHNICIAN",
      phone: "+1 555 0201",
      technicianProfile: {
        create: {
          isAvailable: true,
          serviceArea: "Downtown & Midtown",
          vehicleName: "Van SN-01",
        },
      },
    },
    include: { technicianProfile: true },
  });

  const tech2User = await prisma.user.create({
    data: {
      name: "Hassan Malik",
      email: "hassan.malik@servenow.demo",
      passwordHash,
      role: "TECHNICIAN",
      phone: "+1 555 0202",
      technicianProfile: {
        create: {
          isAvailable: true,
          serviceArea: "North & Suburbs",
          vehicleName: "Van SN-02",
        },
      },
    },
    include: { technicianProfile: true },
  });

  const tech3User = await prisma.user.create({
    data: {
      name: "Sara Khan",
      email: "sara.khan@servenow.demo",
      passwordHash,
      role: "TECHNICIAN",
      phone: "+1 555 0203",
      technicianProfile: {
        create: {
          isAvailable: true,
          serviceArea: "East & Industrial",
          vehicleName: "Van SN-03",
        },
      },
    },
    include: { technicianProfile: true },
  });

  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: "AC Repair",
        slug: "ac-repair",
        description: "Diagnostics, refrigerant check, and quick repairs for residential AC units.",
        durationMinutes: 90,
        price: new Prisma.Decimal("149.00"),
      },
    }),
    prisma.service.create({
      data: {
        name: "Home Cleaning",
        slug: "home-cleaning",
        description: "Deep cleaning for kitchens, bathrooms, and living areas.",
        durationMinutes: 120,
        price: new Prisma.Decimal("189.00"),
      },
    }),
    prisma.service.create({
      data: {
        name: "Plumbing Visit",
        slug: "plumbing-visit",
        description: "Leak inspection, drain clearing, and fixture tune-ups.",
        durationMinutes: 60,
        price: new Prisma.Decimal("129.00"),
      },
    }),
    prisma.service.create({
      data: {
        name: "Pest Control",
        slug: "pest-control",
        description: "Interior and perimeter treatment with follow-up scheduling.",
        durationMinutes: 75,
        price: new Prisma.Decimal("159.00"),
      },
    }),
    prisma.service.create({
      data: {
        name: "Electrical Inspection",
        slug: "electrical-inspection",
        description: "Panel review, outlet testing, and safety report.",
        durationMinutes: 45,
        price: new Prisma.Decimal("99.00"),
      },
    }),
  ]);

  const [ac, cleaning, plumbing] = services;

  const booking1 = await prisma.booking.create({
    data: {
      bookingNumber: "SN-2026-001",
      customerId: customer.id,
      serviceId: ac.id,
      scheduledDate: new Date("2026-03-24"),
      scheduledTime: "09:00–11:00",
      address: "1200 Market St, Suite 400",
      notes: "Outdoor unit is noisy on startup.",
      status: "ASSIGNED",
      statusLogs: {
        create: [
          { status: "BOOKED", note: "Booking received" },
          { status: "ASSIGNED", note: "Technician assigned" },
        ],
      },
      assignments: {
        create: {
          technicianId: tech1User.technicianProfile!.id,
          eta: new Date("2026-03-24T10:30:00"),
          status: "ASSIGNED",
        },
      },
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      bookingNumber: "SN-2026-002",
      customerId: customer.id,
      serviceId: cleaning.id,
      scheduledDate: new Date("2026-03-25"),
      scheduledTime: "13:00–16:00",
      address: "88 Maple Ave",
      notes: "Two pets on site — please knock before entering.",
      status: "EN_ROUTE",
      statusLogs: {
        create: [
          { status: "BOOKED", note: "Booking received" },
          { status: "ASSIGNED", note: "Technician assigned" },
          { status: "EN_ROUTE", note: "Technician is on the way" },
        ],
      },
      assignments: {
        create: {
          technicianId: tech2User.technicianProfile!.id,
          eta: new Date("2026-03-25T14:00:00"),
          status: "EN_ROUTE",
        },
      },
    },
  });

  const booking3 = await prisma.booking.create({
    data: {
      bookingNumber: "SN-2026-003",
      customerId: customer.id,
      serviceId: plumbing.id,
      scheduledDate: new Date("2026-03-22"),
      scheduledTime: "08:00–10:00",
      address: "45 River Rd",
      notes: "Kitchen sink slow drain.",
      status: "COMPLETED",
      statusLogs: {
        create: [
          { status: "BOOKED", note: "Booking received" },
          { status: "ASSIGNED", note: "Technician assigned" },
          { status: "IN_PROGRESS", note: "Work started" },
          { status: "COMPLETED", note: "Trap cleared, flow restored" },
        ],
      },
      assignments: {
        create: {
          technicianId: tech3User.technicianProfile!.id,
          status: "COMPLETED",
        },
      },
    },
  });

  await prisma.invoice.create({
    data: {
      bookingId: booking3.id,
      invoiceNumber: "INV-2026-0001",
      subtotal: new Prisma.Decimal("129.00"),
      total: new Prisma.Decimal("129.00"),
      paymentStatus: "PAID",
    },
  });

  console.log("Seed complete:", {
    admin: "admin@servenow.demo",
    customer: customer.email,
    technicians: [tech1User.email, tech2User.email, tech3User.email],
    bookings: [booking1.bookingNumber, booking2.bookingNumber, booking3.bookingNumber],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
