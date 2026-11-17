import { NextResponse } from "next/server";
import { createSession, upsertDevUser } from "@/lib/db";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

function parseAllowlist(): string[] {
  return (
    process.env.AUTH_DEV_ALLOWLIST?.split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean) ?? []
  );
}

/** Dev email login is local-only unless AUTH_DEV_ALLOWLIST is explicitly set. */
function devLoginAllowed(): { ok: true; allowlist: string[] } | { ok: false; error: string } {
  const allowlist = parseAllowlist();
  const hosted =
    process.env.NODE_ENV === "production" ||
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.CURSOR_APP_ID);

  if (hosted && allowlist.length === 0) {
    return {
      ok: false,
      error:
        "Dev email login is disabled on hosted deployments. Set AUTH_DEV_ALLOWLIST or use Discord.",
    };
  }

  return { ok: true, allowlist };
}

export async function POST(request: Request) {
  const gate = devLoginAllowed();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as {
    email?: string;
  } | null;
  const email = body?.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  // When an allowlist is set (required on hosted), only listed emails may sign in.
  if (gate.allowlist.length > 0 && !gate.allowlist.includes(email)) {
    return NextResponse.json(
      { error: "That email is not on AUTH_DEV_ALLOWLIST." },
      { status: 403 },
    );
  }

  // Local without allowlist: still block demo seed emails to reduce casual takeover.
  if (gate.allowlist.length === 0 && email.endsWith("@demo.buds.gg")) {
    return NextResponse.json(
      { error: "Demo seed emails cannot be used for login." },
      { status: 403 },
    );
  }

  const user = upsertDevUser(email);
  const sessionId = createSession(user.id);
  const res = NextResponse.json({ ok: true, userId: user.id });
  res.cookies.set(SESSION_COOKIE, sessionId, sessionCookieOptions());
  return res;
}
