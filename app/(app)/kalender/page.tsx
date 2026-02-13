"use client";

import { useEffect, useMemo, useState } from "react";

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
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    start: "",
    end: "",
    location: "",
    notes: "",
    category: "probe"
  });

  const year = new Date().getFullYear();
  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember"
  ];

  const entriesByMonth = useMemo(() => {
    const map: Record<number, Entry[]> = {};
    for (let i = 0; i < 12; i += 1) {
      map[i] = [];
    }
    entries.forEach((entry) => {
      const date = new Date(entry.start);
      if (date.getFullYear() === year) {
        map[date.getMonth()].push(entry);
      }
    });
    Object.values(map).forEach((list) =>
      list.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    );
    return map;
  }, [entries, year]);

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
    setShowForm(false);
    load();
  }

  async function removeEntry(id: string) {
    if (!confirm("Termin wirklich löschen?")) return;
    await fetch(`/api/calendar/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Jahreskalender {year}</h1>
          <div className="text-night-300 text-sm">Alle Termine im Überblick</div>
        </div>
        <button className="rounded-pill px-5 py-2 bg-night-700" onClick={() => setShowForm(true)}>
          Neuer Eintrag
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {months.map((month, index) => (
          <div key={month} className="bg-ink/70 border border-night-800 rounded-xl p-4">
            <div className="text-night-200 font-semibold mb-3">{month}</div>
            {entriesByMonth[index].length === 0 ? (
              <div className="text-night-400 text-sm">Keine Termine</div>
            ) : (
              <div className="grid gap-2">
                {entriesByMonth[index].map((entry) => (
                  <div key={entry.id} className="border border-night-800 rounded-xl p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-sm">{entry.title}</div>
                      <button
                        className="rounded-pill px-2 py-1 border border-night-700 text-xs"
                        onClick={() => removeEntry(entry.id)}
                        type="button"
                      >
                        Löschen
                      </button>
                    </div>
                    <div className="text-night-300 text-xs">
                      {new Date(entry.start).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                    <div className="text-night-400 text-xs">{entry.location}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg bg-ink border border-night-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Neuer Termin</div>
              <button
                className="rounded-pill px-3 py-1 border border-night-600"
                onClick={() => setShowForm(false)}
              >
                Schließen
              </button>
            </div>
            <form onSubmit={submit} className="grid gap-4">
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
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="probe">Probe</option>
                <option value="show">Show</option>
                <option value="aufbau">Aufbau</option>
                <option value="abbau">Abbau</option>
              </select>
              <button className="rounded-pill px-5 py-2 bg-night-700" type="submit">
                Speichern
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
