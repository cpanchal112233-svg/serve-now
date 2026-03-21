import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(7).optional().or(z.literal("")),
});

export const bookingCreateSchema = z.object({
  serviceId: z.string().min(1),
  scheduledDate: z.string().min(1),
  scheduledTime: z.string().min(1),
  address: z.string().min(5),
  notes: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerName: z.string().min(2).optional(),
  customerPhone: z.string().optional(),
  customerPassword: z.string().min(6).optional(),
});

export const bookingStatusSchema = z.object({
  status: z.enum([
    "BOOKED",
    "ASSIGNED",
    "EN_ROUTE",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ]),
  note: z.string().optional(),
});

export const dispatchSchema = z.object({
  bookingId: z.string().min(1),
  technicianProfileId: z.string().min(1),
  eta: z.string().datetime().optional(),
});

export const technicianCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  serviceArea: z.string().optional(),
  vehicleName: z.string().optional(),
});

export const completionReportSchema = z.object({
  notes: z.string().min(1),
  completedAt: z.string().datetime().optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional().or(z.literal("")),
});

export const accountPasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(6),
});

export const invoicePatchSchema = z.object({
  paymentStatus: z.enum(["PENDING", "PAID", "OVERDUE"]),
});
