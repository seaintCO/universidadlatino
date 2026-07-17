import { createClient } from "@/lib/supabase/server";

export type MercadoCourse = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  long_description: string | null;
  category: string;
  level: "Principiante" | "Intermedio" | "Avanzado";
  estimated_hours: number;
  thumbnail_url: string | null;
  required_plan: "free" | "academia" | "academia_pro";
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
};

export type MercadoModule = {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_published: boolean;
};

export async function getAllCoursesForAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mu_courses")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Unable to load courses: ${error.message}`);
  }

  return (data ?? []) as MercadoCourse[];
}

export async function getPublishedCourses() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mu_courses")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Unable to load courses: ${error.message}`);
  }

  return (data ?? []) as MercadoCourse[];
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mu_courses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load course: ${error.message}`);
  }

  return data as MercadoCourse | null;
}

export async function getCourseModules(courseId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mu_course_modules")
    .select("*")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Unable to load modules: ${error.message}`);
  }

  return (data ?? []) as MercadoModule[];
}
