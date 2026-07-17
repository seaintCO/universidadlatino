import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCanceledPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-5 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-[#ddd9d0] bg-white p-8 text-center md:p-12">
        <XCircle
          className="mx-auto text-[#686c66]"
          size={52}
          strokeWidth={1.6}
        />

        <p className="editorial-label mt-6">Pago cancelado</p>

        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          No se realizó ningún cargo.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#686c66]">
          Puedes regresar y elegir el curso que deseas cuando estés listo.
        </p>

        <Link
          href="/#precios"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1f211f] px-7 text-sm font-semibold !text-white hover:bg-[#30332f]"
        >
          Volver a precios
        </Link>
      </div>
    </main>
  );
}
