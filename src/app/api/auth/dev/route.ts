import { NextResponse } from "next/server";
import { createSession, upsertDevUser } from "@/lib/db";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
  } | null;
  const email = body?.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  // Prefer Discord when configured. Email stand-in stays available until then
  // so reviewers can claim handles without Discord app secrets.
  // Optional AUTH_DEV_ALLOWLIST locks email login to listed addresses.
  const allowlist = process.env.AUTH_DEV_ALLOWLIST?.split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (allowlist?.length && !allowlist.includes(email)) {
    return NextResponse.json(
      { error: "That email is not on AUTH_DEV_ALLOWLIST." },
      { status: 403 },
    );
  }

  const user = upsertDevUser(email);
  const sessionId = createSession(user.id);
  const res = NextResponse.json({ ok: true, userId: user.id });
  res.cookies.set(SESSION_COOKIE, sessionId, sessionCookieOptions());
  return res;
}
