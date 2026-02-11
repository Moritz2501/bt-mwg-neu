"use client";

export default function Topbar({ username }: { username: string }) {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <header className="flex items-center justify-between gap-4 py-4">
      <div className="text-sm text-night-200">Willkommen, {username}</div>
      <button
        onClick={logout}
        className="rounded-pill px-4 py-2 bg-night-700 text-white hover:bg-night-600"
      >
        Logout
      </button>
    </header>
  );
}
