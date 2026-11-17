import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { claimHandle, getEditableProfile } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { handle?: string } | null;
  if (!body?.handle) {
    return NextResponse.json({ error: "Handle required." }, { status: 400 });
  }

  try {
    claimHandle(user.id, body.handle);
    return NextResponse.json({ ok: true, profile: getEditableProfile(user.id) });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Claim failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
