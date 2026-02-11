"use client";

import { useEffect, useState } from "react";

type Entry = {
  id: string;
  title: string;
  start: string;
  end: string;
  location: string;
  category: string;
};

export default function CalendarPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState({
    title: "",
    start: "",
    end: "",
    location: "",
    notes: "",
    category: "probe"
  });

  async function load() {
    const response = await fetch("/api/calendar");
    if (response.ok) setEntries(await response.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ title: "", start: "", end: "", location: "", notes: "", category: "probe" });
    load();
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={submit} className="grid gap-4 bg-ink/70 border border-night-800 rounded-xl p-6">
        <div className="text-night-200 text-sm">Neuer Termin</div>
        <input
          placeholder="Titel"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
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
        <input
          placeholder="Ort"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />
        <textarea
          placeholder="Notizen"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="probe">Probe</option>
          <option value="show">Show</option>
          <option value="aufbau">Aufbau</option>
          <option value="abbau">Abbau</option>
        </select>
        <button className="rounded-pill px-5 py-2 bg-night-700" type="submit">
          Speichern
        </button>
      </form>

      <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
        <div className="text-night-200 text-sm mb-4">Aktuelle Termine</div>
        <div className="grid gap-3">
          {entries.map((entry) => (
            <div key={entry.id} className="border border-night-800 rounded-xl p-4">
              <div className="font-semibold">{entry.title}</div>
              <div className="text-night-300 text-sm">
                {new Date(entry.start).toLocaleString("de-DE")} - {new Date(entry.end).toLocaleString("de-DE")}
              </div>
              <div className="text-night-300 text-sm">{entry.location}</div>
              <div className="text-night-400 text-xs">{entry.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
