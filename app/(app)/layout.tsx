import { requireAuth } from "@/lib/auth";
import AppShell from "@/components/AppShell";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <AppShell username={user.username} isAdmin={user.role === "admin"}>
      {children}
    </AppShell>
  );
}
