import { requireAdmin, isAdminVerified } from "@/lib/auth";
import AdminVerify from "@/components/admin/AdminVerify";
import ChangelogEditor from "@/components/admin/ChangelogEditor";

export default async function AdminChangelogPage() {
  await requireAdmin();
  const verified = isAdminVerified();

  if (!verified) {
    return (
      <div className="grid gap-6">
        <div className="text-night-300 text-sm">
          Admin Passwort erforderlich, um den Changelog zu bearbeiten.
        </div>
        <AdminVerify />
      </div>
    );
  }

  return (
    <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Changelog</h1>
      <ChangelogEditor />
    </div>
  );
}
