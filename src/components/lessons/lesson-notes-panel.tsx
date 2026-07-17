"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { CheckCircle2, LoaderCircle, NotebookPen } from "lucide-react";
import { saveLessonNote } from "@/app/(platform)/cursos/[courseSlug]/[lessonSlug]/actions";

type LessonNotesPanelProps = {
  courseId: string;
  courseSlug: string;
  lessonId: string;
  lessonSlug: string;
  initialNote: string;
};

export function LessonNotesPanel({
  courseId,
  courseSlug,
  lessonId,
  lessonSlug,
  initialNote,
}: LessonNotesPanelProps) {
  const [body, setBody] = useState(initialNote);
  const [savedBody, setSavedBody] = useState(initialNote);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (body === savedBody) {
      return;
    }

    const timer = window.setTimeout(() => {
      startTransition(async () => {
        const result = await saveLessonNote({
          courseId,
          courseSlug,
          lessonId,
          lessonSlug,
          body,
        });

        setMessage(result.message);

        if (result.success) {
          setSavedBody(body);
        }
      });
    }, 900);

    return () => {
      window.clearTimeout(timer);
    };
  }, [body, courseId, courseSlug, lessonId, lessonSlug, savedBody]);

  return (
    <section className="rounded-2xl border border-[#ddd9d0] bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="editorial-label mb-2">Notas personales</p>

          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-[-0.03em]">
            <NotebookPen size={20} />
            Mis apuntes
          </h2>
        </div>

        <div className="text-xs font-medium text-[#686c66]">
          {isPending ? (
            <span className="flex items-center gap-1.5">
              <LoaderCircle className="animate-spin" size={14} />
              Guardando
            </span>
          ) : body === savedBody && body ? (
            <span className="flex items-center gap-1.5 text-[#2f6650]">
              <CheckCircle2 size={14} />
              Guardado
            </span>
          ) : null}
        </div>
      </div>

      <textarea
        value={body}
        onChange={(event) => {
          setBody(event.target.value);
          setMessage(null);
        }}
        placeholder="Escribe lo que quieres recordar de esta lección..."
        rows={7}
        maxLength={10000}
        className="focus-ring mt-5 w-full resize-y rounded-xl border border-[#ddd9d0] bg-[#fcfbf8] px-4 py-3 text-sm leading-7 outline-none placeholder:text-[#999d97]"
      />

      <div className="mt-2 flex items-center justify-between gap-4 text-xs text-[#8b8f89]">
        <span>Se guarda automáticamente.</span>
        <span>{body.length}/10,000</span>
      </div>

      {message && body !== savedBody ? (
        <p className="mt-3 text-xs text-red-700">{message}</p>
      ) : null}
    </section>
  );
}
