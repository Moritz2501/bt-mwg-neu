import Link from "next/link";
import BookingForm from "@/components/BookingForm";
import { prisma } from "@/lib/db";

export default async function LandingPage() {
  const prismaAny = prisma as any;
  const changelog = await prismaAny.changelogEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  });
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-6">
          <div className="text-2xl font-semibold text-night-100">Bühnentechnik-MWG</div>
        <div className="flex gap-4">
          <Link className="rounded-pill px-5 py-2 bg-night-700 text-white" href="/login">
            Anmelden
          </Link>
        </div>
      </header>

      <section className="flex-1 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center text-night-200 text-3xl font-semibold">
            Herzlich willkommen bei der Bühnentechnik des Maria-Wächtler-Gymnasiums
          </div>
          <div className="mb-8 bg-ink/70 border border-night-800 rounded-xl p-6">
            <div className="text-night-200 text-sm mb-4">Changelog</div>
            {changelog.length === 0 ? (
              <div className="text-night-400 text-sm">Noch keine Eintraege.</div>
            ) : (
              <div className="grid gap-3">
                {changelog.map((entry: any) => (
                  <div key={entry.id} className="border border-night-800 rounded-xl p-4">
                    <div className="font-semibold">{entry.title}</div>
                    {entry.body && (
                      <div className="text-night-300 text-sm mt-1 whitespace-pre-line">
                        {entry.body}
                      </div>
                    )}
                    <div className="text-night-400 text-xs mt-2">
                      {entry.createdAt.toLocaleString("de-DE")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <BookingForm title="Event anfragen" />
        </div>
      </section>
    </main>
  );
}
