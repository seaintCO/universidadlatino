import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isPurchaseKey, type PurchaseKey } from "@/lib/payments/catalog";
import { ContinueCheckout } from "@/components/payments/continue-checkout";
import { getUserEntitlements } from "@/lib/payments/access";
import { canPurchase } from "@/lib/payments/entitlements";

type ContinueCheckoutPageProps = {
  searchParams: Promise<{
    purchase?: string;
  }>;
};

export default async function ContinueCheckoutPage({
  searchParams,
}: ContinueCheckoutPageProps) {
  const { purchase } = await searchParams;

  if (!isPurchaseKey(purchase)) {
    redirect("/#precios");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?purchase=${encodeURIComponent(purchase)}`);
  }

  const entitlements = await getUserEntitlements(user.id);
  if (!canPurchase(entitlements, purchase)) {
    redirect("/dashboard");
  }

  return <ContinueCheckout product={purchase as PurchaseKey} />;
}
