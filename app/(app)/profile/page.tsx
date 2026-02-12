import { requireAuth } from "@/lib/auth";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const user = await requireAuth();

  return (
    <div className="grid gap-6">
      <ProfileForm initialUsername={user.username} />
      <div className="bg-ink/70 border border-night-800 rounded-xl p-6">
        <div className="text-night-200">Rolle: {user.role}</div>
        <div className="text-night-400 text-sm">Status: {user.active ? "aktiv" : "inaktiv"}</div>
      </div>
    </div>
  );
}
