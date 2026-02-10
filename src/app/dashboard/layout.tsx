import { Sidebar } from "@/components/layout/sidebar";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell>
      <div className="flex min-h-screen bg-background bg-glow">
        <Sidebar />
        <main className="flex-1 lg:ml-[220px]">{children}</main>
      </div>
    </DashboardShell>
  );
}
