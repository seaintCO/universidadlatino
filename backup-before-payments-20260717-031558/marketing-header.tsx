import Link from "next/link";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#ddd9d0]/80 bg-[#f7f5f0]/95">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-base font-bold tracking-[-0.04em] text-[#1f211f]"
        >
          CURSOCAPITAL
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/cursos"
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

          <Link
            href="/login"
            className="text-sm font-medium text-[#686c66] hover:text-[#1f211f]"
          >
            Iniciar sesión
          </Link>

          <Link
            href="/evaluacion"
            className="rounded-lg bg-[#2f6650] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#254f3f]"
          >
            Comenzar
          </Link>
        </nav>

        <Link
          href="/login"
          className="rounded-lg border border-[#ddd9d0] bg-white px-4 py-2 text-sm font-semibold md:hidden"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
