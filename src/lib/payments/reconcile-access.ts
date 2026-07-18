import "server-only";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPurchaseKey } from "@/lib/payments/catalog";

export type PurchaseRecoveryResult = {
  restored: number;
  error: string | null;
};

function stripeObjectId(
  value: string | Stripe.Customer | Stripe.DeletedCustomer | null,
) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.id;
}

export async function reconcileStripeAccessForUser(
  userId: string,
): Promise<PurchaseRecoveryResult> {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return {
      restored: 0,
      error: "Missing STRIPE_SECRET_KEY.",
    };
  }

  try {
    const stripe = new Stripe(secretKey);

    const paymentIntents = await stripe.paymentIntents.search({
      query: `metadata['user_id']:'${userId}'`,
      limit: 100,
      expand: ["data.latest_charge"],
    });

    const latestPurchaseByKey = new Map<
      string,
      {
        user_id: string;
        access_key: string;
        status: "active";
        stripe_payment_intent_id: string;
        stripe_customer_id: string | null;
        amount_total: number;
        currency: string;
        purchased_at: string;
        updated_at: string;
      }
    >();

    for (const paymentIntent of paymentIntents.data) {
      const accessKey = paymentIntent.metadata.access_key;

      if (paymentIntent.status !== "succeeded" || !isPurchaseKey(accessKey)) {
        continue;
      }

      const latestCharge = paymentIntent.latest_charge;

      if (
        latestCharge &&
        typeof latestCharge !== "string" &&
        (latestCharge.refunded ||
          latestCharge.amount_refunded >= latestCharge.amount)
      ) {
        continue;
      }

      const existing = latestPurchaseByKey.get(accessKey);

      if (
        existing &&
        new Date(existing.purchased_at).getTime() >=
          paymentIntent.created * 1000
      ) {
        continue;
      }

      latestPurchaseByKey.set(accessKey, {
        user_id: userId,
        access_key: accessKey,
        status: "active",
        stripe_payment_intent_id: paymentIntent.id,
        stripe_customer_id: stripeObjectId(paymentIntent.customer),
        amount_total: paymentIntent.amount_received || paymentIntent.amount,
        currency: paymentIntent.currency,
        purchased_at: new Date(paymentIntent.created * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    const rows = Array.from(latestPurchaseByKey.values());

    if (rows.length === 0) {
      return {
        restored: 0,
        error: null,
      };
    }

    const admin = createAdminClient();

    const { error } = await admin.from("mu_course_access").upsert(rows, {
      onConflict: "user_id,access_key",
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      restored: rows.length,
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Stripe recovery error.";

    console.error("Unable to reconcile Stripe purchases:", message);

    return {
      restored: 0,
      error: message,
    };
  }
}
