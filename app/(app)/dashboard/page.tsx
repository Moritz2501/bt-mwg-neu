import Section from "@/components/Section";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
  await requireAuth();

  const [users, events, requests] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.bookingRequest.count()
  ]);

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
    </div>
  );
}
