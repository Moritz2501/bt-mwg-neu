import { requireAdmin } from "@/lib/auth";
import ChangelogEditor from "@/components/admin/ChangelogEditor";
import Link from "next/link";

export default async function AdminChangelogPage() {
  await requireAdmin();
  return (
    <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-semibold">Changelog</h1>
        <Link className="rounded-pill px-4 py-2 border border-night-600" href="/admin">
          Zurueck
        </Link>
      </div>
      <ChangelogEditor />
    </div>
  );
}
