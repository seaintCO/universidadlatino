import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/auth/session";
import {
  canAccessModuleSlug,
  getUserAccessContext,
} from "@/lib/payments/access";
import { CompleteLessonButton } from "@/components/lessons/complete-lesson-button";
import { LessonBookmarkButton } from "@/components/lessons/lesson-bookmark-button";
import { LessonNotesPanel } from "@/components/lessons/lesson-notes-panel";
import { LessonActivityTracker } from "@/components/lessons/lesson-activity-tracker";

type LessonPageProps = {
  params: Promise<{
    courseSlug: string;
    lessonSlug: string;
  }>;
};

type LessonRecord = {
  id: string;
  course_id: string;
  module_id: string;
  slug: string;
  title: string;
  description: string | null;
  duration_seconds: number;
  youtube_video_id: string | null;
  youtube_url: string | null;
  youtube_creator_name: string | null;
  spanish_summary: unknown;
  action_steps: unknown;
  sort_order: number;
};

type SidebarLesson = {
  id: string;
  slug: string;
  title: string;
  sort_order: number;
};

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseSlug, lessonSlug } = await params;
  const user = await requireUser();
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: course, error: courseError } = await admin
    .from("mu_courses")
    .select("id, slug, title, category")
    .eq("slug", courseSlug)
    .maybeSingle();

  if (courseError) {
    throw new Error(`Unable to load course: ${courseError.message}`);
  }

  if (!course) {
    notFound();
  }

  const { data: lessonData, error: lessonError } = await admin
    .from("mu_lessons")
    .select(
      "id, course_id, module_id, slug, title, description, duration_seconds, youtube_video_id, youtube_url, youtube_creator_name, spanish_summary, action_steps, sort_order",
    )
    .eq("course_id", course.id)
    .eq("slug", lessonSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (lessonError) {
    throw new Error(`Unable to load lesson: ${lessonError.message}`);
  }

  if (!lessonData) {
    notFound();
  }

  const lesson = lessonData as LessonRecord;

  const { data: moduleData, error: moduleError } = await admin
    .from("mu_course_modules")
    .select("id, slug, title, sort_order")
    .eq("id", lesson.module_id)
    .eq("is_published", true)
    .maybeSingle();

  if (moduleError || !moduleData) {
    notFound();
  }

  const accessContext = await getUserAccessContext(user.id);

  if (!canAccessModuleSlug(accessContext, moduleData.slug)) {
    redirect(`/cursos/${course.slug}?locked=${moduleData.slug}`);
  }

  const [moduleLessonsResult, progressResult, noteResult, bookmarkResult] =
    await Promise.all([
      admin
        .from("mu_lessons")
        .select("id, slug, title, sort_order")
        .eq("module_id", lesson.module_id)
        .eq("is_published", true)
        .order("sort_order", { ascending: true }),

      supabase
        .from("mu_lesson_progress")
        .select("lesson_id, status")
        .eq("user_id", user.id)
        .eq("course_id", course.id),

      supabase
        .from("mu_lesson_notes")
        .select("body")
        .eq("user_id", user.id)
        .eq("lesson_id", lesson.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),

      supabase
        .from("mu_lesson_bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("lesson_id", lesson.id)
        .maybeSingle(),
    ]);

  if (moduleLessonsResult.error) {
    throw new Error(
      `Unable to load lessons: ${moduleLessonsResult.error.message}`,
    );
  }

  const lessons = (moduleLessonsResult.data ?? []) as SidebarLesson[];
  const completedLessonIds = new Set(
    (progressResult.data ?? [])
      .filter((item) => item.status === "completed")
      .map((item) => item.lesson_id),
  );
  const initiallyCompleted = completedLessonIds.has(lesson.id);
  const initialNote = noteResult.data?.body ?? "";
  const initiallyBookmarked = Boolean(bookmarkResult.data);
  const currentIndex = lessons.findIndex((item) => item.id === lesson.id);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;
  const summaries = stringList(lesson.spanish_summary);
  const actionSteps = stringList(lesson.action_steps);

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <LessonActivityTracker
        courseId={course.id}
        courseSlug={course.slug}
        lessonId={lesson.id}
        lessonSlug={lesson.slug}
      />

      <header className="border-b border-[#ddd9d0] bg-white">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link
            href="/dashboard"
            className="text-sm font-bold tracking-[-0.04em] !text-[#1f211f]"
          >
            CURSOCAPITAL
          </Link>

          <Link
            href={`/cursos/${course.slug}`}
            className="text-sm font-semibold !text-[#686c66] hover:!text-[#1f211f]"
          >
            Volver al curso
          </Link>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[320px_1fr]">
        <aside className="border-b border-[#ddd9d0] bg-[#f7f5f0] lg:border-b-0 lg:border-r">
          <div className="border-b border-[#ddd9d0] p-5">
            <p className="editorial-label mb-2">{course.category}</p>

            <h1 className="text-xl font-semibold tracking-[-0.03em]">
              {course.title}
            </h1>

            <p className="mt-2 text-sm text-[#686c66]">
              Módulo {moduleData.sort_order}: {moduleData.title}
            </p>
          </div>

          <nav className="max-h-[45vh] space-y-1 overflow-y-auto p-3 lg:max-h-[calc(100vh-9rem)]">
            {lessons.map((item) => {
              const isActive = item.id === lesson.id;
              const isCompleted = completedLessonIds.has(item.id);

              return (
                <Link
                  key={item.id}
                  href={`/cursos/${course.slug}/${item.slug}`}
                  className={`flex items-start gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-[#e3ece7] font-semibold !text-[#254f3f]"
                      : "!text-[#686c66] hover:bg-white hover:!text-[#1f211f]"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2
                      className="mt-0.5 shrink-0 text-[#2f6650]"
                      size={17}
                    />
                  ) : (
                    <Circle
                      className="mt-0.5 shrink-0 text-[#b8bbb5]"
                      size={17}
                    />
                  )}

                  <span>
                    <span className="mr-1.5 text-xs text-[#8b8f89]">
                      {item.sort_order}.
                    </span>
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">
          <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
            <div className="mb-6">
              <p className="editorial-label mb-2">{moduleData.title}</p>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                {lesson.title}
              </h1>

              {lesson.description ? (
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#686c66] md:text-base">
                  {lesson.description}
                </p>
              ) : null}

              <p className="mt-3 text-xs font-medium text-[#8b8f89]">
                Duración estimada:{" "}
                {Math.max(1, Math.round(lesson.duration_seconds / 60))} minutos
              </p>
            </div>

            <div className="aspect-video overflow-hidden rounded-2xl border border-[#2f312e] bg-[#1f211f]">
              {lesson.youtube_video_id ? (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${lesson.youtube_video_id}`}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-white">
                  Este video todavía no está disponible.
                </div>
              )}
            </div>

            {lesson.youtube_creator_name || lesson.youtube_url ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#686c66]">
                <span>Fuente: {lesson.youtube_creator_name ?? "YouTube"}</span>

                {lesson.youtube_url ? (
                  <a
                    href={lesson.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold !text-[#2f6650] hover:!text-[#254f3f]"
                  >
                    Ver video original
                  </a>
                ) : null}
              </div>
            ) : null}

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <section className="rounded-2xl border border-[#ddd9d0] bg-white p-6">
                  <h2 className="text-xl font-semibold tracking-[-0.03em]">
                    Resumen de la lección
                  </h2>

                  {summaries.length > 0 ? (
                    <ul className="mt-5 space-y-4">
                      {summaries.map((summary) => (
                        <li
                          key={summary}
                          className="flex items-start gap-3 text-sm leading-7 text-[#4f534e]"
                        >
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2f6650]" />
                          {summary}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm leading-7 text-[#686c66]">
                      El resumen editorial se añadirá después de revisar el
                      video.
                    </p>
                  )}
                </section>

                <section className="rounded-2xl border border-[#ddd9d0] bg-white p-6">
                  <h2 className="text-xl font-semibold tracking-[-0.03em]">
                    Pasos de acción
                  </h2>

                  {actionSteps.length > 0 ? (
                    <ol className="mt-5 space-y-4">
                      {actionSteps.map((step, index) => (
                        <li
                          key={step}
                          className="flex items-start gap-4 text-sm leading-7 text-[#4f534e]"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f211f] text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-4 text-sm leading-7 text-[#686c66]">
                      Los pasos de acción se añadirán después de revisar el
                      video.
                    </p>
                  )}
                </section>

                <LessonNotesPanel
                  courseId={course.id}
                  courseSlug={course.slug}
                  lessonId={lesson.id}
                  lessonSlug={lesson.slug}
                  initialNote={initialNote}
                />
              </div>

              <aside className="space-y-5">
                <section className="rounded-2xl border border-[#ddd9d0] bg-white p-5">
                  <p className="editorial-label mb-2">Progreso</p>

                  <h2 className="mb-5 text-lg font-semibold">
                    Completa esta lección
                  </h2>

                  <CompleteLessonButton
                    courseId={course.id}
                    courseSlug={course.slug}
                    lessonId={lesson.id}
                    lessonSlug={lesson.slug}
                    initiallyCompleted={initiallyCompleted}
                  />

                  <div className="mt-3">
                    <LessonBookmarkButton
                      courseId={course.id}
                      courseSlug={course.slug}
                      lessonId={lesson.id}
                      lessonSlug={lesson.slug}
                      initiallyBookmarked={initiallyBookmarked}
                    />
                  </div>
                </section>

                <section className="rounded-2xl border border-[#ddd9d0] bg-white p-5">
                  <h2 className="text-lg font-semibold">Navegación</h2>

                  <div className="mt-4 space-y-3">
                    {previousLesson ? (
                      <Link
                        href={`/cursos/${course.slug}/${previousLesson.slug}`}
                        className="block rounded-lg border border-[#ddd9d0] px-4 py-3 text-sm font-semibold !text-[#1f211f] hover:bg-[#f7f5f0]"
                      >
                        ← {previousLesson.title}
                      </Link>
                    ) : null}

                    {nextLesson ? (
                      <Link
                        href={`/cursos/${course.slug}/${nextLesson.slug}`}
                        className="block rounded-lg bg-[#1f211f] px-4 py-3 text-sm font-semibold !text-white hover:bg-[#30332f]"
                      >
                        {nextLesson.title} →
                      </Link>
                    ) : (
                      <Link
                        href={`/cursos/${course.slug}`}
                        className="block rounded-lg bg-[#1f211f] px-4 py-3 text-sm font-semibold !text-white hover:bg-[#30332f]"
                      >
                        Volver al curso
                      </Link>
                    )}
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
