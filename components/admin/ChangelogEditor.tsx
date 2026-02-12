"use client";

import { useEffect, useState } from "react";

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
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");

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

    if (!adminPassword.trim()) {
      setError("Admin Passwort erforderlich");
      return;
    }

    const response = await fetch("/api/admin/changelog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, adminPassword })
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
    if (!confirm("Eintrag wirklich loeschen?")) return;
    setError("");
    if (!adminPassword.trim()) {
      setError("Admin Passwort erforderlich");
      return;
    }
    const response = await fetch(`/api/admin/changelog/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPassword })
      }
    );
    if (!response.ok) {
      const data = await response.json();
      setError(data.message || "Fehler beim Loeschen");
      return;
    }
    load();
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={createEntry} className="bg-ink/70 border border-night-800 rounded-xl p-6 grid gap-4">
        <div className="text-night-200 text-sm">Changelog aktualisieren</div>
        <input
          type="password"
          placeholder="Admin Passwort"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          required
        />
        <input
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
         />
        <textarea
          placeholder="Beschreibung (optional)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
        />
         {error && <div className="text-red-400">{error}</div>}
         <button className="rounded-pill px-4 py-2 bg-night-700" type="submit">
           Eintrag speichern
         </button>
       </form>

       <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
         <div className="text-night-200 text-sm mb-4">Aktuelle Eintraege</div>
         <div className="grid gap-3">
           {entries.map((entry) => (
             <div key={entry.id} className="border border-night-800 rounded-xl p-4">
               <div className="flex items-start justify-between gap-3">
                 <div>
                   <div className="font-semibold">{entry.title}</div>
                  {entry.body && (
                    <div className="text-night-300 text-sm mt-1 whitespace-pre-line">
                      {entry.body}
                    </div>
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
                   Loeschen
                 </button>
               </div>
             </div>
           ))}
         </div>
       </div>
     </div>
   );
}
