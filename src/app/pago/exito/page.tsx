import Link from "next/link";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { CheckCircle2 } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { grantAccessFromCheckoutSession } from "@/lib/payments/grant-access";

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function PaymentSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const user = await requireUser();
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    redirect("/dashboard");
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecret) {
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }

  const stripe = new Stripe(stripeSecret);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const sessionUserId =
    session.metadata?.user_id ?? session.client_reference_id;

  if (sessionUserId !== user.id) {
    redirect("/dashboard");
  }

  await grantAccessFromCheckoutSession(session);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-5 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-[#ddd9d0] bg-white p-8 text-center shadow-[0_20px_70px_rgba(31,33,31,0.08)] md:p-12">
        <CheckCircle2
          className="mx-auto text-[#2f6650]"
          size={52}
          strokeWidth={1.6}
        />

        <p className="editorial-label mt-6">Pago confirmado</p>

        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          Tu acceso ya está activo.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#686c66]">
          Puedes entrar al panel y comenzar tus lecciones inmediatamente.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1f211f] px-7 text-sm font-semibold !text-white hover:bg-[#30332f]"
        >
          Ir a mi panel
        </Link>
      </div>
    </main>
  );
}
