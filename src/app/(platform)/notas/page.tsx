import { NotebookPen } from "lucide-react";
import { PlatformInfoPage } from "@/components/platform/platform-info-page";

export default function NotesPage() {
  return (
    <PlatformInfoPage
      eyebrow="Notas"
      title="Tus ideas se guardan dentro de cada lección."
      description="Abre una lección para escribir, actualizar y consultar tus notas mientras estudias."
      icon={NotebookPen}
    />
  );
}
