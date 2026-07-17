import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { getCurrentProfile, requireUser } from "@/lib/auth/session";
import { getCurrentSubscription } from "@/lib/data/subscriptions";
import {
  getDashboardLearningState,
  getLearningActivityStats,
} from "@/lib/data/progress";
import { logout } from "@/app/(auth)/actions";
import { Progress } from "@/components/ui/progress";

function formatVideoPosition(seconds: number) {
  if (seconds <= 0) {
    return null;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default async function DashboardPage() {
  const user = await requireUser();

  const [profile, subscription, learningState, activityStats] =
    await Promise.all([
      getCurrentProfile(),
      getCurrentSubscription(user.id),
      getDashboardLearningState(user.id),
      getLearningActivityStats(user.id),
    ]);

  const name =
    profile?.display_name ??
    profile?.first_name ??
    user.email?.split("@")[0] ??
    "Estudiante";

  const planLabel =
    subscription?.plan === "academia_pro"
      ? "Academia Pro"
      : subscription?.plan === "academia"
        ? "Academia"
        : "Sin membresía";

  const videoPosition = learningState
    ? formatVideoPosition(learningState.lastPositionSeconds)
    : null;

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10">
      <header className="flex flex-col justify-between gap-5 border-b border-[#ddd9d0] pb-8 sm:flex-row sm:items-start">
        <div>
          <p className="editorial-label mb-2">Panel del estudiante</p>

          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            Buenos días, {name}.
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#686c66]">
            Continúa construyendo las habilidades que acercan tus metas.
          </p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="min-h-11 rounded-lg border border-[#ddd9d0] bg-white px-4 text-sm font-semibold hover:bg-[#efede7]"
          >
            Cerrar sesión
          </button>
        </form>
      </header>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {learningState ? (
            <section className="rounded-2xl border border-[#ddd9d0] bg-white p-6 shadow-[0_12px_40px_rgba(31,33,31,0.05)]">
              <p className="editorial-label mb-5">Continuar aprendiendo</p>

              <div className="grid gap-6 md:grid-cols-[190px_1fr]">
                <div className="flex aspect-video items-center justify-center rounded-xl bg-[#efede7]">
                  <BookOpen
                    className="text-[#686c66]"
                    size={36}
                    strokeWidth={1.6}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#686c66]">
                    Módulo {learningState.module?.sort_order ?? 1}
                    {learningState.module
                      ? ` · ${learningState.module.title}`
                      : ""}
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                    {learningState.course.title}
                  </h2>

                  <p className="mt-2 text-sm font-medium text-[#4f534e]">
                    {learningState.lesson.title}
                  </p>

                  {videoPosition ? (
                    <p className="mt-1 text-xs text-[#8b8f89]">
                      Continuar desde {videoPosition}
                    </p>
                  ) : null}

                  <div className="mt-6">
                    <Progress
                      value={learningState.courseProgress}
                      label={`${learningState.completedLessons} de ${learningState.totalLessons} lecciones completadas`}
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/cursos/${learningState.course.slug}/${learningState.lesson.slug}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1f211f] px-5 text-sm font-semibold text-white hover:bg-[#30332f]"
                    >
                      Continuar lección
                      <ArrowRight size={16} />
                    </Link>

                    <Link
                      href={`/cursos/${learningState.course.slug}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#ddd9d0] bg-white px-5 text-sm font-semibold hover:bg-[#f7f5f0]"
                    >
                      Ver curso
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-dashed border-[#c9c4b9] bg-white p-10 text-center">
              <BookOpen className="mx-auto text-[#686c66]" size={34} />

              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">
                Empieza tu primera lección
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#686c66]">
                Explora la Academia y selecciona el curso con el que quieres
                comenzar.
              </p>

              <Link
                href="/cursos"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#1f211f] px-5 text-sm font-semibold text-white"
              >
                Abrir Academia
                <ArrowRight size={16} />
              </Link>
            </section>
          )}

          <div className="grid gap-5 sm:grid-cols-3">
            <section className="rounded-2xl border border-[#ddd9d0] bg-white p-5">
              <CheckCircle2
                className="mb-5 text-[#2f6650]"
                size={23}
                strokeWidth={1.7}
              />

              <p className="text-2xl font-semibold">
                {activityStats.completedLessons}
              </p>

              <p className="mt-1 text-sm text-[#686c66]">
                Lecciones completadas
              </p>
            </section>

            <section className="rounded-2xl border border-[#ddd9d0] bg-white p-5">
              <Flame
                className="mb-5 text-[#2f6650]"
                size={23}
                strokeWidth={1.7}
              />

              <p className="text-2xl font-semibold">
                {activityStats.streakDays}
              </p>

              <p className="mt-1 text-sm text-[#686c66]">Días de racha</p>
            </section>

            <section className="rounded-2xl border border-[#ddd9d0] bg-white p-5">
              <Clock3
                className="mb-5 text-[#2f6650]"
                size={23}
                strokeWidth={1.7}
              />

              <p className="text-2xl font-semibold">
                {activityStats.activeDays}
              </p>

              <p className="mt-1 text-sm text-[#686c66]">Días activos</p>
            </section>
          </div>

          <section className="rounded-2xl border border-[#ddd9d0] bg-white p-6">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="editorial-label mb-2">Certificados</p>

                <h2 className="text-xl font-semibold">
                  Completa un curso para desbloquearlo
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#686c66]">
                  Los certificados aparecerán cuando completes todas las
                  lecciones y evaluaciones requeridas.
                </p>
              </div>

              <Award
                className="hidden shrink-0 text-[#2f6650] sm:block"
                size={34}
                strokeWidth={1.5}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl bg-[#1f211f] p-6 text-white">
            <ShieldCheck size={27} className="text-[#8db5a0]" />

            <p className="editorial-label mt-5 text-[#b7bbb4]">Membresía</p>

            <h2 className="mt-2 text-2xl font-semibold">{planLabel}</h2>

            <p className="mt-3 text-sm leading-6 text-[#b7bbb4]">
              Estado: {subscription?.status ?? "inactive"}
            </p>

            {profile?.role === "admin" ? (
              <div className="mt-5 rounded-lg border border-[#4b4e49] p-3 text-sm">
                Acceso administrativo activo
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-[#ddd9d0] bg-white p-6">
            <p className="editorial-label mb-3">Meta de hoy</p>

            <h2 className="text-lg font-semibold">Mantén tu progreso</h2>

            <div className="mt-5 space-y-4 text-sm text-[#4f534e]">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={18}
                  className={
                    activityStats.completedLessons > 0
                      ? "text-[#2f6650]"
                      : "text-[#b8bbb5]"
                  }
                />
                Completar una lección
              </div>

              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-[#b8bbb5]" />
                Repasar tus notas
              </div>

              <div className="flex items-center gap-3">
                <Flame size={18} className="text-[#b8bbb5]" />
                Mantener tu racha
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
