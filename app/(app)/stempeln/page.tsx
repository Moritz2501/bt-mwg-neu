"use client";

import { useEffect, useState } from "react";

type Entry = {
  id: string;
  start: string;
  end: string | null;
  duration: number | null;
};

export default function TimeTrackingPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [status, setStatus] = useState("");

  async function load() {
    const response = await fetch("/api/time-entries");
    if (response.ok) {
      setEntries(await response.json());
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function punch(action: "start" | "stop") {
    setStatus("");
    const response = await fetch("/api/time-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });
    if (!response.ok) {
      const data = await response.json();
      setStatus(data.message || "Fehler");
      return;
    }
    load();
  }

  return (
    <div className="grid gap-6">
      <div className="flex gap-4">
        <button className="rounded-pill px-5 py-2 bg-night-700" onClick={() => punch("start")}>
          Kommen
        </button>
        <button className="rounded-pill px-5 py-2 bg-night-700" onClick={() => punch("stop")}>
          Gehen
        </button>
        <a
          className="rounded-pill px-5 py-2 border border-night-600"
          href="/api/time-entries/export"
        >
          CSV Export
        </a>
      </div>
      {status && <div className="text-red-400">{status}</div>}
      <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
        <table className="w-full text-sm">
          <thead className="text-night-300">
            <tr>
              <th className="text-left py-2">Start</th>
              <th className="text-left py-2">Ende</th>
              <th className="text-left py-2">Dauer (min)</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-t border-night-800">
                <td className="py-2">{new Date(entry.start).toLocaleString("de-DE")}</td>
                <td className="py-2">
                  {entry.end ? new Date(entry.end).toLocaleString("de-DE") : "-"}
                </td>
                <td className="py-2">{entry.duration ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
