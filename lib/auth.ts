import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { nanoid } from "nanoid";

export const SESSION_COOKIE = "bt_session";
export const ADMIN_COOKIE = "admin_verified";

export async function createSession(userId: string) {
  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt
    }
  });

  return { token, expiresAt };
}

export async function destroySessionByToken(token?: string | null) {
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
}

export function getSessionToken() {
  return cookies().get(SESSION_COOKIE)?.value ?? null;
}

export function getSessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  };
}

export function getExpiredCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0)
  };
}

export async function getSessionUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.deleteMany({ where: { token } });
    return null;
  }

  if (!session.user.active) return null;
  return session.user;
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}

export function isAdminVerified() {
  return cookies().get(ADMIN_COOKIE)?.value === "yes";
}

export function getAdminVerifiedCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 20)
  };
}
