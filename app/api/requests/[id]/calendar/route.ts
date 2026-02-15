import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { writeAdminLog } from "@/lib/audit";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const bookingRequest = await prisma.bookingRequest.findUnique({
    where: { id: params.id }
  });

  if (!bookingRequest) {
    return NextResponse.json({ message: "Anfrage nicht gefunden" }, { status: 404 });
  }

  if (bookingRequest.status !== "angenommen") {
    return NextResponse.json(
      { message: "Nur angenommene Anfragen koennen in den Kalender eingetragen werden." },
      { status: 400 }
    );
  }

  const existing = await prisma.calendarEntry.findFirst({
    where: {
      title: bookingRequest.eventTitle,
      start: bookingRequest.start,
      end: bookingRequest.end,
      location: bookingRequest.location
    }
  });

  if (existing) {
    return NextResponse.json({ message: "Diese Anfrage ist bereits im Kalender eingetragen." }, { status: 409 });
  }

  const entry = await prisma.calendarEntry.create({
    data: {
      title: bookingRequest.eventTitle,
      start: bookingRequest.start,
      end: bookingRequest.end,
      location: bookingRequest.location,
      notes: bookingRequest.notes,
      category: "show"
    }
  });

  await writeAdminLog({
    actorId: user.id,
    action: "request_to_calendar",
    details: {
      requestId: bookingRequest.id,
      calendarEntryId: entry.id,
      title: entry.title
    }
  });

  return NextResponse.json(entry, { status: 201 });
}
