import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { writeAdminLog } from "@/lib/audit";

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

  const requiredPassword = process.env.BOOKING_SUBMIT_PASSWORD;
  if (!requiredPassword) {
    return NextResponse.json({ message: "Passwort nicht konfiguriert" }, { status: 500 });
  }
  if (!parsed.data.submitPassword || parsed.data.submitPassword !== requiredPassword) {
    return NextResponse.json({ message: "Passwort falsch" }, { status: 401 });
  }

  if (parsed.data.honey) {
    return NextResponse.json({ ok: true });
  }

  const booking = await prisma.bookingRequest.create({
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

  await writeAdminLog({
    actorName: `public:${parsed.data.requesterName}`,
    action: "booking_request_create",
    details: {
      bookingId: booking.id,
      eventTitle: booking.eventTitle,
      email: booking.email
    }
  });

  return NextResponse.json({ ok: true });
}
