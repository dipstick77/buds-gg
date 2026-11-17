import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/db";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

function readSessionId(request: Request): string | null {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function clearSessionResponse(request: Request, redirectTo?: string) {
  const sessionId = readSessionId(request);
  if (sessionId) deleteSession(sessionId);

  const res = redirectTo
    ? NextResponse.redirect(new URL(redirectTo, request.url))
    : NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
  return res;
}

export async function POST(request: Request) {
  return clearSessionResponse(request);
}

export async function GET(request: Request) {
  return clearSessionResponse(request, "/");
}
