import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, isAdminVerified } from "@/lib/auth";
import { userUpdateSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/password";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  if (!isAdminVerified()) {
    return NextResponse.json({ message: "Admin Verifikation fehlt" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = userUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Eingaben" }, { status: 400 });
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.password) {
    data.passwordHash = await hashPassword(parsed.data.password);
    delete data.password;
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, username: true, role: true, active: true }
  });

  return NextResponse.json(user);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  if (!isAdminVerified()) {
    return NextResponse.json({ message: "Admin Verifikation fehlt" }, { status: 401 });
  }

  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
