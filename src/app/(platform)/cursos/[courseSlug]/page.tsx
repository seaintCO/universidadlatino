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

type CoursePageProps = {
  params: Promise<{
    courseSlug: string;
  }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: course, error: courseError } = await supabase
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

  const { data: modules, error: modulesError } = await supabase
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

  let completedLessonIds = new Set<string>();

  if (user) {
    const { data: completedProgress } = await supabase
      .from("mu_lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .eq("status", "completed");

    completedLessonIds = new Set(
      (completedProgress ?? []).map((progress) => progress.lesson_id),
    );
  }

  const normalizedModules = (modules ?? []).map((module) => ({
    ...module,
    lessons: [...(module.mu_lessons ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
    quizzes: module.mu_quizzes ?? [],
  }));

  const allPublishedLessons = normalizedModules.flatMap((module) =>
    module.lessons.filter((lesson) => lesson.is_published),
  );

  const completedCount = allPublishedLessons.filter((lesson) =>
    completedLessonIds.has(lesson.id),
  ).length;

  const progress =
    allPublishedLessons.length > 0
      ? Math.round((completedCount / allPublishedLessons.length) * 100)
      : 0;

  const firstAvailableLesson = allPublishedLessons[0] ?? null;

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-2xl bg-[#1f211f] px-6 py-10 text-white md:px-10 md:py-14">
          <p className="editorial-label text-[#b7bbb4]">{course.category}</p>

          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            {course.title}
          </h1>

          {course.subtitle ? (
            <p className="mt-4 text-lg text-[#d8dbd5]">{course.subtitle}</p>
          ) : null}

          <p className="mt-6 max-w-3xl text-sm leading-7 text-[#b7bbb4] md:text-base">
            {course.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-5 text-sm font-medium text-[#d8dbd5]">
            <span>{normalizedModules.length} módulos</span>

            <span className="flex items-center gap-2">
              <Clock3 size={17} />
              {course.estimated_hours} horas
            </span>

            <span>{course.level}</span>
          </div>

          <div className="mt-8 max-w-xl">
            <div className="mb-2 flex justify-between text-xs font-semibold text-[#b7bbb4]">
              <span>
                {completedCount} de {allPublishedLessons.length} lecciones
              </span>
              <span>{progress}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-[#79a98e]"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {firstAvailableLesson ? (
            <Link
              href={`/cursos/${course.slug}/${firstAvailableLesson.slug}`}
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-[#1f211f] hover:bg-[#efede7]"
            >
              <PlayCircle size={18} />
              {completedCount > 0 ? "Continuar aprendiendo" : "Comenzar curso"}
            </Link>
          ) : null}
        </header>

        <div className="mt-8 space-y-6">
          {normalizedModules.map((module) => {
            const publishedLessons = module.lessons.filter(
              (lesson) => lesson.is_published,
            );

            const draftLessonCount =
              module.lessons.length - publishedLessons.length;

            const completedModuleLessons = publishedLessons.filter((lesson) =>
              completedLessonIds.has(lesson.id),
            ).length;

            const moduleComplete =
              publishedLessons.length > 0 &&
              completedModuleLessons === publishedLessons.length;

            return (
              <section
                key={module.id}
                className="overflow-hidden rounded-2xl border border-[#ddd9d0] bg-white"
              >
                <div className="border-b border-[#ddd9d0] p-6 md:p-8">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row">
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
                      ) : (
                        <span className="text-sm font-semibold text-[#686c66]">
                          {completedModuleLessons}/{publishedLessons.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-[#eeeae2]">
                  {module.lessons.map((lesson) => {
                    const completed = completedLessonIds.has(lesson.id);

                    if (!lesson.is_published) {
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

                            <p className="mt-1 text-xs">Próximamente</p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={lesson.id}
                        href={`/cursos/${course.slug}/${lesson.slug}`}
                        className="flex min-h-16 items-center gap-4 px-6 py-4 transition-colors hover:bg-[#faf9f6] md:px-8"
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

                {module.quizzes.length > 0 ? (
                  <div className="border-t border-[#ddd9d0] bg-[#faf9f6] px-6 py-4 md:px-8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">
                          Evaluación del módulo
                        </p>

                        <p className="mt-1 text-xs text-[#686c66]">
                          Completa las lecciones antes de tomar el quiz.
                        </p>
                      </div>

                      <span className="rounded-full border border-[#ddd9d0] bg-white px-3 py-1.5 text-xs font-semibold text-[#686c66]">
                        Quiz
                      </span>
                    </div>
                  </div>
                ) : null}

                {publishedLessons.length === 0 && draftLessonCount > 0 ? (
                  <div className="border-t border-[#ddd9d0] bg-[#faf9f6] px-6 py-4 text-sm text-[#686c66] md:px-8">
                    Este módulo está preparado y esperando sus videos.
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
