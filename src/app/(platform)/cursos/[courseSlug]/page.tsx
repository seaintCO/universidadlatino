import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  Clock3,
  LockKeyhole,
  PlayCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/auth/session";
import {
  canAccessModuleSlug,
  getUserAccessContext,
} from "@/lib/payments/access";
import {
  moduleSlugToPurchaseKey,
  purchaseCatalog,
} from "@/lib/payments/catalog";
import { CheckoutButton } from "@/components/payments/checkout-button";

type CoursePageProps = {
  params: Promise<{
    courseSlug: string;
  }>;
};

type LessonOutline = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  duration_seconds: number;
  sort_order: number;
  is_published: boolean;
};

type ModuleOutline = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_published: boolean;
  mu_lessons: LessonOutline[] | null;
  mu_quizzes: Array<{
    id: string;
    title: string;
    is_published: boolean;
  }> | null;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = await params;
  const user = await requireUser();
  const supabase = await createClient();
  const admin = createAdminClient();
  const accessContext = await getUserAccessContext(user.id);

  const { data: course, error: courseError } = await admin
    .from("mu_courses")
    .select(
      "id, slug, title, subtitle, description, category, level, estimated_hours",
    )
    .eq("slug", courseSlug)
    .maybeSingle();

  if (courseError) {
    throw new Error(`Unable to load course: ${courseError.message}`);
  }

  if (!course) {
    notFound();
  }

  const { data: modulesData, error: modulesError } = await admin
    .from("mu_course_modules")
    .select(
      `
      id,
      slug,
      title,
      description,
      sort_order,
      is_published,
      mu_lessons (
        id,
        slug,
        title,
        description,
        duration_seconds,
        sort_order,
        is_published
      ),
      mu_quizzes (
        id,
        title,
        is_published
      )
      `,
    )
    .eq("course_id", course.id)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (modulesError) {
    throw new Error(`Unable to load modules: ${modulesError.message}`);
  }

  const modules = ((modulesData ?? []) as ModuleOutline[]).map((module) => ({
    ...module,
    unlocked: canAccessModuleSlug(accessContext, module.slug),
    lessons: [...(module.mu_lessons ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
    quizzes: module.mu_quizzes ?? [],
  }));

  const accessibleLessons = modules.flatMap((module) =>
    module.unlocked
      ? module.lessons.filter((lesson) => lesson.is_published)
      : [],
  );

  let completedLessonIds = new Set<string>();

  if (accessibleLessons.length > 0) {
    const { data: completedProgress } = await supabase
      .from("mu_lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .eq("status", "completed")
      .in(
        "lesson_id",
        accessibleLessons.map((lesson) => lesson.id),
      );

    completedLessonIds = new Set(
      (completedProgress ?? []).map((progress) => progress.lesson_id),
    );
  }

  const completedCount = accessibleLessons.filter((lesson) =>
    completedLessonIds.has(lesson.id),
  ).length;
  const progress =
    accessibleLessons.length > 0
      ? Math.round((completedCount / accessibleLessons.length) * 100)
      : 0;
  const firstAvailableLesson = accessibleLessons[0] ?? null;
  const hasAnyAccess = accessContext.isAdmin || accessContext.keys.size > 0;

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-2xl bg-[#1f211f] px-6 py-10 text-white md:px-10 md:py-14">
          <p className="editorial-label text-[#b7bbb4]">{course.category}</p>

          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
            {course.title}
          </h1>

          {course.subtitle ? (
            <p className="mt-4 text-lg text-[#d8dbd5]">{course.subtitle}</p>
          ) : null}

          <p className="mt-6 max-w-3xl text-sm leading-7 text-[#b7bbb4] md:text-base">
            {course.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-5 text-sm font-medium text-[#d8dbd5]">
            <span>{modules.length} módulos</span>

            <span className="flex items-center gap-2">
              <Clock3 size={17} />
              {course.estimated_hours} horas
            </span>

            <span>{course.level}</span>
          </div>

          <div className="mt-8 max-w-xl">
            <div className="mb-2 flex justify-between text-xs font-semibold text-[#b7bbb4]">
              <span>
                {completedCount} de {accessibleLessons.length} lecciones
                incluidas
              </span>
              <span>{progress}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-[#79a98e]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {firstAvailableLesson ? (
            <Link
              href={`/cursos/${course.slug}/${firstAvailableLesson.slug}`}
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold !text-[#1f211f] hover:bg-[#efede7]"
            >
              <PlayCircle size={18} />
              {completedCount > 0 ? "Continuar aprendiendo" : "Comenzar curso"}
            </Link>
          ) : (
            <div className="mt-8 max-w-sm">
              <CheckoutButton
                product="bundle"
                className="bg-white !text-[#1f211f] hover:bg-[#efede7]"
              >
                Comprar acceso completo por $100
              </CheckoutButton>
            </div>
          )}
        </header>

        {!hasAnyAccess ? (
          <div className="mt-6 rounded-2xl border border-[#c9dacf] bg-[#edf4ef] p-5 text-sm leading-7 text-[#254f3f]">
            Tu cuenta está activa, pero todavía no has comprado un curso. Elige
            una ruta abajo para abrir Stripe Checkout.
          </div>
        ) : null}

        <div className="mt-8 space-y-6">
          {modules.map((module) => {
            const publishedLessons = module.lessons.filter(
              (lesson) => lesson.is_published,
            );
            const completedModuleLessons = module.unlocked
              ? publishedLessons.filter((lesson) =>
                  completedLessonIds.has(lesson.id),
                ).length
              : 0;
            const moduleComplete =
              module.unlocked &&
              publishedLessons.length > 0 &&
              completedModuleLessons === publishedLessons.length;
            const purchaseKey = moduleSlugToPurchaseKey(module.slug);

            return (
              <section
                key={module.id}
                className="overflow-hidden rounded-2xl border border-[#ddd9d0] bg-white"
              >
                <div className="border-b border-[#ddd9d0] p-6 md:p-8">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                      <p className="editorial-label">
                        Módulo {module.sort_order}
                      </p>

                      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                        {module.title}
                      </h2>

                      {module.description ? (
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#686c66]">
                          {module.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="shrink-0">
                      {moduleComplete ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#e3ece7] px-3 py-1.5 text-xs font-bold text-[#254f3f]">
                          <CheckCircle2 size={15} />
                          Completado
                        </span>
                      ) : module.unlocked ? (
                        <span className="text-sm font-semibold text-[#686c66]">
                          {completedModuleLessons}/{publishedLessons.length}
                        </span>
                      ) : purchaseKey ? (
                        <div className="w-full min-w-[220px] sm:w-auto">
                          <CheckoutButton
                            product={purchaseKey}
                            className="bg-[#1f211f] !text-white hover:bg-[#30332f]"
                          >
                            Comprar por{" "}
                            {purchaseCatalog[purchaseKey].priceLabel}
                          </CheckoutButton>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#efede7] px-3 py-1.5 text-xs font-bold text-[#686c66]">
                          <LockKeyhole size={14} />
                          Bloqueado
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-[#eeeae2]">
                  {publishedLessons.map((lesson) => {
                    const completed = completedLessonIds.has(lesson.id);

                    if (!module.unlocked) {
                      return (
                        <div
                          key={lesson.id}
                          className="flex min-h-16 items-center gap-4 px-6 py-4 text-[#92958f] md:px-8"
                        >
                          <LockKeyhole size={18} className="shrink-0" />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                              {lesson.sort_order}. {lesson.title}
                            </p>
                            <p className="mt-1 text-xs">
                              Compra este curso para desbloquear la lección
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={lesson.id}
                        href={`/cursos/${course.slug}/${lesson.slug}`}
                        className="flex min-h-16 items-center gap-4 px-6 py-4 !text-[#1f211f] transition-colors hover:bg-[#faf9f6] md:px-8"
                      >
                        {completed ? (
                          <CheckCircle2
                            size={19}
                            className="shrink-0 text-[#2f6650]"
                          />
                        ) : (
                          <Circle
                            size={19}
                            className="shrink-0 text-[#b8bbb5]"
                          />
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {lesson.sort_order}. {lesson.title}
                          </p>

                          {lesson.description ? (
                            <p className="mt-1 line-clamp-1 text-xs text-[#686c66]">
                              {lesson.description}
                            </p>
                          ) : null}
                        </div>

                        <span className="shrink-0 text-xs font-medium text-[#8b8f89]">
                          {Math.max(
                            1,
                            Math.round(lesson.duration_seconds / 60),
                          )}{" "}
                          min
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {module.quizzes.some((quiz) => quiz.is_published) ? (
                  <div className="border-t border-[#ddd9d0] bg-[#faf9f6] px-6 py-4 md:px-8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">
                          Evaluación del módulo
                        </p>
                        <p className="mt-1 text-xs text-[#686c66]">
                          {module.unlocked
                            ? "Completa las lecciones antes de tomar el quiz."
                            : "Disponible después de comprar esta ruta."}
                        </p>
                      </div>

                      <span className="rounded-full border border-[#ddd9d0] bg-white px-3 py-1.5 text-xs font-semibold text-[#686c66]">
                        {module.unlocked ? "Quiz" : "Bloqueado"}
                      </span>
                    </div>
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
