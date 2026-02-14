"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    start: "",
    end: "",
    venue: "",
    contact: "",
    status: "geplant",
    notes: "",
    checklist: "",
    equipment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const checklist = form.checklist
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text) => ({ area: "Allgemein", text }));

    const equipment = form.equipment
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text) => ({
        itemName: text,
        quantity: 1,
        condition: "ok",
        storageLocation: "Lager",
        reserved: false
      }));

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          start: form.start,
          end: form.end,
          venue: form.venue,
          contact: form.contact,
          status: form.status,
          notes: form.notes,
          checklist,
          equipment
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(payload?.message ?? "Event konnte nicht erstellt werden.");
        return;
      }

      router.push("/events");
    } catch {
      setError("Event konnte nicht erstellt werden.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-ink/70 border border-night-800 rounded-xl p-6 grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Neues Event</h1>
        <button
          className="rounded-pill px-4 py-2 border border-night-600"
          type="button"
          onClick={() => router.push("/events")}
        >
          Zurück
        </button>
      </div>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <div className="grid md:grid-cols-2 gap-4">
        <label className="grid gap-2 text-sm text-night-300">
          Beginn
          <input
            type="datetime-local"
            value={form.start}
            onChange={(e) => setForm({ ...form, start: e.target.value })}
            required
          />
        </label>
        <label className="grid gap-2 text-sm text-night-300">
          Ende
          <input
            type="datetime-local"
            value={form.end}
            onChange={(e) => setForm({ ...form, end: e.target.value })}
            required
          />
        </label>
      </div>
      <input
        placeholder="Veranstaltungsort"
        value={form.venue}
        onChange={(e) => setForm({ ...form, venue: e.target.value })}
        required
      />
      <input
        placeholder="Kontakt"
        value={form.contact}
        onChange={(e) => setForm({ ...form, contact: e.target.value })}
        required
      />
      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
        <option value="geplant">geplant</option>
        <option value="aktiv">aktiv</option>
        <option value="abgeschlossen">abgeschlossen</option>
      </select>
      <textarea
        placeholder="Notizen"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />
      <textarea
        placeholder="Checkliste (eine Zeile pro Punkt)"
        value={form.checklist}
        onChange={(e) => setForm({ ...form, checklist: e.target.value })}
        rows={4}
      />
      <textarea
        placeholder="Equipment (eine Zeile pro Artikel)"
        value={form.equipment}
        onChange={(e) => setForm({ ...form, equipment: e.target.value })}
        rows={4}
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button className="rounded-pill px-5 py-2 bg-night-700 disabled:opacity-60" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Speichert..." : "Speichern"}
      </button>
    </form>
  );
}
