import Link from "next/link";

export function LegalPage({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f5f0] px-5 py-14 sm:py-20">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold tracking-[-0.04em]">CURSOCAPITAL</Link>
        <header className="mt-12 border-b border-[#ddd9d0] pb-9">
          <p className="editorial-label">Información legal</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">{title}</h1>
          <p className="mt-5 text-sm leading-7 text-[#686c66] sm:text-base">{description}</p>
          <p className="mt-4 text-xs font-semibold text-[#868a84]">Última actualización: 18 de julio de 2026</p>
        </header>
        <div className="space-y-9 py-10 text-[15px] leading-8 text-[#4f534e] [&_a]:font-semibold [&_a]:text-[#2f6650] [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-[-0.025em] [&_h2]:text-[#1f211f] [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_strong]:text-[#1f211f]">
          {children}
        </div>
      </article>
    </main>
  );
}
