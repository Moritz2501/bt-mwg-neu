import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-semibold text-night-100">StageFlow</div>
        <div className="flex gap-4">
          <Link className="rounded-pill px-5 py-2 bg-night-700 text-white" href="/login">
            Login
          </Link>
          <Link className="rounded-pill px-5 py-2 border border-night-500 text-night-100" href="/book">
            Event anfragen
          </Link>
        </div>
      </header>

      <section className="flex-1 grid lg:grid-cols-2 gap-10 px-8 py-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-5xl font-[var(--font-sora)] text-white">
            Technik, Crew und Events in einem Flow.
          </h1>
          <p className="text-night-200 text-lg">
            StageFlow verbindet Stempelzeiten, Kalender und Event-Management in einem dunklen,
            fokussierten Workspace. Perfekt fuer Buehnenteams, die Live-Betrieb lieben.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link className="rounded-pill px-6 py-3 bg-glow text-ink font-semibold" href="/book">
              Event anfragen
            </Link>
            <Link className="rounded-pill px-6 py-3 border border-night-500 text-night-100" href="/login">
              Zum Dashboard
            </Link>
          </div>
        </div>
        <div className="bg-night-800/60 border border-night-700 rounded-xl p-8 shadow-neon">
          <div className="grid gap-4 text-night-100">
            <div>
              <div className="text-sm uppercase tracking-widest text-night-300">Highlights</div>
              <h2 className="text-2xl font-semibold">Alles was du brauchst</h2>
            </div>
            <ul className="space-y-2 text-night-200">
              <li>Rollenbasierter Zugang</li>
              <li>Arbeitszeiten & CSV Export</li>
              <li>Kalender mit Crew-Zuordnung</li>
              <li>Event-Checklisten + Equipment</li>
              <li>Public Booking mit Spam-Schutz</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
