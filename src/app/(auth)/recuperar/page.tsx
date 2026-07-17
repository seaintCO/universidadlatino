import Link from "next/link";
import { requestPasswordReset } from "@/app/(auth)/actions";

type RecoveryPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function RecoveryPage({
  searchParams,
}: RecoveryPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-5">
      <div className="w-full max-w-md rounded-2xl border border-[#ddd9d0] bg-white p-8">
        <Link href="/" className="text-sm font-bold tracking-[-0.04em]">
          CURSOCAPITAL
        </Link>

        <h1 className="mt-10 text-3xl font-semibold tracking-[-0.04em]">
          Recupera tu acceso
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#686c66]">
          Enviaremos un enlace seguro a tu correo electrónico.
        </p>

        {params.error ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {params.error}
          </div>
        ) : null}

        {params.message ? (
          <div className="mt-6 rounded-lg border border-[#c9dacf] bg-[#edf4ef] p-3 text-sm text-[#254f3f]">
            {params.message}
          </div>
        ) : null}

        <form action={requestPasswordReset} className="mt-8">
          <label htmlFor="email" className="mb-2 block text-sm font-semibold">
            Correo electrónico
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            className="focus-ring min-h-12 w-full rounded-lg border border-[#ddd9d0] px-4"
          />

          <button
            type="submit"
            className="mt-5 min-h-12 w-full rounded-lg bg-[#1f211f] px-5 text-sm font-semibold text-white"
          >
            Enviar enlace
          </button>
        </form>
      </div>
    </main>
  );
}
