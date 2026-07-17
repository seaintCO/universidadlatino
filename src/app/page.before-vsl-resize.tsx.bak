import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Play,
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { UniversidadLatinoHero } from "@/components/marketing/universidad-latino-hero";
import { EliteCtaButton } from "@/components/marketing/elite-cta-button";
import { ReviewMarquee } from "@/components/marketing/review-marquee";

const launchCourses = [
  {
    id: "trading",
    number: "01",
    title: "Trading desde Cero",
    description:
      "Aprende cómo funcionan los mercados, cómo leer una gráfica y cómo comenzar a operar con una estructura clara.",
    lessons: 8,
    price: 50,
    href: "/cursos/mercado-university",
  },
  {
    id: "ecommerce",
    number: "02",
    title: "E-commerce desde Cero",
    description:
      "Aprende a encontrar productos, construir una tienda, crear una oferta y preparar tu negocio para vender online.",
    lessons: 8,
    price: 50,
    href: "/cursos/mercado-university",
  },
  {
    id: "tiktok-shop",
    number: "03",
    title: "Ganar Dinero con TikTok Shop",
    description:
      "Aprende a encontrar productos, crear contenido y generar comisiones como creador afiliado de TikTok Shop.",
    lessons: 8,
    price: 50,
    href: "/cursos/mercado-university",
  },
];

const includedCourses = [
  "Trading desde Cero",
  "E-commerce desde Cero",
  "Ganar Dinero con TikTok Shop",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <MarketingHeader />

      <main>
        <UniversidadLatinoHero />

        <section className="container-shell pb-24">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-[#1f211f]">
            <div className="text-center text-white">
              <button
                type="button"
                aria-label="Reproducir video"
                className="focus-ring mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white text-[#1f211f] transition-transform hover:scale-105"
              >
                <Play className="ml-1" size={28} fill="currentColor" />
              </button>

              <p className="mt-5 text-sm font-semibold">
                Conoce Mercado University
              </p>
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-base leading-8 text-[#686c66]">
            No necesitas otra lista de ideas. Necesitas una ruta clara,
            habilidades prácticas y un sistema que puedas seguir paso a paso.
          </p>
        </section>

        <ReviewMarquee />

        <section className="border-y border-[#ddd9d0] bg-white">
          <div className="container-shell grid gap-7 py-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Aprende a tu ritmo", Clock3],
              ["Contenido práctico", BookOpen],
              ["Quizzes incluidos", Award],
              ["Acceso a tu progreso", Check],
            ].map(([label, Icon]) => {
              const TrustIcon = Icon as typeof Clock3;

              return (
                <div
                  key={label as string}
                  className="flex items-center justify-center gap-3 text-sm font-semibold text-[#4f534e]"
                >
                  <TrustIcon size={19} strokeWidth={1.7} />
                  {label as string}
                </div>
              );
            })}
          </div>
        </section>

        <section id="cursos" className="container-shell py-24">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="editorial-label mb-3">Academia</p>

              <h2 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Tres rutas. Una meta.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#686c66] md:text-base">
                Compra una ruta individual o accede a las tres dentro de Mercado
                University.
              </p>
            </div>

            <Link
              href="#precios"
              className="hidden items-center gap-2 text-sm font-semibold text-[#2f6650] sm:flex"
            >
              Ver precios
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {launchCourses.map((course) => (
              <article
                key={course.id}
                className="group flex min-h-[420px] flex-col rounded-2xl border border-[#ddd9d0] bg-white p-7 transition-all duration-200 hover:-translate-y-1 hover:border-[#bfc5bd] hover:shadow-[0_18px_45px_rgba(31,33,31,0.07)]"
              >
                <div className="flex items-center justify-between">
                  <span className="editorial-label">Curso {course.number}</span>

                  <span className="rounded-full bg-[#edf2ee] px-3 py-1.5 text-xs font-bold text-[#2f6650]">
                    ${course.price}
                  </span>
                </div>

                <div className="mt-12">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                    {course.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#686c66]">
                    {course.description}
                  </p>
                </div>

                <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-[#686c66]">
                  <BookOpen size={16} />
                  {course.lessons} lecciones
                </div>

                <div className="mt-auto pt-10">
                  <Link
                    href={course.href}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#ddd9d0] bg-[#faf9f6] px-5 text-sm font-semibold transition-colors group-hover:border-[#2f6650] group-hover:bg-[#2f6650] group-hover:text-white"
                  >
                    Ver curso
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="precios"
          className="border-t border-[#ddd9d0] bg-white py-24"
        >
          <div className="container-shell">
            <div className="mx-auto max-w-2xl text-center">
              <p className="editorial-label mb-3">Precios</p>

              <h2 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Elige una ruta o llévate las tres.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#686c66] md:text-base">
                Acceso de pago único. Sin mensualidades.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-2xl border border-[#ddd9d0] bg-white p-7 md:p-9">
                <p className="editorial-label">Curso individual</p>

                <h3 className="mt-4 text-2xl font-semibold">
                  Elige una habilidad
                </h3>

                <p className="mt-5 text-5xl font-semibold tracking-[-0.055em]">
                  $50
                </p>

                <p className="mt-3 text-sm text-[#686c66]">
                  Pago único por curso
                </p>

                <ul className="mt-8 space-y-4 text-sm text-[#4f534e]">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#2f6650]" />
                    Ocho lecciones prácticas
                  </li>

                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#2f6650]" />
                    Quiz del curso
                  </li>

                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#2f6650]" />
                    Notas, marcadores y progreso
                  </li>

                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#2f6650]" />
                    Acceso desde cualquier dispositivo
                  </li>
                </ul>

                <Link
                  href="#cursos"
                  className="mt-9 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-[#ddd9d0] bg-white px-6 text-sm font-semibold transition-colors hover:bg-[#efede7]"
                >
                  Elegir un curso
                </Link>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-[#1f211f] p-7 text-white md:p-9">
                <div className="absolute right-6 top-6 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#1f211f]">
                  Mejor valor
                </div>

                <p className="editorial-label text-[#b7bbb4]">
                  Mercado University
                </p>

                <h3 className="mt-4 max-w-md text-2xl font-semibold">
                  Acceso a las tres rutas
                </h3>

                <div className="mt-5 flex items-end gap-3">
                  <p className="text-5xl font-semibold tracking-[-0.055em]">
                    $100
                  </p>

                  <p className="pb-1 text-sm text-[#b7bbb4]">pago único</p>
                </div>

                <p className="mt-3 text-sm text-[#b7bbb4]">
                  Ahorras $50 comparado con comprarlos por separado.
                </p>

                <ul className="mt-8 space-y-4 text-sm text-[#d8dbd5]">
                  {includedCourses.map((course) => (
                    <li key={course} className="flex items-center gap-3">
                      <CheckCircle2
                        size={18}
                        className="shrink-0 text-[#79a98e]"
                      />
                      {course}
                    </li>
                  ))}

                  <li className="flex items-center gap-3">
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-[#79a98e]"
                    />
                    24 lecciones en total
                  </li>

                  <li className="flex items-center gap-3">
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-[#79a98e]"
                    />
                    Quizzes, progreso, notas y marcadores
                  </li>
                </ul>

                <EliteCtaButton href="/evaluacion" className="mt-9 sm:w-full">
                  Obtener los tres cursos
                </EliteCtaButton>
              </div>
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-[#868a84]">
              Mercado University ofrece contenido educativo. No garantiza
              ingresos, resultados financieros ni éxito comercial.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
