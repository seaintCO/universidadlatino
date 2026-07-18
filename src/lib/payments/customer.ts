import "server-only";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export function createStripeClient() {
  const secret = process.env.STRIPE_SECRET_KEY;

  if (!secret) {
    throw new Error("Stripe no está configurado.");
  }

  return new Stripe(secret);
}

export async function ensureStripeCustomer(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}) {
  if (!user.email) {
    throw new Error("La cuenta necesita un correo electrónico válido.");
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("mu_profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  const stripe = createStripeClient();
  if (profile?.stripe_customer_id) {
    try {
      const customer = await stripe.customers.retrieve(profile.stripe_customer_id);
      if (!customer.deleted) return customer.id;
    } catch {
      // Recreate a customer if a stale Stripe id was stored.
    }
  }

  const matches = await stripe.customers.list({ email: user.email, limit: 100 });
  const matchingCustomer = matches.data.find(
    (customer) => customer.metadata.user_id === user.id,
  );
  const customer =
    matchingCustomer ??
    (await stripe.customers.create(
      {
        email: user.email,
        name: [user.user_metadata?.first_name, user.user_metadata?.last_name]
          .filter(Boolean)
          .join(" ") || undefined,
        metadata: { user_id: user.id },
      },
      { idempotencyKey: `customer-${user.id}` },
    ));

  const { error } = await admin.from("mu_profiles").upsert(
    {
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name ?? null,
      last_name: user.user_metadata?.last_name ?? null,
      stripe_customer_id: customer.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) throw new Error(`No se pudo vincular Stripe: ${error.message}`);
  return customer.id;
}
