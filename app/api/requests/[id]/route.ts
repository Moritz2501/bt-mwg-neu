import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { requestStatusSchema } from "@/lib/validation";
import { writeAdminLog } from "@/lib/audit";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const request = await prisma.bookingRequest.findUnique({
    where: { id: params.id },
    include: { comments: { include: { user: true } } }
  });

  if (!request) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(request);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = requestStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Daten" }, { status: 400 });
  }

  const updated = await prisma.bookingRequest.update({
    where: { id: params.id },
    data: {
      status: parsed.data.status as any,
      assignedToUserId: parsed.data.assignedToUserId ?? undefined
    }
  });

  await writeAdminLog({
    actorId: user.id,
    action: "request_update",
    details: {
      requestId: updated.id,
      status: updated.status,
      assignedToUserId: updated.assignedToUserId
    }
  });

  if (parsed.data.internalNote) {
    await prisma.requestComment.create({
      data: {
        requestId: params.id,
        userId: user.id,
        text: parsed.data.internalNote
      }
    });
    await writeAdminLog({
      actorId: user.id,
      action: "request_internal_note",
      details: { requestId: params.id }
    });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.bookingRequest.delete({ where: { id: params.id } });
  await writeAdminLog({
    actorId: user.id,
    action: "request_delete",
    details: { requestId: params.id }
  });
  return NextResponse.json({ ok: true });
}
