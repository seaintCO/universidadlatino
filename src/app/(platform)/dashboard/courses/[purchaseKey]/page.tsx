import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getUserEntitlements } from "@/lib/payments/access";
import { canPurchase } from "@/lib/payments/entitlements";
import { isPurchaseKey } from "@/lib/payments/catalog";

const destinations = {
  trading: "/cursos/trading-desde-cero",
  ecommerce: "/cursos/ecommerce-desde-cero",
  tiktok_shop: "/cursos/tiktok-shop",
  bundle: "/cursos",
} as const;

export default async function OwnedCourseRedirect({
  params,
}: {
  params: Promise<{ purchaseKey: string }>;
}) {
  const { purchaseKey } = await params;
  if (!isPurchaseKey(purchaseKey)) notFound();

  const user = await requireUser();
  const entitlements = await getUserEntitlements(user.id);
  if (canPurchase(entitlements, purchaseKey)) redirect("/#precios");

  redirect(destinations[purchaseKey]);
}
