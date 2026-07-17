import { CourseCard } from "@/components/courses/course-card";
import { courses } from "@/data/courses";

export default function CoursesPage() {
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

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Buscar cursos..."
          className="focus-ring min-h-12 flex-1 rounded-lg border border-[#ddd9d0] bg-white px-4 text-sm"
        />

        <select className="focus-ring min-h-12 rounded-lg border border-[#ddd9d0] bg-white px-4 text-sm">
          <option>Todas las categorías</option>
          <option>Trading</option>
          <option>E-commerce</option>
          <option>Marketing</option>
          <option>Ventas</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
