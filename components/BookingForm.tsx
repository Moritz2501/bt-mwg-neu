"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingForm({ title = "Event anfragen" }: { title?: string }) {
  const router = useRouter();
  const [form, setForm] = useState({
    requesterName: "",
    email: "",
    phone: "",
    eventTitle: "",
    start: "",
    end: "",
    location: "",
    audienceSize: 1,
    techNeedsCategories: [] as string[],
    techNeedsText: "",
    budget: "",
    notes: "",
    honey: ""
  });
  const [error, setError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [submitPassword, setSubmitPassword] = useState("");

  const toggleCategory = (value: string) => {
    setForm((prev) => ({
      ...prev,
      techNeedsCategories: prev.techNeedsCategories.includes(value)
        ? prev.techNeedsCategories.filter((item) => item !== value)
        : [...prev.techNeedsCategories, value]
    }));
  };

  async function submitBooking(password: string) {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        audienceSize: Number(form.audienceSize),
        budget: form.budget ? Number(form.budget) : null,
        submitPassword: password
      })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message || "Fehler beim Absenden");
      return;
    }

    router.push("/book/success");
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setShowPasswordModal(true);
  }

  async function confirmSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    await submitBooking(submitPassword);
  }

  return (
    <div className="bg-ink/70 border border-night-800 rounded-xl p-6 shadow">
      <h1 className="text-3xl font-semibold mb-6">{title}</h1>
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Name des Antragstellers"
            value={form.requesterName}
            onChange={(e) => setForm({ ...form, requesterName: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="E-Mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Telefon (optional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            placeholder="Event Titel"
            value={form.eventTitle}
            onChange={(e) => setForm({ ...form, eventTitle: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="text-sm text-night-300">Datum/Zeitraum (TT.MM.JJJJ)</div>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="datetime-local"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
              required
            />
            <input
              type="datetime-local"
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Ort"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
        </div>

        <div className="bg-ink/60 border border-night-800 rounded-xl p-4">
          <div className="text-sm text-night-300">Technikbedarf</div>
          <div className="flex flex-wrap gap-3 mt-3">
            {["Ton", "Licht", "Buehne", "Video", "Strom", "Sonstiges"].map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`rounded-pill px-4 py-2 border ${
                  form.techNeedsCategories.includes(cat)
                    ? "bg-night-700 border-night-500"
                    : "border-night-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <textarea
          placeholder="Technikdetails"
          value={form.techNeedsText}
          onChange={(e) => setForm({ ...form, techNeedsText: e.target.value })}
          rows={3}
        />
        <textarea
          placeholder="Notizen"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
        />
        <input
          type="number"
          placeholder="Budget (optional)"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />
        <input
          className="hidden"
          value={form.honey}
          onChange={(e) => setForm({ ...form, honey: e.target.value })}
          aria-hidden="true"
          tabIndex={-1}
        />
        {error && <div className="text-red-400">{error}</div>}
        <button className="rounded-pill px-6 py-3 bg-glow text-ink font-semibold" type="submit">
          Anfrage senden
        </button>
      </form>
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md bg-ink border border-night-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Passwort erforderlich</div>
              <button
                className="rounded-pill px-3 py-1 border border-night-600"
                onClick={() => setShowPasswordModal(false)}
                type="button"
              >
                Schliessen
              </button>
            </div>
            <form onSubmit={confirmSubmit} className="grid gap-4">
              <input
                type="password"
                placeholder="Passwort"
                value={submitPassword}
                onChange={(e) => setSubmitPassword(e.target.value)}
                required
              />
              {error && <div className="text-red-400">{error}</div>}
              <button className="rounded-pill px-5 py-2 bg-night-700" type="submit">
                Anfrage absenden
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
