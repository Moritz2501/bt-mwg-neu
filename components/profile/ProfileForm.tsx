"use client";

import { useState } from "react";

type ProfileFormProps = {
  initialUsername: string;
};

export default function ProfileForm({ initialUsername }: ProfileFormProps) {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password: password || undefined
      })
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.message || "Update fehlgeschlagen");
      return;
    }

    setPassword("");
    setMessage("Profil aktualisiert");
  }

  return (
    <form onSubmit={submit} className="bg-ink/70 border border-night-800 rounded-xl p-6 grid gap-4">
      <h1 className="text-2xl font-semibold">Profil</h1>
      <div className="grid gap-2">
        <label className="text-night-300 text-sm">Benutzername</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <label className="text-night-300 text-sm">Neues Passwort</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Optional"
        />
      </div>
      {message && <div className="text-night-200 text-sm">{message}</div>}
      <button className="rounded-pill px-5 py-2 bg-night-700" type="submit">
        Speichern
      </button>
    </form>
  );
}
