import { ChartNoAxesColumnIncreasing } from "lucide-react";
import { PlatformInfoPage } from "@/components/platform/platform-info-page";

export default function ChartsPage() {
  return (
    <PlatformInfoPage
      eyebrow="Gráficas"
      title="Aprende a leer el mercado paso a paso."
      description="Las lecciones de gráficas, indicadores y ejecución están dentro de tu ruta de Trading."
      icon={ChartNoAxesColumnIncreasing}
      actionLabel="Abrir Trading"
      actionHref="/cursos/mercado-university"
    />
  );
}
