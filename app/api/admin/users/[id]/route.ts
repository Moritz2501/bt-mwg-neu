import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { adminUserUpdateSchema } from "@/lib/validation";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const adminUser = await requireAdmin();

  const prismaAny = prisma as any;

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

  await prismaAny.adminLog.create({
    data: {
      adminId: adminUser.id,
      action: "update_user",
      targetUserId: user.id,
      details: JSON.stringify(parsed.data)
    }
  });

  return NextResponse.json(user);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const adminUser = await requireAdmin();

  const prismaAny = prisma as any;

  await prisma.user.delete({ where: { id: params.id } });
  await prismaAny.adminLog.create({
    data: {
      adminId: adminUser.id,
      action: "delete_user",
      targetUserId: params.id,
      details: "Deleted user"
    }
  });
  return NextResponse.json({ ok: true });
}
