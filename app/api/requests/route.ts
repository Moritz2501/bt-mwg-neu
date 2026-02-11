import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const location = url.searchParams.get("location");

  const requests = await prisma.bookingRequest.findMany({
    where: {
      status: status ? (status as any) : undefined,
      location: location ? { contains: location } : undefined
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(requests);
}
