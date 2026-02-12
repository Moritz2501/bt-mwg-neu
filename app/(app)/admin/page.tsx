import { requireAdmin, isAdminVerified } from "@/lib/auth";
import AdminVerify from "@/components/admin/AdminVerify";
import Link from "next/link";

export default async function AdminPage() {
  await requireAdmin();
  const verified = isAdminVerified();

  return (
    <div className="grid gap-6">
      {!verified ? (
        <AdminVerify />
      ) : (
        <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
          <h1 className="text-2xl font-semibold">Admin Bereich</h1>
          <p className="text-night-300">Zugriff gewährt. Wähle einen Bereich.</p>
          <div className="flex gap-4 mt-4">
            <Link className="rounded-pill px-4 py-2 bg-night-700" href="/admin/users">
              Benutzerverwaltung
            </Link>
            <Link className="rounded-pill px-4 py-2 border border-night-600" href="/admin/logs">
              Admin Log
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
