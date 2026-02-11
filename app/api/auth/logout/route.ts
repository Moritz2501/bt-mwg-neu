import { NextResponse } from "next/server";
import {
  destroySessionByToken,
  getExpiredCookieOptions,
  getSessionToken,
  ADMIN_COOKIE,
  SESSION_COOKIE
} from "@/lib/auth";

export async function POST() {
  const token = getSessionToken();
  await destroySessionByToken(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", getExpiredCookieOptions());
  response.cookies.set(ADMIN_COOKIE, "", getExpiredCookieOptions());
  return response;
}
