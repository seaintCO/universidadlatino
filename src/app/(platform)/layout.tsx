import { redirect } from "next/navigation";
import { PlatformSidebar } from "@/components/layout/platform-sidebar";
import { requireUser } from "@/lib/auth/session";
import { getUserAccessContext } from "@/lib/payments/access";

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
    <div className="flex min-h-screen bg-[#f7f5f0]">
      <PlatformSidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
