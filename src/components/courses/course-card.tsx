import Link from "next/link";
import { BookOpen, Clock3 } from "lucide-react";
import type { Course } from "@/types/course";
import { getCourseLessonCount } from "@/data/courses";
import { Card } from "@/components/ui/card";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  const lessonCount = getCourseLessonCount(course);

  return (
    <Link href={`/cursos/${course.slug}`}>
      <Card className="group h-full overflow-hidden transition-transform hover:-translate-y-1">
        <div className="flex aspect-[16/9] items-center justify-center bg-[#efede7]">
          <span className="editorial-label text-[#686c66]">
            {course.category}
          </span>
        </div>

        <div className="p-5">
          <p className="editorial-label mb-2">{course.category}</p>

          <h3 className="mb-2 text-lg font-semibold tracking-[-0.025em] group-hover:text-[#2f6650]">
            {course.title}
          </h3>

          <p className="mb-5 text-sm leading-6 text-[#686c66]">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#686c66]">
            <span className="flex items-center gap-1.5">
              <BookOpen size={15} />
              {lessonCount} lecciones
            </span>

            <span className="flex items-center gap-1.5">
              <Clock3 size={15} />
              {course.estimatedHours} horas
            </span>

            <span>{course.level}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
