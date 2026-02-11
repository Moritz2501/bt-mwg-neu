"use client";

import { useState } from "react";

export default function AdminVerify() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message || "Zugriff verweigert");
      return;
    }

    window.location.reload();
  }

  return (
    <form onSubmit={submit} className="bg-ink/70 border border-night-800 rounded-xl p-6 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Admin Verifikation</h1>
      <input
        type="password"
        placeholder="Admin Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <div className="text-red-400 mt-2">{error}</div>}
      <button className="rounded-pill px-4 py-2 bg-glow text-ink font-semibold mt-4" type="submit">
        Freischalten
      </button>
    </form>
  );
}
