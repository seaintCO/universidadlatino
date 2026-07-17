import { Settings } from "lucide-react";
import { PlatformInfoPage } from "@/components/platform/platform-info-page";

export default function SettingsPage() {
  return (
    <PlatformInfoPage
      eyebrow="Configuración"
      title="Administra tu cuenta de CursoCapital."
      description="Por ahora puedes gestionar tu acceso, contraseña y correo desde la autenticación de la plataforma."
      icon={Settings}
      actionLabel="Volver al panel"
      actionHref="/dashboard"
    />
  );
}
