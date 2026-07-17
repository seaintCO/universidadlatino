"use client";

import { useEffect, useRef } from "react";
import { markLessonViewed } from "@/app/(platform)/cursos/[courseSlug]/[lessonSlug]/actions";

type LessonActivityTrackerProps = {
  courseId: string;
  courseSlug: string;
  lessonId: string;
  lessonSlug: string;
};

export function LessonActivityTracker({
  courseId,
  courseSlug,
  lessonId,
  lessonSlug,
}: LessonActivityTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) {
      return;
    }

    hasTracked.current = true;

    void markLessonViewed({
      courseId,
      courseSlug,
      lessonId,
      lessonSlug,
    });
  }, [courseId, courseSlug, lessonId, lessonSlug]);

  return null;
}
