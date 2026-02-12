import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { requestCommentSchema } from "@/lib/validation";
import { writeAdminLog } from "@/lib/audit";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = requestCommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Ungueltige Daten" }, { status: 400 });
  }

  const comment = await prisma.requestComment.create({
    data: {
      requestId: params.id,
      userId: user.id,
      text: parsed.data.text
    }
  });

  await writeAdminLog({
    actorId: user.id,
    action: "request_comment",
    details: { requestId: params.id, commentId: comment.id }
  });

  return NextResponse.json(comment);
}
