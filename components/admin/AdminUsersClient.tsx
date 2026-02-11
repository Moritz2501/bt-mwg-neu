"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  username: string;
  role: string;
  active: boolean;
};

export default function AdminUsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ username: "", password: "", role: "member", active: true });

  async function load() {
    const response = await fetch("/api/admin/users");
    if (response.ok) setUsers(await response.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function createUser(event: React.FormEvent) {
    event.preventDefault();
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ username: "", password: "", role: "member", active: true });
    load();
  }

  async function toggleActive(user: User) {
    await fetch(`/api/admin/users/${user.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active })
      }
    );
    load();
  }

  async function remove(user: User) {
    await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={createUser} className="bg-ink/70 border border-night-800 rounded-xl p-6 grid gap-4">
        <div className="text-night-200 text-sm">Neuer Benutzer</div>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Passwort"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <div className="flex gap-4">
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Aktiv
          </label>
        </div>
        <button className="rounded-pill px-4 py-2 bg-night-700" type="submit">
          Benutzer anlegen
        </button>
      </form>

      <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
        <div className="text-night-200 text-sm mb-4">Benutzerliste</div>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="border border-night-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{user.username}</div>
                <div className="text-night-300 text-sm">{user.role}</div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-pill px-3 py-1 border border-night-600" onClick={() => toggleActive(user)}>
                  {user.active ? "Deaktivieren" : "Aktivieren"}
                </button>
                <button className="rounded-pill px-3 py-1 border border-night-600" onClick={() => remove(user)}>
                  Loeschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
