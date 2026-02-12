import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, isAdminVerified } from "@/lib/auth";
import { writeAdminLog } from "@/lib/audit";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const adminUser = await requireAdmin();
  if (!isAdminVerified()) {
    return NextResponse.json({ message: "Admin Verifikation fehlt" }, { status: 401 });
  }

  const entry = await prisma.changelogEntry.delete({ where: { id: params.id } });
  await writeAdminLog({
    actorId: adminUser.id,
    action: "delete_changelog",
    details: entry.title
  });
  return NextResponse.json({ ok: true });
}
