"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { userCanAccessLesson } from "@/lib/payments/access";

type LessonInput = {
  courseId: string;
  courseSlug: string;
  lessonId: string;
  lessonSlug: string;
};

type SaveNoteInput = LessonInput & {
  body: string;
};

function refreshLessonPaths(input: LessonInput) {
  revalidatePath(`/cursos/${input.courseSlug}/${input.lessonSlug}`);
  revalidatePath(`/cursos/${input.courseSlug}`);
  revalidatePath("/dashboard");
  revalidatePath("/cursos");
  revalidatePath("/notas");
  revalidatePath("/videoteca");
}

async function requireAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      supabase,
      user: null,
    };
  }

  return {
    supabase,
    user,
  };
}

export async function completeLesson(input: LessonInput) {
  const { supabase, user } = await requireAuthenticatedUser();

  if (!user) {
    return {
      success: false,
      message: "Debes iniciar sesión para guardar tu progreso.",
    };
  }

  if (!(await userCanAccessLesson(user.id, input.lessonId))) {
    return {
      success: false,
      message: "Compra este curso para guardar tu progreso.",
    };
  }

  const now = new Date().toISOString();

  const { data: existingProgress } = await supabase
    .from("mu_lesson_progress")
    .select("started_at, watched_seconds, last_position_seconds")
    .eq("user_id", user.id)
    .eq("lesson_id", input.lessonId)
    .maybeSingle();

  const { error } = await supabase.from("mu_lesson_progress").upsert(
    {
      user_id: user.id,
      course_id: input.courseId,
      lesson_id: input.lessonId,
      status: "completed",
      progress_percent: 100,
      watched_seconds: existingProgress?.watched_seconds ?? 0,
      last_position_seconds: existingProgress?.last_position_seconds ?? 0,
      started_at: existingProgress?.started_at ?? now,
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

  refreshLessonPaths(input);

  return {
    success: true,
    message: "Lección completada.",
  };
}

export async function markLessonViewed(input: LessonInput) {
  const { supabase, user } = await requireAuthenticatedUser();

  if (!user) {
    return {
      success: false,
    };
  }

  if (!(await userCanAccessLesson(user.id, input.lessonId))) {
    return {
      success: false,
    };
  }

  const now = new Date().toISOString();

  const { data: existingProgress } = await supabase
    .from("mu_lesson_progress")
    .select(
      "status, progress_percent, started_at, completed_at, watched_seconds, last_position_seconds",
    )
    .eq("user_id", user.id)
    .eq("lesson_id", input.lessonId)
    .maybeSingle();

  const status =
    existingProgress?.status === "completed" ? "completed" : "in_progress";

  const { error } = await supabase.from("mu_lesson_progress").upsert(
    {
      user_id: user.id,
      course_id: input.courseId,
      lesson_id: input.lessonId,
      status,
      progress_percent:
        existingProgress?.status === "completed"
          ? 100
          : Math.max(existingProgress?.progress_percent ?? 0, 1),
      watched_seconds: existingProgress?.watched_seconds ?? 0,
      last_position_seconds: existingProgress?.last_position_seconds ?? 0,
      started_at: existingProgress?.started_at ?? now,
      completed_at: existingProgress?.completed_at ?? null,
      last_viewed_at: now,
      updated_at: now,
    },
    {
      onConflict: "user_id,lesson_id",
    },
  );

  if (error) {
    console.error("Unable to record lesson view:", error);

    return {
      success: false,
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
  };
}

export async function saveLessonNote(input: SaveNoteInput) {
  const { supabase, user } = await requireAuthenticatedUser();

  if (!user) {
    return {
      success: false,
      message: "Debes iniciar sesión para guardar notas.",
    };
  }

  if (!(await userCanAccessLesson(user.id, input.lessonId))) {
    return {
      success: false,
      message: "Compra este curso para guardar notas.",
    };
  }

  const cleanBody = input.body.trim();

  if (cleanBody.length > 10000) {
    return {
      success: false,
      message: "La nota es demasiado larga.",
    };
  }

  const { data: existingNote, error: existingNoteError } = await supabase
    .from("mu_lesson_notes")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_id", input.lessonId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingNoteError) {
    console.error("Unable to find lesson note:", existingNoteError);

    return {
      success: false,
      message: "No pudimos cargar tu nota.",
    };
  }

  if (!cleanBody) {
    if (existingNote) {
      const { error: deleteError } = await supabase
        .from("mu_lesson_notes")
        .delete()
        .eq("id", existingNote.id)
        .eq("user_id", user.id);

      if (deleteError) {
        return {
          success: false,
          message: "No pudimos eliminar la nota.",
        };
      }
    }

    refreshLessonPaths(input);

    return {
      success: true,
      message: "Nota eliminada.",
    };
  }

  const payload = {
    user_id: user.id,
    course_id: input.courseId,
    lesson_id: input.lessonId,
    body: cleanBody,
    updated_at: new Date().toISOString(),
  };

  const result = existingNote
    ? await supabase
        .from("mu_lesson_notes")
        .update(payload)
        .eq("id", existingNote.id)
        .eq("user_id", user.id)
    : await supabase.from("mu_lesson_notes").insert(payload);

  if (result.error) {
    console.error("Unable to save lesson note:", result.error);

    return {
      success: false,
      message: "No pudimos guardar tu nota.",
    };
  }

  refreshLessonPaths(input);

  return {
    success: true,
    message: "Nota guardada.",
  };
}

export async function toggleLessonBookmark(input: LessonInput) {
  const { supabase, user } = await requireAuthenticatedUser();

  if (!user) {
    return {
      success: false,
      bookmarked: false,
      message: "Debes iniciar sesión para guardar favoritos.",
    };
  }

  if (!(await userCanAccessLesson(user.id, input.lessonId))) {
    return {
      success: false,
      bookmarked: false,
      message: "Compra este curso para guardar favoritos.",
    };
  }

  const { data: existingBookmark, error: bookmarkError } = await supabase
    .from("mu_lesson_bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_id", input.lessonId)
    .maybeSingle();

  if (bookmarkError) {
    return {
      success: false,
      bookmarked: false,
      message: "No pudimos comprobar este favorito.",
    };
  }

  if (existingBookmark) {
    const { error } = await supabase
      .from("mu_lesson_bookmarks")
      .delete()
      .eq("id", existingBookmark.id)
      .eq("user_id", user.id);

    if (error) {
      return {
        success: false,
        bookmarked: true,
        message: "No pudimos eliminar el favorito.",
      };
    }

    refreshLessonPaths(input);

    return {
      success: true,
      bookmarked: false,
      message: "Eliminado de favoritos.",
    };
  }

  const { error } = await supabase.from("mu_lesson_bookmarks").insert({
    user_id: user.id,
    lesson_id: input.lessonId,
  });

  if (error) {
    return {
      success: false,
      bookmarked: false,
      message: "No pudimos guardar el favorito.",
    };
  }

  refreshLessonPaths(input);

  return {
    success: true,
    bookmarked: true,
    message: "Guardado en favoritos.",
  };
}
