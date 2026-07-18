import { redirect } from "next/navigation";
import { PlatformSidebar } from "@/components/layout/platform-sidebar";
import { requireUser } from "@/lib/auth/session";
import { getUserAccessContext } from "@/lib/payments/access";
import Link from "next/link";
import { logout } from "@/app/(auth)/actions";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const access = await getUserAccessContext(user.id);

  if (!access.isAdmin && access.keys.size === 0) {
    redirect("/?purchase_required=1#precios");
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] lg:flex">
      <PlatformSidebar />
      <header className="flex min-h-16 items-center justify-between border-b border-[#ddd9d0] px-4 lg:hidden">
        <Link
          href="/dashboard"
          className="text-sm font-bold tracking-[-0.04em]"
        >
          CURSOCAPITAL
        </Link>

        <form action={logout}>
          <button
            type="submit"
            className="min-h-10 rounded-lg border border-[#ddd9d0] bg-white px-4 text-sm font-semibold text-[#1f211f] hover:bg-[#efede7]"
          >
            Cerrar sesión
          </button>
        </form>
      </header>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
