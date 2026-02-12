import bcrypt from "bcryptjs";

type VerifyResult = {
  ok: boolean;
  status?: number;
  message?: string;
};

export async function verifyAdminPassword(password: string): Promise<VerifyResult> {
  const hash = process.env.ADMIN_AREA_PASSWORD_HASH;
  const plain = process.env.ADMIN_AREA_PASSWORD;

  if (!hash && !plain) {
    return { ok: false, status: 500, message: "Admin Passwort nicht konfiguriert" };
  }

  if (hash) {
    const ok = await bcrypt.compare(password, hash);
    return ok
      ? { ok: true }
      : { ok: false, status: 401, message: "Admin Passwort falsch" };
  }

  if (password !== plain) {
    return { ok: false, status: 401, message: "Admin Passwort falsch" };
  }

  return { ok: true };
}
