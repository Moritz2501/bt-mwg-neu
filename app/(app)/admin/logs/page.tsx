import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

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
    <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Audit Log</h1>
      <ul className="space-y-2">
        {logs.map((log: any) => (
          <li key={log.id} className="border border-night-800 rounded-xl p-3">
            <div className="text-night-200 text-sm">
              {new Date(log.createdAt).toLocaleString("de-DE")}
            </div>
            <div className="font-semibold">{log.action}</div>
            <div className="text-night-300 text-sm">
              Akteur: {log.admin?.username ?? log.actorName ?? "Unbekannt"}
              {log.targetUser ? ` | Ziel: ${log.targetUser.username}` : ""}
            </div>
            {log.details && <div className="text-night-400 text-xs">{log.details}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
