import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { eventSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const status = url.searchParams.get("status");

  const events = await prisma.event.findMany({
    where: { status: status ? (status as any) : undefined },
    orderBy: { start: "desc" }
  });

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Daten" }, { status: 400 });
  }

  const event = await prisma.event.create({
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
    }
  });

  return NextResponse.json(event);
}
