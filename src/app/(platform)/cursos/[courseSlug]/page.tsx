import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    courseSlug: string;
  }>;
};

export default async function CoursePage({ params }: Props) {
  const { courseSlug } = await params;

  const supabase = await createClient();

  const { data: course } = await supabase
    .from("mu_courses")
    .select("*")
    .eq("slug", courseSlug)
    .single();

  if (!course) notFound();

  const { data: modules } = await supabase
    .from("mu_course_modules")
    .select("*")
    .eq("course_id", course.id)
    .order("sort_order");

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">

      <div className="mb-10">

        <p className="editorial-label">
          {course.category}
        </p>

        <h1 className="text-5xl font-semibold tracking-tight mt-3">
          {course.title}
        </h1>

        <p className="text-stone-500 mt-4 max-w-3xl leading-7">
          {course.description}
        </p>

      </div>

      <div className="space-y-6">

        {modules?.map((module) => (

          <div
            key={module.id}
            className="bg-white border border-stone-200 rounded-xl p-6"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-xs uppercase tracking-wider text-stone-400">
                  Módulo {module.sort_order}
                </p>

                <h2 className="text-xl font-semibold mt-1">
                  {module.title}
                </h2>

                <p className="text-stone-500 mt-2">
                  {module.description}
                </p>

              </div>

            </div>

            <div className="mt-6">

              <Link
                href={`/cursos/${course.slug}/${module.slug}`}
                className="bg-stone-900 text-white px-5 py-3 rounded-lg font-medium inline-flex"
              >
                Ver módulo
              </Link>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}