import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/db";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  // cookie read via request not needed for delete if we clear blindly
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
  return res;
}

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (match?.[1]) deleteSession(match[1]);
  const url = new URL("/", request.url);
  const res = NextResponse.redirect(url);
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
  return res;
}
