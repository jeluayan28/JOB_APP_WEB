import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { jobSchema } from "@/lib/validation";

const unauthorized = () => NextResponse.json({ error: "Not signed in." }, { status: 401 });

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const jobs = await db.jobApplication.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ jobs });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const parsed = jobSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Position and company are required." }, { status: 400 });
  }

  const job = await db.jobApplication.create({ data: { ...parsed.data, userId } });
  return NextResponse.json({ job }, { status: 201 });
}
