import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { writeAdminLog } from "@/lib/audit";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
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
