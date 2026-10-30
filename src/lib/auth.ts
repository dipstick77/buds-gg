import { cookies } from "next/headers";
import { deleteSession, getUserBySession } from "./db";
import type { User } from "./types";

export const SESSION_COOKIE = "buds_session";

export function discordConfigured(): boolean {
  return Boolean(
    process.env.DISCORD_CLIENT_ID &&
      process.env.DISCORD_CLIENT_SECRET &&
      process.env.DISCORD_REDIRECT_URI,
  );
}

export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const session = jar.get(SESSION_COOKIE)?.value;
  return getUserBySession(session);
}

export async function clearSessionCookie() {
  const jar = await cookies();
  const session = jar.get(SESSION_COOKIE)?.value;
  if (session) deleteSession(session);
  jar.delete(SESSION_COOKIE);
}

export function sessionCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 30) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
