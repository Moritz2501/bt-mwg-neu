"use client";

import { useEffect, useState } from "react";
import ChangelogBody from "@/components/ChangelogBody";

type ChangelogEntry = {
  id: string;
  title: string;
  body: string | null;
  createdAt: string;
};

export default function ChangelogList() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);

  async function load() {
    const response = await fetch("/api/changelog", { cache: "no-store" });
    if (response.ok) {
      setEntries(await response.json());
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-8 bg-ink/70 border border-night-800 rounded-xl p-6">
      <div className="text-night-200 text-sm mb-4">Changelog</div>
      {entries.length === 0 ? (
        <div className="text-night-300 text-3xl font-semibold text-center min-h-[50vh] flex items-center justify-center">Es gibt gerade keine Changelog-Einträge.</div>
      ) : (
        <div className="grid gap-3">
          {entries.map((entry) => (
            <div key={entry.id} className="border border-night-800 rounded-xl p-4">
              <div className="font-semibold">{entry.title}</div>
              {entry.body && (
                <ChangelogBody body={entry.body} className="text-night-300 text-sm mt-1 grid gap-2" />
              )}
              <div className="text-night-400 text-xs mt-2">
                {new Date(entry.createdAt).toLocaleString("de-DE")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
