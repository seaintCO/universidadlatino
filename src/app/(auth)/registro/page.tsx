import Link from "next/link";
import { redirect } from "next/navigation";
import { signup } from "@/app/(auth)/actions";
import { isPurchaseKey } from "@/lib/payments/catalog";
import { RegistrationAcceptance } from "@/components/legal/registration-acceptance";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
    purchase?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const purchase = isPurchaseKey(params.purchase) ? params.purchase : "";

  if (!purchase) {
    redirect("/#precios");
  }

  const loginHref = `/login?purchase=${encodeURIComponent(purchase)}`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-5 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-[#ddd9d0] bg-white p-7 md:p-10">
        <Link href="/" className="text-sm font-bold tracking-[-0.04em]">
          CURSOCAPITAL
        </Link>

        <h1 className="mt-10 text-3xl font-semibold tracking-[-0.04em]">
          Crea tu cuenta
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#686c66]">
          Tu curso ya está seleccionado. Crea tu acceso y continúa directamente
          a Stripe para finalizar el pago.
        </p>

        <div className="mt-5 rounded-lg border border-[#c9dacf] bg-[#edf4ef] p-3 text-sm text-[#254f3f]">
          Tu selección está guardada. No tendrás que volver a elegir el curso.
        </div>

        {params.error ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {params.error}
          </div>
        ) : null}

        <form action={signup} className="mt-8 space-y-5">
          <input type="hidden" name="purchase" value={purchase} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-semibold"
              >
                Nombre
              </label>

              <input
                id="firstName"
                name="firstName"
                required
                autoComplete="given-name"
                className="focus-ring min-h-12 w-full rounded-lg border border-[#ddd9d0] px-4"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-semibold"
              >
                Apellido
              </label>

              <input
                id="lastName"
                name="lastName"
                required
                autoComplete="family-name"
                className="focus-ring min-h-12 w-full rounded-lg border border-[#ddd9d0] px-4"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">
              Correo electrónico
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="focus-ring min-h-12 w-full rounded-lg border border-[#ddd9d0] px-4"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
            >
              Contraseña
            </label>

            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              required
              className="focus-ring min-h-12 w-full rounded-lg border border-[#ddd9d0] px-4"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-semibold"
            >
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              minLength={8}
              autoComplete="new-password"
              required
              className="focus-ring min-h-12 w-full rounded-lg border border-[#ddd9d0] px-4"
            />
          </div>

          <button
            type="submit"
            className="min-h-12 w-full rounded-lg bg-[#2f6650] px-5 text-sm font-semibold !text-white hover:bg-[#254f3f]"
          >
            Crear cuenta y continuar al pago
          </button>

          <RegistrationAcceptance />
        </form>

        <p className="mt-7 text-center text-sm text-[#686c66]">
          ¿Ya tienes una cuenta?{" "}
          <Link href={loginHref} className="font-semibold text-[#1f211f]">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
