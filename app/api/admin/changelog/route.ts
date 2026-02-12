import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { changelogSchema } from "@/lib/validation";
import { writeAdminLog } from "@/lib/audit";
import { verifyAdminPassword } from "@/lib/adminPassword";

export async function POST(request: Request) {
  const body = await request.json();
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
  const parsed = changelogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Eingaben" }, { status: 400 });
  }

  const prismaAny = prisma as any;
  const entry = await prismaAny.changelogEntry.create({
    data: {
      title: parsed.data.title,
      body: parsed.data.body ?? null
    }
  });

  await writeAdminLog({
    actorId: adminUser.id,
    action: "create_changelog",
    details: entry.title
  });

  return NextResponse.json(entry);
}
