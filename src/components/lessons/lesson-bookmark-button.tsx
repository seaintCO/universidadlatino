"use client";

import { useState, useTransition } from "react";
import { Bookmark, LoaderCircle } from "lucide-react";
import { toggleLessonBookmark } from "@/app/(platform)/cursos/[courseSlug]/[lessonSlug]/actions";

type LessonBookmarkButtonProps = {
  courseId: string;
  courseSlug: string;
  lessonId: string;
  lessonSlug: string;
  initiallyBookmarked: boolean;
};

export function LessonBookmarkButton({
  courseId,
  courseSlug,
  lessonId,
  lessonSlug,
  initiallyBookmarked,
}: LessonBookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      const result = await toggleLessonBookmark({
        courseId,
        courseSlug,
        lessonId,
        lessonSlug,
      });

      setMessage(result.message);

      if (result.success) {
        setBookmarked(result.bookmarked);
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors ${
          bookmarked
            ? "border-[#b8cfc1] bg-[#e3ece7] text-[#254f3f]"
            : "border-[#ddd9d0] bg-white text-[#4f534e] hover:bg-[#f7f5f0]"
        }`}
      >
        {isPending ? (
          <LoaderCircle className="animate-spin" size={17} />
        ) : (
          <Bookmark size={17} fill={bookmarked ? "currentColor" : "none"} />
        )}

        {bookmarked ? "Guardado" : "Guardar lección"}
      </button>

      {message ? (
        <p className="mt-2 text-center text-xs text-[#686c66]">{message}</p>
      ) : null}
    </div>
  );
}
