import type { PlatformCta, PlatformId } from "./types";

export interface PlatformMeta {
  id: PlatformId;
  name: string;
  placeholder: string;
  helper: string;
  primaryCta: PlatformCta;
  buildUrl?: (value: string) => string | null;
}

export const PLATFORMS: PlatformMeta[] = [
  {
    id: "steam",
    name: "Steam",
    placeholder: "steamcommunity.com/id/you",
    helper: "Open profile is the usual CTA.",
    primaryCta: "open",
    buildUrl: (value) => {
      if (/^https?:\/\//i.test(value)) return value;
      const clean = value.replace(/^\/+/, "");
      if (clean.startsWith("id/") || clean.startsWith("profiles/")) {
        return `https://steamcommunity.com/${clean}`;
      }
      return `https://steamcommunity.com/id/${clean}`;
    },
  },
  {
    id: "discord",
    name: "Discord",
    placeholder: "username",
    helper: "Copy ID — friends paste it in Discord.",
    primaryCta: "copy",
  },
  {
    id: "riot",
    name: "Riot",
    placeholder: "Name#TAG",
    helper: "Copy tag for Valorant / LoL.",
    primaryCta: "copy",
  },
  {
    id: "epic",
    name: "Epic",
    placeholder: "Epic display name",
    helper: "Copy display name.",
    primaryCta: "copy",
  },
  {
    id: "xbox",
    name: "Xbox",
    placeholder: "Gamertag",
    helper: "Copy gamertag.",
    primaryCta: "copy",
  },
  {
    id: "psn",
    name: "PSN",
    placeholder: "Online ID",
    helper: "Copy PSN ID.",
    primaryCta: "copy",
  },
  {
    id: "nintendo",
    name: "Nintendo",
    placeholder: "SW-XXXX-XXXX-XXXX",
    helper: "Copy friend code.",
    primaryCta: "copy",
  },
  {
    id: "twitch",
    name: "Twitch",
    placeholder: "channel",
    helper: "Open channel.",
    primaryCta: "open",
    buildUrl: (value) => {
      if (/^https?:\/\//i.test(value)) return value;
      return `https://twitch.tv/${value.replace(/^@/, "")}`;
    },
  },
  {
    id: "youtube",
    name: "YouTube",
    placeholder: "@handle or channel URL",
    helper: "Open channel.",
    primaryCta: "open",
    buildUrl: (value) => {
      if (/^https?:\/\//i.test(value)) return value;
      const handle = value.startsWith("@") ? value : `@${value}`;
      return `https://youtube.com/${handle}`;
    },
  },
  {
    id: "custom",
    name: "Custom",
    placeholder: "https://…",
    helper: "Any URL your buds need.",
    primaryCta: "open",
    buildUrl: (value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`),
  },
];

export function getPlatform(id: PlatformId): PlatformMeta {
  return PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[PLATFORMS.length - 1];
}

export function resolvePlatformUrl(
  platform: PlatformId,
  value: string,
  url?: string | null,
): string | null {
  if (url && url.trim()) return url.trim();
  const meta = getPlatform(platform);
  return meta.buildUrl?.(value.trim()) ?? null;
}
