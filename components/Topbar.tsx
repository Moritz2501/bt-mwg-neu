"use client";

import { useRouter } from "next/navigation";

export default function Topbar({ username }: { username: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
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
