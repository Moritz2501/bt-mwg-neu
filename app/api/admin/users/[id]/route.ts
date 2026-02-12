import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { adminUserUpdateSchema } from "@/lib/validation";
import { writeAdminLog } from "@/lib/audit";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const adminUser = await requireAdmin();

  const body = await request.json();
  const parsed = adminUserUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Eingaben" }, { status: 400 });
  }

  const data: Record<string, unknown> = { ...parsed.data };

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, username: true, role: true, active: true }
  });

  await writeAdminLog({
    actorId: adminUser.id,
    action: "update_user",
    targetUserId: user.id,
    details: parsed.data
  });

  return NextResponse.json(user);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const adminUser = await requireAdmin();

  await prisma.user.delete({ where: { id: params.id } });
  await writeAdminLog({
    actorId: adminUser.id,
    action: "delete_user",
    targetUserId: params.id,
    details: "Deleted user"
  });
  return NextResponse.json({ ok: true });
}
