import Link from "next/link";
import { ArrowRight, Award, BookOpen, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  return (
    <div className="px-4 py-8 md:px-8 lg:px-10">
      <header className="mb-10">
        <p className="editorial-label mb-2">Panel del estudiante</p>

        <h1 className="text-3xl font-semibold tracking-[-0.04em]">
          Buenos días, Luis.
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#686c66]">
          Continúa construyendo las habilidades que acercan tus metas.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card className="p-6">
            <p className="editorial-label mb-4">Continuar aprendiendo</p>

            <div className="grid gap-6 md:grid-cols-[180px_1fr]">
              <div className="flex aspect-video items-center justify-center rounded-xl bg-[#efede7]">
                <BookOpen className="text-[#686c66]" size={34} />
              </div>

              <div>
                <p className="text-xs font-semibold text-[#686c66]">
                  Módulo 1 · Lección 1
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                  Trading desde Cero
                </h2>

                <div className="mt-5">
                  <Progress value={8} label="Progreso del curso" />
                </div>

                <Link
                  href="/cursos/trading-desde-cero/como-funcionan-los-mercados"
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#1f211f] px-5 text-sm font-semibold text-white"
                >
                  Continuar lección
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Card>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              ["Lecciones", "1", BookOpen],
              ["Racha", "1 día", Flame],
              ["Certificados", "0", Award],
            ].map(([label, value, Icon]) => {
              const StatIcon = Icon as typeof BookOpen;

              return (
                <Card key={label as string} className="p-5">
                  <StatIcon
                    className="mb-5 text-[#2f6650]"
                    size={22}
                    strokeWidth={1.7}
                  />
                  <p className="text-2xl font-semibold">{value as string}</p>
                  <p className="mt-1 text-sm text-[#686c66]">
                    {label as string}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Meta de hoy</h2>
              <span className="text-xs font-semibold text-[#686c66]">0/3</span>
            </div>

            <div className="mt-5 space-y-4 text-sm text-[#4f534e]">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" />
                Completar una lección
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" />
                Repasar flashcards
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4" />
                Escribir una nota
              </label>
            </div>
          </Card>

          <Card className="bg-[#1f211f] p-6 text-white">
            <p className="editorial-label mb-3 text-[#b7bbb4]">Próximo paso</p>

            <h2 className="text-xl font-semibold">
              Completa tu primera lección
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#b7bbb4]">
              Empieza con los fundamentos antes de avanzar a gráficas e
              indicadores.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
