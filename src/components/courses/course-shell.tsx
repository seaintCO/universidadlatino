import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import type { Course, Lesson } from "@/types/course";

type CourseShellProps = {
  course: Course;
  activeLesson?: Lesson;
  children: React.ReactNode;
};

export function CourseShell({
  course,
  activeLesson,
  children,
}: CourseShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <header className="border-b border-[#ddd9d0] bg-white">
        <div className="flex min-h-16 items-center justify-between px-4 md:px-6">
          <Link
            href="/dashboard"
            className="text-sm font-bold tracking-[-0.03em]"
          >
            MERCADO UNIVERSITY
          </Link>

          <Link
            href="/cursos"
            className="text-sm font-semibold text-[#686c66] hover:text-[#1f211f]"
          >
            Salir del curso
          </Link>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[320px_1fr]">
        <aside className="border-b border-[#ddd9d0] bg-[#f7f5f0] lg:border-b-0 lg:border-r">
          <div className="p-5">
            <p className="editorial-label mb-2">{course.category}</p>
            <h1 className="text-xl font-semibold tracking-[-0.03em]">
              {course.title}
            </h1>
          </div>

          <div className="max-h-[48vh] overflow-y-auto px-3 pb-5 lg:max-h-[calc(100vh-9rem)]">
            {course.modules.map((module) => (
              <section key={module.id} className="mb-5">
                <div className="px-2 pb-2">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#686c66]">
                    Módulo {module.order}
                  </p>
                  <h2 className="mt-1 text-sm font-semibold">{module.title}</h2>
                </div>

                <div className="space-y-1">
                  {module.lessons.length > 0 ? (
                    module.lessons.map((lesson) => {
                      const isActive = activeLesson?.id === lesson.id;

                      return (
                        <Link
                          key={lesson.id}
                          href={`/cursos/${course.slug}/${lesson.slug}`}
                          className={`flex min-h-12 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? "bg-[#e3ece7] font-semibold text-[#254f3f]"
                              : "text-[#686c66] hover:bg-white hover:text-[#1f211f]"
                          }`}
                        >
                          {isActive ? (
                            <PlayCircle size={17} />
                          ) : lesson.isPublished ? (
                            <CheckCircle2 size={17} />
                          ) : (
                            <Lock size={17} />
                          )}

                          <span className="line-clamp-2">{lesson.title}</span>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="rounded-lg border border-dashed border-[#ddd9d0] px-3 py-4 text-xs text-[#686c66]">
                      Contenido en preparación
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
