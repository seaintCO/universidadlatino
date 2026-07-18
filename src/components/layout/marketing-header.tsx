import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/lib/payments/access";
import { logout } from "@/app/(auth)/actions";

export async function MarketingHeader() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasAccess = false;

  if (user) {
    hasAccess = (await getUserEntitlements(user.id)).hasAnyCourse;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#ddd9d0]/80 bg-[#f7f5f0]/95 backdrop-blur-xl">
      <div className="container-shell flex min-h-16 items-center justify-between gap-3 py-2">
        <Link
          href="/"
          className="shrink-0 text-sm font-bold tracking-[-0.04em] text-[#1f211f] sm:text-base"
        >
          CURSOCAPITAL
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="/#cursos"
            className="text-sm font-medium text-[#686c66] hover:text-[#1f211f]"
          >
            Academia
          </Link>

          <Link
            href="/#precios"
            className="text-sm font-medium text-[#686c66] hover:text-[#1f211f]"
          >
            Precios
          </Link>

          {!user ? (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-[#1f211f] hover:text-[#2f6650]"
              >
                Iniciar sesión
              </Link>

              <Link
                href="/#precios"
                className="rounded-lg bg-[#2f6650] px-5 py-2.5 text-sm font-semibold !text-white hover:bg-[#254f3f]"
              >
                Comprar curso
              </Link>
            </>
          ) : hasAccess ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-[#1f211f] hover:text-[#2f6650]"
              >
                Mi Panel
              </Link>

              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg border border-[#ddd9d0] bg-white px-5 py-2.5 text-sm font-semibold text-[#1f211f] hover:bg-[#efede7]"
                >
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-[#1f211f] hover:text-[#2f6650]"
              >
                Cambiar cuenta
              </Link>

              <Link
                href="/#precios"
                className="rounded-lg bg-[#2f6650] px-5 py-2.5 text-sm font-semibold !text-white hover:bg-[#254f3f]"
              >
                Comprar curso
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          {!user ? (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-[#ddd9d0] bg-white px-3 py-2 text-[11px] font-semibold text-[#1f211f]"
              >
                Iniciar sesión
              </Link>

              <Link
                href="/#precios"
                className="rounded-lg bg-[#2f6650] px-3 py-2 text-[11px] font-semibold !text-white"
              >
                Comprar
              </Link>
            </>
          ) : hasAccess ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg bg-[#2f6650] px-3 py-2 text-[11px] font-semibold !text-white"
              >
                Mi Panel
              </Link>

              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg border border-[#ddd9d0] bg-white px-3 py-2 text-[11px] font-semibold text-[#1f211f]"
                >
                  Salir
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-[#ddd9d0] bg-white px-3 py-2 text-[11px] font-semibold text-[#1f211f]"
              >
                Cambiar cuenta
              </Link>

              <Link
                href="/#precios"
                className="rounded-lg bg-[#2f6650] px-3 py-2 text-[11px] font-semibold !text-white"
              >
                Comprar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
