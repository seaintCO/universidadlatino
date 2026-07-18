"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  UserPlus,
  X,
} from "lucide-react";
import type { PurchaseKey } from "@/lib/payments/catalog";

type CheckoutButtonProps = {
  product: PurchaseKey;
  children: React.ReactNode;
  className?: string;
};

function AccountChoiceModal({
  product,
  onClose,
}: {
  product: PurchaseKey;
  onClose: () => void;
}) {
  const purchase = encodeURIComponent(product);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="purchase-account-title"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#111311] p-6 text-white shadow-[0_35px_100px_rgba(0,0,0,0.55)] sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ventana"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={17} />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#79a98e]/15 text-[#79a98e]">
          <LockKeyhole size={22} />
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#79a98e]">
          Pago seguro
        </p>

        <h2
          id="purchase-account-title"
          className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl"
        >
          Antes de continuar...
        </h2>

        <p className="mt-4 text-sm leading-7 text-white/55">
          ¿Ya tienes una cuenta?
        </p>

        <div className="mt-7 space-y-3">
          <Link
            href={`/login?purchase=${purchase}`}
            className="group flex min-h-14 w-full items-center justify-between rounded-xl border border-white/10 bg-white px-5 text-sm font-semibold !text-[#111311] transition-all hover:scale-[1.01] hover:bg-[#eef0ed]"
          >
            <span className="flex items-center gap-3">
              <LogIn size={19} />
              Ya tengo una cuenta
            </span>

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <Link
            href={`/registro?purchase=${purchase}`}
            className="group flex min-h-14 w-full items-center justify-between rounded-xl border border-white/15 bg-white/[0.06] px-5 text-sm font-semibold !text-white transition-all hover:scale-[1.01] hover:bg-white/10"
          >
            <span className="flex items-center gap-3">
              <UserPlus size={19} />
              Crear cuenta
            </span>

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <p className="mt-6 text-center text-[11px] leading-5 text-white/35">
          Serás enviado a Stripe inmediatamente después de iniciar sesión o
          crear tu cuenta.
        </p>
      </div>
    </div>
  );
}

export function CheckoutButton({
  product,
  children,
  className = "",
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
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
        setLoading(false);
        setShowAccountModal(true);
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
    <>
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

      {showAccountModal ? (
        <AccountChoiceModal
          product={product}
          onClose={() => setShowAccountModal(false)}
        />
      ) : null}
    </>
  );
}
