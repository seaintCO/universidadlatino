export const purchaseKeys = [
  "trading",
  "ecommerce",
  "tiktok_shop",
  "bundle",
] as const;

export type PurchaseKey = (typeof purchaseKeys)[number];

export const purchaseCatalog: Record<
  PurchaseKey,
  {
    name: string;
    priceLabel: string;
    envName:
      | "STRIPE_PRICE_TRADING"
      | "STRIPE_PRICE_ECOMMERCE"
      | "STRIPE_PRICE_TIKTOK_SHOP"
      | "STRIPE_PRICE_BUNDLE";
  }
> = {
  trading: {
    name: "Trading desde Cero",
    priceLabel: "$50",
    envName: "STRIPE_PRICE_TRADING",
  },
  ecommerce: {
    name: "E-commerce desde Cero",
    priceLabel: "$50",
    envName: "STRIPE_PRICE_ECOMMERCE",
  },
  tiktok_shop: {
    name: "Ganar Dinero con TikTok Shop",
    priceLabel: "$50",
    envName: "STRIPE_PRICE_TIKTOK_SHOP",
  },
  bundle: {
    name: "CursoCapital — Acceso Completo",
    priceLabel: "$100",
    envName: "STRIPE_PRICE_BUNDLE",
  },
};

export function isPurchaseKey(value: unknown): value is PurchaseKey {
  return (
    typeof value === "string" &&
    purchaseKeys.includes(value as PurchaseKey)
  );
}

export function getStripePriceId(key: PurchaseKey) {
  const envName = purchaseCatalog[key].envName;
  const priceId = process.env[envName];

  if (!priceId) {
    throw new Error(`Missing ${envName}.`);
  }

  return priceId;
}

export function moduleSlugToPurchaseKey(
  moduleSlug: string,
): PurchaseKey | null {
  switch (moduleSlug) {
    case "trading-desde-cero":
      return "trading";
    case "ecommerce-desde-cero":
      return "ecommerce";
    case "tiktok-shop":
      return "tiktok_shop";
    default:
      return null;
  }
}
