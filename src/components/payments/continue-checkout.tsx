"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, LoaderCircle } from "lucide-react";
import type { PurchaseKey } from "@/lib/payments/catalog";

export function ContinueCheckout({ product }: { product: PurchaseKey }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedRefundPolicy, setAcceptedRefundPolicy] = useState(false);
  const [attempted, setAttempted] = useState(false);

  async function openStripe() {
      setAttempted(true);
      if (!acceptedTerms || !acceptedRefundPolicy) return;
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product, acceptedTerms, acceptedRefundPolicy }),
        });

        const result = (await response.json()) as {
          url?: string;
          error?: string;
          message?: string;
        };

        if (response.status === 401) {
          window.location.assign(
            `/login?purchase=${encodeURIComponent(product)}`,
          );
          return;
        }

        if (response.status === 409 && result.error === "already_owned") {
          window.location.assign("/dashboard");
          return;
        }

        if (!response.ok || !result.url) {
          throw new Error(result.message ?? result.error ?? "No se pudo abrir el pago seguro.");
        }

        window.location.assign(result.url);
      } catch (checkoutError) {
        setError(
          checkoutError instanceof Error
            ? checkoutError.message
            : "No se pudo abrir el pago seguro.",
        );
        setLoading(false);
      }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070807] px-5 py-16 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.055] p-8 text-center shadow-2xl backdrop-blur-xl">
        {error ? (
          <>
            <AlertCircle
              size={42}
              className="mx-auto text-red-300"
              strokeWidth={1.6}
            />

            <h1 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
              No pudimos abrir Stripe.
            </h1>

            <p className="mt-3 text-sm leading-7 text-red-200/75">{error}</p>

            <Link
              href="/#precios"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-6 text-sm font-semibold !text-[#111311]"
            >
              Regresar a precios
            </Link>
          </>
        ) : (
          <>
            {loading ? <LoaderCircle size={44} className="mx-auto animate-spin text-[#79a98e]" strokeWidth={1.7} /> : null}

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#79a98e]">
              Cuenta verificada
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
              {loading ? "Abriendo tu pago seguro…" : "Confirma antes de pagar"}
            </h1>

            <p className="mt-3 text-sm leading-7 text-white/50">
              Revisa y acepta las políticas para continuar a Stripe.
            </p>

            <fieldset className="mt-6 space-y-3 text-left text-xs leading-5 text-white/70">
              <legend className="sr-only">Aceptación requerida para comprar</legend>
              <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg p-2">
                <input type="checkbox" required checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.currentTarget.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#79a98e]" />
                <span>He leído y acepto los <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold !text-white underline">Términos y Condiciones</Link>.
                  {attempted && !acceptedTerms ? <span className="mt-1 block font-semibold text-red-300">Debes aceptar los Términos y Condiciones.</span> : null}
                </span>
              </label>
              <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg p-2">
                <input type="checkbox" required checked={acceptedRefundPolicy} onChange={(event) => setAcceptedRefundPolicy(event.currentTarget.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#79a98e]" />
                <span>Entiendo que todos los cursos digitales son ventas finales conforme a la <Link href="/refund-policy" target="_blank" rel="noopener noreferrer" className="font-semibold !text-white underline">Política de Reembolsos</Link>, salvo cuando la ley aplicable disponga lo contrario.
                  {attempted && !acceptedRefundPolicy ? <span className="mt-1 block font-semibold text-red-300">Debes aceptar la Política de Reembolsos.</span> : null}
                </span>
              </label>
            </fieldset>

            <button type="button" onClick={() => void openStripe()} disabled={loading} className="mt-6 min-h-12 w-full rounded-lg bg-white px-6 text-sm font-semibold text-[#111311] disabled:opacity-60">
              {loading ? "Abriendo Stripe…" : "Continuar al pago"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
