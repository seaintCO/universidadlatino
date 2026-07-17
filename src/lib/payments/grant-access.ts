import "server-only";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPurchaseKey } from "@/lib/payments/catalog";

function stripeId(
  value:
    | string
    | Stripe.PaymentIntent
    | Stripe.Customer
    | Stripe.DeletedCustomer
    | null,
) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.id;
}

export async function grantAccessFromCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  const userId = session.metadata?.user_id ?? session.client_reference_id;
  const accessKey = session.metadata?.access_key;

  if (!userId || !isPurchaseKey(accessKey)) {
    throw new Error("Checkout session is missing valid access metadata.");
  }

  if (
    session.payment_status !== "paid" &&
    session.payment_status !== "no_payment_required"
  ) {
    return;
  }

  const supabase = createAdminClient();

  const { error } = await supabase.from("mu_course_access").upsert(
    {
      user_id: userId,
      access_key: accessKey,
      status: "active",
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: stripeId(session.payment_intent),
      stripe_customer_id: stripeId(session.customer),
      amount_total: session.amount_total,
      currency: session.currency,
      purchased_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,access_key",
    },
  );

  if (error) {
    throw new Error(`Unable to grant course access: ${error.message}`);
  }
}
