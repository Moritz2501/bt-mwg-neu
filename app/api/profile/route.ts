import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { profileUpdateSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/password";
import { writeAdminLog } from "@/lib/audit";

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Eingaben" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.username) data.username = parsed.data.username;
  if (parsed.data.password) data.passwordHash = await hashPassword(parsed.data.password);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data,
    select: { id: true, username: true, role: true, active: true }
  });

  await writeAdminLog({
    actorId: user.id,
    action: "profile_update",
    details: {
      usernameChanged: Boolean(parsed.data.username),
      passwordChanged: Boolean(parsed.data.password)
    }
  });

  return NextResponse.json(updated);
}
