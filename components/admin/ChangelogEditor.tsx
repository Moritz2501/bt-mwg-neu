"use client";

import { useEffect, useState } from "react";
import ChangelogBody from "@/components/ChangelogBody";

type ChangelogEntry = {
  id: string;
  title: string;
  body: string | null;
  createdAt: string;
};

export default function ChangelogEditor() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [previewDevice, setPreviewDevice] = useState<"iphone" | "ipad">("iphone");

  const previewEntries = [
    {
      id: "draft",
      title: title.trim() || "Titel Vorschau",
      body: body.trim() || null,
      createdAtLabel: "gerade eben",
      isDraft: true
    },
    ...entries.slice(0, 2).map((entry) => ({
      id: entry.id,
      title: entry.title,
      body: entry.body,
      createdAtLabel: new Date(entry.createdAt).toLocaleString("de-DE"),
      isDraft: false
    }))
  ];

  async function load() {
    const response = await fetch("/api/changelog");
    if (response.ok) {
      setEntries(await response.json());
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createEntry(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/admin/changelog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message || "Fehler beim Speichern");
      return;
    }

    const created = await response.json();
    setEntries((prev) => [created, ...prev]);
    setTitle("");
    setBody("");
  }

  async function removeEntry(id: string) {
    if (!confirm("Eintrag wirklich löschen?")) return;
    setError("");
    const response = await fetch(`/api/admin/changelog/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      }
    );
    if (!response.ok) {
      const data = await response.json();
      setError(data.message || "Fehler beim Löschen");
      return;
    }
    load();
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={createEntry} className="bg-ink/70 border border-night-800 rounded-xl p-6 grid gap-4">
        <div className="text-night-200 text-sm">Changelog aktualisieren</div>
        <div className="grid xl:grid-cols-[1fr_auto] gap-6 items-start">
          <div className="grid gap-4">
            <input
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder={"Beschreibung (optional)\nStichpunkte mit - oder * beginnen"}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
            />
            {error && <div className="text-red-400">{error}</div>}
            <button className="rounded-pill px-4 py-2 bg-night-700" type="submit">
              Eintrag speichern
            </button>
          </div>

          <div className="grid gap-2 justify-items-center">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewDevice("iphone")}
                className={`rounded-pill px-3 py-1 border text-xs ${
                  previewDevice === "iphone" ? "bg-night-700 border-night-700" : "border-night-600"
                }`}
              >
                iPhone
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("ipad")}
                className={`rounded-pill px-3 py-1 border text-xs ${
                  previewDevice === "ipad" ? "bg-night-700 border-night-700" : "border-night-600"
                }`}
              >
                iPad
              </button>
            </div>

            <div
              className={
                previewDevice === "iphone"
                  ? "w-[300px] h-[650px] rounded-[2.5rem] border-4 border-night-700 bg-night-900 p-2"
                  : "w-[700px] h-[500px] rounded-[2.25rem] border-4 border-night-700 bg-night-900 p-2"
              }
            >
              <div
                className={
                  previewDevice === "iphone"
                    ? "w-full h-full rounded-[2rem] bg-ink border border-night-800 overflow-hidden"
                    : "w-full h-full rounded-[1.75rem] bg-ink border border-night-800 overflow-hidden"
                }
              >
                {previewDevice === "iphone" ? (
                  <div className="flex justify-center pt-2">
                    <div className="h-6 w-32 rounded-full bg-night-800" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center pt-2">
                    <div className="h-2 w-2 rounded-full bg-night-700" />
                  </div>
                )}
                <div className={previewDevice === "iphone" ? "p-4 grid gap-3" : "p-5 grid gap-3"}>
                  <div className="text-night-200 text-sm">Changelog</div>
                  <div
                    className={
                      previewDevice === "iphone"
                        ? "grid gap-3 max-h-[520px] overflow-y-auto no-scrollbar pr-1"
                        : "grid gap-3 max-h-[400px] overflow-y-auto no-scrollbar pr-1"
                    }
                  >
                    {previewEntries.map((entry) => (
                      <div key={entry.id} className="border border-night-800 rounded-xl p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-semibold">{entry.title}</div>
                          {entry.isDraft ? (
                            <span className="rounded-pill px-2 py-0.5 text-xs border border-night-600 text-night-200">
                              Neu
                            </span>
                          ) : null}
                        </div>
                        {entry.body ? (
                          <ChangelogBody body={entry.body} className="text-night-300 text-sm mt-1 grid gap-2" />
                        ) : null}
                        <div className="text-night-400 text-xs mt-2">{entry.createdAtLabel}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

       <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
         <div className="text-night-200 text-sm mb-4">Aktuelle Einträge</div>
         <div className="grid gap-3">
           {entries.length === 0 ? (
             <div className="text-night-400 text-sm">Es gibt gerade keine Changelog-Einträge.</div>
           ) : (
             entries.map((entry) => (
               <div key={entry.id} className="border border-night-800 rounded-xl p-4">
                 <div className="flex items-start justify-between gap-3">
                   <div>
                     <div className="font-semibold">{entry.title}</div>
                    {entry.body && (
                      <ChangelogBody body={entry.body} className="text-night-300 text-sm mt-1 grid gap-2" />
                    )}
                     <div className="text-night-400 text-xs mt-2">
                       {new Date(entry.createdAt).toLocaleString("de-DE")}
                     </div>
                   </div>
                   <button
                     className="rounded-pill px-3 py-1 border border-night-600"
                     onClick={() => removeEntry(entry.id)}
                     type="button"
                   >
                     Löschen
                   </button>
                 </div>
               </div>
             ))
           )}
         </div>
       </div>
     </div>
   );
}
