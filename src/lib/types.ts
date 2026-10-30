export type ThemeId = "midnight" | "soft-buds" | "signal";

export type PlatformId =
  | "steam"
  | "discord"
  | "riot"
  | "epic"
  | "xbox"
  | "psn"
  | "nintendo"
  | "twitch"
  | "youtube"
  | "custom";

export type PlatformCta = "copy" | "open";

export interface User {
  id: string;
  email: string | null;
  discord_id: string | null;
  discord_username: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  handle: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  theme: ThemeId;
  looking_for_bud: number;
  looking_for_game: string;
  looking_for_vibe: string;
  is_public: number;
  created_at: string;
  updated_at: string;
}

export interface PlatformLink {
  id: string;
  profile_id: string;
  platform: PlatformId;
  label: string;
  value: string;
  url: string;
  sort_order: number;
  verified_at: string | null;
}

export interface FavoriteGame {
  id: string;
  profile_id: string;
  game_name: string;
  image_url: string;
  sort_order: number;
}

export interface ShowcaseItem {
  id: string;
  profile_id: string;
  title: string;
  image_url: string;
  game: string;
  external_url: string;
  sort_order: number;
}

export interface PublicProfilePayload {
  profile: Profile;
  platforms: PlatformLink[];
  games: FavoriteGame[];
  showcase: ShowcaseItem[];
}

export interface ProfileUpdateInput {
  handle?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  theme?: ThemeId;
  looking_for_bud?: boolean;
  looking_for_game?: string;
  looking_for_vibe?: string;
  is_public?: boolean;
  platforms?: Array<{
    platform: PlatformId;
    label?: string;
    value: string;
    url?: string;
    sort_order?: number;
  }>;
  games?: Array<{
    game_name: string;
    image_url?: string;
    sort_order?: number;
  }>;
}
