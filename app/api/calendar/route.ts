import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { calendarEntrySchema } from "@/lib/validation";
import { writeAdminLog } from "@/lib/audit";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const location = url.searchParams.get("location");

  const entries = await prisma.calendarEntry.findMany({
    where: {
      category: category ? (category as any) : undefined,
      location: location ? { contains: location } : undefined
    },
    orderBy: { start: "asc" }
  });

  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = calendarEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Daten" }, { status: 400 });
  }

  const entry = await prisma.calendarEntry.create({
    data: {
      title: parsed.data.title,
      start: new Date(parsed.data.start),
      end: new Date(parsed.data.end),
      location: parsed.data.location,
      notes: parsed.data.notes ?? null,
      category: parsed.data.category as any,
      assignedUsers: { connect: parsed.data.assignedUserIds.map((id) => ({ id })) }
    }
  });

  await writeAdminLog({
    actorId: user.id,
    action: "calendar_create",
    details: { entryId: entry.id, title: entry.title }
  });

  return NextResponse.json(entry);
}
