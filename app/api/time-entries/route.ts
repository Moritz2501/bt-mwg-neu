import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { timeEntrySchema } from "@/lib/validation";
import { minutesBetween } from "@/lib/time";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const entries = await prisma.timeEntry.findMany({
    where: { userId: user.id },
    orderBy: { start: "desc" },
    take: 50
  });
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = timeEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Eingabe" }, { status: 400 });
  }

  if (parsed.data.action === "start") {
    const open = await prisma.timeEntry.findFirst({ where: { userId: user.id, end: null } });
    if (open) {
      return NextResponse.json({ message: "Bereits gestartet" }, { status: 400 });
    }
    const entry = await prisma.timeEntry.create({ data: { userId: user.id, start: new Date() } });
    return NextResponse.json(entry);
  }

  const open = await prisma.timeEntry.findFirst({ where: { userId: user.id, end: null } });
  if (!open) {
    return NextResponse.json({ message: "Kein offener Eintrag" }, { status: 400 });
  }

  const end = new Date();
  const duration = minutesBetween(open.start, end);
  const entry = await prisma.timeEntry.update({
    where: { id: open.id },
    data: { end, duration }
  });
  return NextResponse.json(entry);
}
