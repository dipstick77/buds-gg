import groupsSeed from "@/data/groups.json";

export type RecruitmentMode = "open" | "applications" | "invite_only";
export type GamingStyle = "Competitive" | "Casual" | "Hardcore";
export type GroupPlatform = "pc" | "xbox" | "psn" | "nintendo" | "discord";
export type PreferredSize = "small" | "medium" | "large";

export interface SeedGroup {
  slug: string;
  name: string;
  description: string;
  avatarInitials: string;
  avatarColor: string;
  bannerHue: string;
  memberCount: number;
  recruitmentMode: RecruitmentMode;
  activity: string;
  games: string[];
  tags: string[];
  platforms: GroupPlatform[];
  region: string;
  timezone: string;
  gamingStyle: GamingStyle;
  preferredSize: PreferredSize;
  minAge: number;
  schedule: string;
  rules: string;
  discordInvite: string;
}

export const GROUPS = groupsSeed as SeedGroup[];

export const FILTER_OPTIONS = {
  games: Array.from(new Set(GROUPS.flatMap((g) => g.games))).sort(),
  styles: Array.from(new Set(GROUPS.map((g) => g.gamingStyle))).sort(),
  platforms: Array.from(new Set(GROUPS.flatMap((g) => g.platforms))).sort(),
  regions: Array.from(new Set(GROUPS.map((g) => g.region))).sort(),
  timezones: Array.from(new Set(GROUPS.map((g) => g.timezone))).sort(),
  sizes: ["small", "medium", "large"] as PreferredSize[],
  recruitment: [
    { value: "open", label: "Open" },
    { value: "applications", label: "Applications" },
    { value: "invite_only", label: "Invite-only" },
  ] as const,
} as const;

export const POPULAR_TAGS = Array.from(
  new Set(GROUPS.flatMap((g) => [...g.tags, ...g.games])),
).slice(0, 14);

export function getGroupBySlug(slug: string): SeedGroup | undefined {
  const key = slug.trim().toLowerCase();
  return GROUPS.find((g) => g.slug === key);
}

export function listGroups(): SeedGroup[] {
  return GROUPS;
}

export function recruitmentLabel(mode: RecruitmentMode): string {
  switch (mode) {
    case "open":
      return "Open";
    case "applications":
      return "Applications";
    case "invite_only":
      return "Invite-only";
  }
}

export function sizeLabel(size: PreferredSize): string {
  switch (size) {
    case "small":
      return "Small (≤50)";
    case "medium":
      return "Medium";
    case "large":
      return "Large (100+)";
  }
}

export function platformLabel(platform: GroupPlatform): string {
  switch (platform) {
    case "pc":
      return "PC";
    case "xbox":
      return "Xbox";
    case "psn":
      return "PlayStation";
    case "nintendo":
      return "Nintendo";
    case "discord":
      return "Discord";
  }
}
