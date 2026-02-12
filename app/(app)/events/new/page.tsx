"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    Name: "",
    Start: "",
    Ende: "",
    Veranstaltungsort: "",
    Kontakt: "",
    Status: "geplant",
    Notizen: "",
    Checkliste: "",
    Equipment: ""
  });

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const checklist = form.Checkliste
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text) => ({ area: "Allgemein", text }));

    const equipment = form.Equipment
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

    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Name: form.Name,
        Start: form.Start,
        Ende: form.Ende,
        Veranstaltungsort: form.Veranstaltungsort,
        Kontakt: form.Kontakt,
        Status: form.Status,
        Notizen: form.Notizen,
        Checkliste: checklist,
        Equipment: equipment
      })
    });

    if (response.ok) {
      router.push("/events");
    }
  }

  return (
    <form onSubmit={submit} className="bg-ink/70 border border-night-800 rounded-xl p-6 grid gap-4">
      <h1 className="text-2xl font-semibold">Neues Event</h1>
      <input
        placeholder="Name"
        value={form.Name}
        onChange={(e) => setForm({ ...form, Name: e.target.value })}
        required
      />
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="datetime-local"
          value={form.Start}
          onChange={(e) => setForm({ ...form, Start: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={form.Ende}
          onChange={(e) => setForm({ ...form, Ende: e.target.value })}
          required
        />
      </div>
      <input
        placeholder="Veranstaltungsort"
        value={form.Veranstaltungsort}
        onChange={(e) => setForm({ ...form, Veranstaltungsort: e.target.value })}
        required
      />
      <input
        placeholder="Kontakt"
        value={form.Kontakt}
        onChange={(e) => setForm({ ...form, Kontakt: e.target.value })}
        required
      />
      <select value={form.Status} onChange={(e) => setForm({ ...form, Status: e.target.value })}>
        <option value="geplant">geplant</option>
        <option value="aktiv">aktiv</option>
        <option value="abgeschlossen">abgeschlossen</option>
      </select>
      <textarea
        placeholder="Notizen"
        value={form.Notizen}
        onChange={(e) => setForm({ ...form, Notizen: e.target.value })}
      />
      <textarea
        placeholder="Checkliste (eine Zeile pro Punkt)"
        value={form.Checkliste}
        onChange={(e) => setForm({ ...form, Checkliste: e.target.value })}
        rows={4}
      />
      <textarea
        placeholder="Equipment (eine Zeile pro Artikel)"
        value={form.Equipment}
        onChange={(e) => setForm({ ...form, Equipment: e.target.value })}
        rows={4}
      />
      <button className="rounded-pill px-5 py-2 bg-night-700" type="submit">
        Speichern
      </button>
    </form>
  );
}
