"use client";

import { useEffect, useState } from "react";

type Entry = {
  id: string;
  start: string;
  end: string | null;
  duration: number | null;
};

type SummaryUser = { username: string; minutes: number };
type Summary = { totalMinutes: number; users: SummaryUser[] };

export default function TimeTrackingPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState<Summary>({ totalMinutes: 0, users: [] });

  async function load() {
    const response = await fetch("/api/time-entries");
    if (response.ok) {
      setEntries(await response.json());
    }
    const summaryResponse = await fetch("/api/time-entries/summary");
    if (summaryResponse.ok) {
      setSummary(await summaryResponse.json());
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

  const colors = ["#7e6bff", "#3d33e3", "#5a5cf6", "#b1bcff", "#241f8b", "#7f8eff"];
  const totalMinutes = summary.totalMinutes || 0;
  const segments = summary.users.map((user, index) => {
    const percent = totalMinutes ? (user.minutes / totalMinutes) * 100 : 0;
    return { ...user, percent, color: colors[index % colors.length] };
  });
  const gradient = segments.length
    ? `conic-gradient(${segments
        .map((seg, idx) => {
          const start = segments.slice(0, idx).reduce((sum, s) => sum + s.percent, 0);
          const end = start + seg.percent;
          return `${seg.color} ${start}% ${end}%`;
        })
        .join(", ")})`
    : "conic-gradient(#1b1a5e 0% 100%)";

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

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

      <div className="bg-ink/70 border border-night-800 rounded-xl p-6 grid gap-6">
        <div>
          <h2 className="text-xl font-semibold">Stempelzeiten</h2>
          <div className="text-night-300 text-sm">Gesamt: {formatMinutes(totalMinutes)}</div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div className="flex items-center justify-center">
            <div
              className="w-56 h-56 rounded-full border border-night-800 shadow-inner"
              style={{ background: gradient }}
              aria-label="Stempelzeiten Kreisdiagramm"
            />
          </div>
          <div className="grid gap-2">
            {segments.length === 0 ? (
              <div className="text-night-400 text-sm">Keine Stempelzeiten vorhanden.</div>
            ) : (
              segments.map((user) => (
                <div key={user.username} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: user.color }}
                    />
                    <span className="text-night-200">{user.username}</span>
                  </div>
                  <div className="text-night-300">{formatMinutes(user.minutes)}</div>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <div className="text-night-200 text-sm mb-3">Leaderboard</div>
          <div className="grid gap-2">
            {segments.map((user, index) => (
              <div key={user.username} className="border border-night-800 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-night-400 text-xs">#{index + 1}</div>
                  <div className="text-night-100">{user.username}</div>
                </div>
                <div className="text-night-300 text-sm">{formatMinutes(user.minutes)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
