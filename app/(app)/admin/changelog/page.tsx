import { requireAdmin } from "@/lib/auth";
import ChangelogEditor from "@/components/admin/ChangelogEditor";

export default async function AdminChangelogPage() {
  await requireAdmin();
  return (
    <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Changelog</h1>
      <ChangelogEditor />
    </div>
  );
}
