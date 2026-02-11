import Link from "next/link";

export default function BookingSuccess() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
      <h1 className="text-3xl font-semibold">Danke fuer deine Anfrage!</h1>
      <p className="text-night-200">Wir melden uns zeitnah mit einer Rueckmeldung.</p>
      <Link className="rounded-pill px-6 py-3 bg-night-700 text-white" href="/">
        Zurueck zur Startseite
      </Link>
    </main>
  );
}
