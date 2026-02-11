import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { toCsv } from "@/lib/csv";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  const userId = url.searchParams.get("userId");

  const targetUserId = user.role === "admin" && userId ? userId : user.id;

  const entries = await prisma.timeEntry.findMany({
    where: {
      userId: targetUserId,
      start: start ? { gte: new Date(start) } : undefined,
      end: end ? { lte: new Date(end) } : undefined
    },
    orderBy: { start: "asc" }
  });

  const csv = toCsv(
    ["Start", "Ende", "Dauer"],
    entries.map((entry: { start: Date; end: Date | null; duration: number | null }) => [
      entry.start.toISOString(),
      entry.end ? entry.end.toISOString() : "",
      entry.duration ?? ""
    ])
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=stempel.csv"
    }
  });
}
