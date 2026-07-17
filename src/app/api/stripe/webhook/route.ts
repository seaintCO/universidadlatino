import { NextResponse } from "next/server";
import Stripe from "stripe";
import { grantAccessFromCheckoutSession } from "@/lib/payments/grant-access";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 500 },
    );
  }

  const stripe = new Stripe(stripeSecret);
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  try {
    const rawBody = await request.text();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await grantAccessFromCheckoutSession(
        event.data.object as Stripe.Checkout.Session,
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed.",
      },
      { status: 400 },
    );
  }
}
