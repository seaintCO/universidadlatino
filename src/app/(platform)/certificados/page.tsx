import { Award } from "lucide-react";
import { PlatformInfoPage } from "@/components/platform/platform-info-page";

export default function CertificatesPage() {
  return (
    <PlatformInfoPage
      eyebrow="Certificados"
      title="Completa tus rutas para desbloquear certificados."
      description="Los certificados aparecerán cuando completes las lecciones y evaluaciones requeridas de cada curso."
      icon={Award}
      actionLabel="Continuar aprendiendo"
      actionHref="/dashboard"
    />
  );
}
