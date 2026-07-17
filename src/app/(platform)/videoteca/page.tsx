import { Library } from "lucide-react";
import { PlatformInfoPage } from "@/components/platform/platform-info-page";

export default function VideoLibraryPage() {
  return (
    <PlatformInfoPage
      eyebrow="Videoteca"
      title="Todas tus lecciones, en un solo lugar."
      description="Accede a los videos incluidos en los cursos que compraste y continúa exactamente donde terminaste."
      icon={Library}
    />
  );
}
