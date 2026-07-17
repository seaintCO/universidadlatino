import { Check, ExternalLink } from "lucide-react";
import type { Lesson } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type LessonPlayerProps = {
  lesson: Lesson;
  moduleTitle: string;
};

export function LessonPlayer({ lesson, moduleTitle }: LessonPlayerProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
      <div className="mb-6">
        <p className="editorial-label mb-2">{moduleTitle}</p>

        <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
          {lesson.title}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#686c66] md:text-base">
          {lesson.description}
        </p>
      </div>

      <div className="aspect-video overflow-hidden rounded-2xl border border-[#2f312e] bg-[#1f211f]">
        {lesson.youtubeId ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${lesson.youtubeId}`}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <p className="editorial-label mb-3 text-[#b7bbb4]">
              Video pendiente de revisión
            </p>
            <p className="max-w-md text-sm leading-6 text-[#d8dbd5]">
              El reproductor ya está listo. El video se añadirá después de
              verificar su calidad, autor y permiso de inserción.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-5 text-xl font-semibold tracking-[-0.03em]">
              Resumen de la lección
            </h2>

            <div className="space-y-4">
              {lesson.summary.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e3ece7] text-[#254f3f]">
                    <Check size={13} strokeWidth={2.5} />
                  </div>

                  <p className="text-sm leading-7 text-[#4f534e]">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-5 text-xl font-semibold tracking-[-0.03em]">
              Pasos de acción
            </h2>

            <ol className="space-y-4">
              {lesson.actionSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f211f] text-xs font-bold text-white">
                    {index + 1}
                  </span>

                  <p className="pt-0.5 text-sm leading-7 text-[#4f534e]">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <p className="editorial-label mb-2">Tu progreso</p>
            <h2 className="mb-4 text-lg font-semibold">
              Completa esta lección
            </h2>

            <Button variant="emerald" fullWidth>
              Marcar como completada
            </Button>
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-lg font-semibold">Recursos</h2>

            {lesson.resources.length > 0 ? (
              <div className="space-y-2">
                {lesson.resources.map((resource) => (
                  <a
                    key={resource.url}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-lg border border-[#ddd9d0] p-3 text-sm font-medium hover:bg-[#f7f5f0]"
                  >
                    {resource.title}
                    <ExternalLink size={15} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-[#686c66]">
                Los recursos de esta lección se agregarán durante la revisión de
                contenido.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
