import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, isAdminVerified } from "@/lib/auth";

export async function GET() {
  await requireAdmin();
  if (!isAdminVerified()) {
    return NextResponse.json({ message: "Admin Verifikation fehlt" }, { status: 401 });
  }

  const logs = await prisma.adminLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      admin: { select: { username: true } },
      targetUser: { select: { username: true } }
    }
  });

  return NextResponse.json(logs);
}
