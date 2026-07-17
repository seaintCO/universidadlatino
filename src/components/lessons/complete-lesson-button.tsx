"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { completeLesson } from "@/app/(platform)/cursos/[courseSlug]/[lessonSlug]/actions";

type CompleteLessonButtonProps = {
  courseId: string;
  courseSlug: string;
  lessonId: string;
  lessonSlug: string;
  initiallyCompleted: boolean;
};

export function CompleteLessonButton({
  courseId,
  courseSlug,
  lessonId,
  lessonSlug,
  initiallyCompleted,
}: CompleteLessonButtonProps) {
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleComplete() {
    if (completed || isPending) {
      return;
    }

    setMessage(null);

    startTransition(async () => {
      const result = await completeLesson({
        courseId,
        courseSlug,
        lessonId,
        lessonSlug,
      });

      setMessage(result.message);

      if (result.success) {
        setCompleted(true);
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleComplete}
        disabled={completed || isPending}
        className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
          completed
            ? "cursor-default bg-[#e3ece7] text-[#254f3f]"
            : "bg-[#2f6650] text-white hover:bg-[#254f3f] disabled:cursor-wait disabled:opacity-70"
        }`}
      >
        {isPending ? (
          <>
            <LoaderCircle className="animate-spin" size={17} />
            Guardando...
          </>
        ) : completed ? (
          <>
            <CheckCircle2 size={17} />
            Lección completada
          </>
        ) : (
          "Marcar como completada"
        )}
      </button>

      {message ? (
        <p
          className={`mt-3 text-xs leading-5 ${
            completed ? "text-[#2f6650]" : "text-red-700"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
