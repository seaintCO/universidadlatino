import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createStripeClient } from "@/lib/payments/customer";
import { grantAccessFromCheckoutSession } from "@/lib/payments/grant-access";

export async function reconcileStripeAccessForUser(userId: string) {
  try {
    const admin = createAdminClient();
    const { data: authData, error: authError } =
      await admin.auth.admin.getUserById(userId);
    if (authError || !authData.user?.email) {
      return { recovered: 0, error: authError?.message ?? "Cuenta no encontrada." };
    }

    const { data: profile } = await admin
      .from("mu_profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .maybeSingle();
    const stripe = createStripeClient();
    const customers = profile?.stripe_customer_id
      ? [await stripe.customers.retrieve(profile.stripe_customer_id)]
      : (await stripe.customers.list({ email: authData.user.email, limit: 100 })).data;

    let recovered = 0;
    for (const customer of customers) {
      if (customer.deleted) continue;
      const sessions = await stripe.checkout.sessions.list({
        customer: customer.id,
        status: "complete",
        limit: 100,
      });
      for (const session of sessions.data) {
        const owner = session.metadata?.user_id ?? session.client_reference_id;
        const metadataEmail = session.metadata?.email?.toLowerCase();
        const customerEmail = customer.email?.toLowerCase();
        const belongsToUser =
          owner === userId ||
          (!owner &&
            (metadataEmail === authData.user.email.toLowerCase() ||
              customerEmail === authData.user.email.toLowerCase()));
        if (belongsToUser && session.payment_status === "paid") {
          await grantAccessFromCheckoutSession(session, userId);
          recovered += 1;
        }
      }
    }
    return { recovered, error: null };
  } catch (error) {
    return { recovered: 0, error: error instanceof Error ? error.message : "No se pudo recuperar la compra." };
  }
}
