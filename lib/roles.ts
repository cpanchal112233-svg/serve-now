import type { UserRole } from "@prisma/client";

export const ROLES = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  TECHNICIAN: "TECHNICIAN",
} as const satisfies Record<string, UserRole>;

export function isCustomer(role: UserRole) {
  return role === "CUSTOMER";
}

export function isAdmin(role: UserRole) {
  return role === "ADMIN";
}

export function isTechnician(role: UserRole) {
  return role === "TECHNICIAN";
}
