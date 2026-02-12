import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { eventSchema } from "@/lib/validation";
import { writeAdminLog } from "@/lib/audit";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { checklist: true, equipment: true }
  });

  if (!event) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Daten" }, { status: 400 });
  }

  await prisma.eventChecklistItem.deleteMany({ where: { eventId: params.id } });
  await prisma.eventEquipment.deleteMany({ where: { eventId: params.id } });

  const event = await prisma.event.update({
    where: { id: params.id },
    data: {
      name: parsed.data.name,
      start: new Date(parsed.data.start),
      end: new Date(parsed.data.end),
      venue: parsed.data.venue,
      contact: parsed.data.contact,
      status: (parsed.data.status ?? "geplant") as any,
      notes: parsed.data.notes ?? null,
      checklist: {
        create: parsed.data.checklist.map((item) => ({
          area: item.area,
          text: item.text,
          done: item.done ?? false
        }))
      },
      equipment: {
        create: parsed.data.equipment.map((item) => ({
          itemName: item.itemName,
          quantity: item.quantity,
          condition: item.condition,
          storageLocation: item.storageLocation,
          reserved: item.reserved ?? false
        }))
      }
    },
    include: { checklist: true, equipment: true }
  });

  await writeAdminLog({
    actorId: user.id,
    action: "event_update",
    details: { eventId: event.id, name: event.name }
  });

  return NextResponse.json(event);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.event.delete({ where: { id: params.id } });
  await writeAdminLog({
    actorId: user.id,
    action: "event_delete",
    details: { eventId: params.id }
  });
  return NextResponse.json({ ok: true });
}
