import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { calendarEntrySchema } from "@/lib/validation";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = calendarEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Daten" }, { status: 400 });
  }

  const entry = await prisma.calendarEntry.update({
    where: { id: params.id },
    data: {
      title: parsed.data.title,
      start: new Date(parsed.data.start),
      end: new Date(parsed.data.end),
      location: parsed.data.location,
      notes: parsed.data.notes ?? null,
      category: parsed.data.category as any,
      assignedUsers: {
        set: [],
        connect: parsed.data.assignedUserIds.map((id) => ({ id }))
      }
    }
  });

  return NextResponse.json(entry);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.calendarEntry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
