import type { PurchaseKey } from "./catalog.ts";

export function ownsPurchase(keys: Iterable<PurchaseKey>, purchase: PurchaseKey) {
  const owned = new Set(keys);
  return owned.has("bundle") || owned.has(purchase);
}

export function canEnterPlatform(role: string | null, keys: Iterable<PurchaseKey>) {
  return role === "admin" || new Set(keys).size > 0;
}

export function checkoutPaymentSucceeded(status: string) {
  return status === "paid" || status === "no_payment_required";
}
