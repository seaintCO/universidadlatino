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

  for (const courseModule of course.modules) {
    const lesson = courseModule.lessons.find(
      (currentLesson) => currentLesson.slug === lessonSlug,
    );

    if (lesson) {
      return {
        course,
        lesson,
        moduleTitle: courseModule.title,
      };
    }
  }

  return null;
}

export function getCourseLessonCount(course: Course) {
  return course.modules.reduce(
    (total, courseModule) => total + courseModule.lessons.length,
    0,
  );
}

export function getCourseDuration(course: Course) {
  return course.modules.reduce(
    (courseTotal, courseModule) =>
      courseTotal +
      courseModule.lessons.reduce(
        (moduleTotal, lesson) => moduleTotal + lesson.durationMinutes,
        0,
      ),
    0,
  );
}
