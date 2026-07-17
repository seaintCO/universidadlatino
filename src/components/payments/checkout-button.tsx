"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import type { PurchaseKey } from "@/lib/payments/catalog";

type CheckoutButtonProps = {
  product: PurchaseKey;
  children: React.ReactNode;
  className?: string;
};

export function CheckoutButton({
  product,
  children,
  className = "",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");

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
      };

      if (response.status === 401) {
        const next = encodeURIComponent("/#precios");
        window.location.assign(`/login?next=${next}`);
        return;
      }

      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "No se pudo iniciar el pago.");
      }

      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "No se pudo iniciar el pago.",
      );
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className={[
          "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-65",
          className,
        ].join(" ")}
      >
        {loading ? (
          <>
            <LoaderCircle size={17} className="animate-spin" />
            Abriendo pago…
          </>
        ) : (
          children
        )}
      </button>

      {error ? (
        <p className="mt-2 text-center text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
