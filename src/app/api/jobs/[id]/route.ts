import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { jobSchema } from "@/lib/validation";

const unauthorized = () => NextResponse.json({ error: "Not signed in." }, { status: 401 });

export async function PATCH(req: Request, ctx: RouteContext<"/api/jobs/[id]">) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const parsed = jobSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Position and company are required." }, { status: 400 });
  }

  const { id } = await ctx.params;
  // Scoped to the owner so one user can never edit another's row.
  const { count } = await db.jobApplication.updateMany({ where: { id, userId }, data: parsed.data });
  if (count === 0) return NextResponse.json({ error: "Application not found." }, { status: 404 });

  const job = await db.jobApplication.findUnique({ where: { id } });
  return NextResponse.json({ job });
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/jobs/[id]">) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id } = await ctx.params;
  // Scoped to the owner so one user can never delete another's row.
  await db.jobApplication.deleteMany({ where: { id, userId } });
  return NextResponse.json({ ok: true });
}
