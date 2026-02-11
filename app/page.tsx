import Link from "next/link";
import BookingForm from "@/components/BookingForm";

export default function LandingPage() {
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
          <BookingForm title="Event anfragen" />
        </div>
      </section>
    </main>
  );
}
