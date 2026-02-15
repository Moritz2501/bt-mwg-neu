import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { requestStatusSchema } from "@/lib/validation";
import { writeAdminLog } from "@/lib/audit";

function requestMarker(requestId: string) {
  return `[request:${requestId}]`;
}

function requestStatusMarker(status: string) {
  return `[request-status:${status}]`;
}

function stripRequestMeta(notes: string | null | undefined) {
  if (!notes) return "";
  return notes
    .replace(/\[request:[^\]]+\]/g, "")
    .replace(/\[request-status:[^\]]+\]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function withRequestMeta(notes: string | null | undefined, requestId: string, status: string) {
  const cleanNotes = stripRequestMeta(notes);
  const tags = `${requestMarker(requestId)}\n${requestStatusMarker(status)}`;
  if (!cleanNotes) return tags;
  return `${cleanNotes}\n\n${tags}`;
}

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

  const linkedCalendarEntries = await prisma.calendarEntry.findMany({
    where: {
      OR: [
        { notes: { contains: requestMarker(updated.id) } },
        {
          title: updated.eventTitle,
          start: updated.start,
          end: updated.end,
          location: updated.location,
          category: "show"
        }
      ]
    }
  });

  await Promise.all(
    linkedCalendarEntries.map((entry) =>
      prisma.calendarEntry.update({
        where: { id: entry.id },
        data: {
          notes: withRequestMeta(entry.notes, updated.id, updated.status)
        }
      })
    )
  );

  await writeAdminLog({
    actorId: user.id,
    action: "request_update",
    details: {
      requestId: updated.id,
      status: updated.status,
      assignedToUserId: updated.assignedToUserId,
      updatedCalendarEntries: linkedCalendarEntries.length
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

  const bookingRequest = await prisma.bookingRequest.findUnique({ where: { id: params.id } });
  if (!bookingRequest) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const marker = requestMarker(params.id);

  const result = await prisma.$transaction(async (tx) => {
    const deletedCalendarEntries = await tx.calendarEntry.deleteMany({
      where: {
        OR: [
          { notes: { contains: marker } },
          {
            title: bookingRequest.eventTitle,
            start: bookingRequest.start,
            end: bookingRequest.end,
            location: bookingRequest.location,
            category: "show"
          }
        ]
      }
    });

    await tx.bookingRequest.delete({ where: { id: params.id } });

    return { deletedCalendarCount: deletedCalendarEntries.count };
  });

  await writeAdminLog({
    actorId: user.id,
    action: "request_delete",
    details: {
      requestId: params.id,
      deletedCalendarEntries: result.deletedCalendarCount
    }
  });
  return NextResponse.json({ ok: true });
}
