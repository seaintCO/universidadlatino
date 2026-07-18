"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, LoaderCircle } from "lucide-react";
import type { PurchaseKey } from "@/lib/payments/catalog";

export function ContinueCheckout({ product }: { product: PurchaseKey }) {
  const started = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) {
      return;
    }

    started.current = true;

    async function openStripe() {
      try {
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product }),
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
      }
    }

    void openStripe();
  }, [product]);

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
            <LoaderCircle
              size={44}
              className="mx-auto animate-spin text-[#79a98e]"
              strokeWidth={1.7}
            />

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#79a98e]">
              Cuenta verificada
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
              Abriendo tu pago seguro…
            </h1>

            <p className="mt-3 text-sm leading-7 text-white/50">
              Te estamos enviando directamente a Stripe para finalizar tu
              compra.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
