import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, isAdminVerified } from "@/lib/auth";
import { userCreateSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/password";

export async function GET() {
  await requireAdmin();
  if (!isAdminVerified()) {
    return NextResponse.json({ message: "Admin Verifikation fehlt" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true, active: true }
  });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  await requireAdmin();
  if (!isAdminVerified()) {
    return NextResponse.json({ message: "Admin Verifikation fehlt" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = userCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Eingaben" }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      username: parsed.data.username,
      passwordHash,
      role: parsed.data.role,
      active: parsed.data.active
    },
    select: { id: true, username: true, role: true, active: true }
  });

  return NextResponse.json(user);
}
