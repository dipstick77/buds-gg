import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import type {
  FavoriteGame,
  PlatformId,
  PlatformLink,
  Profile,
  ProfileUpdateInput,
  PublicProfilePayload,
  ShowcaseItem,
  ThemeId,
  User,
} from "./types";
import { normalizeHandle, validateHandle } from "./reserved";
import { resolvePlatformUrl } from "./platforms";
import { seedIfEmpty } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = process.env.BUDS_DB_PATH || path.join(DATA_DIR, "buds.db");

let dbInstance: Database.Database | null = null;

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function migrate(db: Database.Database) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      discord_id TEXT UNIQUE,
      discord_username TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
      handle TEXT NOT NULL UNIQUE COLLATE NOCASE,
      display_name TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      avatar_url TEXT NOT NULL DEFAULT '',
      theme TEXT NOT NULL DEFAULT 'midnight',
      looking_for_bud INTEGER NOT NULL DEFAULT 0,
      looking_for_game TEXT NOT NULL DEFAULT '',
      looking_for_vibe TEXT NOT NULL DEFAULT '',
      is_public INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS platform_links (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      platform TEXT NOT NULL,
      label TEXT NOT NULL DEFAULT '',
      value TEXT NOT NULL,
      url TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      verified_at TEXT
    );
    CREATE TABLE IF NOT EXISTS favorite_games (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      game_name TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS showcase_items (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '',
      game TEXT NOT NULL DEFAULT '',
      external_url TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_profiles_handle ON profiles(handle);
    CREATE INDEX IF NOT EXISTS idx_platform_profile ON platform_links(profile_id, sort_order);
    CREATE INDEX IF NOT EXISTS idx_games_profile ON favorite_games(profile_id, sort_order);
  `);
}

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance;
  ensureDir();
  const db = new Database(DB_PATH);
  migrate(db);
  dbInstance = db;
  seedIfEmpty(db);
  return db;
}

function nowIso() {
  return new Date().toISOString();
}

export function createSession(userId: string, days = 30): string {
  const db = getDb();
  const id = nanoid(32);
  const created = nowIso();
  const expires = new Date(Date.now() + days * 86400000).toISOString();
  db.prepare(
    `INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)`,
  ).run(id, userId, created, expires);
  return id;
}

export function getUserBySession(sessionId: string | undefined | null): User | null {
  if (!sessionId) return null;
  const db = getDb();
  const row = db
    .prepare(
      `SELECT u.* FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > ?`,
    )
    .get(sessionId, nowIso()) as User | undefined;
  return row ?? null;
}

export function deleteSession(sessionId: string) {
  getDb().prepare(`DELETE FROM sessions WHERE id = ?`).run(sessionId);
}

export function upsertDevUser(email: string): User {
  const db = getDb();
  const existing = db
    .prepare(`SELECT * FROM users WHERE email = ?`)
    .get(email.toLowerCase()) as User | undefined;
  if (existing) return existing;
  const user: User = {
    id: nanoid(),
    email: email.toLowerCase(),
    discord_id: null,
    discord_username: null,
    created_at: nowIso(),
  };
  db.prepare(
    `INSERT INTO users (id, email, discord_id, discord_username, created_at)
     VALUES (@id, @email, @discord_id, @discord_username, @created_at)`,
  ).run(user);
  return user;
}

export function upsertDiscordUser(input: {
  discordId: string;
  username: string;
  email?: string | null;
}): User {
  const db = getDb();
  const existing = db
    .prepare(`SELECT * FROM users WHERE discord_id = ?`)
    .get(input.discordId) as User | undefined;
  if (existing) {
    db.prepare(
      `UPDATE users SET discord_username = ?, email = COALESCE(?, email) WHERE id = ?`,
    ).run(input.username, input.email ?? null, existing.id);
    return getUserById(existing.id)!;
  }
  const user: User = {
    id: nanoid(),
    email: input.email ?? null,
    discord_id: input.discordId,
    discord_username: input.username,
    created_at: nowIso(),
  };
  db.prepare(
    `INSERT INTO users (id, email, discord_id, discord_username, created_at)
     VALUES (@id, @email, @discord_id, @discord_username, @created_at)`,
  ).run(user);
  return user;
}

export function getUserById(id: string): User | null {
  return (getDb().prepare(`SELECT * FROM users WHERE id = ?`).get(id) as User | undefined) ?? null;
}

export function getProfileByUserId(userId: string): Profile | null {
  return (
    (getDb().prepare(`SELECT * FROM profiles WHERE user_id = ?`).get(userId) as
      | Profile
      | undefined) ?? null
  );
}

export function getProfileByHandle(handle: string): Profile | null {
  return (
    (getDb()
      .prepare(`SELECT * FROM profiles WHERE handle = ? COLLATE NOCASE`)
      .get(normalizeHandle(handle)) as Profile | undefined) ?? null
  );
}

export function getPublicProfile(handle: string): PublicProfilePayload | null {
  const profile = getProfileByHandle(handle);
  if (!profile || !profile.is_public) return null;
  return attachRelations(profile);
}

export function getEditableProfile(userId: string): PublicProfilePayload | null {
  const profile = getProfileByUserId(userId);
  if (!profile) return null;
  return attachRelations(profile);
}

function attachRelations(profile: Profile): PublicProfilePayload {
  const db = getDb();
  const platforms = db
    .prepare(
      `SELECT * FROM platform_links WHERE profile_id = ? ORDER BY sort_order ASC, rowid ASC`,
    )
    .all(profile.id) as PlatformLink[];
  const games = db
    .prepare(
      `SELECT * FROM favorite_games WHERE profile_id = ? ORDER BY sort_order ASC, rowid ASC`,
    )
    .all(profile.id) as FavoriteGame[];
  const showcase = db
    .prepare(
      `SELECT * FROM showcase_items WHERE profile_id = ? ORDER BY sort_order ASC, rowid ASC`,
    )
    .all(profile.id) as ShowcaseItem[];
  return { profile, platforms, games, showcase };
}

export function listExampleHandles(): string[] {
  const rows = getDb()
    .prepare(
      `SELECT handle FROM profiles WHERE is_public = 1 ORDER BY handle ASC LIMIT 12`,
    )
    .all() as Array<{ handle: string }>;
  return rows.map((r) => r.handle);
}

export function claimHandle(userId: string, rawHandle: string): Profile {
  const validated = validateHandle(rawHandle);
  if (!validated.ok) throw new Error(validated.error);

  const db = getDb();
  const existing = getProfileByUserId(userId);
  if (existing) throw new Error("You already claimed a handle.");

  const taken = getProfileByHandle(validated.handle);
  if (taken) throw new Error("That handle is taken.");

  const stamp = nowIso();
  const profile: Profile = {
    id: nanoid(),
    user_id: userId,
    handle: validated.handle,
    display_name: validated.handle,
    bio: "",
    avatar_url: "",
    theme: "midnight",
    looking_for_bud: 0,
    looking_for_game: "",
    looking_for_vibe: "",
    is_public: 1,
    created_at: stamp,
    updated_at: stamp,
  };
  db.prepare(
    `INSERT INTO profiles (
      id, user_id, handle, display_name, bio, avatar_url, theme,
      looking_for_bud, looking_for_game, looking_for_vibe, is_public, created_at, updated_at
    ) VALUES (
      @id, @user_id, @handle, @display_name, @bio, @avatar_url, @theme,
      @looking_for_bud, @looking_for_game, @looking_for_vibe, @is_public, @created_at, @updated_at
    )`,
  ).run(profile);
  return profile;
}

export function updateProfile(userId: string, input: ProfileUpdateInput): PublicProfilePayload {
  const db = getDb();
  const profile = getProfileByUserId(userId);
  if (!profile) throw new Error("Claim a handle first.");

  let nextHandle = profile.handle;
  if (input.handle !== undefined && normalizeHandle(input.handle) !== profile.handle) {
    const validated = validateHandle(input.handle);
    if (!validated.ok) throw new Error(validated.error);
    const taken = getProfileByHandle(validated.handle);
    if (taken && taken.id !== profile.id) throw new Error("That handle is taken.");
    nextHandle = validated.handle;
  }

  const theme = (input.theme ?? profile.theme) as ThemeId;
  const stamp = nowIso();

  db.prepare(
    `UPDATE profiles SET
      handle = ?,
      display_name = ?,
      bio = ?,
      avatar_url = ?,
      theme = ?,
      looking_for_bud = ?,
      looking_for_game = ?,
      looking_for_vibe = ?,
      is_public = ?,
      updated_at = ?
     WHERE id = ?`,
  ).run(
    nextHandle,
    input.display_name ?? profile.display_name,
    input.bio ?? profile.bio,
    input.avatar_url ?? profile.avatar_url,
    theme,
    input.looking_for_bud === undefined
      ? profile.looking_for_bud
      : input.looking_for_bud
        ? 1
        : 0,
    input.looking_for_game ?? profile.looking_for_game,
    input.looking_for_vibe ?? profile.looking_for_vibe,
    input.is_public === undefined ? profile.is_public : input.is_public ? 1 : 0,
    stamp,
    profile.id,
  );

  if (input.platforms) {
    db.prepare(`DELETE FROM platform_links WHERE profile_id = ?`).run(profile.id);
    const insert = db.prepare(
      `INSERT INTO platform_links
        (id, profile_id, platform, label, value, url, sort_order, verified_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NULL)`,
    );
    input.platforms.forEach((p, index) => {
      if (!p.value.trim()) return;
      const platform = p.platform as PlatformId;
      const url =
        p.url?.trim() ||
        resolvePlatformUrl(platform, p.value) ||
        "";
      insert.run(
        nanoid(),
        profile.id,
        platform,
        p.label?.trim() || "",
        p.value.trim(),
        url,
        p.sort_order ?? index,
      );
    });
  }

  if (input.games) {
    db.prepare(`DELETE FROM favorite_games WHERE profile_id = ?`).run(profile.id);
    const insert = db.prepare(
      `INSERT INTO favorite_games
        (id, profile_id, game_name, image_url, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
    );
    input.games.forEach((g, index) => {
      if (!g.game_name.trim()) return;
      insert.run(
        nanoid(),
        profile.id,
        g.game_name.trim(),
        g.image_url?.trim() || "",
        g.sort_order ?? index,
      );
    });
  }

  return getEditableProfile(userId)!;
}
