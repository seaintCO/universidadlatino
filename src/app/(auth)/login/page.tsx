import Link from "next/link";
import { login } from "@/app/(auth)/actions";
import { isPurchaseKey } from "@/lib/payments/catalog";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
    purchase?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  const purchase = isPurchaseKey(params.purchase) ? params.purchase : "";

  return (
    <main className="grid min-h-screen bg-white md:grid-cols-2">
      <section className="hidden bg-[#1f211f] p-12 text-white md:flex md:flex-col md:justify-between">
        <Link href="/" className="text-base font-bold tracking-[-0.04em]">
          CURSOCAPITAL
        </Link>

        <div className="max-w-md">
          <h1 className="text-5xl font-semibold leading-tight tracking-[-0.05em]">
            Regresa a tus cursos.
          </h1>

          <p className="mt-6 leading-8 text-[#b7bbb4]">
            Usa el mismo correo y contraseña que utilizaste al crear tu cuenta y
            realizar tu compra.
          </p>
        </div>

        <p className="text-sm text-[#8f948d]">
          Tu acceso permanece guardado en tu cuenta.
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-12 block text-sm font-bold tracking-[-0.04em] md:hidden"
          >
            CURSOCAPITAL
          </Link>

          <p className="editorial-label">Para estudiantes existentes</p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
            Inicia sesión
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#686c66]">
            Tu compra y tu progreso están asociados a tu correo electrónico.
          </p>

          {purchase ? (
            <div className="mt-5 rounded-lg border border-[#c9dacf] bg-[#edf4ef] p-3 text-sm leading-6 text-[#254f3f]">
              Después de iniciar sesión continuarás directamente al pago de tu
              curso seleccionado.
            </div>
          ) : null}

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

          <form action={login} className="mt-8 space-y-5">
            <input
              type="hidden"
              name="next"
              value={params.next ?? "/dashboard"}
            />

            <input type="hidden" name="purchase" value={purchase} />

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Correo electrónico
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="focus-ring min-h-12 w-full rounded-lg border border-[#ddd9d0] px-4"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold">
                  Contraseña
                </label>

                <Link
                  href="/recuperar"
                  className="text-xs font-semibold text-[#2f6650]"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="focus-ring min-h-12 w-full rounded-lg border border-[#ddd9d0] px-4"
              />
            </div>

            <button
              type="submit"
              className="min-h-12 w-full rounded-lg bg-[#1f211f] px-5 text-sm font-semibold !text-white hover:bg-[#30332f]"
            >
              {purchase
                ? "Iniciar sesión y continuar al pago"
                : "Entrar a mis cursos"}
            </button>
          </form>

          {purchase ? (
            <div className="mt-8 border-t border-[#ddd9d0] pt-7 text-center">
              <p className="text-sm text-[#686c66]">¿Es tu primera compra?</p>

              <Link
                href={`/registro?purchase=${encodeURIComponent(purchase)}`}
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[#ddd9d0] bg-white px-5 text-sm font-semibold text-[#1f211f] hover:bg-[#efede7]"
              >
                Crear cuenta y pagar
              </Link>
            </div>
          ) : (
            <div className="mt-8 border-t border-[#ddd9d0] pt-7 text-center">
              <p className="text-sm text-[#686c66]">
                ¿Todavía no tienes un curso?
              </p>

              <Link
                href="/#precios"
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[#ddd9d0] bg-white px-5 text-sm font-semibold text-[#1f211f] hover:bg-[#efede7]"
              >
                Elegir un curso
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
