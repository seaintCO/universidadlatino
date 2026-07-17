import Link from "next/link";
import { BookOpen, Clock3, LockKeyhole } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth/session";
import { getAllCoursesForAdmin, getPublishedCourses } from "@/lib/data/courses";

export default async function CoursesPage() {
  const profile = await getCurrentProfile();

  const courses =
    profile?.role === "admin"
      ? await getAllCoursesForAdmin()
      : await getPublishedCourses();

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10">
      <header className="mb-10">
        <p className="editorial-label mb-2">Academia</p>

        <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
          Aprende habilidades prácticas.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#686c66] md:text-base">
          Explora rutas estructuradas en español para aprender desde los
          fundamentos hasta la ejecución.
        </p>
      </header>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#c9c4b9] bg-white p-10 text-center">
          <LockKeyhole className="mx-auto text-[#686c66]" size={30} />

          <h2 className="mt-5 text-xl font-semibold">
            Los cursos todavía no están publicados
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#686c66]">
            El contenido se está revisando antes de abrirlo a los estudiantes.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/cursos/${course.slug}`}
              className="group overflow-hidden rounded-2xl border border-[#ddd9d0] bg-white transition-transform hover:-translate-y-1"
            >
              <div className="flex aspect-video items-center justify-center bg-[#efede7]">
                <span className="editorial-label">{course.category}</span>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="editorial-label">{course.category}</p>

                  {!course.is_published ? (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                      Borrador
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] group-hover:text-[#2f6650]">
                  {course.title}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#686c66]">
                  {course.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium text-[#686c66]">
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={15} />6 módulos
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock3 size={15} />
                    {course.estimated_hours} horas
                  </span>

                  <span>{course.level}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
