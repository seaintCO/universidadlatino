import { PlatformSidebar } from "@/components/layout/platform-sidebar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f7f5f0]">
      <PlatformSidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
