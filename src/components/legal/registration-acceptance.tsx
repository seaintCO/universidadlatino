"use client";

import { useState } from "react";
import Link from "next/link";

export function RegistrationAcceptance() {
  const [termsError, setTermsError] = useState(false);
  const [refundError, setRefundError] = useState(false);

  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">Aceptación de políticas legales</legend>
      <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg p-2 text-sm leading-6 text-[#4f534e]">
        <input
          type="checkbox"
          name="acceptedTerms"
          required
          className="mt-1 h-5 w-5 shrink-0 accent-[#2f6650]"
          onInvalid={(event) => {
            event.preventDefault();
            setTermsError(true);
          }}
          onChange={(event) => setTermsError(!event.currentTarget.checked)}
        />
        <span>
          He leído y acepto los{" "}
          <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1f211f] underline">
            Términos y Condiciones
          </Link>.
          {termsError ? <span className="mt-1 block text-xs font-semibold text-red-700">Debes aceptar los Términos y Condiciones.</span> : null}
        </span>
      </label>
      <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg p-2 text-sm leading-6 text-[#4f534e]">
        <input
          type="checkbox"
          name="acceptedRefundPolicy"
          required
          className="mt-1 h-5 w-5 shrink-0 accent-[#2f6650]"
          onInvalid={(event) => {
            event.preventDefault();
            setRefundError(true);
          }}
          onChange={(event) => setRefundError(!event.currentTarget.checked)}
        />
        <span>
          Entiendo y acepto la{" "}
          <Link href="/refund-policy" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1f211f] underline">
            Política de Reembolsos
          </Link>.
          {refundError ? <span className="mt-1 block text-xs font-semibold text-red-700">Debes aceptar la Política de Reembolsos.</span> : null}
        </span>
      </label>
      <p className="text-center text-xs leading-5 text-[#686c66]">
        Al crear tu cuenta confirmas que has leído y aceptado nuestras políticas legales.
      </p>
    </fieldset>
  );
}
