import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, isAdminVerified } from "@/lib/auth";
import { changelogSchema } from "@/lib/validation";

export async function POST(request: Request) {
  await requireAdmin();
  if (!isAdminVerified()) {
    return NextResponse.json({ message: "Admin Verifikation fehlt" }, { status: 401 });
  }

  const body = await request.json();
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

  return NextResponse.json(entry);
}
