import { MessageCircle } from "lucide-react";
import { PlatformInfoPage } from "@/components/platform/platform-info-page";

export default function CommunityPage() {
  return (
    <PlatformInfoPage
      eyebrow="Comunidad"
      title="La comunidad de CursoCapital está en preparación."
      description="Este espacio reunirá anuncios, conversaciones y recursos para estudiantes. Tus cursos y progreso ya funcionan desde el panel."
      icon={MessageCircle}
      actionLabel="Volver al panel"
      actionHref="/dashboard"
    />
  );
}
