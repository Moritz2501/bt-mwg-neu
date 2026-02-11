import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { adminVerifySchema } from "@/lib/validation";
import { requireAdmin, setAdminVerified } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  await requireAdmin();
  const ip = request.headers.get("x-forwarded-for") || "local";
  const limit = rateLimit(`admin:${ip}`, 5, 1000 * 60 * 10);
  if (!limit.ok) {
    return NextResponse.json({ message: "Zu viele Versuche" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = adminVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Eingabe" }, { status: 400 });
  }

  const hash = process.env.ADMIN_AREA_PASSWORD_HASH;
  const plain = process.env.ADMIN_AREA_PASSWORD;
  let ok = false;

  if (hash) {
    ok = await bcrypt.compare(parsed.data.password, hash);
  } else if (plain) {
    ok = parsed.data.password === plain;
  }

  if (!ok) {
    return NextResponse.json({ message: "Admin Passwort falsch" }, { status: 401 });
  }

  setAdminVerified();
  return NextResponse.json({ ok: true });
}
