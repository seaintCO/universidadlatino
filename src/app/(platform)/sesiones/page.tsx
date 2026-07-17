import { Video } from "lucide-react";
import { PlatformInfoPage } from "@/components/platform/platform-info-page";

export default function SessionsPage() {
  return (
    <PlatformInfoPage
      eyebrow="Sesiones"
      title="Las sesiones en vivo se anunciarán aquí."
      description="Cuando se programe una clase o sesión especial, encontrarás la fecha y el acceso en esta sección."
      icon={Video}
      actionLabel="Volver al panel"
      actionHref="/dashboard"
    />
  );
}
