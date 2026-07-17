"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type CompleteLessonInput = {
  courseId: string;
  courseSlug: string;
  lessonId: string;
  lessonSlug: string;
};

export async function completeLesson(input: CompleteLessonInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      message: "Debes iniciar sesión para guardar tu progreso.",
    };
  }

  const now = new Date().toISOString();

  const { error } = await supabase.from("mu_lesson_progress").upsert(
    {
      user_id: user.id,
      course_id: input.courseId,
      lesson_id: input.lessonId,
      status: "completed",
      progress_percent: 100,
      watched_seconds: 0,
      last_position_seconds: 0,
      started_at: now,
      completed_at: now,
      last_viewed_at: now,
      updated_at: now,
    },
    {
      onConflict: "user_id,lesson_id",
    },
  );

  if (error) {
    console.error("Unable to complete lesson:", error);

    return {
      success: false,
      message: "No pudimos guardar tu progreso. Intenta nuevamente.",
    };
  }

  revalidatePath(`/cursos/${input.courseSlug}/${input.lessonSlug}`);
  revalidatePath(`/cursos/${input.courseSlug}`);
  revalidatePath("/dashboard");
  revalidatePath("/cursos");

  return {
    success: true,
    message: "Lección completada.",
  };
}
