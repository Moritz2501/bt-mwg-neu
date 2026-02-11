"use client";

import { useState } from "react";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message || "Login fehlgeschlagen");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-ink/70 border border-night-800 rounded-xl p-8">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <div className="grid gap-4">
          <input
            placeholder="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-400">{error}</div>}
          <button className="rounded-pill px-6 py-3 bg-glow text-ink font-semibold" type="submit">
            Login
          </button>
          <a
            className="rounded-pill px-6 py-3 border border-night-600 text-center"
            href="/"
          >
            Zurück zur Startseite
          </a>
        </div>
      </form>
    </main>
  );
}
