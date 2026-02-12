import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const entries = await prisma.timeEntry.findMany({
    where: { end: { not: null } },
    include: { user: { select: { id: true, username: true } } }
  });

  const totals = new Map<string, { username: string; minutes: number }>();
  for (const entry of entries) {
    const minutes = entry.duration ?? 0;
    const existing = totals.get(entry.userId);
    if (existing) {
      existing.minutes += minutes;
    } else {
      totals.set(entry.userId, { username: entry.user.username, minutes });
    }
  }

  const users = Array.from(totals.values())
    .filter((item) => item.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);

  const totalMinutes = users.reduce((sum, item) => sum + item.minutes, 0);

  return NextResponse.json({ totalMinutes, users });
}
