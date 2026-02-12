import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { writeAdminLog } from "@/lib/audit";
import { verifyAdminPassword } from "@/lib/adminPassword";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  const adminPassword = body?.adminPassword;
  if (!adminPassword) {
    return NextResponse.json({ message: "Admin Passwort erforderlich" }, { status: 401 });
  }
  const verified = await verifyAdminPassword(adminPassword);
  if (!verified.ok) {
    return NextResponse.json(
      { message: verified.message ?? "Admin Passwort falsch" },
      { status: verified.status ?? 401 }
    );
  }

  const adminUser = await requireAdmin();
  const prismaAny = prisma as any;
  const entry = await prismaAny.changelogEntry.delete({ where: { id: params.id } });
  await writeAdminLog({
    actorId: adminUser.id,
    action: "delete_changelog",
    details: entry.title
  });
  return NextResponse.json({ ok: true });
}
