import { NextResponse } from "next/server";
import {
  destroySessionByToken,
  getExpiredCookieOptions,
  getSessionUser,
  getSessionToken,
  ADMIN_COOKIE,
  SESSION_COOKIE
} from "@/lib/auth";
import { writeAdminLog } from "@/lib/audit";

export async function POST() {
  const user = await getSessionUser();
  const token = getSessionToken();
  await destroySessionByToken(token);

  if (user) {
    await writeAdminLog({
      actorId: user.id,
      action: "logout"
    });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", getExpiredCookieOptions());
  response.cookies.set(ADMIN_COOKIE, "", getExpiredCookieOptions());
  return response;
}
