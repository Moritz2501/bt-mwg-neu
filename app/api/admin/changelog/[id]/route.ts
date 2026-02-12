import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, isAdminVerified } from "@/lib/auth";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  if (!isAdminVerified()) {
    return NextResponse.json({ message: "Admin Verifikation fehlt" }, { status: 401 });
  }

  const prismaAny = prisma as any;
  await prismaAny.changelogEntry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
