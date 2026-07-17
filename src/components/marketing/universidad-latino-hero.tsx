import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Play,
  ShoppingBag,
  Star,
  TrendingUp,
} from "lucide-react";
import { EliteCtaButton } from "@/components/marketing/elite-cta-button";

const courses = [
  {
    title: "Trading desde Cero",
    progress: 72,
    icon: TrendingUp,
  },
  {
    title: "E-commerce",
    progress: 48,
    icon: ShoppingBag,
  },
  {
    title: "TikTok Shop",
    progress: 25,
    icon: Play,
  },
];

export function UniversidadLatinoHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#050605] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-18%] top-[-20%] h-[520px] w-[520px] rounded-full bg-[#2f6650]/20 blur-[140px]" />

        <div className="absolute bottom-[-25%] right-[-15%] h-[620px] w-[620px] rounded-full bg-[#79a98e]/15 blur-[160px]" />

        <div className="universidad-hero-grid absolute inset-0 opacity-[0.08]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.07),transparent_38%)]" />
      </div>

      <div className="container-shell relative z-10 grid min-h-[760px] items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <div className="universidad-fade-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#79a98e] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#79a98e]" />
            </span>

            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/65">
              Universidad Latino ya está abierta
            </span>
          </div>

          <h1 className="mt-7 text-[3.25rem] font-semibold leading-[0.96] tracking-[-0.065em] sm:text-6xl md:text-7xl lg:text-[5.6rem]">
            <span className="universidad-fade-2 block">Gana Hasta</span>

            <span className="universidad-fade-3 mt-1 block bg-gradient-to-r from-[#d9f0e3] via-[#79a98e] to-[#4f806c] bg-clip-text text-transparent">
              $10,000 al Mes
            </span>
          </h1>

          <p className="universidad-fade-4 mx-auto mt-7 max-w-xl text-base font-medium leading-8 text-white/55 sm:text-lg lg:mx-0 lg:text-xl">
            Domina Trading, E-commerce y TikTok Shop con cursos prácticos en
            español.
          </p>

          <div className="universidad-fade-5 mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center lg:justify-start">
            <EliteCtaButton href="#precios">
              Obtener los 3 cursos por $100
            </EliteCtaButton>

            <Link
              href="#cursos"
              className="group relative inline-flex h-[54px] w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white/[0.055] px-7 text-sm font-semibold uppercase tracking-[0.04em] text-white/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.09] hover:text-white sm:w-auto"
            >
              <BookOpen size={18} />
              Ver los cursos
              <span className="absolute bottom-0 left-1/2 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-25 transition-opacity group-hover:opacity-70" />
            </Link>
          </div>

          <p className="universidad-fade-5 mt-5 text-xs leading-5 text-white/35">
            Los resultados dependen de tu esfuerzo, experiencia y ejecución. Los
            ingresos no están garantizados.
          </p>

          <div className="universidad-fade-6 mt-10 border-t border-white/10 pt-7">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Una sola plataforma. Tres habilidades.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4 text-sm font-semibold text-white/45 lg:justify-start">
              <span className="flex items-center gap-2">
                <TrendingUp size={17} />
                Trading
              </span>

              <span className="flex items-center gap-2">
                <ShoppingBag size={17} />
                E-commerce
              </span>

              <span className="flex items-center gap-2">
                <Play size={17} />
                TikTok Shop
              </span>
            </div>
          </div>
        </div>

        <div className="universidad-fade-5 relative mx-auto flex w-full max-w-[520px] justify-center lg:justify-end">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2f6650]/30 blur-[90px]" />

          <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
            <div className="absolute -left-8 top-16 hidden w-44 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-2xl sm:block lg:-left-16">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#79a98e]/15 text-[#79a98e]">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                    Progreso
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    Lección completada
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 bottom-20 z-30 hidden w-44 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-2xl sm:block lg:-right-12">
              <div className="flex items-center gap-2 text-[#79a98e]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={13}
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                ))}
              </div>

              <p className="mt-3 text-xs leading-5 text-white/65">
                Educación clara, práctica y completamente en español.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[38px] border-[7px] border-[#171917] bg-black shadow-[0_35px_90px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10 sm:rounded-[48px] sm:border-[8px]">
              <div className="absolute left-1/2 top-3 z-30 h-7 w-28 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/5">
                <div className="absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#222]" />
              </div>

              <div className="relative h-[610px] overflow-hidden bg-[#070807] sm:h-[680px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(121,169,142,0.16),transparent_35%)]" />

                <div className="relative z-10 flex h-full flex-col">
                  <header className="border-b border-white/[0.06] bg-black/65 px-5 pb-4 pt-14 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
                          Bienvenido a
                        </p>

                        <p className="mt-1 text-base font-semibold">
                          Universidad Latino
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.055] text-[#79a98e]">
                        <GraduationCap size={19} />
                      </div>
                    </div>
                  </header>

                  <div className="universidad-phone-scroll flex-1 overflow-y-auto px-5 pb-24 pt-5">
                    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#315f4c] via-[#203f34] to-[#101713] p-5 shadow-[0_18px_50px_-20px_rgba(47,102,80,0.75)]">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/70">
                            Ruta activa
                          </span>

                          <p className="mt-4 text-sm text-white/55">
                            Tu progreso general
                          </p>

                          <p className="mt-1 text-4xl font-semibold tracking-[-0.05em]">
                            48%
                          </p>
                        </div>

                        <BarChart3 size={23} className="text-[#b9ddc9]" />
                      </div>

                      <div className="mt-7 h-2 overflow-hidden rounded-full bg-black/25">
                        <div className="h-full w-[48%] rounded-full bg-[#b9ddc9]" />
                      </div>

                      <div className="mt-4 flex items-center justify-between text-[10px] font-semibold text-white/50">
                        <span>12 de 24 lecciones</span>
                        <span>Continuar</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                          Tus cursos
                        </p>

                        <span className="text-[10px] font-semibold text-[#79a98e]">
                          Ver todos
                        </span>
                      </div>

                      <div className="space-y-3">
                        {courses.map((course) => {
                          const Icon = course.icon;

                          return (
                            <div
                              key={course.title}
                              className="rounded-[20px] border border-white/[0.07] bg-white/[0.045] p-4"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#79a98e]/10 text-[#79a98e]">
                                  <Icon size={19} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="truncate text-xs font-semibold text-white">
                                      {course.title}
                                    </p>

                                    <span className="text-[10px] font-semibold text-white/35">
                                      {course.progress}%
                                    </span>
                                  </div>

                                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                                    <div
                                      className="h-full rounded-full bg-[#79a98e]"
                                      style={{
                                        width: `${course.progress}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6 rounded-[22px] border border-white/[0.07] bg-[#111311] p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
                            Próxima lección
                          </p>

                          <p className="mt-2 text-sm font-semibold">
                            Cómo encontrar productos ganadores
                          </p>
                        </div>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black">
                          <Play size={16} fill="currentColor" />
                        </div>
                      </div>

                      <div className="mt-5 flex items-center gap-4 text-[10px] font-semibold text-white/35">
                        <span className="flex items-center gap-1.5">
                          <Clock3 size={13} />
                          14 minutos
                        </span>

                        <span className="flex items-center gap-1.5">
                          <BookOpen size={13} />
                          E-commerce
                        </span>
                      </div>
                    </div>
                  </div>

                  <nav className="absolute bottom-0 left-0 right-0 flex items-center justify-around border-t border-white/[0.07] bg-black/75 px-5 pb-7 pt-4 backdrop-blur-2xl">
                    <div className="flex flex-col items-center gap-1 text-[#79a98e]">
                      <GraduationCap size={19} />
                      <span className="text-[8px] font-bold uppercase tracking-[0.12em]">
                        Inicio
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1 text-white/30">
                      <BookOpen size={19} />
                      <span className="text-[8px] font-bold uppercase tracking-[0.12em]">
                        Cursos
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1 text-white/30">
                      <BarChart3 size={19} />
                      <span className="text-[8px] font-bold uppercase tracking-[0.12em]">
                        Progreso
                      </span>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
