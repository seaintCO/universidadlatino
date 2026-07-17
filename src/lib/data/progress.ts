import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { canAccessModuleSlug, type AccessContext } from "@/lib/payments/access";

type ProgressRow = {
  course_id: string;
  lesson_id: string;
  status: "not_started" | "in_progress" | "completed";
  progress_percent: number;
  last_position_seconds: number;
  last_viewed_at: string;
};

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  thumbnail_url: string | null;
};

type LessonRow = {
  id: string;
  course_id: string;
  module_id: string;
  slug: string;
  title: string;
  duration_seconds: number;
  sort_order: number;
};

type ModuleRow = {
  id: string;
  slug: string;
  title: string;
  sort_order: number;
};

export type DashboardLearningState = {
  course: CourseRow;
  lesson: LessonRow;
  module: ModuleRow | null;
  completedLessons: number;
  totalLessons: number;
  courseProgress: number;
  lastPositionSeconds: number;
  lastViewedAt: string | null;
  accessibleLessonIds: string[];
};

async function getAccessibleCatalog(context: AccessContext) {
  const admin = createAdminClient();

  const { data: modulesData, error: modulesError } = await admin
    .from("mu_course_modules")
    .select("id, slug, title, sort_order, course_id")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (modulesError) {
    console.error("Unable to load learning modules:", modulesError.message);
    return null;
  }

  const modules = (modulesData ?? []).filter((module) =>
    canAccessModuleSlug(context, module.slug),
  );

  if (modules.length === 0) {
    return null;
  }

  const moduleIds = modules.map((module) => module.id);

  const { data: lessonsData, error: lessonsError } = await admin
    .from("mu_lessons")
    .select(
      "id, course_id, module_id, slug, title, duration_seconds, sort_order",
    )
    .in("module_id", moduleIds)
    .eq("is_published", true);

  if (lessonsError) {
    console.error("Unable to load learning lessons:", lessonsError.message);
    return null;
  }

  const moduleOrder = new Map(
    modules.map((module) => [module.id, module.sort_order]),
  );

  const lessons = ((lessonsData ?? []) as LessonRow[]).sort((a, b) => {
    const moduleDifference =
      (moduleOrder.get(a.module_id) ?? 0) - (moduleOrder.get(b.module_id) ?? 0);

    return moduleDifference || a.sort_order - b.sort_order;
  });

  return {
    modules: modules as ModuleRow[],
    lessons,
  };
}

export async function getDashboardLearningState(
  userId: string,
  context: AccessContext,
): Promise<DashboardLearningState | null> {
  const catalog = await getAccessibleCatalog(context);

  if (!catalog || catalog.lessons.length === 0) {
    return null;
  }

  const supabase = await createClient();
  const admin = createAdminClient();
  const lessonIds = catalog.lessons.map((lesson) => lesson.id);

  const { data: progressRows, error: progressError } = await supabase
    .from("mu_lesson_progress")
    .select(
      "course_id, lesson_id, status, progress_percent, last_position_seconds, last_viewed_at",
    )
    .eq("user_id", userId)
    .in("lesson_id", lessonIds)
    .order("last_viewed_at", { ascending: false });

  if (progressError) {
    console.error("Unable to load learning progress:", progressError.message);
  }

  const progress = (progressRows ?? []) as ProgressRow[];
  const latestProgress = progress[0] ?? null;
  const lesson = latestProgress
    ? (catalog.lessons.find((item) => item.id === latestProgress.lesson_id) ??
      catalog.lessons[0])
    : catalog.lessons[0];

  const moduleData =
    catalog.modules.find((module) => module.id === lesson.module_id) ?? null;

  const { data: courseData, error: courseError } = await admin
    .from("mu_courses")
    .select("id, slug, title, category, thumbnail_url")
    .eq("id", lesson.course_id)
    .maybeSingle();

  if (courseError || !courseData) {
    return null;
  }

  const completedLessons = new Set(
    progress
      .filter((row) => row.status === "completed")
      .map((row) => row.lesson_id),
  ).size;
  const totalLessons = catalog.lessons.length;

  return {
    course: courseData as CourseRow,
    lesson,
    module: moduleData,
    completedLessons,
    totalLessons,
    courseProgress:
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0,
    lastPositionSeconds: latestProgress?.last_position_seconds ?? 0,
    lastViewedAt: latestProgress?.last_viewed_at ?? null,
    accessibleLessonIds: lessonIds,
  };
}

export async function getLearningActivityStats(
  userId: string,
  accessibleLessonIds: string[] = [],
) {
  const supabase = await createClient();

  let query = supabase
    .from("mu_lesson_progress")
    .select("lesson_id, status, last_viewed_at, completed_at")
    .eq("user_id", userId)
    .order("last_viewed_at", { ascending: false });

  if (accessibleLessonIds.length > 0) {
    query = query.in("lesson_id", accessibleLessonIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Unable to load learning activity:", error.message);

    return {
      completedLessons: 0,
      activeDays: 0,
      streakDays: 0,
    };
  }

  const rows = data ?? [];
  const completedLessons = rows.filter(
    (row) => row.status === "completed",
  ).length;

  const activityDates = Array.from(
    new Set(
      rows
        .map((row) => row.last_viewed_at)
        .filter(Boolean)
        .map((value) => new Date(value).toISOString().slice(0, 10)),
    ),
  ).sort((a, b) => b.localeCompare(a));

  let streakDays = 0;
  const today = new Date();

  for (let index = 0; index < activityDates.length; index += 1) {
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - index);

    if (activityDates[index] === expectedDate.toISOString().slice(0, 10)) {
      streakDays += 1;
    } else {
      break;
    }
  }

  return {
    completedLessons,
    activeDays: activityDates.length,
    streakDays,
  };
}
