"use client";

export default function Topbar({
  username,
  onToggleMenu
}: {
  username: string;
  onToggleMenu?: () => void;
}) {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <header className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMenu}
          className="rounded-pill px-4 py-2 border border-night-600 text-night-100"
          type="button"
        >
          Menü
        </button>
        <div className="text-sm text-night-200">Willkommen, {username}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={logout}
          className="rounded-pill px-4 py-2 bg-night-700 text-white hover:bg-night-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
