import { requireAuth } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireAuth();

  return (
    <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
      <h1 className="text-2xl font-semibold">Profil</h1>
      <div className="mt-4 text-night-200">Benutzername: {user.username}</div>
      <div className="text-night-300">Rolle: {user.role}</div>
      <div className="text-night-400 text-sm">Status: {user.active ? "aktiv" : "inaktiv"}</div>
    </div>
  );
}
