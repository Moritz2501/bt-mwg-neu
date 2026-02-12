import { prisma } from "@/lib/db";

type AdminLogInput = {
  actorId?: string | null;
  actorName?: string | null;
  action: string;
  targetUserId?: string | null;
  details?: string | Record<string, unknown> | null;
};

function normalizeDetails(details?: string | Record<string, unknown> | null) {
  if (!details) return null;
  if (typeof details === "string") return details;
  try {
    return JSON.stringify(details);
  } catch {
    return "details_unserializable";
  }
}

export async function writeAdminLog(input: AdminLogInput) {
  const actorName = input.actorName ?? null;
  const actorId = input.actorId ?? null;
  return prisma.adminLog.create({
    data: {
      adminId: actorId,
      actorName,
      action: input.action,
      targetUserId: input.targetUserId ?? null,
      details: normalizeDetails(input.details)
    }
  });
}
