import { requireAuth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <div className="min-h-screen flex">
      <Sidebar isAdmin={user.role === "admin"} />
      <main className="flex-1 px-6 lg:px-10 py-6">
        <Topbar username={user.username} />
        <div className="grid gap-6">{children}</div>
      </main>
    </div>
  );
}
