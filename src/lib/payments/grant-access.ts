import "server-only";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPurchaseKey } from "@/lib/payments/catalog";
import { checkoutPaymentSucceeded } from "@/lib/payments/entitlements";

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
  expectedUserId?: string,
) {
  const userId = session.metadata?.user_id ?? session.client_reference_id;

  const accessKey = session.metadata?.access_key;

  if (!userId || !isPurchaseKey(accessKey)) {
    throw new Error("Checkout session is missing valid access metadata.");
  }

  if (expectedUserId && userId !== expectedUserId) {
    throw new Error("La compra pertenece a otra cuenta.");
  }

  if (!checkoutPaymentSucceeded(session.payment_status)) {
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
      course_slug: session.metadata?.course_slug ?? accessKey,
      accepted_terms: session.metadata?.accepted_terms === "true",
      accepted_refund_policy:
        session.metadata?.accepted_refund_policy === "true",
      accepted_at: session.metadata?.accepted_at ?? null,
      policy_version: session.metadata?.policy_version ?? null,
      amount_total: session.amount_total,
      currency: session.currency,
      purchased_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,course_slug",
    },
  );

  if (error) {
    throw new Error(`Unable to grant course access: ${error.message}`);
  }
}

export async function grantAccessFromPaymentIntent(
  paymentIntent: Stripe.PaymentIntent,
) {
  const userId = paymentIntent.metadata.user_id;
  const accessKey = paymentIntent.metadata.access_key;

  if (
    !userId ||
    !isPurchaseKey(accessKey) ||
    paymentIntent.status !== "succeeded"
  ) {
    return;
  }

  const supabase = createAdminClient();

  const { error } = await supabase.from("mu_course_access").upsert(
    {
      user_id: userId,
      access_key: accessKey,
      course_slug: paymentIntent.metadata.course_slug ?? accessKey,
      accepted_terms: paymentIntent.metadata.accepted_terms === "true",
      accepted_refund_policy:
        paymentIntent.metadata.accepted_refund_policy === "true",
      accepted_at: paymentIntent.metadata.accepted_at ?? null,
      policy_version: paymentIntent.metadata.policy_version ?? null,
      status: "active",
      stripe_payment_intent_id: paymentIntent.id,
      stripe_customer_id: stripeId(paymentIntent.customer),
      amount_total: paymentIntent.amount_received || paymentIntent.amount,
      currency: paymentIntent.currency,
      purchased_at: new Date(paymentIntent.created * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,course_slug",
    },
  );

  if (error) {
    throw new Error(`Unable to grant PaymentIntent access: ${error.message}`);
  }
}
