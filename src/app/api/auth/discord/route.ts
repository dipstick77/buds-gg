import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import {
  OAUTH_STATE_COOKIE,
  discordConfigured,
  sessionCookieOptions,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!discordConfigured()) {
    const url = new URL("/login", request.url);
    url.searchParams.set("discord", "missing");
    return NextResponse.redirect(url);
  }

  const clientId = process.env.DISCORD_CLIENT_ID!;
  const redirectUri =
    process.env.DISCORD_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin}/api/auth/discord/callback`;

  const state = randomBytes(24).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    scope: "identify email",
    redirect_uri: redirectUri,
    prompt: "consent",
    state,
  });

  const res = NextResponse.redirect(
    `https://discord.com/api/oauth2/authorize?${params.toString()}`,
  );
  res.cookies.set(OAUTH_STATE_COOKIE, state, {
    ...sessionCookieOptions(60 * 10),
    maxAge: 60 * 10,
    sameSite: "lax",
  });
  return res;
}
