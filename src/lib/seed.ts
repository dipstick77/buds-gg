import type Database from "better-sqlite3";
import { nanoid } from "nanoid";

function stamp() {
  return new Date().toISOString();
}

export function seedIfEmpty(db: Database.Database) {
  const count = db.prepare(`SELECT COUNT(*) as c FROM profiles`).get() as { c: number };
  if (count.c > 0) return;

  const now = stamp();

  const demos = [
    {
      user: {
        id: "user_maya",
        email: "maya@demo.buds.gg",
        discord_id: null,
        discord_username: null,
      },
      profile: {
        id: "prof_maya",
        handle: "maya",
        display_name: "Maya",
        bio: "Duo queue healer. Chill VC only — add me and let’s climb without the toxicity.",
        avatar_url:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=256&h=256&fit=crop",
        theme: "soft-buds",
        looking_for_bud: 1,
        looking_for_game: "Valorant",
        looking_for_vibe: "Chill duo, mic optional",
      },
      platforms: [
        {
          platform: "discord",
          value: "maya.gg",
          url: "",
          sort_order: 0,
        },
        {
          platform: "riot",
          value: "Maya#BUDS",
          url: "",
          sort_order: 1,
        },
        {
          platform: "steam",
          value: "mayaplays",
          url: "https://steamcommunity.com/id/mayaplays",
          sort_order: 2,
        },
        {
          platform: "twitch",
          value: "mayaplays",
          url: "https://twitch.tv/mayaplays",
          sort_order: 3,
        },
      ],
      games: [
        { game_name: "Valorant", image_url: "", sort_order: 0 },
        { game_name: "Overwatch 2", image_url: "", sort_order: 1 },
        { game_name: "Stardew Valley", image_url: "", sort_order: 2 },
      ],
    },
    {
      user: {
        id: "user_kai",
        email: "kai@demo.buds.gg",
        discord_id: null,
        discord_username: null,
      },
      profile: {
        id: "prof_kai",
        handle: "kai",
        display_name: "Kai",
        bio: "Late-night raids & co-op. Looking for buds who finish what they start.",
        avatar_url:
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&h=256&fit=crop",
        theme: "midnight",
        looking_for_bud: 1,
        looking_for_game: "Destiny 2",
        looking_for_vibe: "Weeknight raids",
      },
      platforms: [
        {
          platform: "steam",
          value: "kaivault",
          url: "https://steamcommunity.com/id/kaivault",
          sort_order: 0,
        },
        {
          platform: "discord",
          value: "kai.vault",
          url: "",
          sort_order: 1,
        },
        {
          platform: "xbox",
          value: "KaiVault",
          url: "",
          sort_order: 2,
        },
        {
          platform: "epic",
          value: "KaiVault",
          url: "",
          sort_order: 3,
        },
      ],
      games: [
        { game_name: "Destiny 2", image_url: "", sort_order: 0 },
        { game_name: "Deep Rock Galactic", image_url: "", sort_order: 1 },
        { game_name: "Helldivers 2", image_url: "", sort_order: 2 },
        { game_name: "Baldur's Gate 3", image_url: "", sort_order: 3 },
      ],
    },
    {
      user: {
        id: "user_nova",
        email: "nova@demo.buds.gg",
        discord_id: null,
        discord_username: null,
      },
      profile: {
        id: "prof_nova",
        handle: "nova",
        display_name: "NOVA",
        bio: "Controller player. Tournament nights + cozy co-op weekends.",
        avatar_url:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop",
        theme: "signal",
        looking_for_bud: 0,
        looking_for_game: "",
        looking_for_vibe: "",
      },
      platforms: [
        {
          platform: "psn",
          value: "NOVA_GG",
          url: "",
          sort_order: 0,
        },
        {
          platform: "discord",
          value: "nova.gg",
          url: "",
          sort_order: 1,
        },
        {
          platform: "nintendo",
          value: "SW-1234-5678-9012",
          url: "",
          sort_order: 2,
        },
        {
          platform: "youtube",
          value: "@novagg",
          url: "https://youtube.com/@novagg",
          sort_order: 3,
        },
        {
          platform: "custom",
          value: "https://nova.gg/vods",
          url: "https://example.com",
          label: "VOD archive",
          sort_order: 4,
        },
      ],
      games: [
        { game_name: "Street Fighter 6", image_url: "", sort_order: 0 },
        { game_name: "It Takes Two", image_url: "", sort_order: 1 },
        { game_name: "Splatoon 3", image_url: "", sort_order: 2 },
      ],
    },
  ] as const;

  const insertUser = db.prepare(
    `INSERT INTO users (id, email, discord_id, discord_username, created_at)
     VALUES (@id, @email, @discord_id, @discord_username, @created_at)`,
  );
  const insertProfile = db.prepare(
    `INSERT INTO profiles (
      id, user_id, handle, display_name, bio, avatar_url, theme,
      looking_for_bud, looking_for_game, looking_for_vibe, is_public, created_at, updated_at
    ) VALUES (
      @id, @user_id, @handle, @display_name, @bio, @avatar_url, @theme,
      @looking_for_bud, @looking_for_game, @looking_for_vibe, 1, @created_at, @updated_at
    )`,
  );
  const insertPlatform = db.prepare(
    `INSERT INTO platform_links
      (id, profile_id, platform, label, value, url, sort_order, verified_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NULL)`,
  );
  const insertGame = db.prepare(
    `INSERT INTO favorite_games (id, profile_id, game_name, image_url, sort_order)
     VALUES (?, ?, ?, ?, ?)`,
  );

  const tx = db.transaction(() => {
    for (const demo of demos) {
      insertUser.run({
        ...demo.user,
        created_at: now,
      });
      insertProfile.run({
        id: demo.profile.id,
        user_id: demo.user.id,
        handle: demo.profile.handle,
        display_name: demo.profile.display_name,
        bio: demo.profile.bio,
        avatar_url: demo.profile.avatar_url,
        theme: demo.profile.theme,
        looking_for_bud: demo.profile.looking_for_bud,
        looking_for_game: demo.profile.looking_for_game,
        looking_for_vibe: demo.profile.looking_for_vibe,
        created_at: now,
        updated_at: now,
      });
      for (const p of demo.platforms) {
        insertPlatform.run(
          nanoid(),
          demo.profile.id,
          p.platform,
          "label" in p ? p.label : "",
          p.value,
          p.url,
          p.sort_order,
        );
      }
      for (const g of demo.games) {
        insertGame.run(
          nanoid(),
          demo.profile.id,
          g.game_name,
          g.image_url,
          g.sort_order,
        );
      }
    }
  });

  tx();
}
