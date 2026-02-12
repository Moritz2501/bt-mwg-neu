import Section from "@/components/Section";
import { prisma } from "@/lib/db";
import { requireAuth, isAdminVerified } from "@/lib/auth";
import AdminVerify from "@/components/admin/AdminVerify";
import ChangelogEditor from "@/components/admin/ChangelogEditor";

export default async function DashboardPage() {
  const user = await requireAuth();

  const now = new Date();
  const [users, events, requests, latestRequests, nextEntries] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.bookingRequest.count(),
    prisma.bookingRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 2
    }),
    prisma.calendarEntry.findMany({
      where: { start: { gte: now } },
      orderBy: { start: "asc" },
      take: 2
    })
  ]);

  const verified = user.role === "admin" && isAdminVerified();

  return (
    <div className="grid gap-6">
      <Section title="Uebersicht">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-night-800/70 rounded-xl p-4">
            <div className="text-night-300 text-sm">Team</div>
            <div className="text-2xl font-semibold">{users}</div>
          </div>
          <div className="bg-night-800/70 rounded-xl p-4">
            <div className="text-night-300 text-sm">Events</div>
            <div className="text-2xl font-semibold">{events}</div>
          </div>
          <div className="bg-night-800/70 rounded-xl p-4">
            <div className="text-night-300 text-sm">Anfragen</div>
            <div className="text-2xl font-semibold">{requests}</div>
          </div>
        </div>
      </Section>
      <div className="grid lg:grid-cols-2 gap-6">
        <Section title="Neueste Anfragen">
          {latestRequests.length === 0 ? (
            <div className="text-night-300">Keine Anfragen vorhanden.</div>
          ) : (
            <div className="grid gap-3">
              {latestRequests.map((request) => (
                <div key={request.id} className="border border-night-800 rounded-xl p-4">
                  <div className="font-semibold">{request.eventTitle}</div>
                  <div className="text-night-300 text-sm">{request.requesterName}</div>
                  <div className="text-night-400 text-xs">Status: {request.status}</div>
                </div>
              ))}
            </div>
          )}
        </Section>
        <Section title="Naechste Termine">
          {nextEntries.length === 0 ? (
            <div className="text-night-300">Keine Termine geplant.</div>
          ) : (
            <div className="grid gap-3">
              {nextEntries.map((entry) => (
                <div key={entry.id} className="border border-night-800 rounded-xl p-4">
                  <div className="font-semibold">{entry.title}</div>
                  <div className="text-night-300 text-sm">
                    {entry.start.toLocaleString("de-DE")}
                  </div>
                  <div className="text-night-400 text-xs">{entry.location}</div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
      {user.role === "admin" && (
        <Section title="Changelog (Admin)">
          {verified ? (
            <ChangelogEditor />
          ) : (
            <div className="grid gap-4">
              <div className="text-night-300 text-sm">
                Admin Passwort erforderlich, um den Changelog zu bearbeiten.
              </div>
              <AdminVerify />
            </div>
          )}
        </Section>
      )}
    </div>
  );
}
