"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";

const validProducts = new Set([
  "trading",
  "ecommerce",
  "tiktok_shop",
  "bundle",
]);

export function PendingCheckout() {
  const started = useRef(false);
  const [error, setError] = useState("");
  const opening = !error;
  useEffect(() => {
    if (started.current) {
      return;
    }

    const pendingPurchase = window.sessionStorage.getItem(
      "cursocapital_pending_purchase",
    );

    if (!pendingPurchase || !validProducts.has(pendingPurchase)) {
      return;
    }

    started.current = true;

    async function continueCheckout() {
      try {
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product: pendingPurchase,
          }),
        });

        const result = (await response.json()) as {
          url?: string;
          error?: string;
        };

        if (response.status === 401) {
          started.current = false;
          return;
        }

        if (!response.ok || !result.url) {
          throw new Error(
            result.error ?? "No se pudo abrir la página de pago.",
          );
        }

        window.sessionStorage.removeItem("cursocapital_pending_purchase");

        window.location.assign(result.url);
      } catch (checkoutError) {
        setError(
          checkoutError instanceof Error
            ? checkoutError.message
            : "No se pudo abrir la página de pago.",
        );
      }
    }

    void continueCheckout();
  }, []);

  if (!opening && !error) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-5 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111311] p-8 text-center text-white shadow-2xl">
        {opening ? (
          <>
            <LoaderCircle
              size={40}
              className="mx-auto animate-spin text-[#79a98e]"
            />

            <h2 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
              Abriendo tu pago seguro
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/55">
              Tu cuenta está lista. Ahora te estamos llevando a Stripe para
              completar tu compra.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold tracking-[-0.04em]">
              No se pudo abrir Stripe
            </h2>

            <p className="mt-3 text-sm leading-6 text-red-300">{error}</p>

            <button
              type="button"
              onClick={() => window.location.assign("/#precios")}
              className="mt-6 min-h-11 rounded-lg bg-white px-6 text-sm font-semibold text-[#111311]"
            >
              Regresar a precios
            </button>
          </>
        )}
      </div>
    </div>
  );
}
