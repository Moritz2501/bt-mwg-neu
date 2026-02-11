import { requireAdmin, isAdminVerified } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export default async function AdminUsersPage() {
  await requireAdmin();
  if (!isAdminVerified()) {
    redirect("/admin");
  }

  return <AdminUsersClient />;
}
