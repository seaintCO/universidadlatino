import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import {
  getStripePriceId,
  isPurchaseKey,
  purchaseCatalog,
} from "@/lib/payments/catalog";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      product?: unknown;
    };

    if (!isPurchaseKey(body.product)) {
      return NextResponse.json(
        { error: "Producto invÃ¡lido." },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Debes iniciar sesiÃ³n antes de comprar." },
        { status: 401 },
      );
    }

    const { data: existingAccess, error: accessError } = await supabase
      .from("mu_course_access")
      .select("access_key")
      .eq("user_id", user.id)
      .eq("status", "active");

    if (accessError) {
      throw new Error(
        `Unable to verify existing access: ${accessError.message}`,
      );
    }

    const ownedKeys = new Set(
      (existingAccess ?? []).map((row) => row.access_key),
    );
    const alreadyOwned = ownedKeys.has("bundle") || ownedKeys.has(body.product);

    if (alreadyOwned) {
      return NextResponse.json({
        url: "/dashboard",
        alreadyOwned: true,
      });
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecret) {
      throw new Error("Missing STRIPE_SECRET_KEY.");
    }

    const stripe = new Stripe(stripeSecret);
    const configuredOrigin =
      process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
    const origin = configuredOrigin ?? new URL(request.url).origin;
    const product = body.product;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: getStripePriceId(product),
          quantity: 1,
        },
      ],
      success_url: `${origin}/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pago/cancelado`,
      customer_email: user.email ?? undefined,
      customer_creation: "always",
      client_reference_id: user.id,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: {
        user_id: user.id,
        access_key: product,
        product_name: purchaseCatalog[product].name,
      },
      payment_intent_data: {
        metadata: {
          user_id: user.id,
          access_key: product,
        },
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a Checkout URL.");
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Unable to create Stripe Checkout Session:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo iniciar el pago.",
      },
      { status: 500 },
    );
  }
}
