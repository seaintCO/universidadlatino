import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck } from "lucide-react";
import { requireUser, getCurrentProfile } from "@/lib/auth/session";
import { getCurrentSubscription } from "@/lib/data/subscriptions";
import { logout } from "@/app/(auth)/actions";

export default async function DashboardPage() {
  const user = await requireUser();

  const [profile, subscription] = await Promise.all([
    getCurrentProfile(),
    getCurrentSubscription(user.id),
  ]);

  const name =
    profile?.display_name ??
    profile?.first_name ??
    user.email?.split("@")[0] ??
    "Estudiante";

  const planLabel =
    subscription?.plan === "academia_pro"
      ? "Academia Pro"
      : subscription?.plan === "academia"
        ? "Academia"
        : "Sin membresía";

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10">
      <header className="flex flex-col justify-between gap-5 border-b border-[#ddd9d0] pb-8 sm:flex-row sm:items-start">
        <div>
          <p className="editorial-label mb-2">Panel del estudiante</p>

          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            Buenos días, {name}.
          </h1>

          <p className="mt-2 text-sm text-[#686c66]">
            Continúa construyendo las habilidades que acercan tus metas.
          </p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="min-h-11 rounded-lg border border-[#ddd9d0] bg-white px-4 text-sm font-semibold hover:bg-[#efede7]"
          >
            Cerrar sesión
          </button>
        </form>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-2xl border border-[#ddd9d0] bg-white p-6">
          <p className="editorial-label mb-4">Tu academia</p>

          <BookOpen className="text-[#2f6650]" size={30} />

          <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">
            Explora tus cursos
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#686c66]">
            Los cursos se cargarán desde Supabase y aparecerán cuando estén
            publicados.
          </p>

          <Link
            href="/cursos"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#1f211f] px-5 text-sm font-semibold text-white"
          >
            Abrir Academia
            <ArrowRight size={16} />
          </Link>
        </section>

        <aside className="rounded-2xl bg-[#1f211f] p-6 text-white">
          <ShieldCheck size={27} className="text-[#8db5a0]" />

          <p className="editorial-label mt-5 text-[#b7bbb4]">Membresía</p>

          <h2 className="mt-2 text-2xl font-semibold">{planLabel}</h2>

          <p className="mt-3 text-sm leading-6 text-[#b7bbb4]">
            Estado: {subscription?.status ?? "inactive"}
          </p>

          {profile?.role === "admin" ? (
            <div className="mt-5 rounded-lg border border-[#4b4e49] p-3 text-sm">
              Acceso administrativo activo
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
