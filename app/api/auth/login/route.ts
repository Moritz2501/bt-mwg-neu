import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import { verifyPassword } from "@/lib/password";
import {
  createSession,
  destroySessionByToken,
  getExpiredCookieOptions,
  getSessionCookieOptions,
  getSessionToken,
  ADMIN_COOKIE,
  SESSION_COOKIE
} from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { writeAdminLog } from "@/lib/audit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  const limit = rateLimit(`login:${ip}`, 5, 1000 * 60 * 10);
  if (!limit.ok) {
    return NextResponse.json({ message: "Zu viele Versuche" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Eingaben" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username: parsed.data.username } });
  if (!user || !user.active) {
    return NextResponse.json({ message: "Login fehlgeschlagen" }, { status: 401 });
  }

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ message: "Login fehlgeschlagen" }, { status: 401 });
  }

  const existingToken = getSessionToken();
  await destroySessionByToken(existingToken);

  const session = await createSession(user.id);
  await writeAdminLog({
    actorId: user.id,
    action: "login"
  });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, session.token, getSessionCookieOptions(session.expiresAt));
  response.cookies.set(ADMIN_COOKIE, "", getExpiredCookieOptions());
  return response;
}
