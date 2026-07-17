import { createClient } from "@/lib/supabase/server";

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
  module_id: string;
  slug: string;
  title: string;
  duration_seconds: number;
  sort_order: number;
};

type ModuleRow = {
  id: string;
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
};

export async function getDashboardLearningState(
  userId: string,
): Promise<DashboardLearningState | null> {
  const supabase = await createClient();

  const { data: latestProgressData, error: latestProgressError } =
    await supabase
      .from("mu_lesson_progress")
      .select(
        "course_id, lesson_id, status, progress_percent, last_position_seconds, last_viewed_at",
      )
      .eq("user_id", userId)
      .order("last_viewed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

  if (latestProgressError) {
    console.error(
      "Unable to load latest learning progress:",
      latestProgressError.message,
    );
  }

  const latestProgress = latestProgressData as ProgressRow | null;

  if (!latestProgress) {
    const { data: firstCourseData, error: firstCourseError } = await supabase
      .from("mu_courses")
      .select("id, slug, title, category, thumbnail_url")
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (firstCourseError || !firstCourseData) {
      return null;
    }

    const firstCourse = firstCourseData as CourseRow;

    const { data: firstLessonData, error: firstLessonError } = await supabase
      .from("mu_lessons")
      .select("id, module_id, slug, title, duration_seconds, sort_order")
      .eq("course_id", firstCourse.id)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (firstLessonError || !firstLessonData) {
      return null;
    }

    const firstLesson = firstLessonData as LessonRow;

    const { data: firstModuleData } = await supabase
      .from("mu_course_modules")
      .select("id, title, sort_order")
      .eq("id", firstLesson.module_id)
      .maybeSingle();

    const { count: totalLessons } = await supabase
      .from("mu_lessons")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("course_id", firstCourse.id)
      .eq("is_published", true);

    return {
      course: firstCourse,
      lesson: firstLesson,
      module: (firstModuleData as ModuleRow | null) ?? null,
      completedLessons: 0,
      totalLessons: totalLessons ?? 0,
      courseProgress: 0,
      lastPositionSeconds: 0,
      lastViewedAt: null,
    };
  }

  const [courseResult, lessonResult, completedResult, totalResult] =
    await Promise.all([
      supabase
        .from("mu_courses")
        .select("id, slug, title, category, thumbnail_url")
        .eq("id", latestProgress.course_id)
        .maybeSingle(),

      supabase
        .from("mu_lessons")
        .select("id, module_id, slug, title, duration_seconds, sort_order")
        .eq("id", latestProgress.lesson_id)
        .maybeSingle(),

      supabase
        .from("mu_lesson_progress")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", userId)
        .eq("course_id", latestProgress.course_id)
        .eq("status", "completed"),

      supabase
        .from("mu_lessons")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("course_id", latestProgress.course_id)
        .eq("is_published", true),
    ]);

  if (
    courseResult.error ||
    lessonResult.error ||
    !courseResult.data ||
    !lessonResult.data
  ) {
    return null;
  }

  const course = courseResult.data as CourseRow;
  const lesson = lessonResult.data as LessonRow;

  const { data: moduleData } = await supabase
    .from("mu_course_modules")
    .select("id, title, sort_order")
    .eq("id", lesson.module_id)
    .maybeSingle();

  const completedLessons = completedResult.count ?? 0;
  const totalLessons = totalResult.count ?? 0;

  const courseProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    course,
    lesson,
    module: (moduleData as ModuleRow | null) ?? null,
    completedLessons,
    totalLessons,
    courseProgress,
    lastPositionSeconds: latestProgress.last_position_seconds,
    lastViewedAt: latestProgress.last_viewed_at,
  };
}

export async function getLearningActivityStats(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mu_lesson_progress")
    .select("status, last_viewed_at, completed_at")
    .eq("user_id", userId)
    .order("last_viewed_at", { ascending: false });

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

    const expected = expectedDate.toISOString().slice(0, 10);

    if (activityDates[index] === expected) {
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
