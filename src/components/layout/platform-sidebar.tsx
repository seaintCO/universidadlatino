import Link from "next/link";
import {
  Award,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  GraduationCap,
  Home,
  Library,
  LogOut,
  MessageCircle,
  NotebookPen,
  Settings,
  Video,
} from "lucide-react";
import { logout } from "@/app/(auth)/actions";

const navigation = [
  { label: "Inicio", href: "/dashboard", icon: Home },
  { label: "Academia", href: "/cursos", icon: GraduationCap },
  { label: "Mi aprendizaje", href: "/dashboard", icon: BookOpen },
  { label: "Videoteca", href: "/videoteca", icon: Library },
  {
    label: "Gráficas",
    href: "/graficas",
    icon: ChartNoAxesColumnIncreasing,
  },
  { label: "Comunidad", href: "/comunidad", icon: MessageCircle },
  { label: "Certificados", href: "/certificados", icon: Award },
  { label: "Notas", href: "/notas", icon: NotebookPen },
  { label: "Sesiones", href: "/sesiones", icon: Video },
];

export function PlatformSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[#ddd9d0] bg-[#f7f5f0] lg:flex lg:flex-col">
      <div className="border-b border-[#ddd9d0] px-6 py-6">
        <Link
          href="/dashboard"
          className="text-base font-bold tracking-[-0.04em]"
        >
          CURSOCAPITAL
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#4f534e] transition-colors hover:bg-white hover:text-[#1f211f]"
            >
              <Icon size={18} strokeWidth={1.7} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#ddd9d0] p-4">
        <Link
          href="/configuracion"
          className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#4f534e] hover:bg-white hover:text-[#1f211f]"
        >
          <Settings size={18} strokeWidth={1.7} />
          Configuración
        </Link>

        <form action={logout} className="mt-1">
          <button
            type="submit"
            className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#4f534e] hover:bg-white hover:text-[#1f211f]"
          >
            <LogOut size={18} strokeWidth={1.7} />
            Cerrar sesión
          </button>
        </form>

        <div className="mt-3 rounded-xl border border-[#ddd9d0] bg-white p-3">
          <p className="text-sm font-semibold">Mi cuenta</p>
          <p className="mt-1 text-xs text-[#686c66]">
            CursoCapital
          </p>
        </div>
      </div>
    </aside>
  );
}
