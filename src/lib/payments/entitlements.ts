import type { PurchaseKey } from "./catalog.ts";

export const individualCourses = [
  "trading",
  "ecommerce",
  "tiktok_shop",
] as const;

export type UserEntitlements = {
  ownsTrading: boolean;
  ownsEcommerce: boolean;
  ownsTikTok: boolean;
  ownsBundle: boolean;
  ownedCourses: Array<Exclude<PurchaseKey, "bundle">>;
  canPurchaseTrading: boolean;
  canPurchaseEcommerce: boolean;
  canPurchaseTikTok: boolean;
  canPurchaseBundle: boolean;
  hasAnyCourse: boolean;
};

export function deriveUserEntitlements(
  keys: Iterable<PurchaseKey>,
): UserEntitlements {
  const activeKeys = new Set(keys);
  const ownsBundle = activeKeys.has("bundle");
  const ownsTrading = ownsBundle || activeKeys.has("trading");
  const ownsEcommerce = ownsBundle || activeKeys.has("ecommerce");
  const ownsTikTok = ownsBundle || activeKeys.has("tiktok_shop");
  const ownedCourses = individualCourses.filter((course) => {
    if (course === "trading") return ownsTrading;
    if (course === "ecommerce") return ownsEcommerce;
    return ownsTikTok;
  });
  const ownsEveryIndividual =
    ownsTrading && ownsEcommerce && ownsTikTok;

  return {
    ownsTrading,
    ownsEcommerce,
    ownsTikTok,
    ownsBundle,
    ownedCourses,
    canPurchaseTrading: !ownsTrading,
    canPurchaseEcommerce: !ownsEcommerce,
    canPurchaseTikTok: !ownsTikTok,
    canPurchaseBundle: !ownsBundle && !ownsEveryIndividual,
    hasAnyCourse: ownedCourses.length > 0,
  };
}

export function canPurchase(
  entitlements: UserEntitlements,
  purchase: PurchaseKey,
) {
  if (purchase === "trading") return entitlements.canPurchaseTrading;
  if (purchase === "ecommerce") return entitlements.canPurchaseEcommerce;
  if (purchase === "tiktok_shop") return entitlements.canPurchaseTikTok;
  return entitlements.canPurchaseBundle;
}

export function ownsPurchase(keys: Iterable<PurchaseKey>, purchase: PurchaseKey) {
  return !canPurchase(deriveUserEntitlements(keys), purchase);
}

export function canEnterPlatform(role: string | null, keys: Iterable<PurchaseKey>) {
  return role === "admin" || deriveUserEntitlements(keys).hasAnyCourse;
}

export function checkoutPaymentSucceeded(status: string) {
  return status === "paid" || status === "no_payment_required";
}
