import { NextResponse } from "next/server";
import { discordConfigured } from "@/lib/auth";

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

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    scope: "identify email",
    redirect_uri: redirectUri,
    prompt: "none",
  });

  // Allow consent when prompt none fails — Discord ignores unknown; use consent default
  params.set("prompt", "consent");

  return NextResponse.redirect(
    `https://discord.com/api/oauth2/authorize?${params.toString()}`,
  );
}
