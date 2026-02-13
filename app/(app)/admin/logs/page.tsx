import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLogsPage() {
  await requireAdmin();
  const logs = await prisma.adminLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      admin: { select: { username: true, role: true } },
      targetUser: { select: { username: true } }
    }
  });

  return (
    <div className="bg-ink/70 border border-night-800 rounded-xl p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-semibold">Audit Log</h1>
        <Link className="rounded-pill px-4 py-2 border border-night-600" href="/admin">
          Zurueck
        </Link>
      </div>
      <ul className="space-y-2">
        {logs.map((log: any) => (
          <li key={log.id} className="border border-night-800 rounded-xl p-3 break-words">
            <div className="text-night-200 text-sm">
              {new Date(log.createdAt).toLocaleString("de-DE")}
            </div>
            <div className="font-semibold">{log.action}</div>
            <div className="text-night-300 text-sm">
              Akteur: {log.admin?.username ?? log.actorName ?? "Unbekannt"}
              {log.targetUser ? ` | Ziel: ${log.targetUser.username}` : ""}
            </div>
            {log.details && <div className="text-night-400 text-xs break-words">{log.details}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
