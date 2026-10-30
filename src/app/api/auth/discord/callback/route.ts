import { NextResponse } from "next/server";
import { createSession, upsertDiscordUser } from "@/lib/db";
import { SESSION_COOKIE, discordConfigured, sessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");

  if (err || !code) {
    return NextResponse.redirect(new URL("/login?discord=denied", request.url));
  }
  if (!discordConfigured()) {
    return NextResponse.redirect(new URL("/login?discord=missing", request.url));
  }

  const redirectUri =
    process.env.DISCORD_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL || url.origin}/api/auth/discord/callback`;

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/login?discord=token", request.url));
  }

  const token = (await tokenRes.json()) as { access_token: string };
  const meRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!meRes.ok) {
    return NextResponse.redirect(new URL("/login?discord=profile", request.url));
  }

  const me = (await meRes.json()) as {
    id: string;
    username: string;
    global_name?: string | null;
    email?: string | null;
  };

  const user = upsertDiscordUser({
    discordId: me.id,
    username: me.global_name || me.username,
    email: me.email ?? null,
  });
  const sessionId = createSession(user.id);
  const res = NextResponse.redirect(new URL("/edit", request.url));
  res.cookies.set(SESSION_COOKIE, sessionId, sessionCookieOptions());
  return res;
}
