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
import { ReviewMarquee } from "@/components/marketing/review-marquee";
import { CheckoutButton } from "@/components/payments/checkout-button";
import type { PurchaseKey } from "@/lib/payments/catalog";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/lib/payments/access";
import { deriveUserEntitlements } from "@/lib/payments/entitlements";

const launchCourses: Array<{
  id: Exclude<PurchaseKey, "bundle">;
  number: string;
  title: string;
  description: string;
  lessons: number;
  price: number;
}> = [
  {
    id: "trading",
    number: "01",
    title: "Trading desde Cero",
    description:
      "Aprende cómo funcionan los mercados, cómo leer una gráfica y cómo comenzar a operar con una estructura clara.",
    lessons: 8,
    price: 50,
  },
  {
    id: "ecommerce",
    number: "02",
    title: "E-commerce desde Cero",
    description:
      "Aprende a encontrar productos, construir una tienda, crear una oferta y preparar tu negocio para vender online.",
    lessons: 8,
    price: 50,
  },
  {
    id: "tiktok_shop",
    number: "03",
    title: "Ganar Dinero con TikTok Shop",
    description:
      "Aprende a encontrar productos, crear contenido y generar comisiones como creador afiliado de TikTok Shop.",
    lessons: 8,
    price: 50,
  },
];

const includedCourses = [
  "Trading desde Cero",
  "E-commerce desde Cero",
  "Ganar Dinero con TikTok Shop",
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const entitlements = user
    ? await getUserEntitlements(user.id)
    : deriveUserEntitlements([]);

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <MarketingHeader />

      <main>
        <UniversidadLatinoHero />

        <section
          aria-labelledby="vsl-heading"
          className="bg-[#f7f5f0] px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
        >
          <div className="mx-auto max-w-6xl text-center">
            <h2
              id="vsl-heading"
              className="mx-auto max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-[#1f211f] md:text-4xl"
            >
              Descubre Cómo Personas Comunes Están Aprendiendo Habilidades que
              Pueden Cambiar Su Futuro
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#686c66] sm:text-base">
              Mira este video antes de elegir tu curso.
            </p>

            <div className="mx-auto mt-9 w-full max-w-[1000px] overflow-hidden rounded-2xl bg-[#1f211f] shadow-[0_24px_70px_-32px_rgba(31,33,31,0.5)]">
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full border-0"
                  src="https://www.youtube-nocookie.com/embed/pUOAx5AGFSM?autoplay=0&controls=1&rel=0"
                  title="Video de presentación oficial de Curso Capital"
                  aria-label="Reproducir video de presentación de Curso Capital"
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>

            <Link
              href="#cursos"
              aria-label="Comenzar ahora y ver los cursos disponibles"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#2f6650] px-7 text-sm font-semibold !text-white transition-colors hover:bg-[#254f3f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6650] focus-visible:ring-offset-2"
            >
              Comenzar Ahora
            </Link>
          </div>
        </section>

        <section className="overflow-hidden bg-[#f7f5f0] px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:pb-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-7 text-center sm:mb-9">
              <p className="editorial-label mb-3">Conoce la plataforma</p>

              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#1f211f] sm:text-3xl md:text-4xl">
                Una universidad diseñada para avanzar.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#686c66] sm:text-base">
                Descubre cómo funcionan las rutas, las lecciones y el
                seguimiento de progreso dentro de CursoCapital.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-5xl">
              <div className="pointer-events-none absolute -inset-4 rounded-[32px] bg-[#2f6650]/10 blur-3xl sm:-inset-6" />

              <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#1c1f1d] shadow-[0_25px_70px_-35px_rgba(31,33,31,0.55)] sm:rounded-3xl">
                <div className="relative aspect-video w-full">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(121,169,142,0.13),transparent_48%)]" />

                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,rgba(0,0,0,0.3))]" />

                  <div className="absolute inset-0 flex items-center justify-center px-5">
                    <div className="text-center text-white">
                      <button
                        type="button"
                        aria-label="Reproducir video de CursoCapital"
                        className="group mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white text-[#1f211f] shadow-[0_12px_35px_rgba(0,0,0,0.32)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-8px_rgba(121,169,142,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79a98e] focus-visible:ring-offset-4 focus-visible:ring-offset-[#1c1f1d] sm:h-20 sm:w-20"
                      >
                        <Play
                          className="ml-1 transition-transform duration-300 group-hover:scale-110"
                          size={26}
                          fill="currentColor"
                        />
                      </button>

                      <p className="mt-5 text-sm font-semibold sm:text-base">
                        Conoce CursoCapital
                      </p>

                      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-white/50 sm:text-sm">
                        Trading, E-commerce y TikTok Shop dentro de una sola
                        experiencia.
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50 backdrop-blur-xl sm:bottom-5 sm:left-5 sm:right-5 sm:px-5">
                    <span>CursoCapital</span>
                    <span>Vista previa</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-7 text-[#686c66] sm:mt-10 sm:text-base sm:leading-8">
              No necesitas otra lista de ideas. Necesitas una ruta clara,
              habilidades prácticas y un sistema para avanzar paso a paso.
            </p>
          </div>
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
                Compra una ruta individual o accede a las tres dentro de
                CursoCapital.
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
                  {entitlements.ownedCourses.includes(course.id) ? (
                    <Link
                      href={`/dashboard/courses/${course.id}`}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#ddd9d0] bg-[#faf9f6] px-5 text-sm font-semibold !text-[#1f211f] transition-all hover:border-[#2f6650] hover:bg-[#2f6650] hover:!text-white"
                    >
                      Continuar curso
                      <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <CheckoutButton
                      product={course.id}
                      className="border border-[#ddd9d0] bg-[#faf9f6] !text-[#1f211f] hover:border-[#2f6650] hover:bg-[#2f6650] hover:!text-white"
                    >
                      Comprar por ${course.price}
                      <ArrowRight size={16} />
                    </CheckoutButton>
                  )}
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

                <p className="editorial-label text-[#b7bbb4]">CursoCapital</p>

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

                <div className="mt-9">
                  {entitlements.canPurchaseBundle ? (
                    <CheckoutButton
                      product="bundle"
                      className="rounded-full border border-white/20 bg-white !text-[#1f211f] hover:scale-[1.01] hover:bg-[#efede7]"
                    >
                      Obtener los tres cursos por $100
                      <ArrowRight size={17} />
                    </CheckoutButton>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white px-6 text-sm font-semibold !text-[#1f211f] hover:bg-[#efede7]"
                    >
                      Ya tienes acceso a todos los cursos.
                      <ArrowRight size={17} />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-[#868a84]">
              CursoCapital ofrece contenido educativo. No garantiza ingresos,
              resultados financieros ni éxito comercial.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
