import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserAccessContext } from "@/lib/payments/access";

export async function MarketingHeader() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let accountHref = "/login";
  let accountLabel = "Iniciar sesión";
  let primaryHref = "/#precios";
  let primaryLabel = "Comenzar";

  if (user) {
    const access = await getUserAccessContext(user.id);
    const canEnterPlatform = access.isAdmin || access.keys.size > 0;

    if (canEnterPlatform) {
      accountHref = "/dashboard";
      accountLabel = "Mi cuenta";
      primaryHref = "/dashboard";
      primaryLabel = "Continuar";
    } else {
      accountHref = "/#precios";
      accountLabel = "Elegir curso";
      primaryHref = "/#precios";
      primaryLabel = "Comprar";
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#ddd9d0]/80 bg-[#f7f5f0]/95 backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="shrink-0 text-sm font-bold tracking-[-0.04em] text-[#1f211f] sm:text-base"
        >
          CURSOCAPITAL
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
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

          <Link
            href={accountHref}
            className="text-sm font-medium text-[#686c66] hover:text-[#1f211f]"
          >
            {accountLabel}
          </Link>

          <Link
            href={primaryHref}
            className="rounded-lg bg-[#2f6650] px-5 py-2.5 text-sm font-semibold !text-white hover:bg-[#254f3f]"
          >
            {primaryLabel}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href={accountHref}
            className="rounded-lg border border-[#ddd9d0] bg-white px-3 py-2 text-[11px] font-semibold text-[#1f211f]"
          >
            {accountLabel}
          </Link>

          <Link
            href={primaryHref}
            className="rounded-lg bg-[#2f6650] px-3 py-2 text-[11px] font-semibold !text-white"
          >
            {primaryLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
