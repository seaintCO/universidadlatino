export type CourseLevel = "Principiante" | "Intermedio" | "Avanzado";

export type LessonResource = {
  title: string;
  url: string;
  type: "video" | "article" | "tool";
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  description: string;
  durationMinutes: number;
  youtubeId?: string;
  youtubeUrl?: string;
  creator?: string;
  summary: string[];
  actionSteps: string[];
  resources: LessonResource[];
  isPreview?: boolean;
  isPublished: boolean;
};

export type CourseModule = {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  level: CourseLevel;
  estimatedHours: number;
  thumbnail: string;
  accent: string;
  isPublished: boolean;
  modules: CourseModule[];
};
