import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const entries = await prisma.changelogEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return NextResponse.json(entries);
}
