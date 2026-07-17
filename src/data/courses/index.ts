import { tradingDesdeCero } from "./trading-desde-cero";
import type { Course, Lesson } from "@/types/course";

export const courses: Course[] = [tradingDesdeCero];

export function getCourseBySlug(slug: string) {
  return courses.find((course) => course.slug === slug);
}

export function getLessonBySlug(
  courseSlug: string,
  lessonSlug: string,
): {
  course: Course;
  lesson: Lesson;
  moduleTitle: string;
} | null {
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    return null;
  }

  for (const module of course.modules) {
    const lesson = module.lessons.find(
      (currentLesson) => currentLesson.slug === lessonSlug,
    );

    if (lesson) {
      return {
        course,
        lesson,
        moduleTitle: module.title,
      };
    }
  }

  return null;
}

export function getCourseLessonCount(course: Course) {
  return course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );
}

export function getCourseDuration(course: Course) {
  return course.modules.reduce(
    (courseTotal, module) =>
      courseTotal +
      module.lessons.reduce(
        (moduleTotal, lesson) => moduleTotal + lesson.durationMinutes,
        0,
      ),
    0,
  );
}
