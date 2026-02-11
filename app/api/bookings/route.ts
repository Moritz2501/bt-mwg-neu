import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  const limit = rateLimit(`booking:${ip}`, 5, 1000 * 60 * 5);
  if (!limit.ok) {
    return NextResponse.json({ message: "Zu viele Anfragen" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Daten" }, { status: 400 });
  }

  if (parsed.data.honey) {
    return NextResponse.json({ ok: true });
  }

  await prisma.bookingRequest.create({
    data: {
      requesterName: parsed.data.requesterName,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      eventTitle: parsed.data.eventTitle,
      start: new Date(parsed.data.start),
      end: new Date(parsed.data.end),
      location: parsed.data.location,
      audienceSize: parsed.data.audienceSize,
      techNeedsCategories: JSON.stringify(parsed.data.techNeedsCategories),
      techNeedsText: parsed.data.techNeedsText ?? null,
      budget: parsed.data.budget ?? null,
      notes: parsed.data.notes ?? null
    }
  });

  return NextResponse.json({ ok: true });
}
