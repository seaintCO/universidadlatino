import Link from "next/link";
import { ArrowRight, Award, BookOpen, Check, Clock3, Play } from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { courses } from "@/data/courses";
import { CourseCard } from "@/components/courses/course-card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <MarketingHeader />

      <main>
        <section className="container-shell py-20 text-center md:py-28">
          <p className="editorial-label mb-5">Educación práctica en español</p>

          <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] md:text-7xl">
            Aprende habilidades.
            <br />
            Construye libertad.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#686c66] md:text-xl">
            Cursos prácticos para aprender trading, e-commerce, creación de
            contenido, ventas y marketing.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/evaluacion"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#2f6650] px-6 text-sm font-semibold text-white hover:bg-[#254f3f]"
            >
              Comenzar ahora
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/cursos"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#ddd9d0] bg-white px-6 text-sm font-semibold hover:bg-[#efede7]"
            >
              Explorar cursos
            </Link>
          </div>
        </section>

        <section className="container-shell pb-24">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-[#1f211f]">
            <div className="text-center text-white">
              <button
                type="button"
                aria-label="Reproducir video"
                className="focus-ring mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white text-[#1f211f]"
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
            habilidades prácticas y un sistema para avanzar.
          </p>
        </section>

        <section className="border-y border-[#ddd9d0] bg-white">
          <div className="container-shell grid gap-7 py-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Aprende a tu ritmo", Clock3],
              ["Contenido práctico", BookOpen],
              ["Certificados incluidos", Award],
              ["Nuevas rutas", Check],
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

        <section className="container-shell py-24">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="editorial-label mb-3">Academia</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Empieza con una ruta clara.
              </h2>
            </div>

            <Link
              href="/cursos"
              className="hidden items-center gap-2 text-sm font-semibold text-[#2f6650] sm:flex"
            >
              Ver academia
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        <section
          id="precios"
          className="border-t border-[#ddd9d0] bg-white py-24"
        >
          <div className="container-shell">
            <div className="mx-auto max-w-2xl text-center">
              <p className="editorial-label mb-3">Membresías</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Una membresía para seguir creciendo.
              </h2>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-[#ddd9d0] bg-white p-7">
                <h3 className="text-xl font-semibold">Academia</h3>
                <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
                  $25
                  <span className="ml-2 text-sm font-medium text-[#686c66]">
                    / mes
                  </span>
                </p>

                <ul className="mt-7 space-y-3 text-sm text-[#4f534e]">
                  <li>Todos los cursos</li>
                  <li>Quizzes y flashcards</li>
                  <li>Progreso y certificados</li>
                  <li>Videoteca</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-[#1f211f] p-7 text-white">
                <h3 className="text-xl font-semibold">Academia Pro</h3>
                <p className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
                  $50
                  <span className="ml-2 text-sm font-medium text-[#b7bbb4]">
                    / mes
                  </span>
                </p>

                <ul className="mt-7 space-y-3 text-sm text-[#d8dbd5]">
                  <li>Todo en Academia</li>
                  <li>Comunidad privada</li>
                  <li>Sesiones en vivo</li>
                  <li>Recursos premium</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
