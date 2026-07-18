import Link from "next/link";

const navigation = [
  ["Academia", "/#cursos"],
  ["Precios", "/#precios"],
  ["Mi Panel", "/dashboard"],
  ["Contacto", "/contact"],
] as const;

const legal = [
  ["Política de Privacidad", "/privacy"],
  ["Términos y Condiciones", "/terms"],
  ["Política de Reembolsos", "/refund-policy"],
  ["Aviso Legal", "/disclaimer"],
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-[#ddd9d0] bg-[#1f211f] text-white">
      <div className="container-shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="text-base font-bold tracking-[-0.04em] !text-white">
            CURSOCAPITAL
          </Link>
          <p className="mt-5 text-sm leading-6 text-white/55">
            © 2026 CursoCapital.<br />Todos los derechos reservados.
          </p>
        </div>
        <FooterColumn title="Navegación" links={navigation} />
        <FooterColumn title="Legal" links={legal} />
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-white/45">Contacto</h2>
          <a href="mailto:support@cursocapital.com" className="mt-4 inline-block text-sm !text-white/75 hover:!text-white">
            support@cursocapital.com
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<readonly [string, string]> }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-white/45">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map(([label, href]) => (
          <li key={href}><Link href={href} className="text-sm !text-white/75 hover:!text-white">{label}</Link></li>
        ))}
      </ul>
    </nav>
  );
}
