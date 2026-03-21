import type { UserRole } from "@prisma/client";
import { isAdmin, isCustomer, isTechnician } from "./roles";

export function canAccessCustomerPortal(role: UserRole) {
  return isCustomer(role);
}

export function canAccessAdmin(role: UserRole) {
  return isAdmin(role);
}

export function canAccessTechnician(role: UserRole) {
  return isTechnician(role);
}
