import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getEditableProfile, updateProfile } from "@/lib/db";
import type { ProfileUpdateInput } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = getEditableProfile(user.id);
  return NextResponse.json({ user, profile: payload });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as ProfileUpdateInput | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const payload = updateProfile(user.id, body);
    return NextResponse.json({ ok: true, profile: payload });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
